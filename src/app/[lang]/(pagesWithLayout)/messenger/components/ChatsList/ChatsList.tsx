import React, {FC, useCallback, useMemo, useEffect, useState, useRef} from 'react';
import styles from './ChatsList.module.scss';
import { MdCreate } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import {WindowMode} from "@/app/[lang]/(pagesWithLayout)/messenger/components/MainPart/MainPart";
import {Chat, ChatsList as ChatsListType, ChatsStore, SpecialChatsListsName} from "@/stores/ChatsStore";
import {observer} from "mobx-react-lite";
import {ChatLine} from "@/app/[lang]/(pagesWithLayout)/messenger/components/ChatLine/ChatLine";
import {LoadingChats} from "@/app/[lang]/(pagesWithLayout)/messenger/components/Loading/LoadingChats";

export interface ChatsListDict {
    favorites: string;
    other: string;
    friends: string;
}

interface ChatsListProps {
    chatsList: ChatsListType;
    dict: ChatsListDict;
    setWindowMode: (mode: WindowMode) => void;
    setActiveList: (name: string) => void;
    setActiveChat: (chat: Chat) => void;
    setNameOfChatsListWhichEditing: (name: string) => void;
}

export const ChatsList:FC<ChatsListProps> = observer<ChatsListProps>(({chatsList, setActiveChat, setNameOfChatsListWhichEditing, dict, setWindowMode, setActiveList}) => {

    const [isOpen, setIsOpen] = useState(false);
    const wasGet = useRef(false);
    const isSpecial = useMemo(() => {
        if (chatsList.name === SpecialChatsListsName.Favorites) {
            return true;
        } else if (chatsList.name === SpecialChatsListsName.Other) {
            return true;
        } else if (chatsList.name === SpecialChatsListsName.Friends) {
            return true;
        }
        return false;
    }, [chatsList.name]);
    const isFriends = useMemo(() => {
        return chatsList.name === SpecialChatsListsName.Friends;

    }, [chatsList.name]);
    const [isLoading, setIsLoading] = useState(false);

    const toggleIsOpen = useCallback(() => {
        if (!wasGet.current) {
            setIsLoading(true);
            ChatsStore.getChats(chatsList.chatsIds).then(() => {
                setIsLoading(false);
            })
        }
        setIsOpen(!isOpen);
    }, [isOpen, chatsList.chatsIds]);

    const changeModeToCreateChatsList = useCallback((e: React.MouseEvent) => {
        setWindowMode(WindowMode.CreateChat);
        setActiveList(chatsList.localName);
        e.stopPropagation();
    }, [setWindowMode, setActiveList, chatsList.localName]);

    const changeModeToUpdateChatsList = useCallback((e: React.MouseEvent) => {
        setWindowMode(WindowMode.UpdateChatsList);
        setNameOfChatsListWhichEditing(chatsList.localName);
        setActiveList(chatsList.localName);
        e.stopPropagation();
    }, [setWindowMode, setActiveList, chatsList.localName, setNameOfChatsListWhichEditing]);

    const doActiveChat = useCallback((id: number) => {
        setActiveChat(chatsList.chats.find(chat => chat.id === id)!);
    }, [setActiveChat, chatsList.chats]);

    useEffect(() => {
        if (chatsList.localName === SpecialChatsListsName.Favorites) {
            ChatsStore.changeLocalName(chatsList.localName, dict.favorites);
        } else if (chatsList.localName === SpecialChatsListsName.Other) {
            ChatsStore.changeLocalName(chatsList.localName, dict.other);
        } else if (chatsList.localName === SpecialChatsListsName.Friends) {
            ChatsStore.changeLocalName(chatsList.localName, dict.friends);
        }
    }, [chatsList.localName, dict.favorites, dict.other, dict.friends]);

    return (
        <div className={styles.chatsList}>
            <div className={styles.info} onClick={toggleIsOpen}>
                <div>{chatsList.localName}</div>
                <div className={styles.buttonsPanel}>
                    {!isFriends && <FaPlus onClick={changeModeToCreateChatsList} className={styles.button}/>}
                    {!isSpecial && <MdCreate onClick={changeModeToUpdateChatsList} className={styles.button}/>}
                </div>
            </div>
            {isOpen && (chatsList.chats.length > 0 || isLoading) &&
                <div className={styles.list}>
                    {isLoading
                        ? <LoadingChats />
                        : chatsList.chats.map((chat) => (
                            <ChatLine key={chat.id} chat={chat} doActiveChat={doActiveChat}/>
                        ))
                    }
                </div>
            }
        </div>
    );
});