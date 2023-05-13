import React, {memo, FC} from 'react';
import styles from './SignUpBlock.module.scss';
import {getTextForLanguage} from "../../../utils/getTextForLanguage";
import {Input} from "../../../components/Input/Input";

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

	return (
		<div className={styles.signUpBlock}>
			<h2>{getTextForLanguage("Create a new account", "Создать новый аккаунт")}</h2>
			<Input onChange={onChangeLogin} placeholder={getTextForLanguage('Enter your login', 'Придумайте логин')} startValue={login} maxLength={32} minLength={2} style={{marginBottom: '5px'}}/>
			<Input onChange={onChangeName} placeholder={getTextForLanguage('Enter your name', 'Введите имя')} startValue={name} maxLength={32} minLength={2} style={{marginBottom: '5px'}}/>
			<Input onChange={onChangeSurname} placeholder={getTextForLanguage('Enter your surname', 'Введите фамилию')} startValue={surname} maxLength={32} minLength={2} style={{marginBottom: '5px'}}/>
			<Input onChange={onChangeEmail} placeholder={getTextForLanguage('Enter your email', 'Введите электронную почту')} startValue={email} maxLength={32} style={{marginBottom: '5px'}}/>
			<Input onChange={onChangePassword} placeholder={getTextForLanguage('Enter a password', 'Придумайте пароль')} startValue={password} maxLength={32} style={{marginBottom: '5px'}} type={"password"}/>
			<div style={{width: '100%', display: 'flex', color: 'var(--blue)', justifyContent: 'end', alignItems: 'end'}}>
				<button className={styles.signUpButton}>
					{getTextForLanguage("Sign up", "Зарегистрироваться")}
				</button>
			</div>
			<h3>
				{getTextForLanguage('Got an existing account? ', 'Есть существующий аккаунт? ')}
				<a style={{color: 'var(--blue)', cursor: 'pointer'}} onClick={() => {setIsLoginWindowOpen(true);}}>
					{getTextForLanguage('Sign in', 'Войти')}
				</a>
			</h3>
		</div>
	);
});