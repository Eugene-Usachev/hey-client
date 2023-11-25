"use client";
import React, {FC, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './ChatsBlock.module.scss';
import {ChatsStore, ChatsList as ChatsListInterface} from "@/stores/ChatsStore";
import {Input, InputDict} from "@/components/Input/Input";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import {WindowMode} from "@/app/[lang]/(pagesWithLayout)/messenger/components/MainPart/MainPart";
import {ChatsList} from "@/app/[lang]/(pagesWithLayout)/messenger/components/ChatsList/ChatsList";

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
    const [chatsLists, setChatsLists] = useState(ChatsStore.chatLists.slice(0, 20));

    useEffect(() => {
        setChatsLists(ChatsStore.chatLists.slice(0, 20));
    }, [ChatsStore.chatLists.length]);

    useEffect(() => {
        if (!ChatsStore.wasGet) {
            ChatsStore.getChatList().then(() => {
                setChatsLists([...ChatsStore.chatLists]);
            });
        }
    }, []);

    useEffect(() => {
        if (filterValue !== "") {
            setChatsLists([...ChatsStore.chatLists.filter((value) => {
                return value.name.toLowerCase().includes(filterValue.toLowerCase());
            })]);
        } else {
            setChatsLists([...ChatsStore.chatLists]);
        }
    }, [filterValue]);


    if (!ChatsStore.wasGet) {
        // TODO loading
        return <></>;
    }

    return (
        <div className={styles.chatsBlock}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px'}}>
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
            {chatsLists.map((value) => {
                return <ChatsList key={value.name} setWindowMode={setWindowMode}  name={value.name} chatsIds={value.chatsIds}/>
            })}
        </div>
    );
});