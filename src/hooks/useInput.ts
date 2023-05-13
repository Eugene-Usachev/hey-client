import {ChangeEvent, useCallback, useState} from "react";

export const useInput = (initialValue: string, emptyValue: any = '') => {
	const [value, setValue] = useState(initialValue);
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};
	const reset = useCallback(() => {
		setValue(initialValue);
	}, [initialValue]);
	const setEmpty = useCallback(() => {
		setValue(emptyValue);
	}, [emptyValue]);
	return { value, onChange, reset, setEmpty };
}