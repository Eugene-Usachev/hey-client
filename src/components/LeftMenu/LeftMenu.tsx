"use client";
import React, {FC, useCallback} from 'react';
import styles from './LeftMenu.module.scss';
import {BsFillPersonFill} from "react-icons/bs";
import {observer} from "mobx-react-lite";
import {TopProfileStore} from "@/stores/TopProfileStore";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {USERID} from "@/app/config";

interface LeftMenuProps {
	dict: {
		SignIn: string;
		MyProfile: string;
		Friends: string;
		Messages: string;
	}
}

export const LeftMenu: FC<LeftMenuProps> = observer(({dict}) => {
	const router = useRouter();

	const toProfile = useCallback(() => {
		const lang = TopProfileStore.lang;
		router.push(`/${lang}/profile/${USERID}`);
	}, [USERID, router, TopProfileStore.lang]);

	return (
		<>
			{TopProfileStore.isGet && !TopProfileStore.isAuthorized
				? <div className={styles.unAuthMenu} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexFlow: 'column', width: '145px'}}>
					<BsFillPersonFill style={{fontSize: '100px'}}/>
					<Link className={styles.button} href={"/registration"}>{dict.SignIn}</Link>
				</div>
				: <div className={styles.leftMenu}>
					<div className={styles.button} onClick={toProfile}>{dict.MyProfile}</div>
					<div className={styles.button}>{dict.Friends}</div>
					<div className={styles.button} style={{borderBottom: "none"}}>{dict.Messages}</div>
				</div>
			}
		</>
	);
});