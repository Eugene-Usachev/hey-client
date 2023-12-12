'use client';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './TopProfile.module.scss';
import {TopProfileStore} from "@/stores/TopProfileStore";
import {LazyAvatar} from "@/components/LazyAvatar/LazyAvatar";
import {TopProfileMenu} from "@/components/TopProfileMenu/TopProfileMenu";
import {refreshAll} from "@/requests/refresh";
import Link from "next/link";
import {api} from "@/app/[lang]/(pagesWithLayout)/profile/ProfileAPI";
import {UserAvatar} from "@/components/UserAvatar/UserAvatar";

interface TopProfileProps {
    topProfileDict: {
        SignIn: string,
    }
    topProfileMenuDict: {
        Mode: string,
        Dark: string,
        Light: string,
        ChooseALanguage: string,
        Exit: string
    }
}

export const TopProfile: FC<TopProfileProps> = observer(({topProfileDict, topProfileMenuDict}) => {

    const [isActive, setIsActive] = useState(false);
    const block = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
    const toggleActive = useCallback(() => {
        setIsActive(!isActive);
    }, [isActive]);

    useEffect(() => {
        TopProfileStore.initTheme();
        TopProfileStore.initLang();
        api.sender.refresh<number>(refreshAll).then((res) => {
            if (res === 200) {
                TopProfileStore.changeNameAndSurname(localStorage.getItem("name")!, localStorage.getItem("surname")!)
                TopProfileStore.changeAvatar(localStorage.getItem("avatar")!)
                TopProfileStore.setIsAuthorized(true);
            }
        })
            .finally(() => {
                TopProfileStore.setIsGet(true);
            })
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
        <>
            {TopProfileStore.isGet
                ? TopProfileStore.isAuthorized
                    ?
                        <div className={styles.topProfile} ref={block}>
                            <div onClick={toggleActive} style={{display: 'flex', alignItems: 'center', justifyContent: TopProfileStore.name == "" || TopProfileStore.surname =="" ? "end" : 'space-between'}}>
                                {TopProfileStore.name[0].toUpperCase()}{TopProfileStore.name.slice(1)} {TopProfileStore.surname[0].toUpperCase()}{TopProfileStore.surname.slice(1)}
                                <UserAvatar size={30} borderRadius={"50%"}
                                            user={{avatar: (TopProfileStore.avatar ? TopProfileStore.avatar : ""), isOnline: true}} />
                            </div>
                            {isActive && <TopProfileMenu dictionary={topProfileMenuDict}/>}
                        </div>
                    :   <Link className={styles.anAuthButton} href={"/registration"}>{topProfileDict.SignIn}</Link>
                : <div className={styles.topProfile} ref={block}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '200px'}}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '160px'}}>
                            <div className={"skeleton"} style={{borderRadius: '10px', height: '18px', width: '95px'}}></div>
                            <div className={"skeleton"} style={{borderRadius: '10px', height: '18px', width: '60px'}}></div>
                        </div>
                        <div className={"skeleton"} style={{borderRadius: '50%', height: '30px', width: '30px'}}></div>
                    </div>
                </div>
            }
        </>
    );
});