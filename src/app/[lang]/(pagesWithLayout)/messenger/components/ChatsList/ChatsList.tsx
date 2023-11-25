import React, {memo, FC, useCallback} from 'react';
import styles from './ChatsList.module.scss';
import { MdCreate } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import {WindowMode} from "@/app/[lang]/(pagesWithLayout)/messenger/components/MainPart/MainPart";

interface ChatsListProps {
    name: string;
    chatsIds: number[];
    setWindowMode: (mode: WindowMode) => void;
}

export const ChatsList:FC<ChatsListProps> = memo<ChatsListProps>(({name, chatsIds, setWindowMode}) => {

    const changeModeToCreateChatsList = useCallback(() => {
        setWindowMode(WindowMode.CreateChat);
    }, [setWindowMode]);

    return (
        <div className={styles.chatsList}>
            {name}
            <div className={styles.buttonsPanel}>
                <FaPlus onClick={changeModeToCreateChatsList} className={styles.button}/>
                <MdCreate className={styles.button}/>
            </div>
        </div>
    );
});