"use client";
import React, {FC, useMemo} from 'react';
import styles from './LeftMenu.module.scss';
import {BsFillPersonFill} from "react-icons/bs";
import {observer} from "mobx-react-lite";
import {TopProfileStore} from "@/stores/TopProfileStore";
import {getTextForLanguage} from "@/utils/getTextForLanguage";
import Link from "next/link";

export const LeftMenu: FC = observer(() => {

	const profileText = useMemo(() => {
		if (TopProfileStore.lang === "ru") {
			return "Мой профиль";
		} else {
			return "My profile";
		}
	}, [TopProfileStore.lang]);

	const friendsText = useMemo(() => {
		if (TopProfileStore.lang === "ru") {
			return "Друзья";
		} else {
			return "Friends";
		}
	}, [TopProfileStore.lang]);

	const messagesText = useMemo(() => {
		if (TopProfileStore.lang === "ru") {
			return "Сообщения";
		} else {
			return "Messages";
		}
	}, [TopProfileStore.lang]);

	return (
		<>
			{TopProfileStore.isGet && !TopProfileStore.isAuthorized
				? <div className={styles.unAuthMenu} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexFlow: 'column', width: '145px'}}>
					<BsFillPersonFill style={{fontSize: '100px'}}/>
					<Link className={styles.button} href={"/registration"}>{getTextForLanguage("Sign up", "Зарегистрироваться")}</Link>
				</div>
				: <div className={styles.leftMenu}>
					<div className={styles.button}>{profileText}</div>
					<div className={styles.button}>{friendsText}</div>
					<div className={styles.button} style={{borderBottom: "none"}}>{messagesText}</div>
				</div>
			}
		</>
	);
});