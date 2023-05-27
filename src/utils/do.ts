import {handConfig, handEye, params, setUpParams} from "@/libs/hand/hand";
import {refresh} from "@/requests/refresh";
import {logout} from "@/utils/logout";

export const do = async (url: string, params: params, withAuth=true) => {
	if (withAuth) {
		if (!params.headers) params.headers = {};
		params.headers["Authorization"] = localStorage.getItem("accessToken") as string;
	}
	const res = await exec(url, params);
	if (withAuth) {
		if (res.status === 401) {
			const status = await refresh();
			if (status === 401) {
				logout();
			} else {
				if (!params.headers) params.headers = {};
				params.headers["Authorization"] = localStorage.getItem("accessToken") as string;
				return await exec(url, params);
			}
		} else {
			return res;
		}
	} else {
		return res;
	}
}

export const exec = (url: string, params: params) => {
	const readyParams = setUpParams(params);
	const {method, body, credentials, mode, cache, showDomain, redirect, referrerPolicy, headers} = readyParams;
	const realUrl = "http://" + handConfig.domain + url;
	showDomain ? handEye.eye.fetchSend(realUrl, method, handConfig.isTimeNecessary) : handEye.eye.fetchSend(url, method, handConfig.isTimeNecessary);
	const dateNow = new Date();
	return fetch(realUrl, {
		method: method,
		body: body,
		mode: mode,
		cache: cache,
		credentials: credentials,
		headers: headers,
		redirect: redirect,
		referrerPolicy: referrerPolicy
	}).then(response => {
		showDomain ? handEye.eye.fetchGet(realUrl, method, response.status, Number(Date.now()) - Number(dateNow), handConfig.isTimeNecessary) : handEye.eye.fetchGet(url, method, response.status, Number(Date.now()) - Number(dateNow), handConfig.isTimeNecessary)
		switch (response.status) {
			case 100:
				return handConfig.reactions.onContinue(response);
			case 101:
				return handConfig.reactions.onSwitchingProtocols(response);
			case 200:
				return handConfig.reactions.onOK(response);
			case 201:
				return handConfig.reactions.onCreated(response);
			case 202:
				return handConfig.reactions.onAccepted(response);
			case 203:
				return handConfig.reactions.onNonAuthoritativeInformation(response);
			case 204:
				return handConfig.reactions.onNoContent(response);
			case 205:
				return handConfig.reactions.onResetContent(response);
			case 206:
				return handConfig.reactions.onPartialContent(response);
			case 300:
				return handConfig.reactions.onMultipleChoices(response);
			case 301:
				return handConfig.reactions.onMovedPermanently(response);
			case 302:
				return handConfig.reactions.onFound(response);
			case 303:
				return handConfig.reactions.onSeeOther(response);
			case 304:
				return handConfig.reactions.onNotModified(response);
			case 305:
				return handConfig.reactions.onUseProxy(response);
			case 307:
				return handConfig.reactions.onTemporaryRedirect(response);
			case 400:
				return handConfig.reactions.onBadRequest(response);
			case 401:
				return handConfig.reactions.onUnauthorized(response);
			case 402:
				return handConfig.reactions.onPaymentRequired(response);
			case 403:
				return handConfig.reactions.onForbidden(response);
			case 404:
				return handConfig.reactions.onNotFound(response);
			case 405:
				return handConfig.reactions.onMethodNotAllowed(response);
			case 406:
				return handConfig.reactions.onNotAcceptable(response);
			case 407:
				return handConfig.reactions.onProxyAuthenticationRequired(response);
			case 408:
				return handConfig.reactions.onRequestTimeout(response);
			case 409:
				return handConfig.reactions.onConflict(response);
			case 410:
				return handConfig.reactions.onGone(response);
			case 411:
				return handConfig.reactions.onLengthRequired(response);
			case 412:
				return handConfig.reactions.onPreconditionFailed(response);
			case 413:
				return handConfig.reactions.onPayloadTooLarge(response);
			case 414:
				return handConfig.reactions.onURITooLong(response);
			case 415:
				return handConfig.reactions.onUnsupportedMediaType(response);
			case 416:
				return handConfig.reactions.onRangeNotSatisfiable(response);
			case 417:
				return handConfig.reactions.onExpectationFailed(response);
			case 500:
				return handConfig.reactions.onInternalServerError(response);
			case 501:
				return handConfig.reactions.onNotImplemented(response);
			case 502:
				return handConfig.reactions.onBadGateway(response);
			case 503:
				return handConfig.reactions.onServiceUnavailable(response);
			case 504:
				return handConfig.reactions.onGatewayTimeout(response);
			case 505:
				return handConfig.reactions.onHTTPVersionNotSupported(response);
			default:
				console.error(`Unhandled response status: ${response.status}`);
				break
		}
	})
}