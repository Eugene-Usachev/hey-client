'use client';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './TopProfile.module.scss';
import {TopProfileStore} from "@/stores/TopProfileStore";
import {LazyAvatar} from "@/components/LazyAvatar/LazyAvatar";
import {TopProfileMenu} from "@/components/TopProfileMenu/TopProfileMenu";
import {refreshAll} from "@/requests/refresh";
import Link from "next/link";
import {getTextForLanguageWithoutStore} from "@/utils/getTextForLanguage";
import {api} from "@/app/(pagesWithLayout)/profile/ProfileAPI";

export const TopProfile: FC = observer(() => {

    const [isActive, setIsActive] = useState(false);
    const block = useRef<HTMLDivElement>(null as HTMLDivElement);
    const toggleActive = useCallback(() => {
        setIsActive(!isActive);
    }, [isActive]);

    useEffect(() => {
        TopProfileStore.initTheme();
        TopProfileStore.initLang();
        api.sender.refresh<number>(refreshAll).then((res) => {
            if (res === 200) {
                TopProfileStore.changeNameAndSurname(localStorage.getItem("name"), localStorage.getItem("surname"))
                TopProfileStore.changeAvatar(localStorage.getItem("avatar"))
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
                                {TopProfileStore.name} {TopProfileStore.surname}
                                <LazyAvatar size={30} borderRadius={"50%"} src={TopProfileStore.avatar} />
                            </div>
                            {isActive && <TopProfileMenu />}
                        </div>
                    :   <Link className={styles.anAuthButton} href={"/registration"}>{getTextForLanguageWithoutStore("Sign in", "Войти")}</Link>
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