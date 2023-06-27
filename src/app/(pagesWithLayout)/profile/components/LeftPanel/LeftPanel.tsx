"use client";
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './LeftPanel.module.scss';
import {FriendStatus, ProfileStore} from "@/stores/ProfileStore";
import {USERID} from "@/app/config";
import {LazyAvatar} from "@/components/LazyAvatar/LazyAvatar";
import {TextForLang} from "@/components/TextForLang/TextForLang";
import {api} from "@/app/(pagesWithLayout)/profile/ProfileAPI";

export const LeftPanel: FC = observer(() => {

    const friendStatus = useMemo(() => {
        for (let i = 0; i < ProfileStore.friends.length; i++) {
            if (ProfileStore.friends[i] === USERID) {
                ProfileStore.changeFriendStatus(FriendStatus.friend)
                return FriendStatus.friend
            }
        }
        for (let i = 0; i <ProfileStore.subscribers.length; i++) {
            if (ProfileStore.subscribers[i] === USERID) {
                ProfileStore.changeFriendStatus(FriendStatus.idol)
                return FriendStatus.idol
            }
        }
        for (let i = 0; i < ProfileStore.mysubs.length; i++) {
            if (ProfileStore.mysubs[i] === ProfileStore.id) {
                ProfileStore.changeFriendStatus(FriendStatus.subscriber)
                return FriendStatus.subscriber
            }
        }
        ProfileStore.changeFriendStatus(FriendStatus.nobody)
        return FriendStatus.nobody
    }, [ProfileStore.friendStatus, ProfileStore.id, USERID]);

    const [isOwner, setIsOwner] = useState(USERID === ProfileStore.id);

    const subscribeCB = useCallback(() => {
        api.subscribe(ProfileStore.id).then((res) => {
            if (res.status === 204) {
                ProfileStore.changeFriendStatus(FriendStatus.idol)
            }
        })
    }, []);

    const unsubscribeCB = useCallback(() => {
        api.unsubscribe(ProfileStore.id).then((res) => {
            if (res.status === 204) {
                ProfileStore.changeFriendStatus(FriendStatus.nobody)
            }
        })
    }, []);

    const addFriendCB = useCallback(() => {
        api.addFriend(ProfileStore.id).then((res) => {
            if (res.status === 204) {
                ProfileStore.changeFriendStatus(FriendStatus.friend)
            }
        })
    }, []);

    const deleteFriendCB = useCallback(() => {
        api.deleteFriend(ProfileStore.id).then((res) => {
            if (res.status === 204) {
                ProfileStore.changeFriendStatus(FriendStatus.subscriber)
            }
        })
    }, []);

    useEffect(() => {
        if (USERID === ProfileStore.id) {
            setIsOwner(true)
        }
    }, []);
    
    return (
        <div className={styles.leftPanel}>
            <LazyAvatar size={130} borderRadius={"50%"} style={{marginBottom: '10px'}} src={ProfileStore.avatar === "" ? "" :`/${ProfileStore.id}/Image/${ProfileStore.avatar}`} />
            {isOwner
                ?
                    <div className={styles.button}>
                        <TextForLang eng={"Change profile"} ru={"Изменить профиль"} />
                    </div>
                : friendStatus === FriendStatus.friend
                    ?
                        <div className={styles.button} onClick={deleteFriendCB} style={{marginBottom: '10px'}}>
                            <TextForLang eng={"Remove from friends"} ru={"Удалить из друзей"} />
                        </div>
                    : friendStatus=== FriendStatus.idol
                        ?
                            <div className={styles.button} onClick={unsubscribeCB} style={{marginBottom: '10px'}}>
                                <TextForLang eng={"Cancel a friend request"} ru={"Отменить заявку в друзья"} />
                            </div>
                        : friendStatus === FriendStatus.subscriber
                            ?
                                <div className={styles.button} onClick={addFriendCB} style={{marginBottom: '10px'}}>
                                    <TextForLang eng={"Add to friends"} ru={"Добавить в друзья"} />
                                </div>
                            :
                                <div className={styles.button} onClick={subscribeCB} style={{marginBottom: '10px'}}>
                                    <TextForLang eng={"Send a friendship request"} ru={"Отправить запрос дружбы"} />
                                </div>
            }
            {!isOwner && <div className={styles.button}>
                <TextForLang eng={"Send a message"} ru={"Написать сообщение"} />
            </div>}
        </div>
    );
});