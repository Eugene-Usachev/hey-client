import React, {memo, FC, useState, useEffect, useCallback} from 'react';
import styles from './Header.module.scss';
import {useTheme} from "../../hooks/useTheme";

export const Header: FC = memo(() => {

	const {theme, toggleTheme} = useTheme();

	return (
		<div className={styles.header}>
			Header
		</div>
	);
});