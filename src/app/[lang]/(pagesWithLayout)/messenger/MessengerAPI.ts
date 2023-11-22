import {API, APIConfig} from "@/libs/api/API";
import {refresh} from "@/requests/refresh";
import {logout} from "@/utils/logout";
import {MessageStyles} from "@/libs/api/Logger";
import {USERID} from "@/app/config";

export class MessengerAPI {
	public readonly sender: API;
	constructor(cfg: APIConfig) {
		this.sender = new API(cfg)
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