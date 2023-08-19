import React, {memo, FC} from 'react';
import styles from './TemplateName.module.scss';

interface TemplateNameProps {

}

export const TemplateName:FC<TemplateNameProps> = memo<TemplateNameProps>(() => {

    return (
        <div className={styles.templateName}>

        </div>
    );
});