import {Eye} from "../infojs/eye";
import {eye} from "../infojs/infojs";
import {handConfig} from "./hand";

enum connectionResponseMethods {
    getOnlineUsers = "getOnlineUsers",
    userDisconnected = "userDisconnected",
    userConnected = "userConnected",
    newMessage = "newMessage",
    updateMessage = "updateMessage",
    deleteMessage = "deleteMessage",
    newChat = "newChat",
    updateChat = "updateChat",
    deleteChat = "deleteChat"
}

enum connectionRequestMethods {
    getOnlineUsers = "getOnlineUsers",
    sendMessage = "sendMessage",
    updateMessage = "updateMessage",
    deleteMessage = "deleteMessage",
    createChat = "createChat",
    updateChat = "updateChat",
    deleteChat = "deleteChat"
}

export class DefaultConnection {
    public WebConnection!: WebSocket;
    private readonly handler: (response: {method: connectionResponseMethods, data: any}) => void;
    private readonly eye: Eye;
    public readonly url: string;
    private readonly waitingFor: [connectionResponseMethods, string][];
    constructor(url: string, eye: Eye, handler: (response: {method: connectionResponseMethods, data: any}) => void) {
        this.eye = eye;
        this.url = url;
        this.handler = handler;
        this.waitingFor = [];
    }

    start(this: DefaultConnection, users: number[] | string[]) {
        this.eye.newLogGroup("Connecting", {name: "Configuring connection"}, 'Connection was opened')
        this.WebConnection = new WebSocket(this.url);
        this.eye.stepReady("Connecting", "Configuring connection")
        this.eye.newStep("Connecting", {name: "Opening connection"})
        this.WebConnection.onmessage = (e: MessageEvent) => {
            if (e.data == "Welcome") {
                this.eye.stepReady("Connecting", "Opening connection", true)
                Connection.checkUsersOnOnline(users.map(Number))
                return;
            }
            const message: any = JSON.parse(e.data);
            this.handleResponse(message);
        }
    }

    handleResponse(this: DefaultConnection, response: {method: connectionResponseMethods, data: any}) {
        this.eye.info(`Got response from ${this.WebConnection.url}: ${response.method}`)
        const index = this.waitingFor.findIndex(e => e[0] == response.method)
        if (index > -1) {
            this.eye.stepReady(this.waitingFor[index][1], `Response handler to method ${this.waitingFor[index][0]}`)
            this.eye.newStep(this.waitingFor[index][1], {name: `Handling to method ${this.waitingFor[index][0]}`})
        }
        this.handler(response)
        if (index > - 1) {
            this.eye.stepReady(this.waitingFor[index][1], `Handling to method ${this.waitingFor[index][0]}`, true)
            this.waitingFor.splice(index, 1)
        }
    }

    send(this: DefaultConnection, method: connectionRequestMethods, data: any, responseMethod: connectionResponseMethods | null = null, groupName: string | null = null) {
        if (responseMethod != null && groupName != null) {
            this.waitingFor.push([responseMethod, groupName]);
            this.eye.newLogGroup(groupName, {name: method}, groupName)
            this.WebConnection.send(JSON.stringify({method: method, data: data}))
            this.eye.newStep(groupName, {name: `Response handler to method ${responseMethod}`})
            this.eye.stepReady(groupName, method)
        } else {
            this.eye.info(`Sending ${method} to ${this.WebConnection.url}`)
            this.WebConnection.send(JSON.stringify({method: method, data: data}))
        }
    }

    saveSend(this: DefaultConnection, method: connectionRequestMethods, data: any, responseMethod: connectionResponseMethods | null = null, groupName: string | null = null) {
        if (this.WebConnection.bufferedAmount == 0) {
            this.send(method, data, responseMethod, groupName)
        }
    }
}

export type ConnectionResponse = {method: connectionResponseMethods, data: any};

export const router: Map<connectionResponseMethods, (message: ConnectionResponse) => void> = new Map()

export function handler(response: ConnectionResponse) {
    const func = router.get(response.method)
    if (func != undefined) func(response)
}

export class WebSocketConnection extends DefaultConnection {
    checkUsersOnOnline(this: WebSocketConnection, users: number[]) {
        this.saveSend(connectionRequestMethods.getOnlineUsers, users, connectionResponseMethods.getOnlineUsers, 'Getting online users')
    }
}

export const Connection = new WebSocketConnection('ws://' + handConfig.domain + '/ws', eye, handler);