"use client";
import React, {FC, useCallback} from 'react';
import {observer} from "mobx-react-lite";
import styles from './ButtonsPanel.module.scss';
import {likesStatus as likesStatusType, PostStore} from "@/stores/PostStore";
import {BiComment, BiLike, BiDislike} from "react-icons/bi";
import {getFormatNumber} from "@/utils/getFormatNumber";
import {FiTrash} from "react-icons/fi";
import {USERID} from "@/app/config";
import {ProfileStore} from "@/stores/ProfileStore";

interface ButtonsPanelProps {
    likes: number;
    dislikes: number;
    likesStatus: likesStatusType;
    toggleIsOpenCommentBlock: () => void;
    id: number;
}

export const ButtonsPanel:FC<ButtonsPanelProps> = observer<ButtonsPanelProps>((
    {likesStatus, id, likes, dislikes, toggleIsOpenCommentBlock}) => {

    const like = useCallback(() => {
        if (likesStatus === likesStatusType.like) {
            PostStore.unlikePost(id);
            return;
        }
        PostStore.likePost(id);
    }, [id, likesStatus]);

    const dislike = useCallback(() => {
        if (likesStatus === likesStatusType.dislike) {
            PostStore.undislikePost(id);
            return;
        }
        PostStore.dislikePost(id);
    }, [id, likesStatus]);

    const deletePost = useCallback(() => {
        PostStore.deletePost(id);
    }, [id]);

    return (
        <div className={styles.buttonsPanel}>
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
                <div className={styles.buttonBlock}>
                    <BiComment className={styles.button} onClick={() => toggleIsOpenCommentBlock()}/>
                </div>
            </div>
            {+USERID === ProfileStore.id &&
                <div className={styles.buttonBlock}>
                    <FiTrash className={styles.button} onClick={deletePost}/>
                </div>
            }
        </div>
    );
});