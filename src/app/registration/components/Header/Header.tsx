"use client";
import React, {memo, FC, useState, useEffect} from 'react';
import styles from './Header.module.scss';
import {getTextForLanguageWithoutStore} from "@/utils/getTextForLanguage";

interface HeaderProps {
	setLoginWindowIsOpen: () => void;
}

export const Header: FC = memo<HeaderProps>(({setLoginWindowIsOpen}) => {

	const [textSignUp, setTextSignUp] = useState(getTextForLanguageWithoutStore("Sign Up",  "Зарегистрироваться"));
	const [textSignIn, setTextSignIn] = useState(getTextForLanguageWithoutStore("Sign in", "Войти"));

	useEffect(() => {
		setTextSignIn(getTextForLanguageWithoutStore("Sign in", "Войти"));
		setTextSignUp(getTextForLanguageWithoutStore("Sign Up", "Зарегистрироваться"));
	}, []);

	return (
		<div className={styles.header}>
			<h1>Hey</h1>
			<div style={{display: 'flex', height: '40px', alignItems: 'center', color: "var(--active-color)"}} onClick={setLoginWindowIsOpen}>
				<h2 className={styles.h2}>{textSignUp}</h2>
				<h1 style={{margin: "0 10px"}}>|</h1>
				<h2 className={styles.h2}>{textSignIn}</h2>
			</div>
		</div>
	);
});