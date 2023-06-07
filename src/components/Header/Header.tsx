import React, {memo, FC} from 'react';
import styles from './Header.module.scss';
import {TopProfile} from "@/components/TopProfile/TopProfile";

export const Header: FC = memo(() => {

	return (
		<div className={styles.headerBox}>
			<div className={styles.header}>
				<div style={{fontSize: '28px', height: '30px', textAlign: 'start', marginBottom: '4px', marginLeft: '10px'}}>Hey</div>
				<div style={{width: '200px'}}></div>
				<TopProfile />
			</div>
		</div>
	);
});