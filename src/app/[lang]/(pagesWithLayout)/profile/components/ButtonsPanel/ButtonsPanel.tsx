"use client";
import React, {FC, useCallback} from 'react';
import {observer} from "mobx-react-lite";
import styles from './ButtonsPanel.module.scss';
import {likesStatus as likesStatusType, PostStore} from "@/stores/PostStore";
import {BiLike} from "react-icons/bi";
import {BiDislike} from "react-icons/bi";
import {getFormatNumber} from "@/utils/getFormatNumber";

interface ButtonsPanelProps {
    likes: number;
    dislikes: number;
    likesStatus: likesStatusType;
    id: number;
}

export const ButtonsPanel:FC<ButtonsPanelProps> = observer<ButtonsPanelProps>((
    {likesStatus, id, likes, dislikes}) => {

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
    }, [likesStatus, id]);

    return (
        <div className={styles.buttonsPanel}>
            <div className={styles.likesBlock}>
                <div className={styles.likeButton + " " + (likesStatus === likesStatusType.like ? "active" : "")}>
                    <BiLike />
                    {getFormatNumber(likes)}
                </div>
                <div className={styles.likeButton + " " + (likesStatus === likesStatusType.dislike ? "active" : "")}>
                    <BiDislike />
                    {getFormatNumber(dislikes)}
                </div>
            </div>
        </div>
    );
});