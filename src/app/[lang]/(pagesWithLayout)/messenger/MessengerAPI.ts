import {API, APIConfig} from "@/libs/api/API";
import {refresh} from "@/requests/refresh";
import {logout} from "@/utils/logout";
import {MessageStyles} from "@/libs/api/Logger";
import {USERID} from "@/app/config";
import {WsRequestMethods} from "@/libs/api/WsRequestMethods";
import {Chat, ChatFromServer, ChatsStore} from "@/stores/ChatsStore";
import {MiniUser, MiniUsersStore} from "@/stores/MiniUsersStore";
import {WsResponseMethod} from "@/types/wsResponseMethod";
import {MessageFromServer, MessagesStore} from "@/stores/MessagesStore";

export class MessengerAPI {
	public readonly sender: API;
	constructor(cfg: APIConfig) {
		this.sender = new API(cfg)
	}

	wsConnect() {
		this.sender.wsConnect();
		this.sender.wsSetHandler(wsHandler);
		MiniUsersStore.setWsSender(this.sender);
	}

	wsDisconnect() {
		this.sender.wsDisconnect();
	}

	async getChatsList(): Promise<Response> {
		if (!USERID || +USERID < 1) throw new Error("Empty USERID");
		return this.sender.getAuth(`/api/chat/list/`, {
			cache: 'no-cache',
		})
	}

	async getChats(chatsId: number[]): Promise<Response> {
		if (chatsId.length === 0) throw new Error("Empty chatsId");
		return this.sender.getAuth(`/api/chat/?chatsIds=${chatsId.join(",")}`, {
			cache: 'no-cache',
		})
	}

	async updateChatsList(chatsList: string, isSetRawChatsToEmpty: boolean): Promise<Response> {
		const data = JSON.stringify({
			is_set_raw_chats_to_empty: isSetRawChatsToEmpty,
			new_chats_lists: chatsList
		});

		return this.sender.patchAuth(`/api/chat/list/`, {
			body: data,
			cache: 'no-cache'
		});
	}

	async createChat(dto: ChatDTO): Promise<void> {
		console.log("1")
		this.sender.wsSend({
			requestMethod: WsRequestMethods.createChat,
			responseMethod: WsResponseMethod.NEW_CHAT,
			body: JSON.stringify(dto)
		});
	}

	async updateChat(dto: UpdateChatDTO): Promise<void> {
		this.sender.wsSend({
			requestMethod: WsRequestMethods.updateChat,
			responseMethod: WsResponseMethod.UPDATE_CHAT,
			body: JSON.stringify(dto)
		});
	}

	async deleteChat(chatId: number): Promise<void> {
		this.sender.wsSend({
			requestMethod: WsRequestMethods.deleteChat,
			responseMethod: WsResponseMethod.DELETE_CHAT,
			body: chatId.toString()
		});
	}

	async getMessages(chatId: number, offset: number): Promise<Response> {
		if (!USERID || +USERID < 1) throw new Error("Empty USERID");
		return this.sender.getAuth(`/api/message/${chatId}?offset=${offset}`, {
			cache: 'no-cache',
		});
	}

	async sendMessage(message: MessageDTO): Promise<void> {
		this.sender.wsSend({
			responseMethod: WsResponseMethod.NEW_MESSAGE,
			requestMethod: WsRequestMethods.sendMessage,
			body: JSON.stringify(message)
		});
	}

	async updateMessage(message: UpdateMessageDTO): Promise<void> {
		this.sender.wsSend({
			responseMethod: WsResponseMethod.UPDATE_MESSAGE,
			requestMethod: WsRequestMethods.updateMessage,
			body: JSON.stringify(message)
		});
	}

	async deleteMessage(messageId: number): Promise<void> {
		this.sender.wsSend({
			responseMethod: WsResponseMethod.DELETE_MESSAGE,
			requestMethod: WsRequestMethods.deleteMessage,
			body: messageId.toString()
		});
	}

	async getMiniUsers(userIds: number[]): Promise<MiniUser[]> {
		let stringsIds = JSON.stringify(userIds);
		stringsIds = stringsIds.slice(1, stringsIds.length - 1);
		stringsIds = '(' + stringsIds + ')';
		const res = await this.sender.get("/api/user/many/?idsOfUsers=" + stringsIds, {
			cache: 'no-cache',
		});

		if (res.status === 200) {
			const list: {
				name: string;
				surname: string;
				avatar: string;
				id: number;
			}[] = await res.json();
			const r: MiniUser[] = [];
			for (const user of list) {
				r.push({
					id: user.id,
					name: user.name,
					surname: user.surname,
					avatar: user.avatar,
					isOnline: false
				})
			}
			return r;
		}
		return [];
	}
}

export let api = new MessengerAPI({
	domain: "https://server-eoac.onrender.com",
	loggerCfg: {
		showDate: true,
		readyStyleName: MessageStyles.success,
		baseStyle: undefined,
		errorStyle: undefined,
		warnStyle: undefined,
		infoStyle: undefined,
		readyStyle: undefined,
		successStyle: undefined,
	},
	refreshFunc: refresh,
	logoutFunc: logout,
});

const wsHandler = (method: string, data: any) => {
	console.log("Here")
	switch (method) {
		case WsResponseMethod.GET_ONLINE_USERS: {
			MiniUsersStore.handleGetOnlineUsers(data);
			return;
		}

		case WsResponseMethod.USER_ONLINE: {
			MiniUsersStore.handleUserOnlineStatusChange(+data, true);
			return;
		}

		case WsResponseMethod.USER_OFFLINE: {
			MiniUsersStore.handleUserOnlineStatusChange(+data, false);
			return;
		}

		case WsResponseMethod.NEW_CHAT: {
			let chat: ChatFromServer = data;
			ChatsStore.handleNewChat(chat);
			return;
		}

		case WsResponseMethod.UPDATE_CHAT: {
			let chat: Chat = data;
			ChatsStore.handleUpdateChat(chat);
			return;
		}

		case WsResponseMethod.DELETE_CHAT: {
			ChatsStore.handleDeleteChat(+data);
			return;
		}

		case WsResponseMethod.NEW_MESSAGE: {
			let message: MessageFromServer = data;
			MessagesStore.handleNewMessage(message);
			return;
		}

		case WsResponseMethod.UPDATE_MESSAGE: {
			let message: UpdateMessageDTO = data;
			MessagesStore.handleUpdateMessage(message);
			return;
		}

		case WsResponseMethod.DELETE_MESSAGE: {
			MessagesStore.handleDeleteMessage(+data);
			return;
		}

		default:
			return;
	}
}

export interface ChatDTO {
	name: string;
	avatar: string;
	members: number[];
}

export interface UpdateChatDTO {
	id: number;
	name: string;
	avatar: string;
	members: number[];
}

export interface UpdateMessageDTO {
	message_id: number;
	data: string;
}

export interface MessageDTO {
	data: string;
	files: string[];
	message_parent_id: number;
	parent_chat_id: number;
	parent_user_id: number;
}