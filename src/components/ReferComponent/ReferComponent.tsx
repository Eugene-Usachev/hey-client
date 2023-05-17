"use client"
import React, {memo, FC, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import {getTextForLanguage} from "@/utils/getTextForLanguage";
import {ThreePoints} from "@/components/ThreePoints/ThreePoints";
import {USERID} from "@/app/config";

export const ReferComponent: FC = memo(() => {
	const router = useRouter();
	useEffect(() => {
		if (USERID > 0) {
			router.push('/profile/' + USERID);
		} else {
			router.push('/registration');
		}
	});

	return (
		<div style={{placeSelf: "center", color: "var(--active-color)", fontSize: "20px"}}>
			{getTextForLanguage("Hold on. Redirecting in progress", "Подождите. Идёт перенаправление")}
			<ThreePoints color={"var(--active-color)"}/>
		</div>
	);
});