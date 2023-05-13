import React, {memo, FC, useState, useCallback} from 'react';
import styles from './Alerts.module.scss';
import {Cross} from "../Cross/Cross";

interface Props {
    text: string;
}

export const InfoAlertElem: FC = memo<Props>(({ text }) => {
    const [isExists, setIsExists] = useState(true);

    const remove = useCallback(() => {
        setIsExists(false);
    }, []);

    return (
        <>
            {isExists &&
                <div className={styles.alerts + " " + styles.infoAlert}>
                    {text}
                    <Cross close={remove}/>
                </div>
            }
        </>
    );
});