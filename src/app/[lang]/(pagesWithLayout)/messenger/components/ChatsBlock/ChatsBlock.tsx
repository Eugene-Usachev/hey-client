"use client";
import React, {FC, useEffect} from 'react';
import {observer} from "mobx-react-lite";
import styles from './ChatsBlock.module.scss';
import {ChatsStore} from "@/stores/ChatsStore";

export const ChatsBlock: FC = observer(() => {

    useEffect(() => {
        if (!ChatsStore.wasGet) {
            ChatsStore.getChatList();
        }
    }, []);

    if (!ChatsStore.wasGet) {
        // TODO loading
        return <></>;
    }

    return (
        <div className={styles.chatsBlock}>

        </div>
    );
});