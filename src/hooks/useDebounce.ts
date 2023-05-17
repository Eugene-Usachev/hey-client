"use client";
import {useCallback, useRef} from "react";

export const useDebounce = (callback, delay: number) => {
	const timer = useRef<number>(0);

	const debouncedCallback = useCallback((...args) => {
		if (timer.current) {
			clearTimeout(timer.current);
		}
		timer.current = setTimeout(() => {
			callback(...args);
		}, delay);
	}, [callback, delay]);

	return debouncedCallback
}