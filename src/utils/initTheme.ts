"use client";
export let UserTheme = "light";

//localStorage.setItem("theme", "BUG: server!");

export const initTheme = () => {
	UserTheme = localStorage.getItem('theme');
	if (UserTheme == "BUG: server!") console.warn(UserTheme)
	const body = document.querySelector("body") as HTMLElement;

	if (UserTheme) {
		body.setAttribute("data-theme", UserTheme);
	} else {
		body.setAttribute("data-theme", "light");
		localStorage.setItem("theme", "light");
	}
}