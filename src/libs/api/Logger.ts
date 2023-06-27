export enum MessageStyles {
	warn = 'warn',
	info = 'info',
	error = 'error',
	success = 'success'
}

export interface LoggerConfig {
	showDate:          boolean | undefined;

	readyStyleName:    MessageStyles | undefined;

	baseStyle: string[] | undefined;
	readyStyle: string[] | undefined;
	warnStyle: string[] | undefined;
	errorStyle: string[] | undefined;
	infoStyle: string[] | undefined;
	successStyle: string[] | undefined;
}

interface LoggerI extends LoggerConfig {
	enter(message: string, style: string[]): void;
	println(message: string): void;
	error(message: string): void;
	warn(message: string):void;
	info(message: string): void;
	success(message: string): void;
	ready(message: string): void;
	fetchSend(url: string, method: string): void;
	fetchGet(url: string, method: string, statusCode: number, time: number): void;
}

export class Logger implements LoggerI {
	private readonly showDate:     	   boolean          = true;
	private readonly baseStyle:    	   string[]         = ["color: #fff", "width: 100%", "background-color: #333", "padding: 2px 4px", "font-size: 14px", "border-radius: 2px"];
	private readonly errorStyle:   	   string[]		    = ["color: #fa0000"];
	private readonly infoStyle:    	   string[]			= ["color: lightblue"];
	private readonly readyStyleName:   MessageStyles    = MessageStyles.success;
	private readonly readyStyle:       string[]			= this.baseStyle;
	private readonly successStyle:     string[]			= ["color: #0fff83"];
	private readonly warnStyle:        string[]			= ["color: orange"];

	constructor(cfg: LoggerConfig) {
		this.showDate = cfg.showDate || true;
		this.readyStyleName = cfg.readyStyleName || MessageStyles.success;

		if (cfg.baseStyle != undefined) {
			this.baseStyle = cfg.baseStyle;
		}

		if (cfg.errorStyle != undefined) {
			this.errorStyle = cfg.errorStyle;
		}

		if (cfg.infoStyle != undefined) {
			this.infoStyle = cfg.infoStyle;
		}

		if (cfg.readyStyle != undefined) {
			this.readyStyle = cfg.readyStyle;
		}

		if (cfg.successStyle != undefined) {
			this.successStyle = cfg.successStyle;
		}

		if (cfg.warnStyle != undefined) {
			this.warnStyle = cfg.warnStyle;
		}

		switch (cfg.readyStyleName) {
			case MessageStyles.info:
				this.readyStyle = this.infoStyle;
				break;
			case MessageStyles.error:
				this.readyStyle = this.errorStyle;
				break;
			case MessageStyles.warn:
				this.readyStyle = this.warnStyle;
				break;
			case MessageStyles.success:
				this.readyStyle = this.successStyle;
				break;
		}
	}

	enter(message: any, style: string[] = []) {
		const realStyle = this.baseStyle.join(';') + ';' + style.join(';') + ';';
		if (typeof message === 'string') {
			console.log(`%c${this.showDate ? formatDate() : ''}${message}`, realStyle)
		} else {
			console.log(`%c${this.showDate ? formatDate() : ''}${JSON.stringify(message, null, 2)}`, realStyle)
		}
	}

	error(message: string): void {
		this.enter(message, this.errorStyle);
		console.trace()
	}

	info(message: string): void {
		this.enter(message, this.infoStyle);
	}

	println(message: string): void {
		this.enter(message, this.baseStyle);
	}

	success(message: string): void {
		this.enter(message, this.successStyle);
	}

	warn(message: string): void {
		this.enter(message, this.warnStyle);
	}

	ready(message: any, isTimeNecessary = true) {
		this.enter(message, this.readyStyle);
	}

	fetchSend(url: string, method: string) {
		const realStyle = this.baseStyle.join(';') + ';' + this.infoStyle.join(';') + ';';
		let methodStyle: string = '';
		switch (method) {
			case "GET": {
				methodStyle = [
					"background-color: #245980",
					"color: #fff",
					"width: 100%",
					"padding: 2px 4px",
					"font-size: 14px",
					"border-radius: 2px"
				].join(';') + ';';
				break;
			}
			case "POST": {
				methodStyle = [
					"background-color: #00a550",
					"color: #fff",
					"width: 100%",
					"padding: 2px 4px",
					"font-size: 14px",
					"border-radius: 2px"
				].join(';') + ';';
				break;
			}
			case "DELETE": {
				methodStyle = [
					"background-color: #fa0000",
					"color: #fff",
					"width: 100%",
					"padding: 2px 4px",
					"font-size: 14px",
					"border-radius: 2px"
				].join(';') + ';';
				break;
			}
			case "PUT":
			case "PATCH": {
				methodStyle = [
					"background-color: #ff8000",
					"color: #fff",
					"width: 100%",
					"padding: 2px 4px",
					"font-size: 14px",
					"border-radius: 2px"
				].join(';') + ';';
				break;
			}
		}
		let methodText = method;
		while (methodText.length < 7) {
			methodText += ' '
		}
		console.log(`%c${this.showDate ? formatDate() : ''}fetch to |%c${methodText}%c "${url}"`, realStyle, methodStyle, realStyle);
	}

