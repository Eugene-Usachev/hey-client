"use client";
import React, {FC, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './ChatsBlock.module.scss';
import {ChatsStore} from "@/stores/ChatsStore";
import {Input, InputDict} from "@/components/Input/Input";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import {WindowMode} from "@/app/[lang]/(pagesWithLayout)/messenger/components/MainPart/MainPart";

export interface ChatsBlockDict {
    input: InputDict;
    chatsBlock: {
        NoChats: string;
        TypeNameOfChat: string;
    }
}

export interface ChatsBlockProps {
    dict: ChatsBlockDict;
    setWindowMode: (mode: WindowMode) => void;
}

export const ChatsBlock: FC<ChatsBlockProps> = observer<ChatsBlockProps>(({dict, setWindowMode}) => {
    const [filterValue, setFilterValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);
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
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Input
                    onChangeValue={(value) => {
                        setFilterValue(value);
                    }}
                    withLabel={false}
                    blockStyle={isSearching ? {width: '100%'} : {width: 'calc(100% - 38px)'}}
                    placeholder={dict.chatsBlock.TypeNameOfChat}
                    dict={dict.input}
                    checkSpace={false}
                    maxLength={10000}
                    minLength={0}
                    type={"default"}
                    onFocus={() => {
                        setIsSearching(true);
                    }}
                    onBlur={() => {
                        setIsSearching(false);
                    }}
                />
                {!isSearching && <MdOutlineCreateNewFolder onClick={() => {setWindowMode(WindowMode.CreateChatsList)}} className={styles.button}/>}
            </div>
        </div>
    );
});