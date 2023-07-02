import React from 'react';
import styles from './Header.module.scss';
import {TopProfile} from "@/components/TopProfile/TopProfile";
import {getDictionary} from "@/app/dictionaries";

export async function Header() {
	const dict = await getDictionary();

	return (
		<div className={styles.headerBox}>
			<div className={styles.header}>
				<div style={{fontSize: '28px', height: '30px', textAlign: 'start', marginBottom: '4px', marginLeft: '10px'}}>Hey</div>
				<div style={{width: '200px'}}></div>
				<TopProfile topProfileDict={dict.layout.TopProfile} topProfileMenuDict={dict.layout.TopProfileMenu}/>
			</div>
		</div>
	);
}