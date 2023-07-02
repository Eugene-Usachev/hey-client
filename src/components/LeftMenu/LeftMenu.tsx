"use client";
import React, {FC, useMemo} from 'react';
import styles from './LeftMenu.module.scss';
import {BsFillPersonFill} from "react-icons/bs";
import {observer} from "mobx-react-lite";
import {TopProfileStore} from "@/stores/TopProfileStore";
import Link from "next/link";

interface LeftMenuProps {
	dict: {
		SignIn: string;
		MyProfile: string;
		Friends: string;
		Messages: string;
	}
}

export const LeftMenu: FC<LeftMenuProps> = observer(({dict}) => {

	return (
		<>
			{TopProfileStore.isGet && !TopProfileStore.isAuthorized
				? <div className={styles.unAuthMenu} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexFlow: 'column', width: '145px'}}>
					<BsFillPersonFill style={{fontSize: '100px'}}/>
					<Link className={styles.button} href={"/registration"}>{dict.SignIn}</Link>
				</div>
				: <div className={styles.leftMenu}>
					<div className={styles.button}>{dict.MyProfile}</div>
					<div className={styles.button}>{dict.Friends}</div>
					<div className={styles.button} style={{borderBottom: "none"}}>{dict.Messages}</div>
				</div>
			}
		</>
	);
});