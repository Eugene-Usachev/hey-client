import React, {memo, FC, useState, useCallback} from 'react';
import styles from './LoginBlock.module.scss';
import {getTextForLanguage} from "../../../utils/getTextForLanguage";
import {Input} from "../../../components/Input/Input";

interface LoginBlockProps {
	setIsLoginWindowOpen: (value: false) => void;
	login: string;
	email: string;
	password: string;
	onChangeLogin: (value: string) => void;
	onChangePassword: (value: string) => void;
	onChangeEmail: (value: string) => void;
}

// TODO on enter!!!!!
export const LoginBlock: FC = memo<LoginBlockProps>(({
	setIsLoginWindowOpen, email,
	login, onChangeLogin, onChangePassword, password, onChangeEmail
}) => {

	const [loginInputIsActive, setLoginInputIsActive] = useState(true);
	const activeLoginInput = useCallback(() => {
		setLoginInputIsActive(true);
	}, []);
	const activeEmailInput = useCallback(() => {
		setLoginInputIsActive(false);
	}, []);

	return (
		<div className={styles.loginBlock}>
			<h2>{getTextForLanguage("Sign in to an existing account", "Войти в существующий аккаунт")}</h2>
			<Input onClick={activeLoginInput} isActive={loginInputIsActive} onChange={onChangeLogin} type={'linked'} placeholder={getTextForLanguage('Enter your login', 'Введите логин')} startValue={login} maxLength={32} minLength={2} style={{marginBottom: '5px'}}/>
			<Input onClick={activeEmailInput} isActive={!loginInputIsActive} onChange={onChangeEmail} type={'linked'} placeholder={getTextForLanguage('Enter your email', 'Введите электронную почту')} startValue={email} maxLength={32} style={{marginBottom: '5px'}}/>
			<Input onChange={onChangePassword} placeholder={getTextForLanguage('Enter a password', 'Введите пароль')} startValue={password} maxLength={32} style={{marginBottom: '5px'}} type={"password"}/>
			<div style={{width: '100%', display: 'flex', color: 'var(--blue)', justifyContent: 'space-between', alignItems: 'end'}}>
				{getTextForLanguage("Forgot password? Click here", "Забыли пароль? Нажмите сюда")}
				<button className={styles.loginButton}>
					{getTextForLanguage("Sign in", "Войти")}
				</button>
			</div>
			<h3>
				{getTextForLanguage('Don\'t have an account? ', 'Нет аккаунта? ')}
				<a style={{color: 'var(--blue)', cursor: 'pointer'}} onClick={() => {setIsLoginWindowOpen(false);}}>
					{getTextForLanguage('Sign up', 'Зарегистрироваться')}
				</a>
			</h3>
		</div>
	);
});