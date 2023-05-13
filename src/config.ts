import {handConfig, handEye} from "./libs/hand/hand";
import {eye, init as initInfoJS} from "./libs/infojs/infojs";
import {initFastArrays} from "./libs/fastjs/index";

export const DOMAIN = 'localhost:4040';
export const STATIC = `http://${DOMAIN}/UserFiles/`;

export const USERID = localStorage.getItem('userId');
export let Lang: "ru" | "eng" = localStorage.getItem('lang') as any;

export const initConfig = () => {
	handEye.eye = eye;
	handConfig.credentials = 'include';
	handConfig.domain = DOMAIN;

	initFastArrays(false);
	initInfoJS(true);
	
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