import React, {memo, FC} from 'react';
import styles from './Error404.module.scss';
import Link from "next/link";

export const Error404: FC = memo(() => {

	return (
		<div className={styles.error404}>
			<h1>Oops!</h1>
			<div style={{display: 'flex', height: '40px', alignItems: 'center'}}>
				<h2 style={{marginRight: "30px"}} className={styles.firstText + " " + styles.h2}>Error 404</h2>
				<h2 className={styles.h2}>Not Found</h2>
			</div>
			<h2>Go back to <Link href={"/"}>Home</Link></h2>
		</div>
	);
});