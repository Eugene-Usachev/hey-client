'use client';
import React, {memo, FC, useState, useCallback, useEffect} from 'react';
import styles from './LoginBlock.module.scss';
import {getTextForLanguage} from "@/utils/getTextForLanguage";
import {Input} from "@/components/Input/Input";
import {SignInEmail, SignInLogin} from "@/requests/auth";
import {Auth} from "@/app/registration/components/LoginWindow/LoginWindow";
import {useRouter} from "next/navigation";
import {Alert, CommonAlert, ErrorAlert, InfoAlert, SuccessAlert, WarningAlert} from "@/components/Alerts/Alerts";

interface LoginFormProps {
	setIsLoginWindowOpen: (value: false) => void;
	login: string;
	email: string;
	password: string;
	onChangeLogin: (value: string) => void;
	onChangePassword: (value: string) => void;
	onChangeEmail: (value: string) => void;
}

export const LoginForm: FC = memo<LoginFormProps>(({
	setIsLoginWindowOpen, email,
	login, onChangeLogin, onChangePassword, password, onChangeEmail
}) => {

	const router = useRouter();
	const [loginInputIsActive, setLoginInputIsActive] = useState(true);
	const activeLoginInput = useCallback(() => {
		setLoginInputIsActive(true);
	}, []);
	const activeEmailInput = useCallback(() => {
		setLoginInputIsActive(false);
	}, []);
	const SignIn = useCallback(() => {
		if (loginInputIsActive) {
			const res = SignInLogin({login: login, password: password});
			res
				.then((res) => {Auth(router, res)})
				.catch((reason) => {throw new Error(reason)})
		} else {
			const res = SignInEmail({email: email, password: password})
			res
				.then((res) => {Auth(router, res)})
				.catch((reason) => {throw new Error(reason)})
		}
		return false;
	}, [login, email, password, loginInputIsActive]);

	return (
		<div className={styles.loginBlock}>
			<h2>{getTextForLanguage("Sign in to an existing account", "Войти в существующий аккаунт")}</h2>
			<Input onEnter={SignIn} onClick={activeLoginInput} isActive={loginInputIsActive} onChangeValue={onChangeLogin} type={'linked'} placeholder={getTextForLanguage('Enter your login', 'Введите логин')} startValue={login} maxLength={32} minLength={2} style={{width: '360px',marginBottom: '5px'}}/>
			<Input onEnter={SignIn} onClick={activeEmailInput} isActive={!loginInputIsActive} onChangeValue={onChangeEmail} type={'linked'} placeholder={getTextForLanguage('Enter your email', 'Введите электронную почту')} startValue={email} maxLength={32} style={{width: '360px',marginBottom: '5px'}}/>
			<Input onEnter={SignIn} onChangeValue={onChangePassword} placeholder={getTextForLanguage('Enter a password', 'Введите пароль')} startValue={password} maxLength={32} style={{width: "400px"}} type={"password"}/>
			<div style={{width: '100%', display: 'flex', color: 'var(--active-color)', justifyContent: 'space-between', alignItems: 'end', marginTop: '5px'}}>
				{getTextForLanguage("Forgot password? Click here", "Забыли пароль? Нажмите сюда")}
				<button className={styles.loginButton} onClick={SignIn}>
					{getTextForLanguage("Sign in", "Войти")}
				</button>
			</div>
			<h3>
				{getTextForLanguage('Don\'t have an account? ', 'Нет аккаунта? ')}
				<a style={{cursor: 'pointer'}} onClick={() => {setIsLoginWindowOpen(false);}}>
					{getTextForLanguage('Sign up', 'Зарегистрироваться')}
				</a>
			</h3>
		</div>
	);
});