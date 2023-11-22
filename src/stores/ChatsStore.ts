import {action, observable, runInAction} from "mobx";
import {api} from "@/app/[lang]/(pagesWithLayout)/messenger/MessengerAPI";
import {ErrorAlert, WarningAlert} from "@/components/Alerts/Alerts";

export interface Chat {

}

export interface ChatList {
	name: string;
	chatsIds: number[];
}

interface ChatsStoreInterface {
	chatLists: ChatList[];
	friends: number[];
	subscribers: number[];
	wasGet: boolean;
	isGetting: boolean;

	getChatList: () => Promise<void>;
	newChatsList: (name: string, chatsIds: number[]) => Promise<void>;
}

export const ChatsStore: ChatsStoreInterface = observable<ChatsStoreInterface>({
	chatLists: [],
	friends: [],
	subscribers: [],
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
				ChatsStore.chatLists.insert({name: key, chatsIds: value});
			}
			ChatsStore.isGetting = false;
			ChatsStore.subscribers = data.subscribers;
			ChatsStore.friends = data.friends;
			ChatsStore.wasGet = true;
		});
	}),

	newChatsList: action(async (name: string, chatsIds: number[]) => {
		if (ChatsStore.chatLists.search(name) > -1) {
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
		if (res.status !== 201) {
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

		runInAction(() => {
			ChatsStore.chatLists.insert({name: name, chatsIds: chatsIds});
		});
	})
});