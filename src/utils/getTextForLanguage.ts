import {Lang} from "@/app/config";
import {TopProfileStore} from "@/stores/TopProfileStore";

export const getTextForLanguageWithoutStore = (engText: string, ruText: string): string => {
	switch (Lang) {
		case "eng":
			return engText;
		case "ru":
			return ruText;
	}
}

export const getTextForLanguage = (engText: string, ruText: string): string => {
	switch (TopProfileStore.lang) {
		case "eng":
			return engText;
		case "ru":
			return ruText;
	}
}