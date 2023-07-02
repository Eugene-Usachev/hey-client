"use client";
import React, {memo, FC, useState, useEffect} from 'react';
import styles from './Header.module.scss';

interface HeaderProps {
	setLoginWindowIsOpen: () => void;
	Dict: {
		SignUp: string;
		SignIn: string;
	}
}

export const Header: FC<HeaderProps> = memo<HeaderProps>(({setLoginWindowIsOpen, Dict}) => {

	const [textSignUp, setTextSignUp] = useState(Dict.SignUp);
	const [textSignIn, setTextSignIn] = useState(Dict.SignIn);

	useEffect(() => {
		setTextSignIn(Dict.SignIn);
		setTextSignUp(Dict.SignUp);
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