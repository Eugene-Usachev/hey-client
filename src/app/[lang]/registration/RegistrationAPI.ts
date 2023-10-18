import {API, APIConfig} from "@/libs/api/API";
import {refresh} from "@/requests/refresh";
import {logout} from "@/utils/logout";
import {MessageStyles} from "@/libs/api/Logger";

export class RegistrationAPI {
	public readonly sender: API;
	constructor(cfg: APIConfig) {
		this.sender = new API(cfg)
	}

	signUp(params: SignUp): Promise<Response> {
		let {email, login, name, password, surname} = params;
		if (email === undefined || login === undefined || password === undefined || name === undefined || surname === undefined) {
			throw new Error("Missing params");
		}
		if (password.length < 8 || password.length > 64) {
			throw new Error("Password length must be between 8 and 64");
		}
		return this.sender.post("/auth/sign-up", {
			body: JSON.stringify(params),
			headers: {"Content-Type": "application/json"}
		})
	}

	signInEmail(params: SignInEmail): Promise<Response> {
		if (params.password === undefined) {
			throw new Error("Missing password");
		}
		if (params.email === undefined) {
			throw new Error("Missing params");
		}
		return this.sender.post("/auth/sign-in", {
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				password: params.password,
				email: params.email
			})
		})
	}

	signInLogin(params: SignInLogin): Promise<Response> {
		if (params.password === undefined) {
			throw new Error("Missing password");
		}
		if (params.login === undefined) {
			throw new Error("Missing params");
		}

		return this.sender.post("/auth/sign-in", {
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				password: params.password,
				login: params.login
			})
		})
	}

	check(params: CheckProps): Promise<Response> {
		if (params.email === undefined || params.login === undefined) {
			throw new Error("Missing params");
		}
		return this.sender.post("/auth/check", {
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(params)
		})
	}
}

export let api = new RegistrationAPI({
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

interface SignUp {
	name: string;
	email: string;
	password: string;
	surname: string;
	login: string;
}

interface SignInLogin {
	login: string;
	password: string;
}

interface SignInEmail {
	email: string;
	password: string;
}

export interface CheckProps {
	email: string;
	login: string;
}