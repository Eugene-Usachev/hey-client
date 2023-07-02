import React from 'react';
import styles from './RegistrationBackground.module.scss';
import {RegistrationBlock} from "../RegistrationBlock/RegistrationBlock";
import {getDictionary} from "@/app/dictionaries";

// TODO After all, comeback here and update. U need to add screenshots of social network. Like U have a button login in header and body is an add of social network.

export async function RegistrationBackground() {

	const dict = await getDictionary();

	return (
		<div className={styles.registrationBackground}>
			<RegistrationBlock inputDict={dict.UI.Input} signUpFormDict={dict.registration.SignUpForm} signInFormDict={dict.registration.LoginForm} HeaderDict={dict.registration.Header}/>
		</div>
	);
}