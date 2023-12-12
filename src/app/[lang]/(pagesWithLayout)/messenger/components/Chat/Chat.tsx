"use client";
import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './Chat.module.scss';
import {Chat as ChatType, ChatsList, ChatsStore, SpecialChatsListsName} from "@/stores/ChatsStore";
import { TbMessageCircleX } from "react-icons/tb";
import {LazyAvatar} from "@/components/LazyAvatar/LazyAvatar";
import {USERID} from "@/app/config";
import {MiniUser, MiniUsersStore} from "@/stores/MiniUsersStore";
import { MdModeEdit } from "react-icons/md";
import { AiOutlineStar } from "react-icons/ai";
import { AiFillStar } from "react-icons/ai";
import {WindowMode} from "@/app/[lang]/(pagesWithLayout)/messenger/components/MainPart/MainPart";
import {MessagesStore} from "@/stores/MessagesStore";
import {Input, InputDict} from '@/components/Input/Input';
import {Message} from "@/app/[lang]/(pagesWithLayout)/messenger/components/Message/Message";
import {LoadingMessages} from "@/app/[lang]/(pagesWithLayout)/messenger/components/Loading/LoadingMessages";
import {Message as MessageType} from "@/stores/MessagesStore";
import {None, Option} from "@/libs/rustTypes/option";
import {UserAvatar} from "@/components/UserAvatar/UserAvatar";

export interface ChatDict {
    NoMessages: string;
    ChooseChat: string;
    WriteMessage: string;
}

interface ChatProps {
    dict: ChatDict;
    inputDict: InputDict;
    chat: ChatType;
    setWindowMode: (mode: WindowMode) => void;
}

