import React, {memo, FC} from 'react';
import styles from './Cross.module.scss';

interface Props {
    close: () => void;
    style?: React.CSSProperties;
    size: number;
}

export const Cross:FC = memo<Props>(({ close, style , size=20}) => {

    return (
        <div className={styles.cross} style={style ? {width: size, height: size, ...style} : {width: size, height: size}} onClick={close}>
            <svg data-icon="cross" width={size} height={size} viewBox="0 0 16 16" role="img">
                <path d="M9.41 8l3.29-3.29c.19-.18.3-.43.3-.71a1.003 1.003 0 00-1.71-.71L8 6.59l-3.29-3.3a1.003 1.003 0 00-1.42 1.42L6.59 8 3.3 11.29c-.19.18-.3.43-.3.71a1.003 1.003 0 001.71.71L8 9.41l3.29 3.29c.18.19.43.3.71.3a1.003 1.003 0 00.71-1.71L9.41 8z" fillRule="evenodd"></path>
            </svg>
        </div>
    );
});