import React, {memo, FC, useState, useCallback, useEffect} from 'react';
import styles from './Header.module.scss';
import {Lang} from "../../../config";
import {useTheme} from "../../../hooks/useTheme";
import {getTextForLanguage} from "../../../utils/getTextForLanguage";

interface HeaderProps {
	setLoginWindowIsOpen: () => void;
}

export const Header: FC = memo<HeaderProps>(({setLoginWindowIsOpen}) => {

	return (
		<div className={styles.header}>
			<h1>Hey</h1>
			<div style={{display: 'flex', height: '40px', alignItems: 'center', color: "var(--active-color)"}} onClick={setLoginWindowIsOpen}>
				<h2 className={styles.h2}>{getTextForLanguage("Sign Up",  "Зарегистрироваться")}</h2>
				<h1 style={{margin: "0 10px"}}>|</h1>
				<h2 className={styles.h2}>{getTextForLanguage("Sign in", "Войти")}</h2>
			</div>
		</div>
	);
});