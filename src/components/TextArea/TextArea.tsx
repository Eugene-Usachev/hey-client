"use client";
import React, {memo, FC, CSSProperties, useEffect, useRef, useCallback, useState, forwardRef, LegacyRef} from 'react';
import styles from './TextArea.module.scss';
import {regType} from "@/components/Input/Input";
import {deleteExtraSpaces} from "@/utils/checkString";

interface TextAreaProps {
    className: string;
    style: CSSProperties;

    placeholder: string;
    startValue: string;

    reg: regType;
    maxLength: number;
    checkSpace: boolean;

    isActive: boolean;
}

export const TextArea = forwardRef<HTMLDivElement | null, TextAreaProps>(({isActive, reg,
                                                                placeholder, style, startValue,
                                                                className, maxLength, checkSpace}, ref) => {
    const [isEmpty, setIsEmpty] = useState(startValue.length === 0);
    const onChange = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        // @ts-ignore
        let newValue = e.target?.textContent;
        if (checkSpace) {
            newValue = deleteExtraSpaces(newValue);
        }
        if (newValue.length > maxLength) {
            newValue = newValue.slice(0, maxLength);
        }
        if (reg !== 'all') {
            switch (reg) {
                case'eng': {
                    newValue = newValue.replace(/[^A-Za-z\d\s]+/g, '');
                    break;
                }
                case "number": {
                    newValue = newValue.replace(/[^\d\s]+/g, '');
                    break;
                }
                case "strictNumber": {
                    newValue = newValue.replace(/\D/g, '');
                    break;
                }
                case "eng_AND_rus": {
                    newValue = newValue.replace(/[^A-Za-zа-яА-Я\d\s]+/g, '');
                    break;
                }
                default: {
                    if (reg) {
                        newValue = newValue.replace(reg, '');
                    }
                }
            }
        }

        if (newValue.length === 0 && !isEmpty) {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
        }
    }, [reg, maxLength, checkSpace]);

    useEffect(() => {
        if (isActive) {
            // @ts-ignore
            ref.current?.focus();
            setIsEmpty(false);
        } else {
            // @ts-ignore
            if (ref.current.textContent === "") {
                setIsEmpty(true);
            }
        }
    }, [isActive]);

    return (
        <div className={styles.textArea + " " + className} ref={ref as LegacyRef<HTMLDivElement>}
             style={style as CSSProperties} contentEditable={isActive} suppressContentEditableWarning={true}
             onKeyDown={onChange}>
            {isEmpty ? <div className={styles.placeholder}>{placeholder}</div> : ""}
        </div>
    );
});