	fetchGet(url: string, method: string, statusCode: number, time: number) {
		let realStyle: string = '';
		let methodStyle: string = '', statusCodeStyle: string = '';
		switch (method) {
			case "GET": {
				methodStyle = [
					"background-color: #245980",
					"color: #fff",
					"width: 100%",
					"padding: 2px 4px",
					"font-size: 14px",
					"border-radius: 2px"
				].join(';') + ';';
				break;
			}
			case "POST": {
				methodStyle = [
					"background-color: #00a550",
					"color: #fff",
					"width: 100%",
					"padding: 2px 4px",
					"font-size: 14px",
					"border-radius: 2px"
				].join(';') + ';';
				break;
			}
			case "DELETE": {
				methodStyle = [
					"background-color: #fa0000",
					"color: #fff",
					"width: 100%",
					"padding: 2px 4px",
					"font-size: 14px",
					"border-radius: 2px"
				].join(';') + ';';
				break;
			}
			case "PUT":
			case "PATCH": {
				methodStyle = [
					"background-color: #ff8000",
					"color: #fff",
					"width: 100%",
					"padding: 2px 4px",
					"font-size: 14px",
					"border-radius: 2px"
				].join(';') + ';';
				break;
			}
		}
		switch (+statusCode.toString()[0]) {
			case 1: {
				statusCodeStyle = [
					"background-color: #245980",
					"color: #fff",
					"width: 100%",
					"padding: 2px 4px",
					"font-size: 14px",
					"border-radius: 2px"
				].join(';') + ';';
				realStyle = this.baseStyle.join(';') + ';' + this.infoStyle.join(';') + ';';
				break;
			}
			case 2: {
				statusCodeStyle = [
					"background-color: #00a550",
					"color: #fff",
					"width: 100%",
					"padding: 2px 4px",
					"font-size: 14px",
					"border-radius: 2px"
				].join(';') + ';';
				realStyle = this.baseStyle.join(';') + ';' + this.successStyle.join(';') + ';';
				break;
			}
			case 3: {
				statusCodeStyle = [
					"background-color: orange",
					"color: #fff",
					"width: 100%",
					"padding: 2px 4px",
					"font-size: 14px",
					"border-radius: 2px"
				].join(';') + ';';
				realStyle = this.baseStyle.join(';') + ';' + this.infoStyle.join(';') + ';';
				break;
			}
			case 4: {
				statusCodeStyle = [
					"background-color: #c26910",
					"color: #fff",
					"width: 100%",
					"padding: 2px 4px",
					"font-size: 14px",
					"border-radius: 2px"
				].join(';') + ';';
				realStyle = this.baseStyle.join(';') + ';' + this.errorStyle.join(';') + ';';
				break;
			}
			case 5: {
				statusCodeStyle = [
					"background-color: #fa0000",
					"color: #fff",
					"width: 100%",
					"padding: 2px 4px",
					"font-size: 14px",
					"border-radius: 2px"
				].join(';') + ';';
				realStyle = this.baseStyle.join(';') + ';' + this.errorStyle.join(';') + ';';
				break;
			}
		}
		let methodText = method;
		while (methodText.length < 7) {
			methodText += ' '
		}
		console.log(`%c${this.showDate ? formatDate() : ''}fetch to |%c${methodText}%c "${url}"   |%c ${statusCode} %c|    ${time} ms`, realStyle, methodStyle, realStyle, statusCodeStyle, realStyle);
	}
}

const formatDate = () => {
	const DateNow = new Date(),
		Year = DateNow.getFullYear(),
		MonthConst = DateNow.getMonth() + 1,
		Month = MonthConst < 10? '0' + MonthConst : MonthConst,
		Day = DateNow.getDate(),
		Hours = DateNow.getHours(),
		MinutesConst = DateNow.getMinutes(),
		Minutes = MinutesConst < 10? `0${MinutesConst}` : MinutesConst,
		SecondsConst = DateNow.getSeconds(),
		Seconds = SecondsConst < 10? `0${SecondsConst}` : SecondsConst,
		Milliseconds = DateNow.getMilliseconds();
	return `${Year}/${Month}/${Day} ${Hours}:${Minutes}:${Seconds}.${Milliseconds}   `;
}