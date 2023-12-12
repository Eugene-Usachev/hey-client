import {action, observable} from "mobx";
import {None, Option, Some} from "@/libs/rustTypes/option";
import {API} from "@/libs/api/API";
import {WsResponseMethod} from "@/types/wsResponseMethod";
import {WsRequestMethods} from "@/libs/api/WsRequestMethods";
import {USERID} from "@/app/config";

export interface MiniUser {
	id: number;
	name: string;
	surname: string;
	avatar: string;
	isOnline: boolean;
}

export interface MiniUsersStore {
	users: MiniUser[];
	wsSender: Option<API>,

	addUsers(users: MiniUser[]): void;
	setWsSender(sender: API): void;
	handleGetOnlineUsers(users: number[]): void;
	handleUserOnlineStatusChange(userId: number, isOnline: boolean): void;
}

export const MiniUsersStore: MiniUsersStore = observable<MiniUsersStore>({
	users: [],
	wsSender: None<API>(),

	addUsers: action((users: MiniUser[]) => {
		for (const user of users) {
			// TODO we use sort bonus only in messenger now
			MiniUsersStore.users.insertObj<MiniUser>(user, 'id');
		}
		if (MiniUsersStore.wsSender.isSome()) {
			const ids = users.map((user) => user.id);
			MiniUsersStore.wsSender.unwrap().wsSend({
				responseMethod: WsResponseMethod.GET_ONLINE_USERS,
				body: JSON.stringify(ids.filter(id => id !== +USERID)),
				requestMethod: WsRequestMethods.getOnlineUsers
			});
		}
	}),

	setWsSender: action((sender: API) => {
		MiniUsersStore.wsSender = Some(sender);
	}),

	handleGetOnlineUsers: action((users: number[]) => {
		for (const userId of users) {
			const user = MiniUsersStore.users.getByKey<MiniUser>(userId, 'id');
			if (user.isSome()) {
				user.unwrap().isOnline = true;
			}
		}
	}),

	handleUserOnlineStatusChange: action((userId: number, isOnline: boolean) => {
		const user = MiniUsersStore.users.getByKey<MiniUser>(userId, 'id');
		if (user.isSome()) {
			user.unwrap().isOnline = isOnline;
		}
	})
});