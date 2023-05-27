import React, {FC, useCallback, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './TopProfileMenu.module.scss';
import {getTextForLanguage} from "@/utils/getTextForLanguage";
import {TopProfileStore} from "@/stores/TopProfileStore";
import {BsFillMoonFill, BsFillSunFill} from "react-icons/bs";
import {MdLanguage} from "react-icons/md";
import {RxExit} from "react-icons/rx";
import {useRouter} from "next/navigation";

export const TopProfileMenu: FC = observer(() => {
    const router = useRouter();
    const [isChoosingLanguage, setIsChoosingLanguage] = useState(false);
    const toggleTheme = useCallback(() => {
        if (TopProfileStore.theme === "dark") {
            TopProfileStore.changeTheme("light");
        } else {
            TopProfileStore.changeTheme("dark");
        }
    }, [TopProfileStore.theme]);
    const chooseLang = useCallback((lang: "ru" | "eng") => {
       TopProfileStore.changeLang(lang);
    }, [TopProfileStore.lang]);
    const toggleIsChoosingLanguage = useCallback(() => {
        setIsChoosingLanguage(!isChoosingLanguage);
    }, [isChoosingLanguage]);
    const logout = useCallback(() => {
        localStorage.removeItem("id");
        localStorage.removeItem("email");
        localStorage.removeItem("login");
        localStorage.removeItem("name");
        localStorage.removeItem("surname");
        localStorage.removeItem("avatar");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.push("/registration")
    }, []);

    return (
        <div className={styles.topProfileMenuBlock}>
            <div className={styles.topProfileMenu}>
                <div className={styles.line} onClick={toggleTheme}>
                    {getTextForLanguage(`Mode: ${TopProfileStore.theme === "dark" ? "Dark" : "Light"}`, `Тема: ${TopProfileStore.theme === "dark" ? "Тёмная" : "Светлая"}`)}
                    {TopProfileStore.theme === "dark"
                        ? <BsFillSunFill />
                        : <BsFillMoonFill/>
                    }
                </div>
                <div className={styles.line} onClick={toggleIsChoosingLanguage} style={{position: 'relative'}}>
                    {getTextForLanguage(`Choose a language`, `Выбрать язык`)}
                    <MdLanguage />
                    {isChoosingLanguage &&
                        <div className={styles.languageSelectionMenu}>
                            <div onClick={() => {chooseLang("eng")}} style={{borderRadius: "8px 8px 0 0", borderBottom: 'solid 1px var(--colors-hover)'}}>English</div>
                            <div onClick={() => {chooseLang("ru")}} style={{borderRadius: "0 0 8px 8px"}}>Русский</div>
                        </div>
                    }
                </div>
                <div className={styles.line + " " + styles.exit} onClick={logout}>
                    {getTextForLanguage("Exit", "Выйти")}
                    <RxExit />
                </div>
            </div>
        </div>
    );
});