"use client";
import React, {FC, useCallback} from 'react';
import {observer} from "mobx-react-lite";
import styles from './UserLine.module.scss';
import {FriendStatus} from "@/stores/ProfileStore";
import Link from "next/link";
import {getHREF} from "@/utils/getHREF";
import {FriendsStore, FriendUser} from "@/stores/FriendsStore";
import {USERID} from "@/app/config";
import { UserAvatar } from '@/components/UserAvatar/UserAvatar';

export interface UserLineDict {
    SendFriendshipRequest: string,
    CancelFriendshipRequest: string,
    AddToFriends: string,
    DeleteFromFriends: string,
}

interface UserLineProps {
    dict: UserLineDict;

    user: FriendUser;
}

export const UserLine:FC<UserLineProps> = observer<UserLineProps>(({
    dict, user
}) => {
    const {name, surname, id, friendStatus, isClientSub} = user;
    const SendFriendshipRequest = useCallback(() => {
        FriendsStore.changeFriendStatus(id, FriendStatus.idol);
    }, [id]);

    const CancelFriendshipRequest = useCallback(() => {
        FriendsStore.changeFriendStatus(id, FriendStatus.nobody);
    }, [id]);

    const AddToFriends = useCallback(() => {
        FriendsStore.changeFriendStatus(id, FriendStatus.friend);
    }, [id]);

    const DeleteFromFriends = useCallback(() => {
        FriendsStore.changeFriendStatus(id, FriendStatus.subscriber);
    }, [id]);

    return (
        <div className={styles.userLine}>
            <Link href={getHREF(`profile/${id}`)} style={{marginRight: '10px'}}>
                <UserAvatar user={user} size={64} borderRadius={"50%"}/>
            </Link>
            <div className={styles.rightPart}>
                <Link href={getHREF(`profile/${id}`)} className={styles.nameAndSurnameBlock}>
                    {name} {surname}
                </Link>
                <div>
                    {!USERID || (+USERID !== id) &&
                        <>
                            {friendStatus === FriendStatus.nobody &&
                                <div className={styles.button} onClick={SendFriendshipRequest}>{dict.SendFriendshipRequest}</div>
                            }
                            {friendStatus === FriendStatus.subscriber &&
                                <div className={styles.button} onClick={AddToFriends}>{dict.AddToFriends}</div>
                            }
                            {friendStatus === FriendStatus.idol &&
                                <div className={styles.button} onClick={CancelFriendshipRequest}>{dict.CancelFriendshipRequest}</div>
                            }
                            {friendStatus === FriendStatus.friend &&
                                <div className={styles.button} onClick={DeleteFromFriends}>{dict.DeleteFromFriends}</div>
                            }
                        </>
                    }
                </div>
            </div>
        </div>
    );
});