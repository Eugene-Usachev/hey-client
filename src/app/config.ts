"use client";
import {init as initInfoJS} from "@/libs/infojs/infojs";
import {initFastArrays} from "@/libs/fastjs/index";

export const CLIENT_DOMAIN = 'client-eoac.onrender.com';
export const DOMAIN = 'server-eoac.onrender.com';
export const STATIC = `https://${DOMAIN}`;
export const STATIC_USERS = `https://server-eoac.onrender.com/UserFiles`;

export let USERID = null as unknown as number;
export let Lang: "ru" | "eng" = "eng";

export const initConfig = () => {
	initFastArrays(false);
	initInfoJS(true);

	if (!USERID) {
		USERID = +(localStorage.getItem('id') as string);
	}

	if ((USERID as number | string) == "BUG: server!") console.warn(USERID);

	Lang = localStorage.getItem('lang') as "ru" | "eng";

	if ((Lang as "ru" | "eng" | "BUG: server!") == "BUG: server!") console.warn(Lang);

	if (!Lang) {
		if (navigator.language == "ru") {
			(document.querySelector("html") as HTMLElement).setAttribute("lang", "ru");
			Lang="ru";
			localStorage.setItem("lang", "ru")
		} else {
			(document.querySelector("html") as HTMLElement).setAttribute("lang", "eng");
			Lang="eng";
			localStorage.setItem("lang", "eng")
		}
	} else if (Lang !== "eng" && Lang !== "ru") {
		(document.querySelector("html") as HTMLElement).setAttribute("lang", "eng");
		Lang="eng";
		localStorage.setItem("lang", "eng")
	}

}

export const setLang = (lang: "ru" | "eng") => {
	if (Lang !== lang) {
		Lang=lang;
		localStorage.setItem("lang", lang)
	}
}