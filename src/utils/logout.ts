export const logout = () => {
	localStorage.removeItem("id");
	localStorage.removeItem("name");
	localStorage.removeItem("surname");
	localStorage.removeItem("avatar");
	localStorage.removeItem("login");
	localStorage.removeItem("email");
	localStorage.removeItem("accessToken");
	localStorage.removeItem("refreshToken");

	// TODO
	//window.location.href = "/registration";
}