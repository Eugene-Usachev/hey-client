import React, {memo, FC} from 'react';
import styles from './TemplateName.module.scss';

interface Props {

}

export const TemplateName:FC = memo<Props>(() => {

    return (
        <div className={styles.templateName}>

        </div>
    );
});