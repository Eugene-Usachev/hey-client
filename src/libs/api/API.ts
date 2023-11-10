import {Logger, LoggerConfig} from "./Logger";
import {getPromiseFromEvent} from "@/utils/getPromiseFromEvent";

export interface APIConfig {
	refreshFunc: () => Promise<Response>;
	logoutFunc: () => void;
	domain: string;
	loggerCfg: LoggerConfig;
}

export class API {
	private readonly logger: Logger;
	private readonly refreshFunc: () => Promise<Response>;
	private readonly domain: string;
	private readonly logoutFunc: () => void;

	constructor(cfg: APIConfig) {
		this.logger = new Logger(cfg.loggerCfg);
		this.refreshFunc = cfg.refreshFunc;
		this.domain = cfg.domain;
		this.logoutFunc = cfg.logoutFunc;
	}

	async sendRequestAuth(url: string, method: string, params: RequestInit): Promise<Response> {
		let startTime = Date.now();
		this.logger.fetchSend(url, method);
		params.method = method;
		let response: Response;
		if (!params.headers) params.headers = {
			Authorization: "",
		};
		let accessToken = localStorage.getItem("accessToken");

		if (!accessToken) {
			await this.refreshFunc();
			accessToken = localStorage.getItem("accessToken");
			if (!accessToken) {
				this.logoutFunc();
				throw new Error("No access token");
			}
			// @ts-ignore
			params.headers!["Authorization"] = accessToken as string;
			response = await fetch(`${this.domain}${url}`,params);
			if (response.status === 401) {
				this.logoutFunc();
				throw new Error("No authorization");
			}
		} else {
			// @ts-ignore
			params.headers!["Authorization"] = accessToken;
			response = await fetch(`${this.domain}${url}`,params);

			if (response.status === 401) {
				await this.refreshFunc();
				accessToken = localStorage.getItem("accessToken");
				if (!accessToken) {
					this.logoutFunc();
					throw new Error("No access token");
				}
				// @ts-ignore
				params.headers!["Authorization"] = accessToken;
				response = await fetch(`${this.domain}${url}`,params);
				if (response.status === 401) {
					this.logoutFunc();
					throw new Error("No authorization");
				}
			}
		}

		this.logger.fetchGet(url, method, response.status, Date.now() - startTime);
		return response;
	}

	async sendRequest(url: string, method: string, params: RequestInit): Promise<Response> {
		let startTime = Date.now();
		this.logger.fetchSend(url, method);
		params.method = method;
		let response: Response;
		response = await fetch(`${this.domain}${url}`,params);

		this.logger.fetchGet(url, method, response.status, Date.now() - startTime);
		return response;
	}

	async get(url: string, params: RequestInit): Promise<Response> {
		return this.sendRequest(url, "GET", params);
	}

	async getAuth(url: string, params: RequestInit): Promise<Response> {
		return this.sendRequestAuth(url, "GET", params);
	}

	async post(url: string, params: RequestInit): Promise<Response> {
		return this.sendRequest(url, "POST", params);
	}

	async postAuth(url: string, params: RequestInit): Promise<Response> {
		return this.sendRequestAuth(url, "POST", params);
	}

	async put(url: string, params: RequestInit): Promise<Response> {
		return this.sendRequest(url, "PUT", params);
	}

	async putAuth(url: string, params: RequestInit): Promise<Response> {
		return this.sendRequestAuth(url, "PUT", params);
	}

	async patch(url: string, params: RequestInit): Promise<Response> {
		return this.sendRequest(url, "PATCH", params);
	}

	async patchAuth(url: string, params: RequestInit): Promise<Response> {
		return this.sendRequestAuth(url, "PATCH", params);
	}

	async delete(url: string, params: RequestInit): Promise<Response> {
		return this.sendRequest(url, "DELETE", params);
	}

	async deleteAuth(url: string, params: RequestInit): Promise<Response> {
		return this.sendRequestAuth(url, "DELETE", params);
	}

	async refresh<T>(func: (...params: any[]) => Promise<T>, ...params: any[]): Promise<T> {
		let response: T;
		// @ts-ignore
		if (this.refreshFunc) {
			response = await func(params)
		}

		// @ts-ignore
		return response;
	}
}

export function NewAPI(cfg: APIConfig): API {
	return new API(cfg);
}