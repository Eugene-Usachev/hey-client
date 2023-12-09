"use client";
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './windowsToCreate.module.scss';
import {ModalWindow} from "@/components/ModalWindow/ModalWindow";
import {LazyAvatar} from "@/components/LazyAvatar/LazyAvatar";
import {Input, InputDict} from "@/components/Input/Input";
import {Chat, ChatsStore} from "@/stores/ChatsStore";
import {MiniUser, MiniUsersStore} from "@/stores/MiniUsersStore";
import {ErrorAlert} from "@/components/Alerts/Alerts";
import {api} from "@/app/[lang]/(pagesWithLayout)/messenger/MessengerAPI";
import {Checkbox} from "@mui/material";
import {USERID} from "@/app/config";

export interface WindowToUpdateChatDict {
	AddTheUser: string;
	EnterUserID: string;
	YourID: string;
	EnterName: string;
	TypeNameOfUser: string;
	ChooseAtLeastOneUser: string;
	OnlyNotGroupChatCanHasNoName: string;
	OnlyGroupChatCanHasName: string;
	Accept: string;
	Cancel: string;
	ThisNameAlreadyExists: string;
	Delete: string;
}

interface WindowToUpdateChatProps {
	dict: {
		inputDict: InputDict;
		windowToUpdateChatsList: WindowToUpdateChatDict;
	};
	chat: Chat;
	close: () => void;
}

const getUsers = (usersId: number[]): MiniUser[] => {
	return MiniUsersStore.users.filter((user) => usersId.includes(user.id));
}
const getUserSlice = (oldList: MiniUser[], delta: number): MiniUser[] => {
	const newList = [...oldList];
	let i = 0;
	for (const user of MiniUsersStore.users) {
		if (newList.findIndex((userInList) => userInList.id === user.id) === -1) {
			newList.push(user);
			i++;
		}
		if (i === delta) {
			break;
		}
	}
	return newList;
}

