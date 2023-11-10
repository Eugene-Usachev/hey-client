import React, {memo, FC, useMemo} from 'react';
import styles from './Comment.module.scss';
import {Comment as CommentInterface} from '@/stores/CommentStore';
import {parseUnixDate} from "@/utils/ParseUnixDate";
import {MiniUser, MiniUsersStore} from "@/stores/MiniUsersStore";
import {
    CommentButtonsPanel
} from "@/app/[lang]/(pagesWithLayout)/profile/components/CommentButtonsPanel/CommentButtonsPanel";
import {USERID} from "@/app/config";
import {TopProfileStore} from "@/stores/TopProfileStore";
import {LazyAvatar} from "@/components/LazyAvatar/LazyAvatar";
import Link from "next/link";
import {getHREF} from "@/utils/getHREF";
import {ProfileStore} from "@/stores/ProfileStore";

interface CommentProps extends CommentInterface {
    dict: {
        You: string;
    }
}

export const Comment:FC<CommentProps> = memo<CommentProps>(({
    date,
    data,
    files,
    likesStatus,
    likes,
    parentCommentId,
    dislikes,
    id,
    parentUserId,
    parentPostId,
    dict
                                                            }) => {

    const user:MiniUser = useMemo(() => {
        if (parentUserId === +USERID) {
            return {
                name: dict.You,
                surname: "",
                id: parentUserId,
                avatar: TopProfileStore.avatar || "",
                isOnline: true
            };
        }
        const user = MiniUsersStore.users.find((user) => user.id === parentUserId);
        if (user !== undefined) return user;
        return {
            name: "Unknown",
            surname: "User",
            id: parentUserId,
            avatar: "",
            isOnline: false
        };
    }, [parentUserId, dict.You]);

    return (
        <div className={styles.comment}>
            <div className={styles.top}>
                <Link href={getHREF(`profile/${user.id}`)} style={{marginRight: '5px', marginBottom: '5px'}}>
                    <LazyAvatar src={user.avatar === "" ? "/NULL.png" :`/${user.id}/Image/${user.avatar}`} size={32} borderRadius={"50%"} />
                </Link>
                <Link href={getHREF(`profile/${user.id}`)}>
                    <div className={styles.nameSurname}>{user.name} {user.surname}</div>
                </Link>
                <div className={styles.date}>{date !== 0 ? parseUnixDate(date) : new Date().toLocaleString()}</div>
            </div>
            {data}
            <CommentButtonsPanel authorId={parentUserId} id={id} likes={likes} likesStatus={likesStatus} dislikes={dislikes} postId={parentPostId}/>
        </div>
    );
});