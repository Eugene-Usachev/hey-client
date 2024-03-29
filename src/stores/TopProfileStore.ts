import {action, observable} from "mobx";
import {setLang} from "@/app/config";

interface TopProfileStoreInterface {
	theme: 'dark' | 'light';
	avatar: string | undefined;
	name: string;
	surname: string;
	lang: 'ru' | 'eng';
	isGet: boolean;
	isAuthorized: boolean;

	initTheme(): void;
	changeTheme(theme: 'dark' | 'light'): void;
	changeAvatar(avatar: string): void;
	changeNameAndSurname(name: string, surname: string): void;
	initLang(): void;
	changeLang(lang: 'ru' | 'eng'): void;
	setIsGet(isGet: boolean): void;
	setIsAuthorized(isAuthorized: boolean): void;
}

export const TopProfileStore: TopProfileStoreInterface = observable<TopProfileStoreInterface>({
	name: '',
	surname: '',
	theme: 'dark',
	avatar: undefined,
	lang: 'eng',
	isGet: false,
	isAuthorized: false,

	initTheme: action(() => {
		let theme = localStorage.getItem("theme") as "dark" | "light";
		theme = theme.length > 0 ? theme : "dark";
		TopProfileStore.theme = theme;
		document.body.setAttribute('data-theme', theme);
	}),
	changeTheme: action((theme: "dark" | "light") => {
		TopProfileStore.theme = theme;
		document.body.setAttribute('data-theme', theme);
		localStorage.setItem("theme", theme);
	}),
	changeAvatar: action((avatar: string) => {
		TopProfileStore.avatar = avatar;
	}),
	changeNameAndSurname: action((name: string, surname: string) => {
		TopProfileStore.name = name;
		TopProfileStore.surname = surname;
	}),
	initLang: action(() => {
		const lang = localStorage.getItem("lang");
		switch (lang) {
			case "ru":
				setLang("ru");
				TopProfileStore.lang = "ru";
				break;
			case "eng":
				setLang("eng");
				TopProfileStore.lang = "eng";
				break;
			default:
				setLang("eng");
				TopProfileStore.lang = "eng";
				break;
		}
	}),
	changeLang: action((lang: 'ru' | 'eng') => {
		setLang(lang);
		TopProfileStore.lang = lang;
	}),
	setIsGet: action((isGet: boolean) => {
		TopProfileStore.isGet = isGet
	}),
	setIsAuthorized: action((isAuthorized: boolean) => {
		TopProfileStore.isAuthorized = isAuthorized
	})
});