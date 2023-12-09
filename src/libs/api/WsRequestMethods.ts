export const enum WsRequestMethods {
	getOnlineUsers="0",

	createChat="1",
	updateChat="2",
	deleteChat="3",

	sendMessage="4",
	updateMessage="5",
	deleteMessage="6",
}

export const getNameFromMethod = (method: WsRequestMethods): string => {
	switch (method) {
		case WsRequestMethods.getOnlineUsers:
			return "getOnlineUsers";
		case WsRequestMethods.createChat:
			return "createChat";
		case WsRequestMethods.updateChat:
			return "updateChat";
		case WsRequestMethods.deleteChat:
			return "deleteChat";
		case WsRequestMethods.sendMessage:
			return "sendMessage";
		case WsRequestMethods.updateMessage:
			return "updateMessage";
		case WsRequestMethods.deleteMessage:
			return "deleteMessage";
	}
}