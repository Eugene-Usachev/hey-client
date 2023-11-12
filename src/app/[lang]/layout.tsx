import '@/styles/index.scss';
import '@/styles/colors.scss';
import { Roboto } from 'next/font/google';
import { UseInitialComponent } from "@/hooks/UseInitialComponent";
import React from "react";
import styles from '@/components/Alerts/Alerts.module.scss'
import {lang} from "@/app/dictionaries";

export const metadata = {
	title: 'Hey',
	description: 'New social network'
}

export const MainFont = Roboto({
	weight: ['300', '400', '700'],
	subsets: ['latin']
})

export default function RootLayout({
									   children,
									   params
								   }: {
	children: React.ReactNode,
	params: {lang: string}
}) {

	lang.current = params.lang;

	return (
		<html lang={params.lang}>
			<UseInitialComponent />
			<body data-theme={"light"} style={{backgroundColor: "var(--colors-bg)", width: '100vw', height: '100vh',...MainFont.style}}>
				{children}
				<div className={styles.alertsBlock} id={"alertsBlock"} />
			</body>
		</html>
	)
}
