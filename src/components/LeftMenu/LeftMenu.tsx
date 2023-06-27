"use client";
import React, {FC, useMemo} from 'react';
import styles from './LeftMenu.module.scss';
import {BsFillPersonFill} from "react-icons/bs";
import {observer} from "mobx-react-lite";
import {TopProfileStore} from "@/stores/TopProfileStore";
import {getTextForLanguage, getTextForLanguageWithoutStore} from "@/utils/getTextForLanguage";
import Link from "next/link";

export const LeftMenu: FC = observer(() => {

	return (
		<>
			{TopProfileStore.isGet && !TopProfileStore.isAuthorized
				? <div className={styles.unAuthMenu} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexFlow: 'column', width: '145px'}}>
					<BsFillPersonFill style={{fontSize: '100px'}}/>
					<Link className={styles.button} href={"/registration"}>{getTextForLanguage("Sign in", "Войти")}</Link>
				</div>
				: <div className={styles.leftMenu}>
					<div className={styles.button}>{getTextForLanguage("My profile", "Мой профиль")}</div>
					<div className={styles.button}>{getTextForLanguage("Friends", "Друзья")}</div>
					<div className={styles.button} style={{borderBottom: "none"}}>{getTextForLanguage("Messages", "Сообщения")}</div>
				</div>
			}
		</>
	);
});