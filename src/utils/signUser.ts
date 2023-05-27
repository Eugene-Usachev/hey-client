export interface signUserInterface {
	id: number;
	email: string;
	login: string;
	name: string;
	surname: string;
	avatar: string;
	accessToken: string;
	refreshToken: string;
}
export const signUser = (obj: signUserInterface) => {
	localStorage.setItem("id", obj.id.toString());
	localStorage.setItem("email", obj.email);
	localStorage.setItem("login", obj.login);
	localStorage.setItem("name", obj.name);
	localStorage.setItem("surname", obj.surname);
	localStorage.setItem("avatar", obj.avatar);
	localStorage.setItem("accessToken", obj.accessToken);
	localStorage.setItem("refreshToken", obj.refreshToken);
}