"use client";
import React, {FC, useCallback, useMemo, useState} from 'react';
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

export interface ChatDict {
    NoMessages: string;
    ChooseChat: string;
}

interface ChatProps {
    dict: ChatDict;
    chat: ChatType;
    setWindowMode: (mode: WindowMode) => void;
}

export const Chat:FC<ChatProps> = observer<ChatProps>(({dict, setWindowMode, chat}) => {

    const name = useMemo(() => {
        return !chat.isSingleUserConversation ? chat.name : chat.members[0] === +USERID
            ? `${MiniUsersStore.users.getByKeyUnchecked<MiniUser>(chat.members[1], 'id').name} ${MiniUsersStore.users.getByKeyUnchecked<MiniUser>(chat.members[1], 'id').surname}`
            : `${MiniUsersStore.users.getByKeyUnchecked<MiniUser>(chat.members[0], 'id').name} ${MiniUsersStore.users.getByKeyUnchecked<MiniUser>(chat.members[0], 'id').surname}`
    }, [chat.isSingleUserConversation, chat.name, chat.members]);

    const toggleFavorite = useCallback(() => {
        ChatsStore.toggleFavoriteChat(chat.id, chat);
    }, [chat]);

    const updateChat = useCallback(() => {
        setWindowMode(WindowMode.UpdateChat);
    }, [setWindowMode]);

    if (false) {
        return (
            <div className={styles.chat}>
                <TbMessageCircleX style={{width: '300px'}}/>
                {dict.NoMessages}
            </div>
        );
    }

    return (
        <div className={styles.chat}>
            <div className={styles.header}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <div style={{marginRight: '10px'}}>
                        <LazyAvatar src={chat.avatar} size={40} borderRadius={"50%"} />
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
        </div>
    );
});