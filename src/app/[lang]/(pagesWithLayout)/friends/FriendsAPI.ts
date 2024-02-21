import {API, APIConfig} from "@/libs/api/API";
import {refresh} from "@/requests/refresh";
import {logout} from "@/utils/logout";
import {MessageStyles} from "@/libs/api/Logger";
import {USERID} from "@/app/config";
import {WsResponseMethod} from "@/types/wsResponseMethod";
import {FriendsStore} from "@/stores/FriendsStore";
import {WsRequestMethods} from "@/libs/api/WsRequestMethods";

const wsHandler = (method: string, data: any) => {
	switch (method) {
		case WsResponseMethod.GET_ONLINE_USERS: {
			FriendsStore.setUsersOnline(data);
			return;
		}

		case WsResponseMethod.USER_ONLINE: {
			FriendsStore.setUsersOnline([+data]);
			return;
		}

		case WsResponseMethod.USER_OFFLINE: {
			FriendsStore.setUsersOffline([+data]);
			return;
		}

		default:
			return;
	}
}

export class FriendsAPI {
	public readonly sender: API;
	constructor(cfg: APIConfig) {
		this.sender = new API(cfg)
	}

	async wsConnect() {
		await this.sender.wsConnect();
		this.sender.wsSetHandler(wsHandler);
	}

	wsDisconnect() {
		this.sender.wsDisconnect();
	}

	async getOnlineUsers(usersIds: number[]) {
		if (usersIds.length === 0) throw new Error("Empty usersIds");
		this.sender.wsSend({
			responseMethod: WsResponseMethod.GET_ONLINE_USERS,
			requestMethod: WsRequestMethods.getOnlineUsers,
			body: JSON.stringify(usersIds),
		});
	}

	async getFriendsAndSubs(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}

		const clientId = +USERID;
		if (clientId === undefined || isNaN(clientId) || clientId < 1) {
			return this.sender.get(`/api/user/friends_and_subs/${id}`, {
				cache: 'no-cache',
			})
		}

		return this.sender.get(`/api/user/friends_and_subs/${id}?clientId=${clientId}`, {
			cache: 'no-cache',
		})
	}

	async getUsers(ids: number[]): Promise<Response> {
		if (!ids || ids.length < 1) {
			throw new Error("Missing params");
		}

		let query = `/api/user/friends_users/${
			USERID ? +USERID : 0}?idsOfUsers=`;
		for (let i = 0; i < ids.length; i++) {
			query += `${ids[i]},`
		}
		query = query.slice(0, -1);
		return this.sender.get(query, {
			cache: 'no-cache',
		});
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

export let api = new FriendsAPI({
	domain: "https://localhost:4040",
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