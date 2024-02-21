import {signUser} from "@/utils/signUser";
import {logout} from "@/utils/logout";
import {DOMAIN} from "@/app/config";
import {eye} from "@/libs/infojs/infojs";

export const refresh = async ()=> {
	const id = localStorage.getItem("id");
	if (!id || +id < 1) {
		logout()
		throw new Error("Unauthorized")
	}
	const token = localStorage.getItem("refreshToken");
	if (!token || token === "") {
		logout()
		throw new Error("Unauthorized")
	}
	const res = await fetch(`https://${DOMAIN}/auth/refresh-tokens/${id}?token=${token}`, {
		method: "GET", cache: 'no-cache'
	})
	if (res.status !== 200) {
		logout()
		throw new Error("Unauthorized")
	}
	const body = await res.json();
	localStorage.setItem("accessToken", body.access_token);
	localStorage.setItem("refreshToken", body.refresh_token);
	return res;
}
export const refreshAll = async (): Promise<number> => {
	const id = localStorage.getItem("id");
	if (!id || +id < 1) {
		return 401;
	}
	const token = localStorage.getItem("refreshToken");
	if (!token || token === "") {
		return 401;
	}
	const body = JSON.stringify({id: +id, token: token})
	const startTime = Date.now();
	eye.fetchSend(`/auth/refresh`, "POST");
	const res = await fetch(`https://${DOMAIN}/auth/refresh`, {method: "POST", body: body, cache: 'no-cache'})
	eye.fetchGet(`/auth/refresh`, "POST", res.status, Date.now() - startTime);
	if (res.status !== 200) {
		return 401;
	}
	const data = await res.json();
	signUser({
		name: data.name,
		surname: data.surname,
		avatar: data.avatar,
		accessToken: data.access_token,
		refreshToken: data.refresh_token,
		login: localStorage.getItem("login") as string,
		email: localStorage.getItem("email") as string,
		id: +(localStorage.getItem("id") as string),
	})
	return 200;
}
