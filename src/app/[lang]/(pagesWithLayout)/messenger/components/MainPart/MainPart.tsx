"use client";
import React, {memo, useCallback, useState} from 'react';
import styles from './MainPart.module.scss';
import {ChatsBlock} from "@/app/[lang]/(pagesWithLayout)/messenger/components/ChatsBlock/ChatsBlock";
import {InputDict} from "@/components/Input/Input";
import {
    WindowToCreateChatsList, WindowToCreateChatsListDict
} from "@/app/[lang]/(pagesWithLayout)/messenger/components/windowsToCreate/windowToCreateChatsList";

interface MainPartProps {
    dict: {
        ChatsBlock: {
            NoChats: string;
            TypeNameOfChat: string;
        };
        WindowToCreateChatsList: WindowToCreateChatsListDict;
        UI: {
            Input: InputDict;
        }
    };
}

export const enum WindowMode {
    None,
    CreateChatsList
}

export const MainPart = memo(({ dict }: MainPartProps) => {
    const [windowMode, setWindowMode] = useState(WindowMode.None);
    const setNoneWindowMode = useCallback(() => {
        setWindowMode(WindowMode.None);
    }, [])

    return (
        <div className={styles.mainPart}>
            <div style={{ width: '66%' }}>
                {windowMode === WindowMode.CreateChatsList && <WindowToCreateChatsList dict={{
                    inputDict: dict.UI.Input,
                    windowToCreateChatsList: dict.WindowToCreateChatsList
                }} close={setNoneWindowMode}/>}
            </div>
            <ChatsBlock dict={{
                input: dict.UI.Input,
                chatsBlock: dict.ChatsBlock
            }} setWindowMode={setWindowMode}/>
        </div>
    );
});