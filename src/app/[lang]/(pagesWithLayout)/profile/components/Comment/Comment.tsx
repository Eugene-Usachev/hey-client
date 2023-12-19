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
import Link from "next/link";
import {getHREF} from "@/utils/getHREF";
import {UserAvatar} from "@/components/UserAvatar/UserAvatar";

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
        const user = MiniUsersStore.users.getByKey<MiniUser>(parentUserId, "id");
        if (user.isSome()) return user.unwrap();
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
                    <UserAvatar user={user} size={32} borderRadius={"50%"} />
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