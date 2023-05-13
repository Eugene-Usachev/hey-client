import React, {memo, FC, useEffect} from 'react';
import {SetLoading} from "../../utils/SetLoading";
import {USERID} from "../../config";
import {useNavigate} from "react-router-dom";


export const ReferComponent: FC = memo(() => {
	const navigate = useNavigate();
	useEffect(() => {
		if (USERID > 0) {
			navigate('/pages/profile/' + USERID);
		} else {
			navigate('/pages/registration');
		}
	});

	return (
		<SetLoading />
	);
});