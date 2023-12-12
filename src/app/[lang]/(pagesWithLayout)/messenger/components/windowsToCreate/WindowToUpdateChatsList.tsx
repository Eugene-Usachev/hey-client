"use client";
import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './windowsToCreate.module.scss';
import {ModalWindow} from "@/components/ModalWindow/ModalWindow";
import {LazyAvatar} from "@/components/LazyAvatar/LazyAvatar";
import {Input, InputDict} from "@/components/Input/Input";
import {ChatsList, ChatsStore} from "@/stores/ChatsStore";
import {MiniUser, MiniUsersStore} from "@/stores/MiniUsersStore";
import {Checkbox} from "@mui/material";
import {
	getChatsSlice
} from "@/app/[lang]/(pagesWithLayout)/messenger/components/windowsToCreate/windowToCreateChatsList";
import {USERID} from "@/app/config";
import {None, Option} from "@/libs/rustTypes/option";
import {UserAvatar} from "@/components/UserAvatar/UserAvatar";

export interface WindowToUpdateChatsListDict {
	EnterName: string;
	Accept: string;
	Delete: string;
	Cancel: string;
	ThisNameAlreadyExists: string;
	TypeNameOfChat: string;
}

interface WindowToUpdateChatsListProps {
	dict: {
		inputDict: InputDict;
		windowToUpdateChatsList: WindowToUpdateChatsListDict;
	};
	chatsListsName: string;
	close: () => void;
}

export const WindowToUpdateChatsList:FC<WindowToUpdateChatsListProps> = observer<WindowToUpdateChatsListProps>(({dict, chatsListsName, close}) => {
	const [name, setName] = useState(chatsListsName);
	const isAll = useRef(false);
	const [filterValue, setFilterValue] = useState("");
	const [chatsVisible, setChatsVisible] = useState((ChatsStore.chatsLists.getByKeyUnchecked<ChatsList>(chatsListsName, 'name').chats.length / 20) * 20 + 20);
	const [chats, setChats] = useState(getChatsSlice(getChatsSlice([...(ChatsStore.chatsLists.getByKeyUnchecked<ChatsList>(chatsListsName, 'name').chats)], 20), 20));
	const [chosenChats, setChosenChats] = useState<number[]>(ChatsStore.chatsLists.getByKeyUnchecked<ChatsList>(chatsListsName, 'name').chatsIds);
	const [loading, setLoading] = useState(true);
	const lastElem = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
	const observer = useRef<IntersectionObserver>();

	useEffect(() => {
		if (!ChatsStore.wasAllGet) {
			ChatsStore.getAllChats().then(() => {
				setLoading(false);
				setChats(getChatsSlice([...(ChatsStore.chatsLists.getByKeyUnchecked<ChatsList>(chatsListsName, 'name').chats)], 20));
			});
		}
	}, []);

	useEffect(() => {
		setChats([...(ChatsStore.chatsLists.getByKeyUnchecked<ChatsList>(chatsListsName, 'name').chats)]);
	}, [ChatsStore.gotChats.length, ChatsStore.chatsLists]);

	const deleteChatsLists = useCallback(() => {
		ChatsStore.deleteChatsList(name);
		close();
	}, [name, close]);

	const update = useCallback(() => {
		if (name.length > 0) {
			if (name !== chatsListsName && ChatsStore.chatsLists.searchObj(name, 'name').isSome()) {
				return;
			}
			ChatsStore.updateChatsList(chatsListsName, name, chosenChats)
			close();
		}
	}, [name, close, chosenChats, chatsListsName]);

	useEffect(() => {
		observer.current = new IntersectionObserver(([target]) => {
			if (target.isIntersecting) {
				if (chatsVisible === ChatsStore.chatsCount || isAll.current) {
					return;
				}
				setChatsVisible(chatsVisible + 20);
				setChats(getChatsSlice(chats, chatsVisible + 20));
				if (chats.length % 20 !== 0 || chatsVisible > ChatsStore.chatsCount) {
					isAll.current = true;
				}
			}
		});
		(observer.current as IntersectionObserver).observe(lastElem.current);

		return () => {
			observer.current?.disconnect();
		}
	}, [lastElem.current, chatsVisible, chats.length, MiniUsersStore.users.length, ChatsStore.chatsCount]);

	return (
		<>
			<ModalWindow close={close} />
			<div className={styles.window}>
				<div style={{display: 'flex', flexFlow: 'column'}}>
					<Input
						blockStyle={{marginBottom: '10px'}}
						placeholder={dict.windowToUpdateChatsList.EnterName}
						style={{width: '530px'}}
						dict={dict.inputDict}
						checkSpace={false}
						maxLength={64}
						minLength={1}
						startValue={chatsListsName}
						type={"default"}
						onChangeValue={(value) => {
							setName(value);
						}}
					/>
					<div className={styles.filterList}>
						<Input
							style={{width: '510px'}}
							inputClass={styles.filterInput}
							blockClass={styles.filterInputBlock}
							placeholder={dict.windowToUpdateChatsList.TypeNameOfChat}
							dict={dict.inputDict}
							checkSpace={false}
							maxLength={1000000}
							minLength={0}
							type={"default"}
							onChangeValue={(value) => {
								setFilterValue(value);
							}}/>
						<div className={styles.list}>
							{chats.map((chat, index) => {
								if (!chat.name.toLowerCase().includes(filterValue.toLowerCase())) {
									return <div key={"empty"+index}></div>;
								}

								const user = useMemo(():Option<MiniUser> => {
									if (chat.isSingleUserConversation) {
										let otherUserId = chat.members[0] === +USERID ? chat.members[1] : chat.members[0];
										return MiniUsersStore.users.getByKey<MiniUser>(otherUserId, "id");
									}
									return None();
								}, [chat.isSingleUserConversation, chat.members]);

								const name = !chat.isSingleUserConversation ? chat.name : `${user.unwrap().name} ${user.unwrap().surname}`;

								return (
									<div key={chat.id} className={styles.element}>
										<div style={{display: 'flex', alignItems: 'center'}}>
											{chat.isSingleUserConversation
												? <UserAvatar style={{marginRight: '5px'}} user={user.unwrap()} size={24} borderRadius={"50%"} />
												: <LazyAvatar style={{marginRight: '5px'}} src={chat.avatar} size={24} borderRadius={"50%"} />
											}
											{name}
										</div>
										<Checkbox checked={chosenChats.indexOf(chat.id) > -1} onChange={() => {
											const index = chosenChats.indexOf(chat.id);
											if (index > -1) {
												setChosenChats([...chosenChats.slice(0, index), ...chosenChats.slice(index + 1)]);
											} else {
												setChosenChats([...chosenChats, chat.id]);
											}
										}}/>
									</div>
								);
							})}
							<div style={{width: '1px', height: '1px'}} ref={lastElem}></div>
						</div>
					</div>
					<div className={styles.buttonsPanel} style={{width: '100%'}}>
						<div className={styles.button} onClick={deleteChatsLists} style={{backgroundColor: 'var(--red)'}}>{dict.windowToUpdateChatsList.Delete}</div>
						<div style={{display: 'flex'}}>
							<div className={styles.button} onClick={close} style={{backgroundColor: 'var(--red)'}}>{dict.windowToUpdateChatsList.Cancel}</div>
							<div className={styles.button} onClick={update} style={{backgroundColor: 'var(--green)'}}>{dict.windowToUpdateChatsList.Accept}</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
});