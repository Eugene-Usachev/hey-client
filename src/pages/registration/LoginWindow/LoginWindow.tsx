import React, {memo, FC, useCallback, useState} from 'react';
import styles from './LoginWindow.module.scss';
import {ModalWindow} from "../../../components/ModalWindow/ModalWindow";
import {LoginBlock} from "../LoginBlock/LoginBlock";
import {SignUpBlock} from "../SignUpBlock/SignUpBlock";

interface LoginWindowProps {
	setOpenIsFalse: () => void;
}

let login = '', password = '', email = '', name = '', surname = '';

export function Auth(userId: number) {

}

export const LoginWindow: FC = memo<LoginWindowProps>(({setOpenIsFalse}) => {

	const onChangeLogin = useCallback((value: string) => {
		login = value;
	}, []);
	const onChangePassword = useCallback((value: string) => {
		password = value;
	}, []);
	const onChangeEmail = useCallback((value: string) => {
		email = value;
	}, []);
	const onChangeName = useCallback((value: string) => {
		name = value;
	}, []);
	const onChangeSurname = useCallback((value: string) => {
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
					? <LoginBlock login={login} password={password} email={email} onChangeLogin={onChangeLogin} onChangeEmail={onChangeEmail} onChangePassword={onChangePassword} setIsLoginWindowOpen={onSetIsLoginWindowOpen}/>
					: <SignUpBlock login={login} password={password} email={email} name={name} surname={surname} onChangeName={onChangeName} onChangeSurname={onChangeSurname}
								   onChangeLogin={onChangeLogin} onChangeEmail={onChangeEmail} onChangePassword={onChangePassword} setIsLoginWindowOpen={onSetIsLoginWindowOpen}/>
				}
			</div>
		</ModalWindow>
	);
});