"use client";
import React, {FC, useCallback, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './windowsToCreate.module.scss';
import {ModalWindow} from "@/components/ModalWindow/ModalWindow";
import {LazyAvatar} from "@/components/LazyAvatar/LazyAvatar";
import {Input, InputDict} from "@/components/Input/Input";
import {ChatsStore} from "@/stores/ChatsStore";

export interface WindowToCreateChatDict {
	EnterName: string;
	Create: string;
	Cancel: string;
	ThisNameAlreadyExists: string;
}

interface WindowToCreateChatProps {
	dict: {
		inputDict: InputDict;
		windowToCreateChatsList: WindowToCreateChatDict;
	};
	close: () => void;
}

export const WindowToCreateChat:FC<WindowToCreateChatProps> = observer<WindowToCreateChatProps>(({dict, close}) => {
	const [name, setName] = useState("");

	const create = useCallback(() => {
		if (name.length > 0) {
			if (ChatsStore.chatLists.searchObj(name, 'name').isSome()) {
				return;
			}
			ChatsStore.newChatsList(name, []).then(() => {
				close();
			});
		}
	}, [name, close]);

	return (
		<>
			<ModalWindow close={close} />
			<div className={styles.window}>
				{/* TODO r*/}
				<LazyAvatar src={""} size={128} borderRadius={"50%"} />
				<div style={{display: 'flex', flexFlow: 'column'}}>
					<Input
						blockStyle={{marginBottom: '10px'}}
						placeholder={dict.windowToCreateChatsList.EnterName}
						style={{width: '380px'}} dict={dict.inputDict}
						checkSpace={false}
						maxLength={64}
						minLength={1}
						error={ChatsStore.chatLists.searchObj(name, 'name').isSome() ? dict.windowToCreateChatsList.ThisNameAlreadyExists : ''}
						type={"default"}
						onChangeValue={(value) => {
							setName(value);
						}}
					/>
					<div className={styles.buttonsPanel}>
						<div className={styles.button} onClick={close} style={{backgroundColor: 'var(--red)'}}>{dict.windowToCreateChatsList.Cancel}</div>
						<div className={styles.button} onClick={create} style={{backgroundColor: 'var(--green)'}}>{dict.windowToCreateChatsList.Create}</div>
					</div>
				</div>
			</div>
		</>
	);
});