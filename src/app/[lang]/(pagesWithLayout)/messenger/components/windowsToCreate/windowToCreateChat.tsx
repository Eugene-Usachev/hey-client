"use client";
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './windowsToCreate.module.scss';
import {ModalWindow} from "@/components/ModalWindow/ModalWindow";
import {LazyAvatar} from "@/components/LazyAvatar/LazyAvatar";
import {Input, InputDict} from "@/components/Input/Input";
import {ChatsStore} from "@/stores/ChatsStore";
import {MiniUser, MiniUsersStore} from "@/stores/MiniUsersStore";
import {ErrorAlert} from "@/components/Alerts/Alerts";
import {api} from "@/app/[lang]/(pagesWithLayout)/messenger/MessengerAPI";
import {Checkbox} from "@mui/material";
import {USERID} from "@/app/config";

export interface WindowToCreateChatDict {
	AddTheUser: string;
	EnterUserID: string;
	YourID: string;
	EnterName: string;
	TypeNameOfUser: string;
	ChooseAtLeastOneUser: string;
	OnlyNotGroupChatCanHasNoName: string;
	OnlyGroupChatCanHasName: string;
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
	listName: string;
}

export const WindowToCreateChat:FC<WindowToCreateChatProps> = observer<WindowToCreateChatProps>(({dict, close, listName}) => {
	const [name, setName] = useState("");
	const [filterValue, setFilterValue] = useState("");
	const [loading, setLoading] = useState(true);
	const [usersVisible, setUsersVisible] = useState(20);
	const [users, setUsers] = useState([...MiniUsersStore.users.slice(0, usersVisible)]);
	const [chosenUsers, setChosenUsers] = useState<number[]>([]);
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
		setUsers([...MiniUsersStore.users.slice(0, usersVisible)]);
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

	const create = useCallback(() => {
		if (chosenUsers.length === 0) {
			ErrorAlert(dict.windowToCreateChatsList.ChooseAtLeastOneUser);
			return;
		}
		if (name.length === 0 && chosenUsers.length > 1) {
			ErrorAlert(dict.windowToCreateChatsList.OnlyNotGroupChatCanHasNoName);
			return;
		}
		// if (name.length > 0 && chosenUsers.length === 1) {
		// 	ErrorAlert(dict.windowToCreateChatsList.OnlyGroupChatCanHasName);
		// 	return;
		// }
		if (name.length > 0) {
			if (ChatsStore.chatsLists.searchObj(name, 'name').isSome()) {
				ErrorAlert(dict.windowToCreateChatsList.ThisNameAlreadyExists);
				return;
			}
		}

		ChatsStore.createChat({
			name: name,
			members: [+USERID, ...chosenUsers],
			avatar: ""
		}, listName)
		close();
	}, [name, dict.windowToCreateChatsList.ChooseAtLeastOneUser, dict.windowToCreateChatsList.OnlyNotGroupChatCanHasNoName, dict.windowToCreateChatsList.ThisNameAlreadyExists, chosenUsers, close, listName]);

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
				{/* TODO r*/}
				<LazyAvatar src={""} size={128} borderRadius={"50%"} />
				<div style={{display: 'flex', flexFlow: 'column'}}>
					<Input
						blockStyle={{marginBottom: '10px'}}
						placeholder={dict.windowToCreateChatsList.EnterName}
						style={{width: '380px'}} dict={dict.inputDict}
						checkSpace={false}
						maxLength={64}
						minLength={0}
						error={ChatsStore.chatsLists.searchObj(name, 'name').isSome() ? dict.windowToCreateChatsList.ThisNameAlreadyExists : ''}
						type={"default"}
						onChangeValue={(value) => {
							setName(value);
						}}/>
					<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
						{/*{dict.windowToCreateChatsList.YourID} {+USERID}.*/}
						<Input dict={dict.inputDict} checkSpace={false} blockStyle={{width: '100%'}} placeholder={dict.windowToCreateChatsList.EnterUserID} maxLength={22} minLength={0} type={"button"}
							   buttonText={dict.windowToCreateChatsList.AddTheUser} reg={"only_numbers"} onClick={addUserById}
							   onChangeValue={(value) => {setTypedId(+value);}}
						/>
					</div>
					<div className={styles.filterList}>
						<Input
							inputClass={styles.filterInput}
							blockClass={styles.filterInputBlock}
							placeholder={dict.windowToCreateChatsList.TypeNameOfUser}
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
					<div className={styles.buttonsPanel}>
						<div className={styles.button} onClick={close} style={{backgroundColor: 'var(--red)'}}>{dict.windowToCreateChatsList.Cancel}</div>
						<div className={styles.button} onClick={create} style={{backgroundColor: 'var(--green)'}}>{dict.windowToCreateChatsList.Create}</div>
					</div>
				</div>
			</div>
		</>
	);
});