import React, {
    CSSProperties,
    FC,
    memo,
    MouseEventHandler,
    useCallback,
    useMemo,
    useRef,
    useState
} from 'react';
import styles from './Input.module.scss';
import {checkStringForValid, checkValidCodes} from "@/utils/checkString";
import {BiHide, BiShow} from "react-icons/bi";
import {RxCross1} from "react-icons/rx";
import {AiOutlineEnter} from "react-icons/ai";

export type InputType = 'default' | 'password' | 'cross' | 'linked' | "send" | "button";
export type regType = 'eng_and_rus' | 'all' | 'eng' | 'only_numbers' | RegExp;

export interface InputDict {
    TheFieldIsIncomplete: string;
    ThisFieldMustNotBeEmpty: string;
}

interface Props extends React.HTMLAttributes<HTMLInputElement>{
    dict: InputDict;

    inputClass?: string;
    blockClass?: string;
    placeholder?: string;
    withLabel?: boolean;
    checkSpace?: boolean;
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
    error?: string;
    buttonText?: string;
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
            inputClass,
            blockClass,
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
            error = "",
            buttonText,
            ...restProps
        }) => {
    const [Value, setValue] = useState(startValue as string);
    const [hide, setHide] = useState(type === "password");
    const [focus, setFocus] = useState(false);
    const [innerError, setInnerError] = useState<checkValidCodes>(checkValidCodes.ok);
    const inputRef = useRef(null) as unknown as React.MutableRefObject<HTMLInputElement>;
    const defaultValueError: checkValidCodes = useMemo(() => {
        if (!defaultValue) {
            return checkValidCodes.ok;
        }
        const checkResult = checkStringForValid(defaultValue, reg as regType, maxLength, minLength as number, checkSpace);
        return checkResult[1];
    }, [defaultValue, reg, maxLength, minLength, checkSpace])

    const getClassName = (): string => {
        let newClassName = styles.input;
        if (newClassName) {
            newClassName += ' ' + className;
        }
        if (inputClass) {
            newClassName += ' ' + inputClass;
        }
        if (isActive) {
            if (error != "") {
                newClassName += ' ' + styles.error;
            } else {
                switch (innerError) {
                    case checkValidCodes.ok:
                        break;
                    case checkValidCodes.empty:
                        newClassName += ' ' + styles.error;
                        break;
                    case checkValidCodes.tooShort:
                        newClassName += ' ' + styles.error;
                        break;
                }
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
        const checkResult = checkStringForValid(e.target.value, reg as regType, maxLength, minLength, checkSpace);
        setValue(checkResult[0]);
        if (innerError !== checkValidCodes.ok) {
            setInnerError(checkResult[1]);
        }
        if (onChangeValue) {
            onChangeValue(checkResult[0]);
        }
        if (onChange) {
            onChange(e as React.ChangeEvent<HTMLInputElement>)
        }
    }, [innerError, reg, maxLength, minLength, checkSpace, onChange]);
    const onKeyUpEvent = useCallback((e: KeyboardEvent) => {
        if ( (e.key === 'Enter' || e.keyCode === 13) && onEnter != undefined) {
            if (onEnter(Value)) {
                setValue('');
                inputRef.current.blur();
            }
        }
    }, [onEnter, Value]);
    const onBlurEvent = useCallback((e: React.FocusEvent) => {
        setFocus(false);
        if (Value.length < minLength) {
            if (Value.length === 0) {
                setInnerError(checkValidCodes.empty);
            } else {
                setInnerError(checkValidCodes.tooShort);
            }
        } else {
            if (innerError !== checkValidCodes.ok) {
                setInnerError(checkValidCodes.ok);
            }
        }
        if (onBlur != undefined) {
            onBlur(e);
        }
    }, [innerError, Value.length, minLength, onBlur]);
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
    }, [onClick]);
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
    }, [onClick, onChange]);

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
        setInnerError(defaultValueError)
        if (onChange) {
            onChange(e as React.ChangeEvent<HTMLInputElement>)
        }
    }, [defaultValue, onClick, onChange]);

    switch (type) {
        case "send":
            const realStyleSend = style ? {...style, paddingRight: '25px', width: 'calc(100% - 35px)'} : {paddingRight: '25px', width: 'calc(100% - 35px)'};
            return (
                <div className={`${styles.inputBlock} ${blockClass}`} style={blockStyle}>
                    {error != ""
                        ? <div className={styles.errorText}>{error}</div>
                        : innerError !== checkValidCodes.ok && isActive
                            ? innerError ==checkValidCodes.empty
                                ? <div className={styles.errorText}>{dict.ThisFieldMustNotBeEmpty}</div>
                                : innerError == checkValidCodes.tooShort
                                    ? <div className={styles.errorText}>{dict.TheFieldIsIncomplete + " " + minLength}</div>
                                    : <></>
                            : Value.length > 0 && withLabel
                                ? <div className={styles.label}>{placeholder}</div>
                                : <></>
                    }
                    <div className={styles.inputCrossBlock} onClick={() => {
                        if (onEnter!(Value)) {
                            setValue('');
                            inputRef.current.blur();
                        }
                    }}>
                        <AiOutlineEnter/>
                    </div>
                    <input
                        disabled={!isActive}
                        placeholder={placeholder as string}
                        ref={inputRef}
                        type={"text"}
                        onFocus={onFocusEvent}
                        onBlur={onBlurEvent}
                        onKeyUp={onKeyUpEvent as React.KeyboardEventHandler}
                        style={realStyleSend}
                        className={getClassName()}
                        value={Value}
                        onChange={onEventChange}
                        {...restProps}
                    />
                </div>
            )
        case "password":
            return (
                <div className={`${styles.inputBlock} ${blockClass}`} style={blockStyle}>
                    {error != ""
                        ? <div className={styles.errorText}>{error}</div>
                        : innerError !== checkValidCodes.ok && isActive
                            ? innerError ==checkValidCodes.empty
                                ? <div className={styles.errorText}>{dict.ThisFieldMustNotBeEmpty}</div>
                                : innerError == checkValidCodes.tooShort
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
                <div className={`${styles.inputBlock} ${blockClass}`} style={blockStyle}>
                    {error != ""
                        ? <div className={styles.errorText}>{error}</div>
                        : innerError !== checkValidCodes.ok && isActive
                            ? innerError ==checkValidCodes.empty
                                ? <div className={styles.errorText}>{dict.ThisFieldMustNotBeEmpty}</div>
                                : innerError == checkValidCodes.tooShort
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
                <div className={`${styles.inputBlock} ${blockClass}`} style={blockStyle}>
                    {error != ""
                        ? <div className={styles.errorText}>{error}</div>
                        : innerError !== checkValidCodes.ok && isActive
                            ? innerError ==checkValidCodes.empty
                                ? <div className={styles.errorText}>{dict.ThisFieldMustNotBeEmpty}</div>
                                : innerError == checkValidCodes.tooShort
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
        case "button": {
            const realStyle = style ? {...style, paddingRight: '25px', width: 'calc(100% - 35px)'} : {paddingRight: '25px', width: 'calc(100% - 35px)'};
            return (
                <div className={`${styles.inputBlock} ${blockClass}`} style={blockStyle}>
                    {error != ""
                        ? <div className={styles.errorText}>{error}</div>
                        : innerError !== checkValidCodes.ok && isActive
                            ? innerError ==checkValidCodes.empty
                                ? <div className={styles.errorText}>{dict.ThisFieldMustNotBeEmpty}</div>
                                : innerError == checkValidCodes.tooShort
                                    ? <div className={styles.errorText}>{dict.TheFieldIsIncomplete + " " + minLength}</div>
                                    : <></>
                            : Value.length > 0 && withLabel
                                ? <div className={styles.label}>{placeholder}</div>
                                : <></>
                    }
                    <div className={styles.button} onClick={onClick}>
                        {buttonText ? buttonText : <></>}
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
        }
        default:
            return (
                <div className={`${styles.inputBlock} ${blockClass}`} style={blockStyle}>
                    {error != ""
                        ? <div className={styles.errorText}>{error}</div>
                        : innerError !== checkValidCodes.ok && isActive
                            ? innerError ==checkValidCodes.empty
                                ? <div className={styles.errorText}>{dict.ThisFieldMustNotBeEmpty}</div>
                                : innerError == checkValidCodes.tooShort
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