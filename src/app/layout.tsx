import '@/styles/index.scss';
import '@/styles/colors.scss';
import {UseInitialComponent} from "@/hooks/UseInitialComponent";
import React from "react";
import styles from '@/components/Alerts/Alerts.module.scss'

export const metadata = {
	title: 'Hey',
	description: 'New social network',
	icon: './favicon.svg'
}

export default function RootLayout({
									   children,
								   }: {
	children: React.ReactNode
}) {

	return (
		<html lang="en">
			<UseInitialComponent />
			<body data-theme={"light"}>
				{children}
				<div className={styles.alertsBlock} id={"alertsBlock"} />
			</body>
		</html>
	)
}
