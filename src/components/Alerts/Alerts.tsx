import React from "react";
import ReactDOM from "react-dom/client";
import {CommonAlertElem} from "./CommonAlert";
import {ErrorAlertElem} from "./ErrorAlert";
import {InfoAlertElem} from "./InfoAlert";
import {SuccessAlertElem} from "./SuccessAlert";
import {WarningAlertElem} from "./WarningAlert";

let alertsBlock = document.getElementById("alertsBlock");

export const CommonAlert = (text) => {
	Alert(<CommonAlertElem text={text} />);
}

export const ErrorAlert = (text) => {
	Alert(<ErrorAlertElem text={text} />);
}

export const InfoAlert = (text) => {
	Alert(<InfoAlertElem text={text}/>)
}

export const SuccessAlert = (text) => {
	Alert(<SuccessAlertElem text={text}/>)
}

export const WarningAlert = (text) => {
	Alert(<WarningAlertElem text={text}/>)
}

export const Alert = (elem: React.ReactNode) => {
	if (!alertsBlock) {
		alertsBlock = document.getElementById("alertsBlock");
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