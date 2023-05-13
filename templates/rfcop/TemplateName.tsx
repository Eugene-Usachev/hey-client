import React, {FC} from 'react';
import {observer} from "mobx-react-lite";
import styles from './TemplateName.module.scss';

interface Props {

}

export const TemplateName:FC = observer<Props>(() => {

    return (
        <div className={styles.templateName}>

        </div>
    );
});