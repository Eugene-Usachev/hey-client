'use client';
import React, { FC, useState, useRef, useEffect, useCallback} from 'react';
import styles from './UserAvatar.module.scss';
import {STATIC_USERS} from "@/app/config";
import {MiniUser} from "@/stores/MiniUsersStore";
import Image from "next/image";
import {observer} from "mobx-react-lite";

interface Props {
    user: MiniUser | {
        id: number;
        avatar: string;
        isOnline: boolean;
    };
    size: number;
    borderRadius: string;
    style?: React.CSSProperties;
}

export const UserAvatar:FC<Props> = observer<Props>(({user, size, borderRadius= 50, style}) => {

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
    }, [img.current, user.avatar]);

    return (
        <div style={{width: `${size}px`, height: `${size}px`, borderRadius: borderRadius, ...style}} className={styles.userAvatar + (!isShowing ? " skeleton" : "")}>
            {user.avatar != undefined && <Image
                priority={false}
                fetchPriority={"low"}
                onLoad={Show} ref={img}
                style={{borderRadius: borderRadius, opacity: isShowing ? "1" :'0'}}
                className={styles.userAvatar + " " + (user.isOnline ? styles.online : "")}
                    src={user.avatar == "" ? `/images/NULL.png` : `${STATIC_USERS}/${user.id}/Image/${user.avatar}` }
                alt={""}
                width={size}
                height={size}
            />}
        </div>
    );
});