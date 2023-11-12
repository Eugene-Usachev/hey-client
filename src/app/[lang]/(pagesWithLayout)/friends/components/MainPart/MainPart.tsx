"use client";
import React, {useEffect, useState} from 'react';
import styles from './MainPart.module.scss';
import {Header} from "@/app/[lang]/(pagesWithLayout)/friends/components/Header/Header";
import {UsersList} from "@/app/[lang]/(pagesWithLayout)/friends/components/UsersList/UsersList";
import {FriendsStore} from "@/stores/FriendsStore";
import Loading from "@/app/[lang]/(pagesWithLayout)/friends/[id]/loading";
import {observer} from "mobx-react-lite";

export const MainPart = observer(({dict}: {dict: any}) => {
	const [wasGet, setWasGet] = useState(false);

	useEffect(() => {
		setWasGet(FriendsStore.wasGet);
	}, [FriendsStore.wasGet]);

	if (!wasGet) {
		return (
			<Loading />
		);
	}

	return (
		<div className={styles.mainPart}>
			<Header dict={dict.friends.header}/>
			<UsersList dicts={{
				userLine: dict.friends.userLine,
			}}/>
		</div>
	);
});