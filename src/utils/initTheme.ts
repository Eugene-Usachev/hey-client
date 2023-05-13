export const UserTheme = localStorage.getItem('theme');

export const initTheme = () => {
	const body = document.querySelector("body") as HTMLElement;

	if (UserTheme) {
		body.setAttribute("data-theme", UserTheme);
	} else {
		body.setAttribute("data-theme", "light");
		localStorage.setItem("theme", "light");
	}
}