'use client';
import React, {memo, FC, useState, useRef, useEffect, useCallback} from 'react';
import styles from './LazyAvatar.module.scss';
import {STATIC_USERS} from "@/app/config";
import Image from "next/image";

interface Props {
    src: string | undefined;
    size: number;
    borderRadius: string;
    style?: React.CSSProperties;
}

export const LazyAvatar:FC<Props> = memo<Props>(({src, size, borderRadius= 50, style}) => {

    const [isShowing, setIsShowing] = useState(false);
    const img = useRef<HTMLImageElement>(null as unknown as HTMLImageElement);
    const Show = useCallback(() => {
        setIsShowing(true);
    }, []);

    useEffect(() => {
        if (img.current) {
            img.current.complete && Show();
            img.current.onload = () => {
                Show()
            }
        }
    }, [img.current, src]);

    return (
        <div style={{width: `${size}px`, height: `${size}px`, borderRadius: borderRadius, ...style}} className={styles.lazyAvatar + (!isShowing ? " skeleton" : "")}>
            {src != undefined && <Image onLoad={Show} priority={false} ref={img} style={{borderRadius: borderRadius, opacity: isShowing ? "1" :'0'}} className={styles.lazyAvatar}
                    src={src == "" ? `${STATIC_USERS}/NULL.png` : STATIC_USERS + src } alt={""} width={size} height={size}/>}
        </div>
    );
});