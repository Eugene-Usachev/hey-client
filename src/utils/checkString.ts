import {regType} from "../components/Input/Input";

export const enum checkValidCodes {
	'ok' = 0,
	'empty' = 1,
	'tooShort' = 2,
}

export type checkStringResult = [string, checkValidCodes];

/** This function checks if a given string is valid based on certain criteria.
 value: the string to check;
 reg: a regular expression to match against;
 maxLength: the maximum length of the string;
 minLength (optional): the minimum length of the string (default is -1). If < 1, must be not empty.;
 checkSpace (optional): a boolean indicating whether to delete extra spaces (default is true); */
export const checkStringForValid = (value: string, reg: regType, maxLength: number, minLength: number = -1, checkSpace: boolean = true): checkStringResult => {
	let newValue = checkSpace ? deleteExtraSpaces(value) : value, status: number = checkValidCodes.ok;

	if (newValue.length > maxLength) {newValue = newValue.slice(0, maxLength)}
	if (reg !== 'all') {
		switch (reg) {
			case'eng':{newValue = newValue.replace (/[^A-Za-z\d\s]+/g, '');break;}
			case "number":{newValue = newValue.replace (/[^\d\s]+/g, '');break;}
			case "strictNumber":{newValue = newValue.replace (/\D/g, '');break;}
			case "eng_AND_rus":{newValue = newValue.replace (/[^A-Za-zа-яА-Я\d\s]+/g, '');break;}
			default: {
				if (reg) {
					newValue = newValue.replace (reg, '');
				}
			}
		}
	}

	if (newValue.length < minLength) {
		if (newValue.length === 0) {
			return [newValue, checkValidCodes.empty];
		}
		return [newValue, checkValidCodes.tooShort];
	}
	return [newValue, status];
}

export const deleteExtraSpaces = (value: string): string => {
	let newValue = value;
	while (newValue.slice(0, 1) === ' ' || newValue.slice(0, 1) === ' ') {
		newValue = newValue.substring(1, newValue.length);
	}
	while (newValue.slice(newValue.length - 1, newValue.length) === ' ' || newValue.slice(newValue.length - 1, newValue.length) === ' ') {
		newValue = newValue.substring(0, newValue.length - 1);
	}
	return newValue;
}