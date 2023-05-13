import React, {memo, FC} from 'react';
import styles from './ModalWindow.module.scss';

interface Props {
    // children must have zIndex property more than 999
    children: React.ReactNode;
    close: () => void;
    style: React.CSSProperties
}

export const ModalWindow:FC = memo<Props>(({children, close, style}) => {

    return (
        <div className={styles.modalWindow} onClick={close} style={style}>
            {children}
        </div>
    );
});