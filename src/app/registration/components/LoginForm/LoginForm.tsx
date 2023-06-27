'use client';
import React, {memo, FC, useState, useCallback} from 'react';
import styles from './LoginBlock.module.scss';
import {getTextForLanguageWithoutStore} from "@/utils/getTextForLanguage";
import {Input} from "@/components/Input/Input";
import {Auth} from "@/app/registration/components/LoginWindow/LoginWindow";
import {useRouter} from "next/navigation";
import {api} from "@/app/registration/RegistrationAPI";

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
			const res = api.signInLogin({login: login, password: password});
			res
				.then((res) => {Auth(router, res)})
				.catch((reason) => {throw new Error(reason)})
		} else {
			const res = api.signInEmail({email: email, password: password})
			res
				.then((res) => {Auth(router, res)})
				.catch((reason) => {throw new Error(reason)})
		}
		return false;
	}, [login, email, password, loginInputIsActive]);

	return (
		<div className={styles.loginBlock}>
			<h2>{getTextForLanguageWithoutStore("Sign in to an existing account", "Войти в существующий аккаунт")}</h2>
			<Input onEnter={SignIn} onClick={activeLoginInput} isActive={loginInputIsActive} onChangeValue={onChangeLogin} type={'linked'} placeholder={getTextForLanguageWithoutStore('Enter your login', 'Введите логин')} startValue={login} maxLength={32} minLength={2} style={{width: '360px',marginBottom: '5px'}}/>
			<Input onEnter={SignIn} onClick={activeEmailInput} isActive={!loginInputIsActive} onChangeValue={onChangeEmail} type={'linked'} placeholder={getTextForLanguageWithoutStore('Enter your email', 'Введите электронную почту')} startValue={email} maxLength={32} style={{width: '360px',marginBottom: '5px'}}/>
			<Input onEnter={SignIn} onChangeValue={onChangePassword} placeholder={getTextForLanguageWithoutStore('Enter a password', 'Введите пароль')} startValue={password} maxLength={32} style={{width: "400px"}} type={"password"}/>
			<div style={{width: '100%', display: 'flex', color: 'var(--active-color)', justifyContent: 'space-between', alignItems: 'end', marginTop: '5px'}}>
				{getTextForLanguageWithoutStore("Forgot password? Click here", "Забыли пароль? Нажмите сюда")}
				<button className={styles.loginButton} onClick={SignIn}>
					{getTextForLanguageWithoutStore("Sign in", "Войти")}
				</button>
			</div>
			<h3>
				{getTextForLanguageWithoutStore('Don\'t have an account? ', 'Нет аккаунта? ')}
				<a style={{cursor: 'pointer'}} onClick={() => {setIsLoginWindowOpen(false);}}>
					{getTextForLanguageWithoutStore('Sign up', 'Зарегистрироваться')}
				</a>
			</h3>
		</div>
	);
});