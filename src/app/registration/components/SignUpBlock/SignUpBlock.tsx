"use client";
import React, {memo, FC, useCallback, useRef, useState, useEffect} from 'react';
import styles from './SignUpBlock.module.scss';
import {getTextForLanguage} from "@/utils/getTextForLanguage";
import {Input} from "@/components/Input/Input";
import {Check, SignUp, SignUpProps} from "@/requests/auth";
import {HTTPRequestParams} from "@/types/http";
import {Auth} from "@/app/registration/components/LoginWindow/LoginWindow";
import {ErrorAlert} from "@/components/Alerts/Alerts";
import {boolean} from "zod";

interface SignUpBlockProps {
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

export const SignUpBlock: FC = memo<SignUpBlockProps>(({setIsLoginWindowOpen, login, onChangeLogin, onChangePassword,
														   password, onChangeEmail, email,
															onChangeSurname, onChangeName, name, surname
													   }) => {

	const [errorMessage, setErrorMessage] = useState("");
	const timer = useRef<number>();
	// TODO doesn't work!!!
	const onChangeLoginCallback = useCallback((currentLogin: string) => {
		onChangeLogin(currentLogin);
		if (timer.current) clearTimeout(timer.current);
		timer.current = window.setTimeout(() => {
			Check({
				params: {login: currentLogin, email: email},
				failCallback: (reason) => {
					throw new Error(reason);
				},
				successCallback: async (res) => {
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
				}
			})
		}, 2000)
	}, [email]);
	// TODO doesn't work!!!
	const onChangeEmailCallback = useCallback((currentEmail: string) => {
		onChangeEmail(currentEmail);
		if (timer.current) clearTimeout(timer.current);
		timer.current = window.setTimeout(() => {
			Check({
				params: {login: login, email: currentEmail},
				failCallback: (reason) => {
					throw new Error(reason);
				},
				successCallback: async (res) => {
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
				}
			})
		}, 2000)
	}, [login]);

	const SignUpCallBack = useCallback(() => {
		if (errorMessage.length > 0) {
			ErrorAlert(errorMessage);
			return;
		}
		const params: SignUpProps = {
			password: password,
			email: email,
			login: login,
			name: name,
			surname: surname
		}
		const SignUpParams: HTTPRequestParams<SignUpProps> = {
			params: params,
			failCallback: (reason: any) => {
				throw new Error(reason);
			},
			successCallback: Auth
		}
		SignUp(SignUpParams)
	}, [login, name, surname, email, password]);

	useEffect(() => {
		if (errorMessage.length > 0) {
			ErrorAlert(errorMessage);
		}
	}, [errorMessage]);

	return (
		<div className={styles.signUpBlock}>
			<h2>{getTextForLanguage("Create a new account", "Создать новый аккаунт")}</h2>
			<Input onChange={onChangeLoginCallback} onEnter={SignUpCallBack} placeholder={getTextForLanguage('Enter your login', 'Придумайте логин')} startValue={login} maxLength={32} minLength={2} style={{marginBottom: '5px'}}/>
			<Input onChange={onChangeName} onEnter={SignUpCallBack} placeholder={getTextForLanguage('Enter your name', 'Введите имя')} startValue={name} maxLength={32} minLength={2} style={{marginBottom: '5px'}}/>
			<Input onChange={onChangeSurname} onEnter={SignUpCallBack} placeholder={getTextForLanguage('Enter your surname', 'Введите фамилию')} startValue={surname} maxLength={32} minLength={2} style={{marginBottom: '5px'}}/>
			<Input onChange={onChangeEmailCallback} onEnter={SignUpCallBack} placeholder={getTextForLanguage('Enter your email', 'Введите электронную почту')} startValue={email} minLength={10} maxLength={32} style={{marginBottom: '5px'}}/>
			<Input onChange={onChangePassword} onEnter={SignUpCallBack} placeholder={getTextForLanguage('Enter a password', 'Придумайте пароль')} startValue={password} minLength={8} maxLength={64} style={{marginBottom: '5px'}} type={"password"}/>
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