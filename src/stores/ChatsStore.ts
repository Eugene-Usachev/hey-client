import {action, observable, runInAction} from "mobx";
import {api, ChatDTO, UpdateChatDTO} from "@/app/[lang]/(pagesWithLayout)/messenger/MessengerAPI";
import {ErrorAlert, WarningAlert} from "@/components/Alerts/Alerts";
import {MiniUser, MiniUsersStore} from "@/stores/MiniUsersStore";
import {USERID} from "@/app/config";

export interface ChatFromServer {
	id: number;
	name: string;
	avatar: string;
	members: number[];
}

export interface Chat {
	id: number;
	name: string;
	avatar: string;
	members: number[];

	isSingleUserConversation: boolean;
}

export interface ChatsList {
	name: string;
	localName: string;
	chatsIds: number[];
	chats: Chat[];
}

interface ChatsStoreInterface {
	chatsLists: ChatsList[];
	chatsCount: number;
	friends: number[];
	gotChats: number[];
	wasGet: boolean;
	isGetting: boolean;
	wasAllGet: boolean;
	waitingChats: Map<string, string>;

	getChatsLists: () => Promise<void>;
	changeLocalName: (listName: string, localName: string) => void;
	processingRawChats: (chats: Chat[]) => Promise<void>;
	saveChatsList: () => Promise<void>;
	deleteChatsList: (name: string) => Promise<void>;
	newChatsList: (name: string, chatsIds: number[]) => Promise<void>;
	updateChatsList: (oldName: string, newName: string, chatsIds: number[]) => Promise<void>;
	getChats: (chatsId: number[]) => Promise<void>;
	getAllChats: () => Promise<void>;
	getChatsFromList: (name: string) => Promise<void>;
	createChat: (dto: ChatDTO, listName: string) => Promise<void>;
	updateChat: (dto: UpdateChatDTO) => Promise<void>;
	deleteChat: (id: number) => Promise<void>;
	toggleFavoriteChat: (chatId: number, chat: Chat) => Promise<void>;
	handleNewChat: (chat: ChatFromServer) => Promise<void>;
	handleUpdateChat: (chat: Chat) => Promise<void>;
	handleDeleteChat: (id: number) => void;
}

