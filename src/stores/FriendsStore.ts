import {action, observable, runInAction} from "mobx";
import {MiniUser} from "@/stores/MiniUsersStore";
import {api} from "@/app/[lang]/(pagesWithLayout)/friends/FriendsAPI";
import {USERID} from "@/app/config";
import {FriendStatus} from "@/stores/ProfileStore";
import {TopProfileStore} from "@/stores/TopProfileStore";
import {ErrorAlert} from "@/components/Alerts/Alerts";

interface UserInfoFromServer {
	name: string;
	surname: string;
	avatar: string;
	friends: number[];
	subscribers: number[];
}

interface UserInfo {
	id: number;
	name: string;
	surname: string;
	avatar: string;
	friends: number[];
	subscribers: number[];
	isOnline: boolean;
}

interface ClientInfo {
	friends: number[];
	subscribers: number[];
}

export interface FriendsInfo {
	client: ClientInfo;
	user: UserInfoFromServer;
}

export const enum OpenListStatus {
	Friends,
	Subscribers,
	MutualFriends
}

interface FriendsStoreInterface {
	theUser: UserInfo;
	client: ClientInfo;

	mutualFriendsList: number[];

	users: FriendUser[];
	isGetting: boolean;
	openListStatus: OpenListStatus;

	wasGet: boolean;

	setOpenListStatus(status: OpenListStatus): void;
	setInfo(id: number, info: FriendsInfo): void;
	setUsersOnline(usersIds: number[]): void;
	setUsersOffline(usersIds: number[]): void;

	changeFriendStatus(userId: number, status: FriendStatus): void
}

