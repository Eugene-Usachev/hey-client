import {WsMethodByEffect} from "@/libs/infojs/eye";

export const enum WsResponseMethod {
	WELCOME = "Welcome",
	NEW_CHAT = "newChat",
	UPDATE_CHAT = "updateChat",
	DELETE_CHAT = "deleteChat",
	NEW_MESSAGE = "newMessage",
	UPDATE_MESSAGE = "updateMessage",
	DELETE_MESSAGE = "deleteMessage"
}

export const getEffectFromMethod = (method: WsResponseMethod): WsMethodByEffect => {
	switch (method) {
		case WsResponseMethod.NEW_CHAT:
			return WsMethodByEffect.CREATE;
		case WsResponseMethod.UPDATE_CHAT:
			return WsMethodByEffect.UPDATE;
		case WsResponseMethod.DELETE_CHAT:
			return WsMethodByEffect.DELETE;
		case WsResponseMethod.WELCOME:
			return WsMethodByEffect.ALIVE;
		case WsResponseMethod.NEW_MESSAGE:
			return WsMethodByEffect.CREATE;
		case WsResponseMethod.UPDATE_MESSAGE:
			return WsMethodByEffect.UPDATE;
		case WsResponseMethod.DELETE_MESSAGE:
			return WsMethodByEffect.DELETE;
	}
}