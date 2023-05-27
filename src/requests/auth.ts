import {HandWithProcessing, RestApiMethods} from "@/libs/hand/hand";
import {HTTPRequestParams} from "@/types/http";

export interface SignUpProps {
	name: string;
	email: string;
	password: string;
	surname: string;
	login: string;
}

export const SignUp = (params: HTTPRequestParams<SignUpProps>) => {
	let {email, login, name, password, surname} = params.params;
	if (email === undefined || login === undefined || password === undefined || name === undefined || surname === undefined) {
		throw new Error("Missing params");
	}
	if (password.length < 8 || password.length > 64) {
		throw new Error("Password length must be between 8 and 64");
	}
	HandWithProcessing("/auth/sign-up", {method: RestApiMethods.Post,
		body: JSON.stringify(params.params), headers: {"Content-Type": "application/json"}}, params.successCallback, params.failCallback)
}

export type SignInPropsLogin = {
	login: string;
	password: string;
}

export type SignInPropsEmail = {
	email: string;
	password: string;
}

export const SignInEmail = (params: HTTPRequestParams<SignInPropsEmail>) => {
	if (params.params?.password === undefined) {
		throw new Error("Missing password");
	}
	if (params.params?.email === undefined) {
		throw new Error("Missing params");
	}
	HandWithProcessing("/auth/sign-in", {
			method: RestApiMethods.Post,
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				password: params.params.password,
				email: params.params.email
			})
		}, params.successCallback, params.failCallback)

}

export const SignInLogin = (params: HTTPRequestParams<SignInPropsLogin>) => {
	if (params.params?.password === undefined) {
		throw new Error("Missing password");
	}
	if (params.params?.login === undefined) {
		throw new Error("Missing params");
	}
	HandWithProcessing("/auth/sign-in", {
		method: RestApiMethods.Post,
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(params.params)
	}, params.successCallback, params.failCallback)

}

export interface CheckProps {
	email: string;
	login: string;
}

export const Check = (params: HTTPRequestParams<CheckProps>) => {
	if (params.params?.email === undefined || params.params?.login === undefined) {
		throw new Error("Missing params");
	}
	HandWithProcessing("/auth/check", {
		method: RestApiMethods.Post,
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(params.params)
	}, params.successCallback, params.failCallback)
}