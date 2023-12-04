import {API, APIConfig} from "@/libs/api/API";
import {refresh} from "@/requests/refresh";
import {logout} from "@/utils/logout";
import {MessageStyles} from "@/libs/api/Logger";
import {USERID} from "@/app/config";
import {WsMethods} from "@/libs/api/WsMethods";
import {ErrorAlert} from "@/components/Alerts/Alerts";
import {Chat, ChatFromServer, ChatsStore} from "@/stores/ChatsStore";
import {MiniUser} from "@/stores/MiniUsersStore";
import {eye} from "@/libs/infojs/infojs";
import {LogLevel, WsMethodByEffect} from "@/libs/infojs/eye";
import {getEffectFromMethod, wsMethods} from "@/types/wsMethods";

export class MessengerAPI {
	public readonly sender: API;
	constructor(cfg: APIConfig) {
		this.sender = new API(cfg)
	}

	wsConnect() {
		this.sender.wsConnect();
		this.sender.wsSetHandler(wsHandler);
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
		let sender: WebSocket;
		if (this.sender.ws.isSome()) {
			sender = this.sender.ws.unwrap();
		} else {
			await this.sender.wsConnect();
			sender = this.sender.ws.unwrap();
		}
		eye.wsSend(wsMethods.NEW_CHAT, getEffectFromMethod(wsMethods.NEW_CHAT))
		sender.send(`${WsMethods.createChat}${JSON.stringify(dto)}`);
	}

	async updateChat(dto: UpdateChatDTO): Promise<void> {
		let sender: WebSocket;
		if (this.sender.ws.isSome()) {
			sender = this.sender.ws.unwrap();
		} else {
			await this.sender.wsConnect();
			sender = this.sender.ws.unwrap();
		}
		eye.wsSend(wsMethods.UPDATE_CHAT, getEffectFromMethod(wsMethods.UPDATE_CHAT))
		sender.send(`${WsMethods.updateChat}${JSON.stringify(dto)}`);
	}

	async deleteChat(chatId: number): Promise<void> {
		let sender: WebSocket;
		if (this.sender.ws.isSome()) {
			sender = this.sender.ws.unwrap();
		} else {
			await this.sender.wsConnect();
			sender = this.sender.ws.unwrap();
		}
		eye.wsSend(wsMethods.DELETE_CHAT, getEffectFromMethod(wsMethods.DELETE_CHAT))
		sender.send(`${WsMethods.deleteChat}${chatId}`);
	}

	async getMiniUsers(userIds: number[]): Promise<MiniUser[]> {
		let stringsIds = JSON.stringify(userIds);
		stringsIds = stringsIds.slice(1, stringsIds.length - 1);
		stringsIds = '(' + stringsIds + ')';
		const res = await this.sender.get("/api/user/many/?idsOfUsers=" + stringsIds, {
			cache: 'no-cache',
		});

		if (res.status === 200) {
			return await res.json();
		}
		return [];
	}
}

export let api = new MessengerAPI({
	domain: "http://localhost:4040",
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
	switch (method) {
		case wsMethods.NEW_CHAT: {
			let chat: ChatFromServer = data;
			ChatsStore.handleNewChat(chat);
			return;
		}

		case wsMethods.UPDATE_CHAT: {
			let chat: Chat = data;
			ChatsStore.handleUpdateChat(chat);
			return;
		}

		case wsMethods.DELETE_CHAT: {
			ChatsStore.handleDeleteChat(+data);
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