export const Chat:FC<ChatProps> = observer<ChatProps>(({dict,
                                                           setWindowMode,
                                                           inputDict,
                                                           chat}) => {
    const list = useRef<HTMLDivElement>(null as never as HTMLDivElement);
    const isLoading = useRef(false);
    const [data, setData] = useState("");
    const observer = useRef<IntersectionObserver>();
    const [messagesVisible, setMessagesVisible] = useState(
        MessagesStore.chats.get(chat.id) !== undefined ? MessagesStore.chats.get(chat.id)!.length : 0
    );
    const firstElem = useRef<HTMLDivElement | null>(null);
    const lastScrollHeight = useRef(0);
    const [needToScroll, setNeedToScroll] = useState(false);
    const user = useMemo(():Option<MiniUser> => {
        if (chat.isSingleUserConversation) {
            let otherUserId = chat.members[0] === +USERID ? chat.members[1] : chat.members[0];
            return MiniUsersStore.users.getByKey<MiniUser>(otherUserId, "id");
        }
        return None();
    }, [chat.isSingleUserConversation, chat.members]);
    const name = useMemo(() => {
        if (!chat.isSingleUserConversation) return chat.name;
        return user.unwrap().name + " " + user.unwrap().surname;
        }, [chat.isSingleUserConversation, chat.name, user]);
    const [messages, setMessages] = useState(MessagesStore.chats.get(chat.id));

    const toggleFavorite = useCallback(() => {
        ChatsStore.toggleFavoriteChat(chat.id, chat);
    }, [chat]);

    const updateChat = useCallback(() => {
        setWindowMode(WindowMode.UpdateChat);
    }, [setWindowMode]);

    useEffect(() => {
        let res = MessagesStore.chats.get(chat.id);
        if (res) {
            setMessages(res);
            setNeedToScroll(true);
            setMessagesVisible(res.length);
            return;
        }
        isLoading.current = true;
        MessagesStore.getMessages(chat.id, 0).then(() => {
            res = MessagesStore.chats.get(chat.id);
            if (!res) {
                return;
            }
            setMessages(res);
            setTimeout(() => {
                isLoading.current = false;
            }, 500);
            setMessagesVisible(res.length);
            setNeedToScroll(true);
        });
    }, [chat.id]);

    useEffect(() => {
        let res = MessagesStore.chats.get(chat.id);
        if (res) {
            setMessages(res);
            setMessagesVisible(res.length);
        }
    }, [chat.id, MessagesStore.chats.get(chat.id)]);

    const sendMessage = useCallback((): boolean => {
        if (!data || data.length === 0) {
            return false;
        }
        MessagesStore.sendMessage({
            data: data,
            files: [],
            message_parent_id: 0,
            parent_chat_id: chat.id,
            parent_user_id: +USERID
        });
        setData("");
        return true;
    }, [data, chat.id]);

	useEffect(() => {
		if (needToScroll) {
			if (list.current) {
                if (lastScrollHeight.current === 0) {
                    list.current.scrollTop = list.current.scrollHeight;
                } else {
                    let cb = () => {
                        let currentHeight = list.current.scrollHeight;
                        if ((currentHeight - lastScrollHeight.current) !== 0) {
                            list.current.scrollTop = currentHeight - lastScrollHeight.current;
                        } else {
                            setTimeout( cb, 5);
                        }
                    }
                    setTimeout( cb, 5);
                }
			}
			setNeedToScroll(false);
		}
	}, [needToScroll]);

    useEffect(() => {
        if (!firstElem.current) return;
        observer.current = new IntersectionObserver(([target]) => {
            if (target.isIntersecting) {
                if (messagesVisible % 20 !== 0 || isLoading.current) return;
                isLoading.current = true;
                lastScrollHeight.current = list.current!.scrollHeight;
                MessagesStore.getMessages(chat.id, messagesVisible).then((numberOfComments) => {
                    setTimeout(() => {
                        isLoading.current = false;
                    }, 500);
                    setNeedToScroll(true);
                    setMessagesVisible(messagesVisible + numberOfComments);
                });
            }
        });
        (observer.current as IntersectionObserver).observe(firstElem.current);

        return () => {
            observer.current?.disconnect();
        }
    }, [firstElem.current, messagesVisible]);

    return (
        <div className={styles.chat}>
            <div className={styles.header}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <div style={{marginRight: '10px'}}>
                        {chat.isSingleUserConversation
                            ? <UserAvatar user={user.unwrap()} size={40} borderRadius={"50%"} />
                            : <LazyAvatar src={chat.avatar} size={40} borderRadius={"50%"} />
                        }

                    </div>
                    {name}
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifySelf: 'end', paddingRight: '5px'}}>
                    {!chat.isSingleUserConversation &&
                        <div className={styles.button}>
                            <MdModeEdit onClick={updateChat}/>
                        </div>
                    }
                    <div className={styles.button} onClick={toggleFavorite}>
                        {ChatsStore.chatsLists.getByKeyUnchecked<ChatsList>(SpecialChatsListsName.Favorites, 'name').chatsIds.includes(chat.id)
                            ? <AiFillStar />
                            : <AiOutlineStar />
                        }
                    </div>
                </div>
            </div>
            <div className={styles.list} ref={list}>
                {!messages
                    ? <LoadingMessages />
                    : messages.length === 0
                        ? (
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column'}}>
                                <TbMessageCircleX style={{fontSize: '150px', marginBottom: '100px'}}/>
                                <div style={{fontSize: '30px'}}>
                                    {dict.NoMessages}
                                </div>
                            </div>
                        )
                        : messages.map((message: MessageType, index) => {
                            if (index === 0) {
                                return (
                                    <div ref={firstElem}>
                                        <Message message={message} key={message.id} />
                                    </div>
                                );
                            }
                            return (
                                <div>
                                    <Message message={message} key={message.id} />
                                </div>
                            );
                        })
                }
            </div>
            <div className={styles.inputBlock}>
                <Input
                    onClick={sendMessage}
                    onEnter={sendMessage}
                    onChangeValue={setData}
                    withLabel={false}
                    checkSpace={false}
                    placeholder={dict.WriteMessage}
                    minLength={-1}
                    maxLength={4096}
                    dict={inputDict}
                    type={"send"}
                />
            </div>
        </div>
    );
});