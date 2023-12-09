import {action, observable, runInAction} from "mobx";
import {api, MessageDTO, UpdateMessageDTO} from "@/app/[lang]/(pagesWithLayout)/messenger/MessengerAPI";
import {ErrorAlert} from "@/components/Alerts/Alerts";

export interface MessageFromServer {
	id: number;
	parent_chat_id: number;
	parent_user_id: number;
	data: string;
	date: number;
	files: string[];
	message_parent_id: number;
}

export interface Message {
	id: number;
	parentChatID: number;
	parentUserID: number;
	data: string;
	date: number;
	files: string[];
	messageParentID: number;
}

interface MessagesStoreInterface {
	chats: Map<number, Message[]>;
	allGotChats: number[];
	isGetting: boolean;

	getMessages: (chatId: number, offset: number) => Promise<number>;
	sendMessage: (message: MessageDTO) => Promise<void>;
	updateMessage: (dto: UpdateMessageDTO) => Promise<void>;
	deleteMessage: (id: number) => Promise<void>;

	handleNewMessage: (message: MessageFromServer) => Promise<void>;
	handleUpdateMessage: (message: UpdateMessageDTO) => Promise<void>;
	handleDeleteMessage: (id: number) => void;
}

export const MessagesStore: MessagesStoreInterface = observable<MessagesStoreInterface>({
	chats: new Map<number, Message[]>(),
	allGotChats: [],
	isGetting: false,

	getMessages: action(async (chatId: number, offset: number) => {
		if (MessagesStore.isGetting || MessagesStore.allGotChats.includes(chatId)) return 0;
		MessagesStore.isGetting = true;
		const res = await api.getMessages(chatId, offset);
		if (res.status !== 200) {
			runInAction(() => {
				MessagesStore.isGetting = false;
			});
			MessagesStore.isGetting = false;
			switch (res.status) {
				case 401:
					ErrorAlert("Unauthorized");
					break;
				case 400:
					ErrorAlert("Bad request");
					break;
				case 500:
					ErrorAlert("Server error");
					break;
				default:
					ErrorAlert("Unknown error");
					break;
			}
			return 0;
		}

		const messages: MessageFromServer[] = await res.json();
		const list = MessagesStore.chats.get(chatId) || [];
		runInAction(() => {
			if (messages.length < 20) {
				MessagesStore.allGotChats.push(chatId);
			}
			MessagesStore.isGetting = false;
			MessagesStore.chats.set(chatId, [...list, ...messages.map((message) => {
				return {
					id: message.id,
					parentChatID: message.parent_chat_id,
					parentUserID: message.parent_user_id,
					data: message.data,
					date: message.date,
					files: message.files,
					messageParentID: message.message_parent_id
				};
			})]);
			if (!MessagesStore.chats.get(chatId)!.isSorted) {
				MessagesStore.chats.get(chatId)!.qSortObj("id");
			}
		});
		return messages.length;
	}),

	sendMessage: action(async (message: MessageDTO) => {
		api.sendMessage(message);
	}),

	updateMessage: action(async (dto: UpdateMessageDTO) => {
		api.updateMessage(dto);
	}),

	deleteMessage: action(async (id: number) => {
		api.deleteMessage(id);
	}),

	handleNewMessage: action(async (message: MessageFromServer) => {
		const list = MessagesStore.chats.get(message.parent_chat_id) || [];
		runInAction(() => {
			MessagesStore.chats.set(message.parent_chat_id, list.concat({
				id: message.id,
				parentChatID: message.parent_chat_id,
				parentUserID: message.parent_user_id,
				data: message.data,
				date: message.date,
				files: message.files,
				messageParentID: message.message_parent_id
			}));
		})
	}),

	handleUpdateMessage: action(async (message: UpdateMessageDTO) => {
		MessagesStore.chats.forEach((list) => {
			const message_ = list.getByKey<Message>(message.message_id, "id");
			if (message_.isSome()) {
				message_.unwrap().data = message.data;
			}
			return;
		});
	}),

	handleDeleteMessage: action(async (id: number) => {
		MessagesStore.chats.forEach((list) => {
			const message_ = list.getByKey<Message>(id, "id");
			if (message_.isSome()) {
				list.removeObj<Message>(message_.unwrap().id, "id");
				return;
			}
		});
	})
});