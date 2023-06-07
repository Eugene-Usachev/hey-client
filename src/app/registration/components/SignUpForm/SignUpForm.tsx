"use client";
import React, {memo, FC, useCallback, useRef, useState, useEffect} from 'react';
import styles from './SignUpBlock.module.scss';
import {getTextForLanguage} from "@/utils/getTextForLanguage";
import {Input} from "@/components/Input/Input";
import {Check, SignUp} from "@/requests/auth";
import {Auth} from "@/app/registration/components/LoginWindow/LoginWindow";
import {ErrorAlert} from "@/components/Alerts/Alerts";
import {useRouter} from "next/navigation";

interface SignUpFormProps {
	setIsLoginWindowOpen: (value: true) => void;
	login: string;
	name: string;
	surname: string;
	email: string;
	password: string;
	onChangeLogin: (value: string) => void;
	onChangeName: (value: string) => void;
	onChangeSurname: (value: string) => void;
	onChangePassword: (value: string) => void;
	onChangeEmail: (value: string) => void;
}

let timer = 0;
const onChangeLoginWithCheck = (login: string, email: string, onChangeLogin: (value: string) => void, setErrorMessage: (message: string) => void) => {
	onChangeLogin(login);
	if (timer) clearTimeout(timer);
	timer= window.setTimeout(() => {
		const res = Check({login: login, email: email});
		res.then(async (res) => {
			const data = await res.json();
			const {isEmailBusy, isLoginBusy} = data;
			if (isEmailBusy && isLoginBusy) {
				setErrorMessage(getTextForLanguage("Email and login is busy", "Электронная почта и логин заняты"));
			} else if (isEmailBusy) {
				setErrorMessage(getTextForLanguage("Email is busy", "Электронная почта занята"));
			} else if (isLoginBusy) {
				setErrorMessage(getTextForLanguage("Login is busy", "Логин занят"));
			} else {
				setErrorMessage("");
			}
		});
		res.catch((reason) => {
			throw new Error(reason);
		});
	}, 2000)
}

const onChangeEmailWithCheck = (login: string, email: string, onChangeEmail: (value: string) => void, setErrorMessage: (message: string) => void) => {
	onChangeEmail(email);
	if (timer) clearTimeout(timer);
	timer = window.setTimeout(() => {
		const res = Check({login: login, email: email},);
		res.then(async (res) => {
			const data = await res.json();
			const {isEmailBusy, isLoginBusy} = data;
			if (isEmailBusy && isLoginBusy) {
				setErrorMessage(getTextForLanguage("Email and login is busy", "Электронная почта и логин заняты"));
			} else if (isEmailBusy) {
				setErrorMessage(getTextForLanguage("Email is busy", "Электронная почта занята"));
			} else if (isLoginBusy) {
				setErrorMessage(getTextForLanguage("Login is busy", "Логин занят"));
			} else {
				setErrorMessage("");
			}
		})
		res.catch((reason) => {
			throw new Error(reason);
		});
	}, 2000)
}


export const SignUpForm: FC = memo<SignUpFormProps>(({setIsLoginWindowOpen, login, onChangeLogin, onChangePassword,
														   password, onChangeEmail, email,
														   onChangeSurname, onChangeName, name, surname
													   }) => {
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState("");
	const crEmail = useRef(email);
	const crLogin = useRef(login);

	const SignUpCallBack = useCallback(() => {
		if (errorMessage.length > 0) {
			ErrorAlert(errorMessage);
			return false;
		}
		const params = {
			password: password,
			email: email,
			login: login,
			name: name,
			surname: surname
		}
		SignUp(params)
			.then((res) => {Auth(router, res, name, surname, "" , email, login)})
			.catch((reason) => {throw new Error(reason)})
		return false;
	}, [login, name, surname, email, password]);

	useEffect(() => {
		if (errorMessage.length > 0) {
			ErrorAlert(errorMessage);
		}
	}, [errorMessage]);

	return (
		<div className={styles.signUpBlock}>
			<h2>{getTextForLanguage("Create a new account", "Создать новый аккаунт")}</h2>
			<Input onChangeValue={(currentLogin) => {crLogin.current = currentLogin;onChangeLoginWithCheck(currentLogin, crEmail.current, onChangeLogin, setErrorMessage)}} onEnter={SignUpCallBack} placeholder={getTextForLanguage('Enter your login', 'Придумайте логин')} startValue={login} maxLength={32} minLength={2} style={{marginBottom: '5px', width: '400px'}}/>
			<Input onChangeValue={onChangeName} onEnter={SignUpCallBack} placeholder={getTextForLanguage('Enter your name', 'Введите имя')} startValue={name} maxLength={32} minLength={2} style={{marginBottom: '5px', width: '400px'}}/>
			<Input onChangeValue={onChangeSurname} onEnter={SignUpCallBack} placeholder={getTextForLanguage('Enter your surname', 'Введите фамилию')} startValue={surname} maxLength={32} minLength={2} style={{marginBottom: '5px', width: '400px'}}/>
			<Input onChangeValue={(currentEmail) => {crEmail.current = currentEmail;onChangeEmailWithCheck(crLogin.current, currentEmail, onChangeEmail, setErrorMessage)}} onEnter={SignUpCallBack} placeholder={getTextForLanguage('Enter your email', 'Введите электронную почту')} startValue={email} minLength={10} maxLength={32} style={{marginBottom: '5px', width: '400px'}}/>
			<Input onChangeValue={onChangePassword} onEnter={SignUpCallBack} placeholder={getTextForLanguage('Enter a password', 'Придумайте пароль')} startValue={password} minLength={8} maxLength={64} style={{marginBottom: '5px', width: '400px'}} type={"password"}/>
			<div style={{width: '100%', display: 'flex', color: 'var(--blue)', justifyContent: 'end', alignItems: 'end'}}>
				<button className={styles.signUpButton} onClick={SignUpCallBack}>
					{getTextForLanguage("Sign up", "Зарегистрироваться")}
				</button>
			</div>
			<h3>
				{getTextForLanguage('Got an existing account? ', 'Есть существующий аккаунт? ')}
				<a style={{cursor: 'pointer'}} onClick={() => {setIsLoginWindowOpen(true);}}>
					{getTextForLanguage('Sign in', 'Войти')}
				</a>
			</h3>
		</div>
	);
});