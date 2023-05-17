'use client';
import React, {memo, FC, useState, useCallback} from 'react';
import styles from './RegistrationBlock.module.scss';
import {Header} from "../Header/Header";
import {LoginWindow} from "../LoginWindow/LoginWindow";

export const RegistrationBlock: FC = memo(() => {

	const [isLoginWindowOpen, setIsLoginWindowOpen] = useState(false);
	const setLoginWindowIsOpen = useCallback(() => {
		setIsLoginWindowOpen(true);
	}, []);
	const setLoginWindowIsClose = useCallback(() => {
		setIsLoginWindowOpen(false);
	}, []);

	return (
		<div className={styles.registrationBlock}>
			<Header setLoginWindowIsOpen={setLoginWindowIsOpen}/>
			{isLoginWindowOpen && <LoginWindow setOpenIsFalse={setLoginWindowIsClose}/>}
		</div>
	);
});