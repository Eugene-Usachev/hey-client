'use client';
import React, {memo, FC, useCallback, useState} from 'react';
import styles from './LoginWindow.module.scss';
import {ModalWindow} from "@/components/ModalWindow/ModalWindow";
import {LoginBlock} from "../LoginBlock/LoginBlock";
import {SignUpBlock} from "../SignUpBlock/SignUpBlock";

interface LoginWindowProps {
	setOpenIsFalse: () => void;
}

let login = '', password = '', email = '', name = '', surname = '';

export async function Auth(res: Response) {
	console.log(await res.json())
}

export const LoginWindow: FC = memo<LoginWindowProps>(({setOpenIsFalse}) => {

	const [loginState, setLoginState] = useState(login);
	const [nameState, setNameState] = useState(name);
	const [surnameState, setSurnameState] = useState(surname);
	const [emailState, setEmailState] = useState(email);
	const [passwordState, setPasswordState] = useState(password);

	const onChangeLogin = useCallback((value: string) => {
		login = value;
		setLoginState(value);
	}, []);
	const onChangePassword = useCallback((value: string) => {
		setPasswordState(value);
		password = value;
	}, []);
	const onChangeEmail = useCallback((value: string) => {
		setEmailState(value);
		email = value;
	}, []);
	const onChangeName = useCallback((value: string) => {
		setNameState(value);
		name = value;
	}, []);
	const onChangeSurname = useCallback((value: string) => {
		setSurnameState(value);
		surname = value;
	}, []);

	// if true it is login, else it is register
	const [isLoginWindowOpen, setIsLoginWindowOpen] = useState(true);

	const onSetIsLoginWindowOpen = useCallback((value: boolean) => {
		setIsLoginWindowOpen(value)
	}, []);

	return (
		<ModalWindow close={setOpenIsFalse} style={{display: "flex", alignItems: 'center', justifyContent: 'center'}}>
			<div className={styles.loginWindow} onClick={(e) => {e.preventDefault();e.stopPropagation()}}>
				{isLoginWindowOpen
					? <LoginBlock login={loginState} password={passwordState} email={emailState} onChangeLogin={onChangeLogin} onChangeEmail={onChangeEmail} onChangePassword={onChangePassword} setIsLoginWindowOpen={onSetIsLoginWindowOpen}/>
					: <SignUpBlock login={loginState} password={passwordState} email={emailState} name={nameState} surname={surnameState} onChangeName={onChangeName} onChangeSurname={onChangeSurname}
								   onChangeLogin={onChangeLogin} onChangeEmail={onChangeEmail} onChangePassword={onChangePassword} setIsLoginWindowOpen={onSetIsLoginWindowOpen}/>
				}
			</div>
		</ModalWindow>
	);
});