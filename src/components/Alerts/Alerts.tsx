"use client";
import React from "react";
import ReactDOM from "react-dom/client";
import {CommonAlertElem} from "./CommonAlert";
import {ErrorAlertElem} from "./ErrorAlert";
import {InfoAlertElem} from "./InfoAlert";
import {SuccessAlertElem} from "./SuccessAlert";
import {WarningAlertElem} from "./WarningAlert";

let alertsBlock: HTMLElement | null = null;

export const CommonAlert = (text: string) => {
	Alert(<CommonAlertElem text={text} />);
}

export const ErrorAlert = (text: string) => {
	Alert(<ErrorAlertElem text={text} />);
}

export const InfoAlert = (text: string) => {
	Alert(<InfoAlertElem text={text}/>)
}

export const SuccessAlert = (text: string) => {
	Alert(<SuccessAlertElem text={text}/>)
}

export const WarningAlert = (text: string) => {
	Alert(<WarningAlertElem text={text}/>)
}

export const Alert = (elem: React.ReactNode) => {
	if (!alertsBlock) {
		alertsBlock = document.getElementById("alertsBlock") as HTMLElement;
		if (!alertsBlock) {
			throw new Error("Alerts block not found");
		}
	}
	const newDiv = document.createElement('div');
	const root = ReactDOM.createRoot(newDiv);
	root.render(elem);
	alertsBlock.appendChild(newDiv);
	// After 10 seconds, remove the component from the DOM
	setTimeout(() => {
		newDiv.remove();
	}, 100000);
}