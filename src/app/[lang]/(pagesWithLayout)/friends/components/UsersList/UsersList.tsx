"use client";
import React, {FC, useEffect, useRef, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './UsersList.module.scss';
import {FriendsStore, FriendUser, OpenListStatus} from "@/stores/FriendsStore";
import {UserLine, UserLineDict} from "@/app/[lang]/(pagesWithLayout)/friends/components/UserLine/UserLine";
import {CommentStore} from "@/stores/CommentStore";

const getUsers = (ids: number[]): (FriendUser | undefined)[] => {
    const list: (FriendUser | undefined)[] = [];
    for (const id of ids) {
        list.push(FriendsStore.users.find(user => user.id == id));
    }
    return list;
}

interface UsersListProps {
    dicts: {
        userLine: UserLineDict,
    }
}

export const UsersList:FC<UsersListProps> = observer<UsersListProps>(({dicts}) => {

    const [mode, setMode] = useState(OpenListStatus.Friends);
    const [list, setList] = useState<(FriendUser | undefined)[]>([]);
    const [offset, setOffset] = useState(0);
    const observer = useRef<IntersectionObserver>();
    const lastFriend = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);

    useEffect(() => {
        setMode(FriendsStore.openListStatus);
        let endIndex;
        switch (FriendsStore.openListStatus) {
            case OpenListStatus.Friends:
                endIndex = offset + 20 > FriendsStore.theUser.friends.length ? FriendsStore.theUser.friends.length : offset + 20;
                setList(getUsers(FriendsStore.theUser.friends.slice(0, endIndex)));
                setOffset(endIndex);
                break;
            case OpenListStatus.Subscribers:
                endIndex = offset + 20 > FriendsStore.theUser.subscribers.length ? FriendsStore.theUser.subscribers.length : offset + 20;
                setList(getUsers(FriendsStore.theUser.subscribers.slice(0, endIndex)));
                setOffset(endIndex);
                break;
            case OpenListStatus.MutualFriends:
                endIndex = offset + 20 > FriendsStore.mutualFriendsList.length ? FriendsStore.mutualFriendsList.length : offset + 20;
                setList(getUsers(FriendsStore.mutualFriendsList.slice(0, endIndex)));
                setOffset(endIndex);
                break;
        }
    }, [FriendsStore.openListStatus, FriendsStore.users.length]);

    useEffect(() => {
        observer.current = new IntersectionObserver(([target]) => {
            if (target.isIntersecting) {
                let endIndex;
                switch (FriendsStore.openListStatus) {
                    case OpenListStatus.Friends:
                        endIndex = offset + 20 > FriendsStore.theUser.friends.length ? FriendsStore.theUser.friends.length : offset + 20;
                        setList(getUsers(FriendsStore.theUser.friends.slice(0, endIndex)));
                        setOffset(endIndex);
                        break;
                    case OpenListStatus.Subscribers:
                        endIndex = offset + 20 > FriendsStore.theUser.subscribers.length ? FriendsStore.theUser.subscribers.length : offset + 20;
                        setList(getUsers(FriendsStore.theUser.subscribers.slice(0, endIndex)));
                        setOffset(endIndex);
                        break;
                    case OpenListStatus.MutualFriends:
                        endIndex = offset + 20 > FriendsStore.mutualFriendsList.length ? FriendsStore.mutualFriendsList.length : offset + 20;
                        setList(getUsers(FriendsStore.mutualFriendsList.slice(0, endIndex)));
                        setOffset(endIndex);
                        break;
                }
            }
        });
        (observer.current as IntersectionObserver).observe(lastFriend.current);

        return () => {
            observer.current?.disconnect();
        }
    }, [lastFriend.current, offset]);

    return (
        <div className={styles.usersList}>
            {list.map((user, index) => {
                if (!user) return <div key={"empty" + index}></div>;
                return (
                    <UserLine key={user.id} dict={dicts.userLine}
                        user={user}
                    />
                )
            })}
            <div ref={lastFriend} style={{height: '1px', width: '1px'}}></div>
        </div>
    );
});