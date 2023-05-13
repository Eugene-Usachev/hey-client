import React, {memo, FC} from 'react';
import { Outlet } from "react-router-dom";
import styles from './LayOut.module.scss';
import {Header} from "../Header/Header";

export const LayOut: FC = memo(() => {

	return (
		<div className={styles.layOut}>
			<Header />
			<Outlet />
		</div>
	);
});