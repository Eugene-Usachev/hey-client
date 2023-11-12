"use client";
import React, {FC, useCallback, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './Header.module.scss';
import {FriendsStore, OpenListStatus} from "@/stores/FriendsStore";
import {USERID} from "@/app/config";

export interface HeaderDict {
    Subscribers: string,
    Friends: string,
    MutualFriends: string,
}

interface HeaderProps {
    dict: HeaderDict;
}

const formatNumber = (num: number): string => {
    if (num < 100) return num.toString();
    if (num < 1001) return "99+";
    let number = num / 1000;
    return `${number.toFixed(1)}k+`;
}

export const Header:FC<HeaderProps> = observer<HeaderProps>(({dict}) => {

    const [numberOfFriend, setNumberOfFriend] = useState(0);
    const [numberOfSubscribers, setNumberOfSubscribers] = useState(0);
    const [numberOfMutualFriend, setNumberOfMutualFriend] = useState(0);
    const [isClientAndUserTheSame, setIsClientAndUserTheSame] = useState(false);

    const openFriends = useCallback(() => {
        FriendsStore.setOpenListStatus(OpenListStatus.Friends);
    }, []);

    const openSubscribers = useCallback(() => {
        FriendsStore.setOpenListStatus(OpenListStatus.Subscribers);
    }, []);

    const openMutualFriends = useCallback(() => {
        FriendsStore.setOpenListStatus(OpenListStatus.MutualFriends);
    }, []);

    useEffect(() => {
        setNumberOfFriend(FriendsStore.theUser.friends.length);
        setNumberOfSubscribers(FriendsStore.theUser.subscribers.length);
        setNumberOfMutualFriend(FriendsStore.mutualFriendsList.length);
    }, [FriendsStore.theUser.friends.length, FriendsStore.theUser.subscribers.length, FriendsStore.mutualFriendsList.length]);

    useEffect(() => {
        if (!USERID || isNaN(+USERID) || +USERID < 1) {
            setIsClientAndUserTheSame(false);
            return;
        }
        setIsClientAndUserTheSame(+USERID == FriendsStore.theUser.id);
    }, [FriendsStore.theUser.id]);

    return (
        <div className={styles.header}>
            <div className={`${styles.button} ${FriendsStore.openListStatus === OpenListStatus.Friends ? styles.active : ""}`}
                onClick={openFriends}>{dict.Friends} {formatNumber(numberOfFriend)}</div>
            <div className={`${styles.button} ${FriendsStore.openListStatus === OpenListStatus.Subscribers ? styles.active : ""}`}
                onClick={openSubscribers}>{dict.Subscribers} {formatNumber(numberOfSubscribers)}</div>
            {!isClientAndUserTheSame &&
                <div className={`${styles.button} ${FriendsStore.openListStatus === OpenListStatus.MutualFriends ? styles.active : ""}`}
                    onClick={openMutualFriends}>{dict.MutualFriends} {formatNumber(numberOfMutualFriend)}</div>
            }
        </div>
    );
});