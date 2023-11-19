import React, {FC, memo} from 'react';
import styles from './MainPart.module.scss';
import {ChatsBlock} from "@/app/[lang]/(pagesWithLayout)/messenger/components/ChatsBlock/ChatsBlock";

export const MainPart: FC = memo(() => {

    return (
        <div className={styles.mainPart}>
            <ChatsBlock />
        </div>
    );
});