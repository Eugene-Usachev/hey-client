import {hand, RestApiMethods} from "@/libs/hand/hand";

interface SignUp {
	name: string;
	email: string;
	password: string;
	surname: string;
	login: string;
}

export const SignUp = (params: SignUp) => {
	let {email, login, name, password, surname} = params;
	if (email === undefined || login === undefined || password === undefined || name === undefined || surname === undefined) {
		throw new Error("Missing params");
	}
	if (password.length < 8 || password.length > 64) {
		throw new Error("Password length must be between 8 and 64");
	}
	return hand("/auth/sign-up", {
		method: RestApiMethods.Post,
		body: JSON.stringify(params),
		headers: {"Content-Type": "application/json"}
	})
}

interface SignInLogin {
	login: string;
	password: string;
}

interface SignInEmail {
	email: string;
	password: string;
}

export const SignInEmail = (params: SignInEmail) => {
	if (params.password === undefined) {
		throw new Error("Missing password");
	}
	if (params.email === undefined) {
		throw new Error("Missing params");
	}
	return hand("/auth/sign-in", {
		method: RestApiMethods.Post,
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			password: params.password,
			email: params.email
		})
	})

}

export const SignInLogin = (params: SignInLogin) => {
	if (params.password === undefined) {
		throw new Error("Missing password");
	}
	if (params.login === undefined) {
		throw new Error("Missing params");
	}

	return hand("/auth/sign-in", {
		method: RestApiMethods.Post,
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			password: params.password,
			login: params.login
		})
	})

}

export interface CheckProps {
	email: string;
	login: string;
}

export const Check = (params: CheckProps) => {
	if (params.email === undefined || params.login === undefined) {
		throw new Error("Missing params");
	}
	return hand("/auth/check", {
		method: RestApiMethods.Post,
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(params)
	})
}