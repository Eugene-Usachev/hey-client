import {WsMethodByEffect} from "@/libs/infojs/eye";

export const enum wsMethods {
	WELCOME = "Welcome",
	NEW_CHAT = "newChat",
	UPDATE_CHAT = "updateChat",
	DELETE_CHAT = "deleteChat",
}

export const getEffectFromMethod = (method: wsMethods): WsMethodByEffect => {
	switch (method) {
		case wsMethods.NEW_CHAT:
			return WsMethodByEffect.CREATE;
		case wsMethods.UPDATE_CHAT:
			return WsMethodByEffect.UPDATE;
		case wsMethods.DELETE_CHAT:
			return WsMethodByEffect.DELETE;
		case wsMethods.WELCOME:
			return WsMethodByEffect.ALIVE;
	}
}