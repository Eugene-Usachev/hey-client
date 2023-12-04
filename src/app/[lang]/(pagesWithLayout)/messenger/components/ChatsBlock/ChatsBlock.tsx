"use client";
import React, {FC, useEffect, useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './ChatsBlock.module.scss';
import {Chat, ChatsStore} from "@/stores/ChatsStore";
import {Input, InputDict} from "@/components/Input/Input";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import {WindowMode} from "@/app/[lang]/(pagesWithLayout)/messenger/components/MainPart/MainPart";
import {ChatsList, ChatsListDict} from "@/app/[lang]/(pagesWithLayout)/messenger/components/ChatsList/ChatsList";

export interface ChatsBlockDict {
    input: InputDict;
    chatsBlock: {
        NoChats: string;
        TypeNameOfChat: string;
    }
    chatsList: ChatsListDict;
}

export interface ChatsBlockProps {
    dict: ChatsBlockDict;
    setWindowMode: (mode: WindowMode) => void;
    setActiveList: (name: string) => void;
    setActiveChat: (chat: Chat) => void;
    setNameOfChatsListWhichEditing: (name: string) => void;
}

export const ChatsBlock: FC<ChatsBlockProps> = observer<ChatsBlockProps>(({dict, setActiveChat, setNameOfChatsListWhichEditing, setWindowMode, setActiveList}) => {
    const [filterValue, setFilterValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [chatsLists, setChatsLists] = useState(ChatsStore.chatsLists);

    useEffect(() => {
        setChatsLists(ChatsStore.chatsLists);
    }, [ChatsStore.chatsLists, ChatsStore.chatsLists.length]);

    useEffect(() => {
        if (!ChatsStore.wasGet) {
            ChatsStore.getChatsLists().then(() => {
                setChatsLists([...ChatsStore.chatsLists]);
            });
        }
    }, []);

    useEffect(() => {
        if (filterValue !== "") {
            setChatsLists([...ChatsStore.chatsLists.filter((value) => {
                return value.localName.toLowerCase().includes(filterValue.toLowerCase());
            })]);
        } else {
            setChatsLists([...ChatsStore.chatsLists]);
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
            <div className={styles.list}>
                {chatsLists.map((value) => {
                    return <ChatsList key={value.name} setActiveChat={setActiveChat} dict={dict.chatsList}
                                      setWindowMode={setWindowMode} chatsList={value}
                                      setNameOfChatsListWhichEditing={setNameOfChatsListWhichEditing}
                                      setActiveList={setActiveList}/>
                })}
            </div>
        </div>
    );
});