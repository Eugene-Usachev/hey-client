import React, {memo, FC, useCallback} from 'react';
import styles from './CommentButtonsPanel.module.scss';
import {likesStatus as likesStatusType} from "@/stores/PostStore";
import {CommentStore} from "@/stores/CommentStore";
import {BiDislike, BiLike} from "react-icons/bi";
import {getFormatNumber} from "@/utils/getFormatNumber";
import {USERID} from "@/app/config";
import {ProfileStore} from "@/stores/ProfileStore";
import {FiTrash} from "react-icons/fi";

interface CommentButtonsPanelProps {
    likes: number;
    dislikes: number;
    likesStatus: likesStatusType;
    id: number;
    authorId: number;
    postId: number;
}

export const CommentButtonsPanel:FC<CommentButtonsPanelProps> = memo<CommentButtonsPanelProps>(({
    likesStatus, id, likes, dislikes, authorId, postId
                                                                                                }) => {

    const like = useCallback(() => {
        if (likesStatus === likesStatusType.like) {
            CommentStore.unlikeComment(postId, id);
            return;
        }
        CommentStore.likeComment(postId, id);
    }, [id, likesStatus, postId]);

    const dislike = useCallback(() => {
        if (likesStatus === likesStatusType.dislike) {
            CommentStore.undislikeComment(postId, id);
            return;
        }
        CommentStore.dislikeComment(postId, id);
    }, [id, likesStatus, postId]);

    const deleteComment = useCallback(() => {
        CommentStore.deleteComment(postId, id);
    }, [id, postId]);

    return (
        <div className={styles.commentButtonsPanel}>
            <div style={{display: "flex"}}>
                <div className={styles.likesBlock}>
                    <div className={styles.likeButton + " " + (likesStatus === likesStatusType.like ? styles.active : "")} onClick={like}>
                        <BiLike />
                        {getFormatNumber(likes)}
                    </div>
                    <div className={styles.likeButton + " " + (likesStatus === likesStatusType.dislike ? styles.active : "")} onClick={dislike}>
                        <BiDislike />
                        {getFormatNumber(dislikes)}
                    </div>
                </div>
            </div>
            {+USERID === authorId &&
                <div className={styles.buttonBlock}>
                    <FiTrash className={styles.button} onClick={deleteComment}/>
                </div>
            }
        </div>
    );
});