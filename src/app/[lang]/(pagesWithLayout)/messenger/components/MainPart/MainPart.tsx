"use client";
import React, {memo, useCallback, useEffect, useState} from 'react';
import styles from './MainPart.module.scss';
import {ChatsBlock} from "@/app/[lang]/(pagesWithLayout)/messenger/components/ChatsBlock/ChatsBlock";
import {InputDict} from "@/components/Input/Input";
import {
    WindowToCreateChatsList, WindowToCreateChatsListDict
} from "@/app/[lang]/(pagesWithLayout)/messenger/components/windowsToCreate/windowToCreateChatsList";
import {
    WindowToCreateChat, WindowToCreateChatDict
} from "@/app/[lang]/(pagesWithLayout)/messenger/components/windowsToCreate/windowToCreateChat";
import {api} from "@/app/[lang]/(pagesWithLayout)/messenger/MessengerAPI";
import {ChatsListDict} from "@/app/[lang]/(pagesWithLayout)/messenger/components/ChatsList/ChatsList";
import {
    WindowToUpdateChatsList, WindowToUpdateChatsListDict
} from "@/app/[lang]/(pagesWithLayout)/messenger/components/windowsToCreate/WindowToUpdateChatsList";
import {None, Some} from "@/libs/rustTypes/option";
import {Chat as ChatType} from "@/stores/ChatsStore";
import {Chat, ChatDict} from "@/app/[lang]/(pagesWithLayout)/messenger/components/Chat/Chat";
import {
    WindowToUpdateChat, WindowToUpdateChatDict
} from "@/app/[lang]/(pagesWithLayout)/messenger/components/windowsToCreate/windowToUpdateChat";

interface MainPartProps {
    dict: {
        ChatsBlock: {
            NoChats: string;
            TypeNameOfChat: string;
        };
        WindowToCreateChatsList: WindowToCreateChatsListDict;
        WindowToCreateChat:  WindowToCreateChatDict;
        WindowToUpdateChatsList: WindowToUpdateChatsListDict;
        UI: {
            Input: InputDict;
        }
        ChatsList: ChatsListDict;
        Chat: ChatDict;
        WindowToUpdateChat: WindowToUpdateChatDict;
    };
}

export const enum WindowMode {
    Chat,
    CreateChatsList,
    UpdateChatsList,
    CreateChat,
    UpdateChat
}

export const MainPart = memo(({ dict }: MainPartProps) => {
    const [windowMode, setWindowMode] = useState(WindowMode.Chat);
    const [activeList, setActiveList] = useState("");
    const [activeChat, setActiveChat] = useState(None<ChatType>());
    const [nameOfChatsListWhichEditing, setNameOfChatsListWhichEditing] = useState("");
    const setChatWindowMode = useCallback(() => {
        setWindowMode(WindowMode.Chat);
    }, []);

    const setActiveChatCB = useCallback((chat: ChatType) => {
        setActiveChat(Some(chat));
    }, []);

    useEffect(() => {
        api.wsConnect();
    }, []);

    return (
        <div className={styles.mainPart}>
            <div style={{ width: '66%' }}>
                {windowMode === WindowMode.CreateChatsList && <WindowToCreateChatsList dict={{
                    inputDict: dict.UI.Input,
                    windowToCreateChatsList: dict.WindowToCreateChatsList
                }} close={setChatWindowMode}/>}
                {windowMode === WindowMode.UpdateChatsList && <WindowToUpdateChatsList
                    chatsListsName={nameOfChatsListWhichEditing}
                    dict={{
                        inputDict: dict.UI.Input,
                        windowToUpdateChatsList: dict.WindowToUpdateChatsList
                    }} close={setChatWindowMode}/>}
                {windowMode === WindowMode.CreateChat && <WindowToCreateChat dict={{
                    inputDict: dict.UI.Input,
                    windowToCreateChatsList: dict.WindowToCreateChat
                }} close={setChatWindowMode} listName={activeList}/>}
                {windowMode === WindowMode.UpdateChat && <WindowToUpdateChat chat={activeChat.unwrap()} dict={{
                    inputDict: dict.UI.Input,
                    windowToUpdateChatsList: dict.WindowToUpdateChat
                }} close={setChatWindowMode}/>}
                {windowMode === WindowMode.Chat && activeChat.isSome()
                    ? <Chat dict={dict.Chat} inputDict={dict.UI.Input} setWindowMode={setWindowMode} chat={activeChat.unwrap()}/>
                    : <div style={{display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: '20px'}}>
                        {dict.Chat.ChooseChat}
                    </div>
                }
            </div>
            <ChatsBlock dict={{
                input: dict.UI.Input,
                chatsBlock: dict.ChatsBlock,
                chatsList: dict.ChatsList
            }} setActiveChat={setActiveChatCB} setWindowMode={setWindowMode} setActiveList={setActiveList} setNameOfChatsListWhichEditing={setNameOfChatsListWhichEditing}/>
        </div>
    );
});