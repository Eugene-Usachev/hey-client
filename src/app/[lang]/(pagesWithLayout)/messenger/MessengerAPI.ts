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