export const WindowToUpdateChat:FC<WindowToUpdateChatProps> = observer<WindowToUpdateChatProps>(({dict, chat, close}) => {
	const [name, setName] = useState(chat.name);
	const [filterValue, setFilterValue] = useState("");
	const [loading, setLoading] = useState(true);
	const [usersVisible, setUsersVisible] = useState(chat.members.length + 20);
	const [users, setUsers] = useState(getUserSlice(getUsers(chat.members), 20));
	const [chosenUsers, setChosenUsers] = useState<number[]>(chat.members);
	const [typedId, setTypedId] = useState<number>(-1);
	const lastElem = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
	const observer = useRef<IntersectionObserver>();

	useEffect(() => {
		if (!ChatsStore.wasAllGet) {
			ChatsStore.getAllChats().then(() => {
				setLoading(false);
			});
		}
	}, []);

	useEffect(() => {
		setUsers(getUserSlice(getUsers(chat.members), 20));
	}, [MiniUsersStore.users.length]);

	useEffect(() => {
		const users: MiniUser[] = [];
		for (const userId of chosenUsers) {
			const user_ = MiniUsersStore.users.getByKey<MiniUser>(userId, 'id');
			if (user_.isNone()) {
				api.getMiniUsers([userId]).then(res => {
					if (res.length > 0) {
						MiniUsersStore.addUsers([res[0]]);
						users.push(res[0]);
					}
				});
			} else {
				users.push(user_.unwrap());
			}
		}
		for (const user of MiniUsersStore.users) {
			if (!(users.find((user_) => user_.id === user.id))) {
				users.push(user);
			}
			if (users.length === usersVisible) break;
		}
		setUsers([...users]);
	}, [chosenUsers.length]);

	const addUserById = useCallback(() => {
		if (typedId === +USERID || typedId < 1) return;
		if (chosenUsers.includes(typedId)) return;
		setChosenUsers([typedId, ...chosenUsers]);
		if (MiniUsersStore.users.searchObj(typedId, 'id').isSome()) {
			return;
		}
		api.getMiniUsers([typedId]).then(res => {
			if (res.length > 0) {
				MiniUsersStore.addUsers([res[0]]);
				setUsers([...MiniUsersStore.users.slice(0, usersVisible)]);
			}
		});
	}, [typedId, chosenUsers, usersVisible]);

	const deleteChat = useCallback(() => {
		ChatsStore.deleteChat(chat.id);
		close();
	}, [chat.id]);

	const accept = useCallback(() => {
		if (chosenUsers.length === 0) {
			ErrorAlert(dict.windowToUpdateChatsList.ChooseAtLeastOneUser);
			return;
		}
		if (name.length === 0 && chosenUsers.length > 1) {
			ErrorAlert(dict.windowToUpdateChatsList.OnlyNotGroupChatCanHasNoName);
			return;
		}
		if (name.length > 0) {
			if (ChatsStore.chatsLists.searchObj(name, 'name').isSome()) {
				ErrorAlert(dict.windowToUpdateChatsList.ThisNameAlreadyExists);
				return;
			}
		}

		ChatsStore.updateChat({
			id: chat.id,
			name: name,
			members: [...chosenUsers],
			avatar: ""
		});
		close();
	}, [name, dict.windowToUpdateChatsList.ChooseAtLeastOneUser, dict.windowToUpdateChatsList.OnlyNotGroupChatCanHasNoName, dict.windowToUpdateChatsList.ThisNameAlreadyExists, chosenUsers, close, chat.id]);

	useEffect(() => {
		observer.current = new IntersectionObserver(([target]) => {
			if (target.isIntersecting) {
				if (usersVisible > MiniUsersStore.users.length || usersVisible === MiniUsersStore.users.length || users.length % 20 !== 0) {
					return;
				}
				setUsersVisible(usersVisible + 20);
				setUsers([...MiniUsersStore.users.slice(0, usersVisible)]);
			}
		});
		(observer.current as IntersectionObserver).observe(lastElem.current);

		return () => {
			observer.current?.disconnect();
		}
	}, [lastElem.current, usersVisible, users.length, MiniUsersStore.users.length]);

	return (
		<>
			<ModalWindow close={close} />
			<div className={styles.window}>
				<LazyAvatar src={""} size={128} borderRadius={"50%"} />
				<div style={{display: 'flex', flexFlow: 'column'}}>
					<Input
						blockStyle={{marginBottom: '10px'}}
						placeholder={dict.windowToUpdateChatsList.EnterName}
						style={{width: '380px'}} dict={dict.inputDict}
						checkSpace={false}
						maxLength={64}
						minLength={0}
						startValue={name}
						error={ChatsStore.chatsLists.searchObj(name, 'name').isSome() ? dict.windowToUpdateChatsList.ThisNameAlreadyExists : ''}
						type={"default"}
						onChangeValue={(value) => {
							setName(value);
						}}/>
					<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
						{/*{dict.windowToUpdateChatsList.YourID} {+USERID}.*/}
						<Input dict={dict.inputDict} checkSpace={false} blockStyle={{width: '100%'}} placeholder={dict.windowToUpdateChatsList.EnterUserID} maxLength={22} minLength={0} type={"button"}
							   buttonText={dict.windowToUpdateChatsList.AddTheUser} reg={"only_numbers"} onClick={addUserById}
							   onChangeValue={(value) => {setTypedId(+value);}}
						/>
					</div>
					<div className={styles.filterList}>
						<Input
							inputClass={styles.filterInput}
							blockClass={styles.filterInputBlock}
							placeholder={dict.windowToUpdateChatsList.TypeNameOfUser}
							dict={dict.inputDict}
							checkSpace={false}
							maxLength={1000000}
							minLength={0}
							type={"default"}
							onChangeValue={(value) => {
								setFilterValue(value);
							}}/>
						<div className={styles.list}>
							{users.map((user, index) => {
								if (user.id === +USERID) return <div key={"empty" + index}></div>;
								if (!user.name.toLowerCase().includes(filterValue.toLowerCase()) && !user.surname.toLowerCase().includes(filterValue.toLowerCase())) {
									return <div key={"empty" + index}></div>;
								}
								return (
									<div key={user.id} className={styles.element}>
										<div style={{display: 'flex', alignItems: 'center'}}>
											<LazyAvatar style={{marginRight: '5px'}} src={user.avatar} size={24} borderRadius={"50%"} />
											{user.name} {user.surname}
										</div>
										<Checkbox checked={chosenUsers.indexOf(user.id) > -1} onChange={() => {
											const index = chosenUsers.indexOf(user.id);
											if (index > -1) {
												setChosenUsers([...chosenUsers.filter((id) => id !== user.id)]);
											} else {
												setChosenUsers([...chosenUsers, user.id]);
											}
										}}/>
									</div>
								);
							})}
							<div style={{width: '1px', height: '1px'}} ref={lastElem}></div>
						</div>
					</div>
					<div className={styles.buttonsPanel} style={{width: '100%'}}>
						<div className={styles.button} onClick={deleteChat} style={{backgroundColor: 'var(--red)'}}>{dict.windowToUpdateChatsList.Delete}</div>
						<div style={{display: 'flex'}}>
							<div className={styles.button} onClick={close} style={{backgroundColor: 'var(--red)'}}>{dict.windowToUpdateChatsList.Cancel}</div>
							<div className={styles.button} onClick={accept} style={{backgroundColor: 'var(--green)'}}>{dict.windowToUpdateChatsList.Accept}</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
});