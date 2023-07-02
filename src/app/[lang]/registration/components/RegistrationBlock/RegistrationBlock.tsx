'use client';
import React, {memo, FC, useState, useCallback} from 'react';
import styles from './RegistrationBlock.module.scss';
import {Header} from "../Header/Header";
import {LoginWindow} from "../LoginWindow/LoginWindow";
import {SignUpFormDict} from "@/app/[lang]/registration/components/SignUpForm/SignUpForm";
import {LoginFormDict} from "@/app/[lang]/registration/components/LoginForm/LoginForm";
import {InputDict} from "@/components/Input/Input";

interface RegistrationBlockProps {
	HeaderDict: {
		SignUp: string;
		SignIn: string;
	};
	signUpFormDict: SignUpFormDict;
	signInFormDict: LoginFormDict;
	inputDict: InputDict;
}

export const RegistrationBlock: FC<RegistrationBlockProps> = memo(({HeaderDict, signUpFormDict, signInFormDict, inputDict}) => {

	const [isLoginWindowOpen, setIsLoginWindowOpen] = useState(false);
	const setLoginWindowIsOpen = useCallback(() => {
		setIsLoginWindowOpen(true);
	}, []);
	const setLoginWindowIsClose = useCallback(() => {
		setIsLoginWindowOpen(false);
	}, []);

	return (
		<div className={styles.registrationBlock}>
			<Header Dict={HeaderDict} setLoginWindowIsOpen={setLoginWindowIsOpen}/>
			{isLoginWindowOpen && <LoginWindow inputDict={inputDict} signInFormDict={signInFormDict} signUpFormDict={signUpFormDict} setOpenIsFalse={setLoginWindowIsClose}/>}
		</div>
	);
});