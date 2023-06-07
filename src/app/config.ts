"use client";
import {handConfig, handEye} from "@/libs/hand/hand";
import {eye, init as initInfoJS} from "@/libs/infojs/infojs";
import {initFastArrays} from "@/libs/fastjs/index";

export const DOMAIN = 'localhost:4040';
export const STATIC = `http://${DOMAIN}`;
export const STATIC_USERS = `http://${DOMAIN}/UserFiles`;

export let USERID = null;
export let Lang: "ru" | "eng" = "eng";

// localStorage.setItem("lang", "BUG: server!");
// localStorage.setItem("userId", "BUG: server!");

export const initConfig = () => {
	handEye.eye = eye;
	handConfig.domain = DOMAIN;

	initFastArrays(false);
	initInfoJS(true);

	if (!USERID) {
		USERID = localStorage.getItem('userId')
	}

	if (USERID == "BUG: server!") console.warn(USERID)

	Lang = localStorage.getItem('lang') as any;

	if (Lang == "BUG: server!") console.warn(Lang)

	if (!Lang) {
		if (navigator.language == "ru") {
			document.querySelector("html").setAttribute("lang", "ru");
			Lang="ru";
			localStorage.setItem("lang", "ru")
		} else {
			document.querySelector("html").setAttribute("lang", "eng");
			Lang="eng";
			localStorage.setItem("lang", "eng")
		}
	} else if (Lang !== "eng" && Lang !== "ru") {
		document.querySelector("html").setAttribute("lang", "eng");
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