"use client";
import React, {memo, FC, useState, useEffect} from 'react';
import styles from './Header.module.scss';
import {getTextForLanguage} from "@/utils/getTextForLanguage";

interface HeaderProps {
	setLoginWindowIsOpen: () => void;
}

export const Header: FC = memo<HeaderProps>(({setLoginWindowIsOpen}) => {

	const [textSignUp, setTextSignUp] = useState(getTextForLanguage("Sign Up",  "Зарегистрироваться"));
	const [textSignIn, setTextSignIn] = useState(getTextForLanguage("Sign in", "Войти"));

	useEffect(() => {
		setTextSignIn(getTextForLanguage("Sign in", "Войти"));
		setTextSignUp(getTextForLanguage("Sign Up", "Зарегистрироваться"));
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