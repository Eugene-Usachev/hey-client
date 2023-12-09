"use client";
import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './Message.module.scss';
import {Message as MessageType, MessagesStore} from "@/stores/MessagesStore";
import {USERID} from "@/app/config";
import {parseUnixDate} from "@/utils/ParseUnixDate";
import {MiniUser, MiniUsersStore} from "@/stores/MiniUsersStore";
import Link from "next/link";
import {getHREF} from "@/utils/getHREF";
import {runInAction} from "mobx";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import {ModalWindow} from "@/components/ModalWindow/ModalWindow";

interface MessageProps {
    message: MessageType;
}

export const Message: FC<MessageProps> = observer<MessageProps>(({message}) => {

    const {data, files, date, messageParentID, parentChatID, parentUserID, id} = message;
    const [isEditing, setIsEditing] = useState(false);
    const textBlock = useRef<HTMLDivElement>(null as never as HTMLDivElement);
    const isYour = useMemo(() => {
        return parentUserID === +USERID;
    }, [parentUserID]);
    const user = useMemo(() => {
        let user = MiniUsersStore.users.getByKeyUnchecked<MiniUser>(parentUserID, 'id');
        runInAction(() => {
            user.name = user.name.charAt(0).toUpperCase() + user.name.slice(1);
            user.surname = user.surname.charAt(0).toUpperCase() + user.surname.slice(1);
        });
        return user;
    }, [parentUserID]);
    const [isActive, setIsActive] = useState(false);
    const toggleIsActive = useCallback((e: React.MouseEvent) => {
        if (!isYour) return;
        setIsActive(!isActive);
        e.stopPropagation();
    }, [isActive, isYour]);

    const updateMessage = useCallback(() => {
        setIsEditing(false);
        setIsActive(false);
        MessagesStore.updateMessage({
            data: textBlock.current?.innerText,
            message_id: id
        })
    }, [id]);

    const deleteMessage = useCallback(() => {
        MessagesStore.deleteMessage(id);
    }, [id]);

    const closeEdit = useCallback(() => {
        textBlock.current!.innerText = data;
        setIsEditing(false);
        setIsActive(false);
    }, [data]);

    useEffect(() => {
        if (isEditing) {
            textBlock.current?.focus();
        }
    }, [isEditing]);

    return (
        <>
            {isEditing && <ModalWindow close={closeEdit} />}
            <div className={styles.messageLine + ' ' + (isEditing ? styles.isEditing : '')} style={isYour ? {justifyContent: "flex-end", marginRight: '5px'} : {marginLeft: '5px'}}>
                <div className={styles.message}>
                    <Link href={getHREF(`profile/${user.id}`)} className={styles.header}>{user.name} {user.surname}</Link>
                    <div onClick={toggleIsActive}>
                        <div className={styles.textBlock + " " + (isEditing ? styles.editingBlock : "")} ref={textBlock} suppressContentEditableWarning={true} contentEditable={isEditing}>{data}</div>
                        <div className={styles.date}>{date !== 0 ? parseUnixDate(date) : new Date().toLocaleString()}</div>
                        {isEditing && (
                            <div className={styles.buttonLine}>
                                <div className={styles.button} onClick={closeEdit}>
                                    <IoMdClose/>
                                </div>
                                <div className={styles.button} onClick={updateMessage}>
                                    <FaCheck/>
                                </div>
                            </div>
                        )}
                        {isActive && !isEditing &&
                            (
                                <div className={styles.buttonLine}>
                                    <div className={styles.button} onClick={() => {
                                        setIsEditing(true)
                                    }}>
                                        <MdEdit/>
                                    </div>
                                    <div className={styles.button} onClick={deleteMessage}>
                                        <MdDelete />
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
});