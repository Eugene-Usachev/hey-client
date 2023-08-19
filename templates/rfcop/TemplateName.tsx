"use client";
import React, {FC} from 'react';
import {observer} from "mobx-react-lite";
import styles from './TemplateName.module.scss';

interface TemplateNameProps {

}

export const TemplateName:FC<TemplateNameProps> = observer<TemplateNameProps>(() => {

    return (
        <div className={styles.templateName}>

        </div>
    );
});