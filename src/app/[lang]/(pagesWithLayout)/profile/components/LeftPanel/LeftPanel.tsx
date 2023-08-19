"use client";
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './LeftPanel.module.scss';
import {FriendStatus, ProfileStore} from "@/stores/ProfileStore";
import {USERID} from "@/app/config";
import {LazyAvatar} from "@/components/LazyAvatar/LazyAvatar";
import {api} from "@/app/[lang]/(pagesWithLayout)/profile/ProfileAPI";
import {ChangeMenu, ChangeMenuDict} from "@/app/[lang]/(pagesWithLayout)/profile/components/ChangeMenu/ChangeMenu";
import {InputDict} from "@/components/Input/Input";

interface LeftPanelDictionary {
    changeProfile: string;
    removeFromFriends: string;
    cancelAFriendRequest: string;
    addToFriends: string;
    sendAFriendshipRequest: string;
    sendAMessage: string;
}

interface Props {
    dictionary: LeftPanelDictionary;
    changeMenuDict: ChangeMenuDict;
    inputDict: InputDict;
}

export const LeftPanel: FC<Props> = observer(({dictionary, changeMenuDict, inputDict}) => {

    const [isChanging, setIsChanging] = useState(false);

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

    const stopChange = useCallback(() => {
        setIsChanging(false);
    }, []);

    useEffect(() => {
        if (USERID === ProfileStore.id) {
            setIsOwner(true)
        }
    }, []);

    useEffect(() => {
        setIsOwner(USERID === ProfileStore.id);
    }, [USERID, ProfileStore.id]);

    useEffect(() => {
        if (isChanging) {
            document.getElementById("rightColumn").style.display = "none";
        } else {
            document.getElementById("rightColumn").style.display = "block";
        }
    }, [isChanging]);

    if (isChanging) {
        return <ChangeMenu stopChange={stopChange} inputDict={inputDict} dict={changeMenuDict}/>
    }

    return (
        <div className={styles.leftPanel}>
            <LazyAvatar size={130} borderRadius={"50%"} style={{marginBottom: '10px'}} src={ProfileStore.avatar === "" ? "" :`/${ProfileStore.id}/Image/${ProfileStore.avatar}`} />
            {isOwner
                ?
                    <div className={styles.button} onClick={() => {setIsChanging(true)}}>
                        {dictionary.changeProfile}
                    </div>
                : friendStatus === FriendStatus.friend
                    ?
                        <div className={styles.button} onClick={deleteFriendCB} style={{marginBottom: '10px'}}>
                            {dictionary.removeFromFriends}
                        </div>
                    : friendStatus=== FriendStatus.idol
                        ?
                            <div className={styles.button} onClick={unsubscribeCB} style={{marginBottom: '10px'}}>
                                {dictionary.cancelAFriendRequest}
                            </div>
                        : friendStatus === FriendStatus.subscriber
                            ?
                                <div className={styles.button} onClick={addFriendCB} style={{marginBottom: '10px'}}>
                                    {dictionary.addToFriends}
                                </div>
                            :
                                <div className={styles.button} onClick={subscribeCB} style={{marginBottom: '10px'}}>
                                    {dictionary.sendAFriendshipRequest}
                                </div>
            }
            {!isOwner && <div className={styles.button}>
                {dictionary.sendAMessage}
            </div>}
        </div>
    );
});