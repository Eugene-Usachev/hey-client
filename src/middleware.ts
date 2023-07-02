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
	const pathname = request.nextUrl.pathname
	const pathnameIsMissingLocale = locales.every(
		(locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
	)

	// Redirect if there is no locale
	if (pathnameIsMissingLocale) {
		const locale = getLocale(request)

		// e.g. incoming request is /products
		// The new URL is now /en/products
		return NextResponse.redirect(
			new URL(`/${locale}/${pathname}`, request.url)
		)
	}
}
export const config = {
	matcher: [
		'/((?!_next).*)',
	],
}
