"use client"
import React, {memo, FC, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import {ThreePoints} from "@/components/ThreePoints/ThreePoints";
import {USERID} from "@/app/config";

interface ReferComponentProps {
	dict: {
		HoldOnRedirectingInProgress: string;
	}
}

export const ReferComponent: FC<ReferComponentProps> = memo<ReferComponentProps>(({dict}) => {
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
			{dict.HoldOnRedirectingInProgress}
			<ThreePoints color={"var(--active-color)"}/>
		</div>
	);
});