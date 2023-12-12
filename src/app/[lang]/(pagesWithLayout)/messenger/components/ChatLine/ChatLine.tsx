"use client";
import React, {FC, useMemo} from 'react';
import {observer} from "mobx-react-lite";
import styles from './ChatLine.module.scss';
import {LazyAvatar} from "@/components/LazyAvatar/LazyAvatar";
import {USERID} from "@/app/config";
import {MiniUser, MiniUsersStore} from "@/stores/MiniUsersStore";
import {Chat} from "@/stores/ChatsStore";
import {UserAvatar} from "@/components/UserAvatar/UserAvatar";
import {None, Option} from "@/libs/rustTypes/option";

export interface ChatLineProps {
    doActiveChat: (chatId: number) => void;
    chat: Chat;
}

export const ChatLine: FC<ChatLineProps> = observer<ChatLineProps>(({doActiveChat, chat}) => {

    const user = useMemo(():Option<MiniUser> => {
        if (chat.isSingleUserConversation) {
            let otherUserId = chat.members[0] === +USERID ? chat.members[1] : chat.members[0];
            return MiniUsersStore.users.getByKey<MiniUser>(otherUserId, "id");
        }
        return None();
    }, [chat.isSingleUserConversation, chat.members]);

    return (
        <div className={styles.chatLine}
             onClick={() => {
                 doActiveChat(chat.id)}
             }
        >
            {chat.isSingleUserConversation
                ? <UserAvatar style={{marginRight: '5px'}} user={user.expect("User not found")} size={40} borderRadius={"50%"} />
                : <LazyAvatar style={{marginRight: '5px'}} src={chat.avatar} size={40} borderRadius={"50%"} />
            }
            {chat.isSingleUserConversation
                ? chat.members[0] === +USERID
                    ? `${MiniUsersStore.users.getByKeyUnchecked<MiniUser>(chat.members[1], "id").name} ${MiniUsersStore.users.getByKeyUnchecked<MiniUser>(chat.members[1], "id").surname}`
                    : `${MiniUsersStore.users.getByKeyUnchecked<MiniUser>(chat.members[0], "id").name} ${MiniUsersStore.users.getByKeyUnchecked<MiniUser>(chat.members[0], "id").surname}`
                : chat.name
            }
        </div>
    );
});