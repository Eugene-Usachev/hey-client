import {hand, RestApiMethods} from "@/libs/hand/hand";
import {signUser} from "@/utils/signUser";

export const refresh = async (): Promise<number> => {
	const id = localStorage.getItem("id");
	if (!id || +id < 1) {
		return 401;
	}
	const token = localStorage.getItem("refreshToken");
	if (!token || token === "") {
		return 401;
	}
	const body = JSON.stringify({id: id, token: token})
	const res = await hand("/refresh", {method: RestApiMethods.Post, body: body})
	if (res.status !== 201) {
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