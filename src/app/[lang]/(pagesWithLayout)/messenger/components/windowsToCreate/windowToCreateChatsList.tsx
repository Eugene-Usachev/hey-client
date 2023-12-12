"use client";
import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './windowsToCreate.module.scss';
import {ModalWindow} from "@/components/ModalWindow/ModalWindow";
import {LazyAvatar} from "@/components/LazyAvatar/LazyAvatar";
import {Input, InputDict} from "@/components/Input/Input";
import {Chat, ChatsStore} from "@/stores/ChatsStore";
import {MiniUser, MiniUsersStore} from "@/stores/MiniUsersStore";
import {Checkbox} from "@mui/material";
import {None, Option} from "@/libs/rustTypes/option";
import {USERID} from "@/app/config";
import {UserAvatar} from "@/components/UserAvatar/UserAvatar";

export interface WindowToCreateChatsListDict {
    EnterName: string;
    Create: string;
    Cancel: string;
    ThisNameAlreadyExists: string;
    TypeNameOfChat: string;
}

interface WindowToCreateChatsListProps {
    dict: {
        inputDict: InputDict;
        windowToCreateChatsList: WindowToCreateChatsListDict;
    };
    close: () => void;
}

export const getChatsSlice = (oldSlice: Chat[], delta: number): Chat[] => {
    const slice = [...oldSlice];
    let i = 0;
    for (const chatList of ChatsStore.chatsLists) {
        for (const chat of chatList.chats) {
            if (i >= delta) break;
            if (slice.findIndex(c => c.id === chat.id) !== -1) continue;
            slice.push(chat);
            i++;
        }
    }
    return slice;
}

export const WindowToCreateChatsList:FC<WindowToCreateChatsListProps> = observer<WindowToCreateChatsListProps>(({dict, close}) => {
    const [name, setName] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [chatsVisible, setChatsVisible] = useState(20);
    const [chats, setChats] = useState(getChatsSlice([], 20));
    const [chosenChats, setChosenChats] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const lastElem = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
    const observer = useRef<IntersectionObserver>();

    useEffect(() => {
        if (!ChatsStore.wasAllGet) {
            ChatsStore.getAllChats().then(() => {
                setLoading(false);
                setChats(getChatsSlice(chats, 20));
            });
        }
    }, []);

    const create = useCallback(() => {
        if (name.length > 0) {
            if (ChatsStore.chatsLists.searchObj(name, 'name').isSome()) {
                return;
            }
            ChatsStore.newChatsList(name, []).then(() => {
                close();
            });
        }
    }, [name, close]);

    useEffect(() => {
        observer.current = new IntersectionObserver(([target]) => {
            if (target.isIntersecting) {
                if (chatsVisible > ChatsStore.chatsCount || chatsVisible === ChatsStore.chatsCount || chats.length % 20 !== 0) {
                    return;
                }
                setChatsVisible(chatsVisible + 20);
                setChats(getChatsSlice(chats, chatsVisible + 20));
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
                        placeholder={dict.windowToCreateChatsList.EnterName}
                        style={{width: '530px'}}
                        dict={dict.inputDict}
                        checkSpace={false}
                        maxLength={64}
                        minLength={1}
                        error={ChatsStore.chatsLists.searchObj(name, 'name').isSome() ? dict.windowToCreateChatsList.ThisNameAlreadyExists : ''}
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
                            placeholder={dict.windowToCreateChatsList.TypeNameOfChat}
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
                                    return <div key={"empty" + index}></div>;
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
                    <div className={styles.buttonsPanel}>
                        <div className={styles.button} onClick={close} style={{backgroundColor: 'var(--red)'}}>{dict.windowToCreateChatsList.Cancel}</div>
                        <div className={styles.button} onClick={create} style={{backgroundColor: 'var(--green)'}}>{dict.windowToCreateChatsList.Create}</div>
                    </div>
                </div>
            </div>
        </>
    );
});