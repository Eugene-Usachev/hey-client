import Negotiator, { Headers } from 'negotiator'
import {NextRequest, NextResponse} from "next/server";

const locales = ['ru', 'en'];
const defaultLocale = 'en';

function getLocale(request: NextRequest) {
	const negotiator = new Negotiator({ headers: request.headers as Headers });
	const preferredLanguage = negotiator.language(locales) || defaultLocale;

	const languageFromAddress = request.nextUrl.pathname.split('/')[1];

	const languageToUse = locales.includes(languageFromAddress)
		? languageFromAddress
		: preferredLanguage;

	return languageToUse;
}

export function middleware(request) {
	const pathname = request.nextUrl.pathname;
	let startWith = "";
	for (let i = 1; i < pathname.length; i++) {
		if (pathname[i] === '/') {
			startWith = pathname.slice(1, i);
			break;
		}
	}

	switch (startWith) {
		case 'icon.svg':
			return;
		case 'favicon.ico':
			return;
		case 'images':
			return;
	}
	const pathnameIsMissingLocale = locales.every(
		(locale) => locale !== startWith && pathname !== `/${locale}`
	);

	// Redirect if there is no locale
	if (pathnameIsMissingLocale && pathname !== "icon.svg" && pathname !== "favicon.ico" && pathname !== "/images") {
		const locale = getLocale(request);

		return NextResponse.redirect(
			new URL(`/${locale}/${pathname}`, request.url)
		);
	}
}
export const config = {
	matcher: [
		'/((?!_next).*)',
	],
}
