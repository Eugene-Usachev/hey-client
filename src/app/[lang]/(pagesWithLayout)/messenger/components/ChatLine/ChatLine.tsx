"use client";
import React, {FC} from 'react';
import {observer} from "mobx-react-lite";
import styles from './ChatLine.module.scss';
import {LazyAvatar} from "@/components/LazyAvatar/LazyAvatar";
import {USERID} from "@/app/config";
import {MiniUser, MiniUsersStore} from "@/stores/MiniUsersStore";
import {Chat} from "@/stores/ChatsStore";

export interface ChatLineProps {
    doActiveChat: (chatId: number) => void;
    chat: Chat;
}

export const ChatLine: FC<ChatLineProps> = observer<ChatLineProps>(({doActiveChat, chat}) => {

    return (
        <div className={styles.chatLine}
             onClick={() => {
                 doActiveChat(chat.id)}
             }
        >
            <LazyAvatar style={{marginRight: '5px'}} src={chat.avatar} size={40} borderRadius={"50%"} />
            {chat.isSingleUserConversation
                ? chat.members[0] === +USERID
                    ? `${MiniUsersStore.users.getByKeyUnchecked<MiniUser>(chat.members[1], "id").name} ${MiniUsersStore.users.getByKeyUnchecked<MiniUser>(chat.members[1], "id").surname}`
                    : `${MiniUsersStore.users.getByKeyUnchecked<MiniUser>(chat.members[0], "id").name} ${MiniUsersStore.users.getByKeyUnchecked<MiniUser>(chat.members[0], "id").surname}`
                : chat.name
            }
        </div>
    );
});