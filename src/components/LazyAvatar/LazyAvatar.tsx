'use client';
import React, {memo, FC, useState, useRef, useEffect, useCallback} from 'react';
import styles from './LazyAvatar.module.scss';
import {STATIC} from "@/app/config";

interface Props {
    src: string | undefined;
    size: number;
    borderRadius: string;
    style?: React.CSSProperties;
}

export const LazyAvatar:FC = memo<Props>(({src, size, borderRadius= 50, style = {}}) => {

    const img = useRef<HTMLImageElement>(null as HTMLImageElement);
    const Show = useCallback(() => {
        if (img.current) img.current.style.display = 'block';
    }, [img.current]);

    useEffect(() => {
        if (img.current) {
            img.current.complete && Show();
            img.current.onload = () => {
                Show()
            }
        }
    }, [img.current]);

    return (
        <div style={{width: `${size}px`, height: `${size}px`, borderRadius: borderRadius, ...style}} className={styles.lazyAvatar + " skeleton"}>
            {src != undefined && <img onLoad={Show} ref={img} style={{borderRadius: borderRadius, display: 'none'}} className={styles.lazyAvatar} src={STATIC + src} alt={""} width={size} height={size}/>}
        </div>
    );
});