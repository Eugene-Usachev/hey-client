"use client";
import {useCallback, useEffect, useState} from "react";

export const useTheme = () => {
	const [theme, setTheme] = useState<'light' | 'dark'>('dark');

	const toggleTheme = useCallback(() => {
		setTheme(theme === 'light' ? 'dark' : 'light');
	}, [theme]);

	useEffect(() => {
		document.body.setAttribute('data-theme', theme);
	}, [theme]);

	return {
		theme, toggleTheme
	}
}