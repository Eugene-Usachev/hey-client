"use client";
import React, {memo, FC, useMemo, useState, useCallback} from 'react';
import styles from './Select.module.scss';

interface Props {
    options: string[];

    placeholder?: string;
    withLabel?: boolean;
    blockStyle?: React.CSSProperties;
    isActive?: boolean;
    // 0 if not selected
    value?: number | 0;
    style?: React.CSSProperties;
    className?: string;

    onChangeValue: (currentValue: number) => void;
    onBlur?: (e: React.FocusEvent) => void;
    onFocus?: (e: React.FocusEvent) => void;
    onEnter?: (currentValue: string) => boolean;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Select:FC<Props> = memo<Props>(({
    options, placeholder, withLabel, blockStyle, isActive, value,
    style, className, onChangeValue, onBlur, onFocus, onEnter, onClick
                                             }) => {
    const [isOpen, setIsOpen] = useState(false);
    const chooseValue = useCallback((e: React.MouseEvent<HTMLDivElement>, value: number) => {
        onChangeValue && onChangeValue(value);
        if (onClick) {
            onClick(e);
        }
    }, [options])

    const toggleIsOpen = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    return (
        <div style={blockStyle} className={styles.block} onClick={toggleIsOpen}>
            {value !== 0 && withLabel && <div className={styles.label}>{placeholder}</div>}
            <div className={value === 0 ? styles.select + " " + styles.placeholder : styles.select}>
                {value === 0 ? placeholder : options[value]}
                <svg className={isOpen ? styles.triangle + " " + styles.open : styles.triangle} viewBox="0 0 10 10"><polygon points="0,8.66 5,1.34 10,8.66" /></svg>
            </div>
            {isOpen &&
                <div className={styles.linesBlock}>
                    {
                        options.map((value, index) => {
                            return <div key={index} style={style} className={styles.line} onClick={(e) => chooseValue(e, index)}>{value}</div>
                        })
                    }
                </div>
            }
        </div>
    );
});