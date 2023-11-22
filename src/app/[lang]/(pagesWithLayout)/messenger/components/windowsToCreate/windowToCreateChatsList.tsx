"use client";
import React, {FC, useCallback, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './windowsToCreate.module.scss';
import {ModalWindow} from "@/components/ModalWindow/ModalWindow";
import {LazyAvatar} from "@/components/LazyAvatar/LazyAvatar";
import {Input, InputDict} from "@/components/Input/Input";
import {ChatsStore} from "@/stores/ChatsStore";

export interface WindowToCreateChatsListDict {
    EnterName: string;
    Create: string;
    Cancel: string;
}

interface WindowToCreateChatsListProps {
    dict: {
        inputDict: InputDict;
        windowToCreateChatsList: WindowToCreateChatsListDict;
    };
    close: () => void;
}

export const WindowToCreateChatsList:FC<WindowToCreateChatsListProps> = observer<WindowToCreateChatsListProps>(({dict, close}) => {
    const [name, setName] = useState("");

    const create = useCallback(() => {
        if (name.length > 0) {
            ChatsStore.newChatsList(name, []).then(() => {
                close();
            });
        }
    }, [name, close]);

    return (
        <>
            <ModalWindow close={close} />
            <div className={styles.window}>
                {/* TODO r*/}
                <LazyAvatar src={""} size={128} borderRadius={"50%"} />
                <div style={{display: 'flex', flexFlow: 'column'}}>
                    <Input
                        blockStyle={{marginBottom: '10px'}}
                        placeholder={dict.windowToCreateChatsList.EnterName}
                        style={{width: '380px'}} dict={dict.inputDict}
                        checkSpace={true}
                        maxLength={64}
                        minLength={1}
                        type={"default"}
                        onChangeValue={(value) => {
                            setName(value);
                        }}
                    />
                    <div className={styles.buttonsPanel}>
                        <div className={styles.button} onClick={close} style={{backgroundColor: 'var(--red)'}}>{dict.windowToCreateChatsList.Cancel}</div>
                        <div className={styles.button} onClick={create} style={{backgroundColor: 'var(--green)'}}>{dict.windowToCreateChatsList.Create}</div>
                    </div>
                </div>
            </div>
        </>
    );
});