"use client";
import React, {memo, FC, useCallback, useRef, useState, useEffect} from 'react';
import styles from './SignUpBlock.module.scss';
import {Input, InputDict} from "@/components/Input/Input";
import {Auth} from "@/app/[lang]/registration/components/LoginWindow/LoginWindow";
import {ErrorAlert} from "@/components/Alerts/Alerts";
import {useRouter} from "next/navigation";
import {api} from "@/app/[lang]/registration/RegistrationAPI";

export interface SignUpFormDict {
	"CreateNewAccount": string;
	"EnterYourLogin": string;
	"EnterYourName": string;
	"EnterYourSurname": string;
	"EnterYourEmail": string;
	"EnterAPassword": string;
	"SignUp": string;
	"GotAnExistingAccount": string;
	"SignIn": string;
	"EmailAndLoginIsBusy": string;
	"EmailIsBusy": string;
	"LoginIsBusy": string;
}

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
	dict: SignUpFormDict
	inputDict: InputDict;
}

let timer = 0;
const onChangeLoginWithCheck = (login: string, email: string, onChangeLogin: (value: string) => void, setErrorMessage: (message: string) => void, dict: SignUpFormDict) => {
	onChangeLogin(login);
	if (timer) clearTimeout(timer);
	timer= window.setTimeout(() => {
		const res = api.check({login: login, email: email});
		res.then(async (res) => {
			const data = await res.json();
			const {isEmailBusy, isLoginBusy} = data;
			if (isEmailBusy && isLoginBusy) {
				setErrorMessage(dict.EmailAndLoginIsBusy);
			} else if (isEmailBusy) {
				setErrorMessage(dict.EmailIsBusy);
			} else if (isLoginBusy) {
				setErrorMessage(dict.LoginIsBusy);
			} else {
				setErrorMessage("");
			}
		});
		res.catch((reason) => {
			throw new Error(reason);
		});
	}, 2000)
}

const onChangeEmailWithCheck = (login: string, email: string, onChangeEmail: (value: string) => void, setErrorMessage: (message: string) => void, dict: SignUpFormDict) => {
	onChangeEmail(email);
	if (timer) clearTimeout(timer);
	timer = window.setTimeout(() => {
		const res = api.check({login: login, email: email},);
		res.then(async (res) => {
			const data = await res.json();
			const {isEmailBusy, isLoginBusy} = data;
			if (isEmailBusy && isLoginBusy) {
				setErrorMessage(dict.EmailAndLoginIsBusy);
			} else if (isEmailBusy) {
				setErrorMessage(dict.EmailIsBusy);
			} else if (isLoginBusy) {
				setErrorMessage(dict.LoginIsBusy);
			} else {
				setErrorMessage("");
			}
		})
		res.catch((reason) => {
			throw new Error(reason);
		});
	}, 2000)
}


export const SignUpForm: FC<SignUpFormProps> = memo<SignUpFormProps>(({setIsLoginWindowOpen, login, onChangeLogin, onChangePassword, inputDict,
														   password, onChangeEmail, email,
														   onChangeSurname, onChangeName, name, surname, dict
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
		api.signUp(params)
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
			<h2>{dict.CreateNewAccount}</h2>
			<Input dict={inputDict} onChangeValue={(currentLogin) => {crLogin.current = currentLogin;onChangeLoginWithCheck(currentLogin, crEmail.current, onChangeLogin, setErrorMessage, dict)}} onEnter={SignUpCallBack} placeholder={dict.EnterYourLogin} startValue={login} maxLength={32} minLength={2} style={{marginBottom: '5px', width: '400px'}}/>
			<Input dict={inputDict} onChangeValue={onChangeName} onEnter={SignUpCallBack} placeholder={dict.EnterYourName} startValue={name} maxLength={32} minLength={2} style={{marginBottom: '5px', width: '400px'}}/>
			<Input dict={inputDict} onChangeValue={onChangeSurname} onEnter={SignUpCallBack} placeholder={dict.EnterYourSurname} startValue={surname} maxLength={32} minLength={2} style={{marginBottom: '5px', width: '400px'}}/>
			<Input dict={inputDict} onChangeValue={(currentEmail) => {crEmail.current = currentEmail;onChangeEmailWithCheck(crLogin.current, currentEmail, onChangeEmail, setErrorMessage, dict)}} onEnter={SignUpCallBack} placeholder={dict.EnterYourEmail} startValue={email} minLength={10} maxLength={32} style={{marginBottom: '5px', width: '400px'}}/>
			<Input dict={inputDict} onChangeValue={onChangePassword} onEnter={SignUpCallBack} placeholder={dict.EnterAPassword} startValue={password} minLength={8} maxLength={64} style={{marginBottom: '5px', width: '400px'}} type={"password"}/>
			<div style={{width: '100%', display: 'flex', color: 'var(--blue)', justifyContent: 'end', alignItems: 'end'}}>
				<button className={styles.signUpButton} onClick={SignUpCallBack}>
					{dict.SignUp}
				</button>
			</div>
			<h3>
				{dict.GotAnExistingAccount}
				<a style={{cursor: 'pointer'}} onClick={() => {setIsLoginWindowOpen(true);}}>
					{" "}{dict.SignIn}
				</a>
			</h3>
		</div>
	);
});