export const ChatsStore: ChatsStoreInterface = observable<ChatsStoreInterface>({
	chatsLists: [],
	chatsCount: 0,
	friends: [],
	gotChats: [],
	wasGet: false,
	isGetting: false,
	wasAllGet: false,
	waitingChats: new Map<string, string>(),

	getChatsLists: action(async () => {
		if (ChatsStore.isGetting) {
			return;
		}
		ChatsStore.isGetting = true;
		const res = await api.getChatsList();
		const data = await res.json();
		const chatsList: object = JSON.parse(data.chatsList);
		const rawChats: number[] = data.raw_chats;
		runInAction(() => {
			for (const [key, value] of Object.entries(chatsList)) {
				ChatsStore.chatsLists.insertObj({
					name: key,
					chatsIds: value,
					chats: [],
					localName: key
				}, 'name');
			}
			ChatsStore.isGetting = false;
			data.friends.qSort();
			ChatsStore.friends = data.friends;
			ChatsStore.wasGet = true;
		});
		if (rawChats.length > 0) {
			await ChatsStore.getChats(rawChats);
		}
	}),

	changeLocalName: action((listName: string, localName: string) => {
		ChatsStore.chatsLists.getByKey<ChatsList>(listName, "name").unwrap().localName = localName;
	}),

	processingRawChats: action(async (chats: Chat[]) => {
		for (const chat of chats) {
			if (chat.members.length != 2 || chat.name !== "") {
				ChatsStore.chatsLists.getByKey<ChatsList>(SpecialChatsListsName.Other, "name").unwrap().chats.push(chat);
				ChatsStore.chatsLists.getByKey<ChatsList>(SpecialChatsListsName.Other, "name").unwrap().chatsIds.push(chat.id);
				continue;
			}

			let otherUserId = chat.members[0] === +USERID ? chat.members[1] : chat.members[0];
			if (ChatsStore.friends.indexOf(otherUserId) !== -1) {
				ChatsStore.chatsLists.getByKey<ChatsList>(SpecialChatsListsName.Friends, "name").unwrap().chats.push(chat);
				ChatsStore.chatsLists.getByKey<ChatsList>(SpecialChatsListsName.Friends, "name").unwrap().chatsIds.push(chat.id);
				continue;
			}

			ChatsStore.chatsLists.getByKey<ChatsList>(SpecialChatsListsName.Other, "name").unwrap().chats.push(chat);
			ChatsStore.chatsLists.getByKey<ChatsList>(SpecialChatsListsName.Other, "name").unwrap().chatsIds.push(chat.id);
		}
		await ChatsStore.saveChatsList();
	}),

	saveChatsList: action(async () => {
		let body = "{";
		ChatsStore.chatsLists.forEach((value, index) => {
			if (index === ChatsStore.chatsLists.length - 1) {
				body += `"${value.name}": [${value.chatsIds.join(",")}]`;
			} else {
				body += `"${value.name}": [${value.chatsIds.join(",")}],`;
			}
		});
		body += "}";

		const res = await api.updateChatsList(body, true);
		if (res.status !== 204) {
			switch (res.status) {
				case 400:
					ErrorAlert("Bad request");
					break;
				case 401:
					ErrorAlert("Unauthorized");
					break;
				case 500:
					ErrorAlert("Internal server error");
					break;
				default:
					ErrorAlert(`Unknown status code: ${res.status}`);
					break;
			}
			return;
		}
	}),

	deleteChatsList: action(async (name: string) => {
		let chatList = ChatsStore.chatsLists.getByKey<ChatsList>(name, "name");
		if (chatList.isNone()) {
			return;
		}
		let otherList = ChatsStore.chatsLists.getByKey<ChatsList>(SpecialChatsListsName.Other, "name").unwrap();
		for (let i = 0; i < chatList.unwrap().chatsIds.length; i++) {
			if (otherList.chatsIds.indexOf(chatList.unwrap().chatsIds[i]) === -1) {
				otherList.chatsIds.push(chatList.unwrap().chatsIds[i]);
				otherList.chats.push(chatList.unwrap().chats[i]);
			}
		}
		let res = ChatsStore.chatsLists.removeObj<ChatsList>(name, 'name');
		if (res) {
			await ChatsStore.saveChatsList();
		}
	}),

	newChatsList: action(async (name: string, chatsIds: number[]) => {
		if (ChatsStore.chatsLists.searchObj<ChatsList>(name, 'name').isSome()) {
			WarningAlert("Chat with this name already exists");
			return;
		}

		let body = "{";
		ChatsStore.chatsLists.forEach((value) => {
			body += `"${value.name}": [${value.chatsIds.join(",")}],`;
		});
		body += `"${name}": [${chatsIds.join(",")}]`;
		body += "}";

		const res = await api.updateChatsList(body, false);
		if (res.status !== 204) {
			switch (res.status) {
				case 400:
					ErrorAlert("Bad request");
					break;
				case 401:
					ErrorAlert("Unauthorized");
					break;
				case 500:
					ErrorAlert("Internal server error");
					break;
				default:
					ErrorAlert(`Unknown status code: ${res.status}`);
					break;
			}
			return;
		}

		runInAction(() => {
			ChatsStore.chatsLists.insertObj({
				name: name,
				chatsIds: chatsIds,
				chats: [],
				localName: name
			}, 'name');
		});
	}),

	updateChatsList: action(async (oldName: string, name: string, chatsIds: number[]) => {
		const ChatsList = ChatsStore.chatsLists.getByKey<ChatsList>(oldName, "name").expect("Chats list not found");
		const oldChatsIds = [...ChatsList.chatsIds];
		const removedIds = oldChatsIds.filter(id => !chatsIds.includes(id));
		const other = ChatsStore.chatsLists.getByKey<ChatsList>(SpecialChatsListsName.Other, "name").unwrap();
		for (const id of removedIds) {
			if (other.chatsIds.indexOf(removedIds[id]) === -1) {
				const chat = ChatsList.chats.find((chat => chat.id === removedIds[id]));
				if (chat) {
					other.chatsIds.push(removedIds[id]);
					other.chats.push(chat);
				}
			}
		}
		ChatsList.name = name;
		ChatsList.localName = name;
		ChatsList.chatsIds = [...chatsIds];
		ChatsStore.chatsLists.qSortObj("name");
		await ChatsStore.saveChatsList();
	}),

	getChats: action(async (chatsId: number[]) => {
		if (ChatsStore.isGetting || ChatsStore.wasAllGet) {
			return;
		}
		ChatsStore.isGetting = true;
		const chatsNeedToGet = [];
		for (const chatId of chatsId) {
			if (ChatsStore.gotChats.search(chatId).isNone()) {
				chatsNeedToGet.push(chatId);
				ChatsStore.gotChats.insert(chatId);
			}
		}
		if (chatsNeedToGet.length === 0) {
			runInAction(() => {
				ChatsStore.isGetting = false;
				ChatsStore.wasGet = true;
			});
			return;
		}
		const res = await api.getChats(chatsId);
		if (res.status !== 200) {
			ChatsStore.isGetting = false;
			switch (res.status) {
				case 400:
					ErrorAlert("Bad request");
					break;
				case 401:
					ErrorAlert("Unauthorized");
					break;
				case 500:
					ErrorAlert("Internal server error");
					break;
			}
			return;
		}
		const data: ChatFromServer[] = await res.json();
		const usersNeedToGet: Set<number> = new Set();
		let usersIDs: number[] = [];
		const rawChats: Chat[] = [];
		let inserted = false;
		runInAction(() => {
			ChatsStore.chatsCount += data.length;
			for (const chatFromServer of data) {
				let chat = {
					name: chatFromServer.name,
					id: chatFromServer.id,
					members: chatFromServer.members,
					avatar: chatFromServer.avatar,
					isSingleUserConversation: chatFromServer.members.length === 2 && chatFromServer.name === ""
				};
				for (const chatsList of ChatsStore.chatsLists) {
					if (chatsList.chatsIds.includes(chat.id)) {
						if (chatsList.chats.find((chatFromList) => chatFromList.id === chat.id)) {
							continue;
						}
						chatsList.chats.push(chat);
						inserted = true;
					}
				}
				if (!inserted) {
					rawChats.push(chat);
				}
				for (const memberId of chat.members) {
					usersNeedToGet.add(memberId);
				}
			}
			usersIDs = Array.from(usersNeedToGet);
			if (usersIDs.length == 0 && rawChats.length == 0) {
				ChatsStore.isGetting = false;
			}
		});
		if (rawChats.length > 0) {
			await ChatsStore.processingRawChats(rawChats);
			if (usersIDs.length == 0) {
				runInAction(() => {
					ChatsStore.isGetting = false;
				});
			}
		}
		if (usersIDs.length != 0) {
			const res = await api.getMiniUsers(usersIDs);
			res.qSortObj("id")
			MiniUsersStore.addUsers(res);
			runInAction(() => {
				const friends = ChatsStore.chatsLists.getByKey<ChatsList>(SpecialChatsListsName.Friends, "name").unwrap();
				const other = ChatsStore.chatsLists.getByKey<ChatsList>(SpecialChatsListsName.Other, "name").unwrap();
				let wasChanged = false;

				for (const chatId of chatsId) {
					let otherUserId;
					let chat = friends.chats.find((chat) => chat.id === chatId);
					if (chat) {
						if (!chat.isSingleUserConversation) {
							continue;
						}
						otherUserId = chat.members[0] === +USERID ? chat.members[1] : chat.members[0];
						if (ChatsStore.friends.search(otherUserId).isSome()) {
							continue;
						}
						// TODO here is a bug. When we remove user from friends we can't open Other list in first time (after open friend list where we have no chat)
						wasChanged = true;
						friends.chats.filter((chat) => chat.id !== chatId);
						friends.chatsIds = friends.chatsIds.filter((id) => id !== chatId);
						other.chats.push(chat);
						other.chatsIds.push(chat.id);
					} else {
						chat = other.chats.find((chat) => chat.id === chatId);
						if (chat) {
							if (!chat.isSingleUserConversation) {
								continue;
							}
							otherUserId = chat.members[0] === +USERID ? chat.members[1] : chat.members[0];
							if (ChatsStore.friends.search(otherUserId).isNone()) {
								continue;
							}
							friends.chatsIds.push(chat.id);
							friends.chats.push(chat);
							other.chatsIds = other.chatsIds.filter((id) => id !== chatId);
							other.chats = other.chats.filter((chat) => chat.id !== chatId);
							wasChanged = true;
						}
					}
				}

				if (wasChanged) {
					ChatsStore.saveChatsList();
				}
				ChatsStore.isGetting = false;
			});
		}
	}),

	getAllChats: action(async () => {
		const IDs = [];
		for (const value of ChatsStore.chatsLists) {
			IDs.push(...value.chatsIds);
		}
		await ChatsStore.getChats(IDs);
		ChatsStore.wasAllGet = true;
	}),

	getChatsFromList: action(async (name: string) => {
		await ChatsStore.getChats(ChatsStore.chatsLists.getByKeyUnchecked<ChatsList>(name, "name").chatsIds);
	}),

	createChat: action(async (dto: ChatDTO, listName: string) => {
		await api.createChat(dto);
		ChatsStore.waitingChats.set(dto.name, listName);
	}),

	updateChat: action(async (chat: UpdateChatDTO) => {
		await api.updateChat(chat);
	}),

	deleteChat: action(async (id: number) => {
		await api.deleteChat(id);
	}),

	toggleFavoriteChat: action(async (chatId: number, chat: Chat) => {
		const favorite = ChatsStore.chatsLists.getByKeyUnchecked<ChatsList>(SpecialChatsListsName.Favorites, 'name');
		if (favorite.chatsIds.indexOf(chatId) === -1) {
			favorite.chats.push(chat);
			favorite.chatsIds.push(chatId);
		} else {
			favorite.chatsIds = favorite.chatsIds.filter((id) => id !== chatId);
			favorite.chats = favorite.chats.filter((chat) => chat.id !== chatId);
		}
		return ChatsStore.saveChatsList();
	}),

	handleNewChat: action(async (chatFromServer: ChatFromServer) => {
		await runInAction(async () => {
			ChatsStore.chatsCount += 1;
			let chat = {
				name: chatFromServer.name,
				id: chatFromServer.id,
				members: chatFromServer.members,
				avatar: chatFromServer.avatar,
				isSingleUserConversation: chatFromServer.members.length === 2 && chatFromServer.name === ""
			};
			if (ChatsStore.waitingChats.has(chat.name)) {
				const listName = ChatsStore.waitingChats.get(chat.name) as string;
				console.log(listName, ChatsStore.chatsLists.checkSorted(), ChatsStore.chatsLists)
				if (ChatsStore.chatsLists.getByKeyUnchecked<ChatsList>(listName, 'name').chatsIds.indexOf(chat.id) !== -1) {
					return;
				}
				ChatsStore.chatsLists.getByKeyUnchecked<ChatsList>(listName, 'name').chatsIds.push(chat.id);
				ChatsStore.chatsLists.getByKeyUnchecked<ChatsList>(listName, 'name').chats.push(chat);
				ChatsStore.waitingChats.delete(chat.name);
			} else {
				let otherUserId = chat.members[0] === +USERID ? chat.members[1] : chat.members[0];
				if (chat.isSingleUserConversation && ChatsStore.friends.search(otherUserId).isSome()) {
					if (ChatsStore.chatsLists.getByKeyUnchecked<ChatsList>(SpecialChatsListsName.Friends, 'name').chatsIds.indexOf(chat.id) !== -1) {
						return;
					}
					ChatsStore.chatsLists.getByKeyUnchecked<ChatsList>(SpecialChatsListsName.Friends, 'name').chatsIds.push(chat.id);
					ChatsStore.chatsLists.getByKeyUnchecked<ChatsList>(SpecialChatsListsName.Friends, 'name').chats.push(chat);
				} else {
					if (ChatsStore.chatsLists.getByKeyUnchecked<ChatsList>(SpecialChatsListsName.Other, 'name').chatsIds.indexOf(chat.id) !== -1) {
						return;
					}
					ChatsStore.chatsLists.getByKeyUnchecked<ChatsList>(SpecialChatsListsName.Other, 'name').chatsIds.push(chat.id);
					ChatsStore.chatsLists.getByKeyUnchecked<ChatsList>(SpecialChatsListsName.Other, 'name').chats.push(chat);
				}
			}

			ChatsStore.gotChats.insert(chat.id);

			ChatsStore.saveChatsList();

			let needToGet = [];
			for (const memberId of chat.members) {
				if (MiniUsersStore.users.searchObj<MiniUser>(memberId, 'id').isNone()) needToGet.push(memberId);
			}

			if (needToGet.length === 0) {
				return;
			}
			const res = await api.getMiniUsers(needToGet);
			MiniUsersStore.addUsers(res);
		});
	}),

	handleUpdateChat: action(async (chat: Chat) => {
		const newUserIds = [];
		for (const memberId of chat.members) {
			if (MiniUsersStore.users.searchObj<MiniUser>(memberId, 'id').isNone()) newUserIds.push(memberId);
		}

		if (newUserIds.length !== 0) {
			const res = await api.getMiniUsers(newUserIds);
			MiniUsersStore.addUsers(res);
		}

		runInAction(() => {
			ChatsStore.chatsLists.forEach((chatsList) => {
				chatsList.chats.forEach((chatFromList) => {
					if (chatFromList.id === chat.id) {
						chatFromList.name = chat.name;
						chatFromList.members = chat.members;
						chatFromList.avatar = chat.avatar;
					}
				});
			});
		});
	}),

	handleDeleteChat: action((chatId: number) => {
		ChatsStore.chatsLists.forEach((chatsList) => {
			const index = chatsList.chatsIds.indexOf(chatId);
			if (index !== -1) {
				chatsList.chatsIds.splice(index, 1);
				chatsList.chats.splice(index, 1);
			}
		})
	})
});

export const enum SpecialChatsListsName {
	Other = "Other",
	Friends = "Friends",
	Favorites = "Favorites",
}