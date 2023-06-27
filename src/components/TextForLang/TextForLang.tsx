"use client";
import React, {memo, FC} from 'react';
import styles from './TextForLang.module.scss';
import {observer} from "mobx-react-lite";
import {getTextForLanguage, getTextForLanguageWithoutStore} from "@/utils/getTextForLanguage";
import {TopProfileStore} from "@/stores/TopProfileStore";

interface Props {
    eng: string;
    ru: string;
    style?: React.CSSProperties
    className?: string
}

export const TextForLangWithoutStore:FC<Props> = memo<Props>(({eng, ru, style, className}) => {

    return (
        <div className={styles.textForLang + className ? " " + className : ""} style={style}>
            {getTextForLanguageWithoutStore(eng, ru)}
        </div>
    );
});

export const TextForLang:FC<Props> = observer<Props>(({eng, ru, style, className}) => {

    return (
        <div className={styles.textForLang + className ? " " + className : ""} style={style}>
            {TopProfileStore.lang === "eng" ? eng : ru}
        </div>
    );
});