'use client';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './TopProfile.module.scss';
import {TopProfileStore} from "@/stores/TopProfileStore";
import {LazyAvatar} from "@/components/LazyAvatar/LazyAvatar";
import {TopProfileMenu} from "@/components/TopProfileMenu/TopProfileMenu";
import {ModalWindow} from "@/components/ModalWindow/ModalWindow";

export const TopProfile: FC = observer(() => {

    const [isActive, setIsActive] = useState(false);
    const block = useRef<HTMLDivElement>(null as HTMLDivElement);
    const toggleActive = useCallback(() => {
        setIsActive(!isActive);
    }, [isActive]);

    useEffect(() => {
        TopProfileStore.initTheme();
        TopProfileStore.initNameAndSurname();
        TopProfileStore.initLang();
    }, []);
    useEffect(() => {
        if (block.current) {
            if (isActive) {
                block.current.className = styles.topProfile + " " + styles.active;
            } else {
                block.current.className = styles.topProfile;
            }
        }
    }, [isActive]);

    return (
        <div className={styles.topProfile} ref={block}>
            <div onClick={toggleActive} style={{display: 'flex', alignItems: 'center', justifyContent: TopProfileStore.name == "" || TopProfileStore.surname =="" ? "end" : 'space-between'}}>
                {TopProfileStore.name} {TopProfileStore.surname}
                <LazyAvatar size={30} borderRadius={"50%"} src={TopProfileStore.avatar} />
            </div>
            {isActive && <TopProfileMenu />}
        </div>
    );
});