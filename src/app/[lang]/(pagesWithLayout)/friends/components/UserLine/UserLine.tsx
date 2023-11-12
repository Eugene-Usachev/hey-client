"use client";
import React, {FC, useCallback} from 'react';
import {observer} from "mobx-react-lite";
import styles from './UserLine.module.scss';
import {FriendStatus} from "@/stores/ProfileStore";
import {LazyAvatar} from "@/components/LazyAvatar/LazyAvatar";
import Link from "next/link";
import {getHREF} from "@/utils/getHREF";
import {FriendsStore} from "@/stores/FriendsStore";
import {USERID} from "@/app/config";

export interface UserLineDict {
    SendFriendshipRequest: string,
    CancelFriendshipRequest: string,
    AddToFriends: string,
    DeleteFromFriends: string,
}

interface UserLineProps {
    dict: UserLineDict;

    name: string;
    surname: string;
    id: number;
    avatar: string;
    isClientSub: boolean;
    friendStatus: FriendStatus;
    isOnline: boolean;
}

export const UserLine:FC<UserLineProps> = observer<UserLineProps>(({
    dict, friendStatus, isClientSub, isOnline, name, surname, avatar, id
}) => {

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
                <LazyAvatar src={avatar === "" ? "/NULL.png" :`/${id}/Image/${avatar}`} size={64} borderRadius={"50%"}/>
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