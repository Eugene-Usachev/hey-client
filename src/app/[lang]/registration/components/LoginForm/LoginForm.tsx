'use client';
import React, {memo, FC, useState, useCallback} from 'react';
import styles from './LoginBlock.module.scss';
import {Input, InputDict} from "@/components/Input/Input";
import {Auth} from "@/app/[lang]/registration/components/LoginWindow/LoginWindow";
import {useRouter} from "next/navigation";
import {api} from "@/app/[lang]/registration/RegistrationAPI";

export interface LoginFormDict {
	"SignInToExistingAccount": string;
	"EnterYourLogin": string;
	"EnterYourEmail": string;
	"EnterAPassword": string;
	"ForgotPasswordClickHere": string;
	"SignIn": string;
	"DontHaveAnAccount": string;
	"SignUp": string;
}

interface LoginFormProps {
	setIsLoginWindowOpen: (value: false) => void;
	login: string;
	email: string;
	password: string;
	onChangeLogin: (value: string) => void;
	onChangePassword: (value: string) => void;
	onChangeEmail: (value: string) => void;
	dict: LoginFormDict;
	inputDict: InputDict;
}

export const LoginForm: FC<LoginFormProps> = memo<LoginFormProps>(({
	setIsLoginWindowOpen, email, inputDict,
	login, onChangeLogin, onChangePassword, password, onChangeEmail, dict
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
			<h2>{dict.SignInToExistingAccount}</h2>
			<Input dict={inputDict} onEnter={SignIn} onClick={activeLoginInput} isActive={loginInputIsActive} onChangeValue={onChangeLogin} type={'linked'} placeholder={dict.EnterYourLogin} startValue={login} maxLength={32} minLength={2} style={{width: '360px',marginBottom: '5px'}}/>
			<Input dict={inputDict} onEnter={SignIn} onClick={activeEmailInput} isActive={!loginInputIsActive} onChangeValue={onChangeEmail} type={'linked'} placeholder={dict.EnterYourEmail} startValue={email} maxLength={32} style={{width: '360px',marginBottom: '5px'}}/>
			<Input dict={inputDict} onEnter={SignIn} onChangeValue={onChangePassword} placeholder={dict.EnterAPassword} startValue={password} maxLength={32} style={{width: "400px"}} type={"password"}/>
			<div style={{width: '100%', display: 'flex', color: 'var(--active-color)', justifyContent: 'space-between', alignItems: 'end', marginTop: '5px'}}>
				{dict.ForgotPasswordClickHere}
				<button className={styles.loginButton} onClick={SignIn}>
					{dict.SignIn}
				</button>
			</div>
			<h3>
				{dict.DontHaveAnAccount}
				<a style={{cursor: 'pointer'}} onClick={() => {setIsLoginWindowOpen(false);}}>
					{" "}{dict.SignUp}
				</a>
			</h3>
		</div>
	);
});