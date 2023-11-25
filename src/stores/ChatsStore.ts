import {action, observable, runInAction} from "mobx";
import {api, ChatDTO, UpdateChatDTO} from "@/app/[lang]/(pagesWithLayout)/messenger/MessengerAPI";
import {ErrorAlert, WarningAlert} from "@/components/Alerts/Alerts";
import {MiniUser, MiniUsersStore} from "@/stores/MiniUsersStore";

export interface Chat {
	id: number;
	name: string;
	avatar: string;
	members: number[];
}

export interface ChatsList {
	name: string;
	chatsIds: number[];
	chats: Chat[];
}

interface ChatsStoreInterface {
	chatLists: ChatsList[];
	friends: number[];
	wasGet: boolean;
	isGetting: boolean;

	getChatList: () => Promise<void>;
	newChatsList: (name: string, chatsIds: number[]) => Promise<void>;
	getChats: (chatsId: number[]) => Promise<void>;
	getAllChats: () => Promise<void>;
	getChatsFromList: (name: string) => Promise<void>;
	createChat: (dto: ChatDTO) => Promise<void>;
	updateChat: (dto: UpdateChatDTO) => Promise<void>;
	deleteChat: (id: number) => Promise<void>;
	handleNewChat: (chat: Chat) => Promise<void>;
	handleUpdateChat: (chat: Chat) => Promise<void>;
	handleDeleteChat: (id: number) => void;
}

export const ChatsStore: ChatsStoreInterface = observable<ChatsStoreInterface>({
	chatLists: [],
	friends: [],
	wasGet: false,
	isGetting: false,

	getChatList: action(async () => {
		if (ChatsStore.isGetting) {
			return;
		}
		ChatsStore.isGetting = true;
		const res = await api.getChatsList();
		const data = await res.json();
		const chatsList: object = JSON.parse(data.chatsList);
		runInAction(() => {
			for (const [key, value] of Object.entries(chatsList)) {
				ChatsStore.chatLists.insertObj({name: key, chatsIds: value}, 'name');
			}
			ChatsStore.isGetting = false;
			ChatsStore.friends = data.friends;
			ChatsStore.wasGet = true;
		});
	}),

	newChatsList: action(async (name: string, chatsIds: number[]) => {
		if (ChatsStore.chatLists.searchObj<ChatsList>(name, 'name').isSome()) {
			WarningAlert("Chat with this name already exists");
			return;
		}

		let body = "{";
		ChatsStore.chatLists.forEach((value) => {
			body += `"${value.name}": [${value.chatsIds.join(",")}],`;
		});
		body += `"${name}": [${chatsIds.join(",")}]`;
		body += "}";

		const res = await api.updateChatsList(body);
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
			ChatsStore.chatLists.insertObj({name: name, chatsIds: chatsIds, chats: []}, 'name');
		});
	}),

	getChats: action(async (chatsId: number[]) => {
		if (ChatsStore.isGetting) {
			return;
		}
		ChatsStore.isGetting = true;
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
		const data: Chat[] = await res.json();
		const usersNeedToGet: Set<number> = new Set();
		await runInAction(async () => {
			for (const chat of data) {
				ChatsStore.chatLists.forEach((value) => {
					if (value.chatsIds.includes(chat.id)) {
						value.chats.push(chat);
					}
				});
				for (const memberId of chat.members) {
					usersNeedToGet.add(memberId);
				}
			}
			const usersIDs = Array.from(usersNeedToGet);
			if (usersIDs.length > 0) {
				const res = await api.getMiniUsers(usersIDs);
				MiniUsersStore.addUsers(res);
			}
			ChatsStore.isGetting = false;
		});
	}),

	getAllChats: action(async () => {
		const IDs = [];
		for (const value of ChatsStore.chatLists) {
			IDs.push(...value.chatsIds);
		}
		await ChatsStore.getChats(IDs);
	}),

	getChatsFromList: action(async (name: string) => {
		await ChatsStore.getChats(ChatsStore.chatLists.getByKeyUnchecked<ChatsList>(name, "name").chatsIds);
	}),

	createChat: action(async (dto: ChatDTO) => {
		await api.createChat(dto);
	}),

	updateChat: action(async (chat: UpdateChatDTO) => {
		await api.updateChat(chat);
	}),

	deleteChat: action(async (id: number) => {
		await api.deleteChat(id);
	}),

	handleNewChat: action(async (chat: Chat) => {
		ChatsStore.chatLists.getByKeyUnchecked<ChatsList>("Other", 'name').chatsIds.push(chat.id);
		ChatsStore.chatLists.getByKeyUnchecked<ChatsList>("Other", 'name').chats.push(chat);

		let needToGet = [];
		for (const memberId of chat.members) {
			if (MiniUsersStore.users.searchObj<MiniUser>(memberId, 'id').isNone()) needToGet.push(memberId);
		}

		if (needToGet.length === 0) {
			return;
		}
		const res = await api.getMiniUsers(needToGet);
		MiniUsersStore.addUsers(res);
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

		ChatsStore.chatLists.forEach((chatsList) => {
			const index = chatsList.chatsIds.indexOf(chat.id);
			if (index !== -1) {
				chatsList.chats[index] = chat;
			}
		})
	}),

	handleDeleteChat: action((chatId: number) => {
		ChatsStore.chatLists.forEach((chatsList) => {
			const index = chatsList.chatsIds.indexOf(chatId);
			if (index !== -1) {
				chatsList.chatsIds.splice(index, 1);
				chatsList.chats.splice(index, 1);
			}
		})
	})
});