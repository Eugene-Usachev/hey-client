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

export const SignUpForm: FC<SignUpFormProps> = memo<SignUpFormProps>(({setIsLoginWindowOpen, login, onChangeLogin, onChangePassword, inputDict,
														   password, onChangeEmail, email,
														   onChangeSurname, onChangeName, name, surname, dict
													   }) => {
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoginError, setIsLoginError] = useState(false);
	const [isEmailError, setIsEmailError] = useState(false);

	const printError = useCallback(() => {
		if (errorMessage.length > 0) {
			ErrorAlert(errorMessage);
		}
	}, [errorMessage]);

	const SignUpCallBack = useCallback(() => {
		if (errorMessage.length > 0 && (isEmailError || isLoginError)) {
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
			.then(async (res) => {
				const status = res.status;
				if (status == 400) {
					const message = (await res.json())["error"];
					if (message == "email is busy") {
						setErrorMessage(dict.EmailIsBusy);
						setIsEmailError(true);
					} else if (message == "login is busy") {
						setErrorMessage(dict.LoginIsBusy);
						setIsLoginError(true);
					}
					printError();
				} else {
					if (status == 201) {
						Auth(router, res, name, surname, "" , email, login);
					} else {
						let message = await res.json();
						ErrorAlert(message["error"]);
					}
				}
			})
			.catch((reason) => {throw new Error(reason)})
		return false;
	}, [login, name, surname, email, password, isLoginError, isEmailError, errorMessage]);

	return (
		<div className={styles.signUpBlock}>
			<h2>{dict.CreateNewAccount}</h2>
			<Input type={"default"} dict={inputDict} onChangeValue={(currentLogin) => {setIsLoginError(false); onChangeLogin(currentLogin)}} blockStyle={{width: '418px'}} onEnter={SignUpCallBack} placeholder={dict.EnterYourLogin} startValue={login} maxLength={32} minLength={1} style={{marginBottom: '5px', width: '400px'}} checkSpace={true}/>
			<Input type={"default"} dict={inputDict} onChangeValue={onChangeName} onEnter={SignUpCallBack} placeholder={dict.EnterYourName} startValue={name} maxLength={32} minLength={1} blockStyle={{width: '418px'}} style={{marginBottom: '5px', width: '400px'}} checkSpace={true}/>
			<Input type={"default"} dict={inputDict} onChangeValue={onChangeSurname} onEnter={SignUpCallBack} placeholder={dict.EnterYourSurname} startValue={surname} maxLength={32} minLength={1} blockStyle={{width: '418px'}} style={{marginBottom: '5px', width: '400px'}} checkSpace={true}/>
			<Input type={"default"} dict={inputDict} onChangeValue={(currentEmail) => {setIsEmailError(false); onChangeEmail(currentEmail)}} blockStyle={{width: '418px'}} onEnter={SignUpCallBack} placeholder={dict.EnterYourEmail} startValue={email} minLength={1} maxLength={32} style={{marginBottom: '5px', width: '400px'}} checkSpace={true}/>
			<Input dict={inputDict} onChangeValue={onChangePassword} onEnter={SignUpCallBack} placeholder={dict.EnterAPassword} startValue={password} minLength={8} maxLength={64} blockStyle={{marginBottom: '5px', width: '418px'}} style={{width: '400px'}} type={"password"} checkSpace={true}/>
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