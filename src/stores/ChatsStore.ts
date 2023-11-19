import {action, observable, runInAction} from "mobx";
import {api} from "@/app/[lang]/(pagesWithLayout)/messenger/MessengerAPI";

export interface Chat {

}

interface ChatsStoreInterface {
	chatList: Map<string, [number]>,
	friends: number[];
	subscribers: number[];
	wasGet: boolean;
	isGetting: boolean;

	getChatList: () => Promise<void>;
}

export const ChatsStore: ChatsStoreInterface = observable<ChatsStoreInterface>({
	chatList: new Map(),
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
				ChatsStore.chatList.set(key, value);
			}
			ChatsStore.isGetting = false;
			ChatsStore.subscribers = data.subscribers;
			ChatsStore.friends = data.friends;
			ChatsStore.wasGet = true;
		});
	})
});