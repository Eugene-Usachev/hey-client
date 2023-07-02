import {API, APIConfig} from "@/libs/api/API";
import {refresh} from "@/requests/refresh";
import {logout} from "@/utils/logout";
import {MessageStyles} from "@/libs/api/Logger";
import {USERID} from "@/app/config";

export class ProfileAPI {
	public readonly sender: API;
	constructor(cfg: APIConfig) {
		this.sender = new API(cfg)
	}

	getUser(params: getUser): Promise<Response> {
		if (params.id === undefined || +params.id < 1 || typeof params.id !== "number") {
			throw new Error("Missing params");
		}
		return this.sender.get("/api/user/" + params.id, {
			cache: 'no-cache',
		})
	}

	async getSubs(): Promise<number[]> {
		if (!USERID || isNaN(+USERID) || +USERID < 1) {
			return [];
		}
		const resp = await this.sender.getAuth("/api/user/subs/", {
			cache: 'no-cache',
		})

		if (resp.status === 200) {
			return resp.json()
		} else {
			return [];
		}
	}

	async subscribe(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}
		return this.sender.patchAuth("/api/user/subscribers/add/" + id, {
			cache: 'no-cache',
		})
	}

	async unsubscribe(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}
		return this.sender.patchAuth("/api/user/subscribers/delete/" + id, {
			cache: 'no-cache',
		})
	}

	async addFriend(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}
		return this.sender.patchAuth("/api/user/friends/add/" + id, {
			cache: 'no-cache',
		})
	}

	async deleteFriend(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}
		return this.sender.patchAuth("/api/user/friends/delete/" + id, {
			cache: 'no-cache',
		})
	}
}

export let api = new ProfileAPI({
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
})

interface getUser {
	id: number;
}