export const FriendsStore: FriendsStoreInterface = observable<FriendsStoreInterface>({
	theUser: {
		id: -1,
		name: "",
		surname: "",
		avatar: "",
		friends: [],
		subscribers: [],
		isOnline: false,
	},
	client: {
		friends: [],
		subscribers: [],
	},

	mutualFriendsList: [],

	users: [],
	isGetting: false,
	openListStatus: OpenListStatus.Friends,

	wasGet: false,

	setOpenListStatus: action((status: OpenListStatus) => {
		FriendsStore.openListStatus = status;
	}),

	setInfo: action(async (id: number, info: FriendsInfo) => {
		const user: UserInfo = {
			id: id,
			friends: info.user.friends,
			avatar: info.user.avatar,
			name: info.user.name,
			surname: info.user.surname,
			subscribers: info.user.subscribers,
			isOnline: false,
		};

		const client: ClientInfo = {
			friends: info.client.friends,
			subscribers: info.client.subscribers,
		};

		const needToGet = new Set<number>();
		for (const id of user.friends) {
			if (id != 0) {
				needToGet.add(id);
			}
		}
		for (const id of user.subscribers) {
			if (id != 0) {
				needToGet.add(id);
			}
		}
		for (const id of client.friends) {
			if (id != 0) {
				needToGet.add(id);
			}
		}
		for (const id of client.subscribers) {
			if (id != 0) {
				needToGet.add(id);
			}
		}
		if (USERID) needToGet.delete(+USERID);
		needToGet.delete(id);

		const needToGetArr = Array.from(needToGet);
		if (needToGetArr.length > 0) {
			if (!FriendsStore.isGetting) {
				runInAction(() => {
					FriendsStore.isGetting = true;
				});
				const resUsers = await api.getUsers(needToGetArr);
				api.getOnlineUsers(needToGetArr);
				if (resUsers.status !== 200) {
					ErrorAlert("Error, status code: " + resUsers.status);
				}

				const users = await resUsers.json() as {
					avatar: string;
					name: string;
					surname: string;
					is_client_sub: boolean;
					id: number;
				}[];
				runInAction(() => {
					for (const user of users) {
						let friendStatus: FriendStatus;
						if (user.is_client_sub) {
							friendStatus = FriendStatus.idol;
						} else if (FriendsStore.client.friends.indexOf(user.id) > -1) {
							friendStatus = FriendStatus.friend;
						} else if (FriendsStore.client.subscribers.indexOf(user.id) > -1) {
							friendStatus = FriendStatus.subscriber;
						} else {
							friendStatus = FriendStatus.nobody;
						}
						FriendsStore.users.push({
							id: user.id,
							name: user.name,
							surname: user.surname,
							avatar: user.avatar,
							isClientSub: user.is_client_sub,
							friendStatus: friendStatus,
							isOnline: false,
						});
					}
					FriendsStore.isGetting = false;
				});
			}
		}

		const mutualFriendsList: number[] = [];
		for (const friendId of user.friends) {
			if (client.friends.indexOf(friendId) > -1) {
				mutualFriendsList.push(friendId);
			}
		}

		runInAction(() => {
			if (+USERID > 0) {
				FriendsStore.users.push({
					id: +USERID,
					name: TopProfileStore.name,
					surname: TopProfileStore.surname,
					avatar: TopProfileStore.avatar || "",
					friendStatus: FriendStatus.nobody,
					isClientSub: false,
					isOnline: true,
				});
			}

			let friendStatus: FriendStatus;
			if (FriendsStore.theUser.friends.indexOf(+USERID) > -1) {
				friendStatus = FriendStatus.friend;
			} else if (FriendsStore.theUser.subscribers.indexOf(+USERID) > -1) {
				friendStatus = FriendStatus.idol;
			} else if (FriendsStore.client.subscribers.indexOf(+USERID) > -1) {
				friendStatus = FriendStatus.subscriber;
			} else {
				friendStatus = FriendStatus.nobody;
			}

			FriendsStore.users.push({
				id: id,
				name: info.user.name,
				surname: info.user.surname,
				avatar: info.user.avatar,
				isClientSub: USERID ? info.user.subscribers.indexOf(+USERID) > -1 : false,
				friendStatus: friendStatus,
				// TODO
				isOnline: true,
			});
			FriendsStore.theUser = user;
			FriendsStore.client = client;
			FriendsStore.mutualFriendsList = mutualFriendsList;
			FriendsStore.wasGet = true;
		});
	}),

	setUsersOnline: action((usersIds: number[]) => {
		FriendsStore.users.forEach((user) => {
			if (usersIds.indexOf(user.id) > -1) {
				user.isOnline = true;
			}
		});
		if (usersIds.indexOf(FriendsStore.theUser.id) > -1) {
			FriendsStore.theUser.isOnline = true;
		}
	}),

	setUsersOffline: action((usersIds: number[]) => {
		FriendsStore.users.forEach((user) => {
			if (usersIds.indexOf(user.id) > -1) {
				user.isOnline = false;
			}
		})

		if (usersIds.indexOf(FriendsStore.theUser.id) > -1) {
			FriendsStore.theUser.isOnline = false;
		}
	}),

	changeFriendStatus: action(async (userId: number, status: FriendStatus) => {
		let index: number;
		let res: Response;
		switch (status) {
			case FriendStatus.idol:
				res = await api.subscribe(userId);
				if (res.status !== 204) {
					ErrorAlert("Error, status code: " + res.status);
					return;
				}

				runInAction(() => {
					FriendsStore.client.friends.push(+USERID);
					FriendsStore.client.subscribers.splice(FriendsStore.client.subscribers.indexOf(+USERID), 1);
				});
				break;
			case FriendStatus.friend:
				res = await api.addFriend(userId);
				if (res.status !== 204) {
					ErrorAlert("Error, status code: " + res.status);
					return;
				}

				runInAction(() => {
					FriendsStore.client.friends.push(userId);
					if (FriendsStore.theUser.friends.indexOf(userId) !== -1) {
						FriendsStore.mutualFriendsList.push(userId);
					}
					index = FriendsStore.client.subscribers.indexOf(+USERID);
					while (index !== -1) {
						FriendsStore.client.subscribers.splice(index, 1);
						index = FriendsStore.client.subscribers.indexOf(+USERID);
					}
				});
				break;
			case FriendStatus.subscriber:
				res = await api.deleteFriend(userId);
				if (res.status !== 204) {
					ErrorAlert("Error, status code: " + res.status);
					return;
				}

				runInAction(() => {
					FriendsStore.client.subscribers.push(+USERID);
					index = FriendsStore.mutualFriendsList.indexOf(userId);
					if (index !== -1) {
						FriendsStore.mutualFriendsList.splice(index, 1);
					}
					FriendsStore.client.friends.splice(FriendsStore.client.friends.indexOf(+USERID), 1);
				});
				break;
			case FriendStatus.nobody:
				res = await api.unsubscribe(userId);
				if (res.status !== 204) {
					ErrorAlert("Error, status code: " + res.status);
				}

				runInAction(() => {
					FriendsStore.client.subscribers.splice(FriendsStore.client.subscribers.indexOf(+USERID), 1);
				});
				break;
		}
		FriendsStore.users.find((user) => user.id === userId)!.friendStatus = status
	})
});

export interface FriendUser extends MiniUser {
	isClientSub: boolean;
	friendStatus: FriendStatus;
}