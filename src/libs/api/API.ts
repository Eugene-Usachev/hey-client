import {Logger, LoggerConfig} from "./Logger";
import {None, Option, Some} from "@/libs/rustTypes/option";
import {getNameFromMethod, WsRequestMethods} from "@/libs/api/WsRequestMethods";
import {getEffectFromMethod, WsResponseMethod} from "@/types/wsResponseMethod";
import {eye} from "@/libs/infojs/infojs";
import {LogLevel, WsMethodByEffect} from "@/libs/infojs/eye";
import {ErrorAlert} from "@/components/Alerts/Alerts";

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

	public ws: Option<WebSocket>;
	public isWsConnecting: boolean;
	private wsHandler: Option<wsHandler>;

	constructor(cfg: APIConfig) {
		this.logger = new Logger(cfg.loggerCfg);
		this.refreshFunc = cfg.refreshFunc;
		this.domain = cfg.domain;
		this.logoutFunc = cfg.logoutFunc;
		this.ws = None();
		this.isWsConnecting = false;
		this.wsHandler = None();
	}

	async wsConnect(): Promise<void> {
		if (this.ws.isSome() || this.isWsConnecting) {
			return;
		}

		this.isWsConnecting = true;

		let fst = localStorage.getItem("accessToken");
		if (!fst) {
			await this.refreshFunc();
			fst = localStorage.getItem("accessToken");
			if (!fst) {
				fst = "";
			}
		}

		const domain = ((): string => {
			const split = this.domain.split("/");
			if (split[0] === "http:") {
				split[0] = "ws:";
			} else {
				split[0] = "wss:";
			}
			return split.join("/");
		})();
		let ws: WebSocket;

		if (fst !== "") {
			ws = new WebSocket(`${domain}/ws?auth=${fst}`);
		} else {
			ws = new WebSocket(`${domain}/ws`);
		}
		this.ws = Some(ws);
		this.isWsConnecting = false;

		this.ws.unwrap().onmessage = (event) => {
			if (this.wsHandler.isSome()) {
				HandleWS(event, this.wsHandler.unwrap());
			}
		}
	}

	async wsDisconnect(): Promise<void> {
		if (this.ws.isSome()) {
			this.ws.unwrap().close();
		}
	}

	wsSetHandler(handler: wsHandler): void {
		this.wsHandler = Some(handler);
	}

	async wsSend(req: WsRequest): Promise<void> {
		if (this.ws.isNone() || this.ws.unwrap().readyState !== 1) {
			if (this.ws.isSome() && this.ws.unwrap().readyState === 0) {
				const cb = () => {
					if (this.ws.isSome() && this.ws.unwrap().readyState === 1) {
						eye.wsSend(getNameFromMethod(req.requestMethod), getEffectFromMethod(req.responseMethod))
						this.ws.unwrap().send(`${req.requestMethod}${req.body}`);
					} else {
						setTimeout(cb, 100);
					}
				}
				cb();
				return;
			}
			await this.wsConnect();
		}
		eye.wsSend(getNameFromMethod(req.requestMethod), getEffectFromMethod(req.responseMethod))
		this.ws.unwrap().send(`${req.requestMethod}${req.body}`);
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

export interface WsRequest {
	requestMethod: WsRequestMethods;
	responseMethod: WsResponseMethod;
	body: string;
}

export type wsHandler = (method: string, data: any) => void;

export function HandleWS(event: MessageEvent, handler: wsHandler) {
	const responses = event.data.split('}{'); // Split the response into individual queries
	responses.forEach((response: string, index: number) => {
		if (response === WsResponseMethod.WELCOME) {
			eye.wsGet("welcome message", WsMethodByEffect.ALIVE, LogLevel.INFO);
			return;
		}

		let data: { method: WsResponseMethod, data: any };
		try {
			if (index !== 0) {
				response = '{' + response; // Add missing opening brace for all queries except the first one
			}
			if (index !== responses.length - 1) {
				response = response + '}'; // Add missing closing brace for all queries except the last one
			}
			data = JSON.parse(response);
		} catch (e) {
			eye.error("ws: handle error message: " + response);
			ErrorAlert("Unexpected error in wsHandler");
			return;
		}
		eye.wsGet(data.method, getEffectFromMethod(data.method));

		handler(data.method, data.data);
	});
}