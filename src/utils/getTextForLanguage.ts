import {Lang} from "../config";

export const getTextForLanguage = (engText: string, ruText: string): string => {
	switch (Lang) {
		case "eng":
			return engText;
		case "ru":
			return ruText;
	}
}