import React, {CSSProperties, FC, memo, MouseEventHandler, useCallback, useMemo, useRef, useState} from 'react';
import styles from './Input.module.scss';
import {checkStringForValid, checkValidCodes} from "@/utils/checkString";
import {BiHide, BiShow} from "react-icons/bi";
import {RxCross1} from "react-icons/rx";

export type InputType = 'default' | 'password' | 'cross' | 'linked';
export type regType = 'eng_and_rus' | 'all' | 'eng' | 'only_numbers' | RegExp;

export interface InputDict {
    TheFieldIsIncomplete: string;
    ThisFieldMustNotBeEmpty: string;
}

interface Props extends React.HTMLAttributes<HTMLInputElement>{
    dict: InputDict;

    placeholder?: string;
    withLabel?: boolean;
    checkSpace: boolean;
    maxLength: number;
    minLength: number;
    blockStyle?: React.CSSProperties;
    type: InputType;
    isActive?: boolean;
    startValue?: string;
    style?: React.CSSProperties;
    className?: string;
    reg?: regType;
    onChangeValue?: (currentValue: string) => void;
    onBlur?: (e: React.FocusEvent) => void;
    onFocus?: (e: React.FocusEvent) => void;
    onEnter?: (currentValue: string) => boolean;

    // for 'cross'
    defaultValue?: string;
    // for 'linked' and 'close' and 'password'
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Input:FC<Props> = memo<Props>(({
            dict,
            placeholder = '',
            withLabel = true,
            checkSpace = true,
            maxLength,
            minLength = -1,
            blockStyle,
            type = 'default',
            isActive = true,
            startValue = '',
            style= {} as CSSProperties,
            className,
            reg='all',
            onChangeValue,
            onBlur,
            onFocus,
            onEnter,
            defaultValue = '',
            onClick,
            onChange,
            ...restProps
        }) => {
    const [Value, setValue] = useState(startValue as string);
    const [hide, setHide] = useState(type === "password");
    const [focus, setFocus] = useState(false);
    const [error, setError] = useState<checkValidCodes>(checkValidCodes.ok);
    const inputRef = useRef(null) as React.MutableRefObject<HTMLInputElement>;
    const defaultValueError: checkValidCodes = useMemo(() => {
        if (!defaultValue) {
            return checkValidCodes.ok;
        }
        const checkResult = checkStringForValid(defaultValue, reg as regType, maxLength, minLength as number, checkSpace);
        return checkResult[1];
    }, [defaultValue])

    const getClassName = (): string => {
        let newClassName = styles.input;
        if (newClassName) {
            newClassName += ' ' + className;
        }
        if (isActive) {
            switch (error) {
                case checkValidCodes.ok:
                    break;
                case checkValidCodes.empty:
                    newClassName += ' ' + styles.error;
                    break;
                case checkValidCodes.tooShort:
                    newClassName += ' ' + styles.error;
                    break;
            }
        } else {
            newClassName += ' ' + styles.disable;
        }
        if (focus) {
            newClassName += ' ' + styles.active;
        }
        return newClassName
    };

    const onEventChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const checkResult = checkStringForValid(e.target.value, reg as regType, maxLength, minLength as number, checkSpace);
        setValue(checkResult[0]);
        if (error !== checkValidCodes.ok) {
            setError(checkResult[1]);
        }
        if (onChangeValue) {
            onChangeValue(checkResult[0]);
        }
        if (onChange) {
            onChange(e as React.ChangeEvent<HTMLInputElement>)
        }
    }, [error, reg, maxLength, minLength, checkSpace, onChange, onChangeValue]);
    const onKeyUpEvent = useCallback((e: KeyboardEvent) => {
        if ( (e.key === 'Enter' || e.keyCode === 13) && onEnter != undefined) {
            if (onEnter(Value)) {
                setValue('');
                inputRef.current.blur();
            }
        }
    }, []);
    const onBlurEvent = useCallback((e: React.FocusEvent) => {
        setFocus(false);
        if (Value.length < minLength) {
            if (Value.length === 0) {
                setError(checkValidCodes.empty);
            } else {
                setError(checkValidCodes.tooShort);
            }
        } else {
            if (error !== checkValidCodes.ok) {
                setError(checkValidCodes.ok);
            }
        }
        if (onBlur != undefined) {
            onBlur(e);
        }
    }, [Value, error]);
    const onFocusEvent = useCallback((e: React.FocusEvent) => {
        setFocus(true);
        if (onFocus != undefined) {
            onFocus(e);
        }
    }, []);

