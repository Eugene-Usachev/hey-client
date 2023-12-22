'use client';
import React, {memo, FC, useCallback, useState} from 'react';
import styles from './LoginWindow.module.scss';
import {ModalWindow} from "@/components/ModalWindow/ModalWindow";
import {LoginForm, LoginFormDict} from "../LoginForm/LoginForm";
import {SignUpForm, SignUpFormDict} from "../SignUpForm/SignUpForm";
import {signUser} from "@/utils/signUser";
import {InputDict} from "@/components/Input/Input";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {CLIENT_DOMAIN, DOMAIN} from "@/app/config";

interface LoginWindowProps {
	setOpenIsFalse: () => void;
	signUpFormDict: SignUpFormDict;
	signInFormDict: LoginFormDict;
	inputDict: InputDict;
}

let login = '', password = '', email = '', name = '', surname = '';

export async function Auth(router: AppRouterInstance, res: Response, initialName="", initialSurname="", initialAvatar="", initialEmail="", initialLogin="") {
	const resParsed = await res.json();
	let {id, login, email, name, surname, avatar, access_token, refresh_token} = resParsed;

	if (!id) throw new Error("No id");
	if (!login) login = initialLogin;
	if (!email) email = initialEmail;
	if (!name) name = initialName;
	if (!surname) surname = initialSurname;
	if (!avatar) avatar = initialAvatar;
	if (!access_token) throw new Error("No access_token");
	if (!refresh_token) throw new Error("No refresh_token");

	signUser({
		id: id,
		login: login,
		email: email,
		name: name,
		surname: surname,
		avatar: avatar,
		accessToken: access_token,
		refreshToken: refresh_token
	});
	let old = window.location.href;
	let newHref = `http://${CLIENT_DOMAIN}/${old.split("/")[3]}/profile/${id}`;
	location.replace(newHref);
}

export const LoginWindow: FC<LoginWindowProps> = memo<LoginWindowProps>(({setOpenIsFalse, signUpFormDict, signInFormDict, inputDict}) => {
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
					? <LoginForm inputDict={inputDict} dict={signInFormDict} login={loginState} password={passwordState} email={emailState} onChangeLogin={onChangeLogin} onChangeEmail={onChangeEmail} onChangePassword={onChangePassword} setIsLoginWindowOpen={onSetIsLoginWindowOpen}/>
					: <SignUpForm inputDict={inputDict} dict={signUpFormDict} login={loginState} password={passwordState} email={emailState} name={nameState} surname={surnameState} onChangeName={onChangeName} onChangeSurname={onChangeSurname}
								  onChangeLogin={onChangeLogin} onChangeEmail={onChangeEmail} onChangePassword={onChangePassword} setIsLoginWindowOpen={onSetIsLoginWindowOpen}/>
				}
			</div>
		</ModalWindow>
	);
});