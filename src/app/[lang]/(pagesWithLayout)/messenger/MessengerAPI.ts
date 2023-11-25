import {API, APIConfig} from "@/libs/api/API";
import {refresh} from "@/requests/refresh";
import {logout} from "@/utils/logout";
import {MessageStyles} from "@/libs/api/Logger";
import {USERID} from "@/app/config";
import {WsMethods} from "@/libs/api/WsMethods";
import {ErrorAlert} from "@/components/Alerts/Alerts";
import {Chat, ChatsStore} from "@/stores/ChatsStore";
import {MiniUser} from "@/stores/MiniUsersStore";

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
		return this.sender.getAuth(`/api/chat/${chatsId.join(",")}`, {
			cache: 'no-cache',
		})
	}

	async updateChatsList(chatsList: string): Promise<Response> {
		return this.sender.patchAuth(`/api/chat/list/`, {
			body: chatsList,
			cache: 'no-cache',// @ts-ignore
			contentType: "plain/text"
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

const wsHandler = (event: MessageEvent) => {
	if (event.data === "Welcome") {
		return;
	}

	let data: {method: string, data: string};
	try {
		data = JSON.parse(event.data);
	} catch (e) {
		ErrorAlert("Unexpected error in wsHandler");
		return;
	}

	switch (data.method) {
		case "newChat": {
			let chat: Chat = JSON.parse(data.data);
			ChatsStore.handleNewChat(chat);
			return;
		}

		case "updateChat": {
			let chat: Chat = JSON.parse(data.data);
			ChatsStore.handleUpdateChat(chat);
			return;
		}

		case "deleteChat": {
			ChatsStore.handleDeleteChat(+JSON.parse(data.data));
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
	chat_id: number;
	name: string;
	avatar: string;
	members: number[];
}