    const doShow = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setHide(false);
        if (onClick) {
            onClick(e);
        }
    }, []);
    const doHide = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        setHide(true);
        if (onClick) {
            onClick(e);
        }
        if (onChange) {
            onChange(e as React.ChangeEvent<HTMLInputElement>)
        }
    }, []);

    const clear = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!defaultValue) {
            throw new Error("defaultValue is undefined")
        }
        e.stopPropagation();
        e.preventDefault();
        if (onClick) {
            onClick(e);
        }
        setValue(defaultValue);
        if (onChangeValue) {
            onChangeValue(defaultValue)
        }
        setError(defaultValueError)
        if (onChange) {
            onChange(e as React.ChangeEvent<HTMLInputElement>)
        }
    }, []);

    switch (type) {
        case "password":
            return (
                <div className={styles.inputBlock} style={blockStyle}>
                    {error !== checkValidCodes.ok && isActive
                        ? error ==checkValidCodes.empty
                            ? <div className={styles.errorText}>{dict.ThisFieldMustNotBeEmpty}</div>
                            : error == checkValidCodes.tooShort
                                ? <div className={styles.errorText}>{dict.TheFieldIsIncomplete + " " + minLength}</div>
                                : <></>
                        : Value.length > 0 && withLabel
                            ? <div className={styles.label}>{placeholder}</div>
                            : <></>
                    }
                    <div style={{display: 'grid'}}>
                        <input
                            disabled={!isActive}
                            placeholder={placeholder as string}
                            ref={inputRef}
                            type={hide ? "password" : "text"}
                            onFocus={onFocusEvent}
                            onBlur={onBlurEvent}
                            onKeyUp={onKeyUpEvent as React.KeyboardEventHandler}
                            style={style}
                            className={getClassName()}
                            value={Value}
                            onChange={onEventChange}
                            {...restProps}
                        />
                        <div className={styles.inputPasswordBlock}>
                            {hide
                                ? <div style={{height: '20px'}} onClick={doShow}><BiShow/></div>
                                : <div style={{height: '20px'}} onClick={doHide}><BiHide/></div>
                            }
                        </div>
                    </div>
                </div>
            )
        case "cross":
            const realStyle = style ? {...style, paddingRight: '25px', width: 'calc(100% - 35px)'} : {paddingRight: '25px', width: 'calc(100% - 35px)'};
            return (
                <div className={styles.inputBlock} style={blockStyle}>
                    {error !== checkValidCodes.ok && isActive
                        ? error ==checkValidCodes.empty
                            ? <div className={styles.errorText}>{dict.ThisFieldMustNotBeEmpty}</div>
                            : error == checkValidCodes.tooShort
                                ? <div className={styles.errorText}>{dict.TheFieldIsIncomplete + " " + minLength}</div>
                                : <></>
                        : Value.length > 0 && withLabel
                            ? <div className={styles.label}>{placeholder}</div>
                            : <></>
                    }
                    <div className={styles.inputCrossBlock} onClick={clear}>
                        <RxCross1/>
                    </div>
                    <input
                        disabled={!isActive}
                        placeholder={placeholder as string}
                        ref={inputRef}
                        type={"text"}
                        onFocus={onFocusEvent}
                        onBlur={onBlurEvent}
                        onKeyUp={onKeyUpEvent as React.KeyboardEventHandler}
                        style={realStyle}
                        className={getClassName()}
                        value={Value}
                        onChange={onEventChange}
                        {...restProps}
                    />
                </div>
            )
        case "linked":
            return (
                <div className={styles.inputBlock} style={blockStyle}>
                    {error !== checkValidCodes.ok && isActive
                        ? error ==checkValidCodes.empty
                            ? <div className={styles.errorText}>{dict.ThisFieldMustNotBeEmpty}</div>
                            : error == checkValidCodes.tooShort
                                ? <div className={styles.errorText}>{dict.TheFieldIsIncomplete + " " + minLength}</div>
                                : <></>
                        : Value.length > 0 && withLabel
                            ? <div className={styles.label}>{placeholder}</div>
                            : <></>
                    }
                    <div style={{display: 'flex'}}>
                        <div className={styles.linkedBlock} onClick={onClick as MouseEventHandler<HTMLDivElement>}>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',
                                width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#fff'}}>
                                {isActive ? <div className={styles.circle}></div> : <></>}
                            </div>
                        </div>
                        <input
                            placeholder={placeholder as string}
                            ref={inputRef}
                            type={"text"}
                            disabled={!isActive}
                            onFocus={onFocusEvent}
                            onBlur={onBlurEvent}
                            onKeyUp={onKeyUpEvent as React.KeyboardEventHandler}
                            style={style ? {borderRadius:" 0 6px 6px 0",...style} : {borderRadius:" 0 6px 6px 0"}}
                            className={getClassName()}
                            value={Value}
                            onChange={onEventChange}
                            {...restProps}
                        />
                    </div>
                </div>
            )
        default:
            return (
                <div className={styles.inputBlock} style={blockStyle}>
                    {error !== checkValidCodes.ok && isActive
                        ? error ==checkValidCodes.empty
                            ? <div className={styles.errorText}>{dict.ThisFieldMustNotBeEmpty}</div>
                            : error == checkValidCodes.tooShort
                                ? <div className={styles.errorText}>{dict.TheFieldIsIncomplete + " " + minLength}</div>
                                : <></>
                        : Value.length > 0 && withLabel
                            ? <div className={styles.label}>{placeholder}</div>
                            : <></>
                    }
                    <input
                        disabled={!isActive}
                        placeholder={placeholder as string}
                        ref={inputRef}
                        onFocus={onFocusEvent}
                        onBlur={onBlurEvent}
                        onKeyUp={onKeyUpEvent as React.KeyboardEventHandler}
                        style={style ? style as CSSProperties : {}}
                        className={getClassName()}
                        value={Value}
                        onChange={onEventChange}
                        {...restProps}
                    />
                </div>
            )
    }
});