"use client"
import {FC, memo, useEffect} from "react";
import {initConfig} from "@/app/config";
import {initTheme} from "@/utils/initTheme";

export const UseInitialComponent: FC = memo(() => {
	useEffect(() => {
		initTheme();
		initConfig();
	}, []);
	return <></>
})