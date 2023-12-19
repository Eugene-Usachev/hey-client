import React, {memo, FC, useState, useCallback} from 'react';
import styles from './Post.module.scss';
import {Post as PostInterface} from "@/stores/PostStore";
import {parseUnixDate} from "@/utils/ParseUnixDate";
import {
    SurveyInPost,
    SurveyInPostDict
} from "@/app/[lang]/(pagesWithLayout)/profile/components/SurveyInPost/SurveyInPost";
import {ButtonsPanel} from "@/app/[lang]/(pagesWithLayout)/profile/components/ButtonsPanel/ButtonsPanel";
import {
    CommentBlock,
    CommentBlockDicts
} from "@/app/[lang]/(pagesWithLayout)/profile/components/CommentBlock/CommentBlock";

export interface PostDict {
    surveyInPostDict: SurveyInPostDict;
}

interface PostProps extends PostInterface {
    dict: PostDict;
    commentBlockDicts: CommentBlockDicts;
}

export const Post:FC<PostProps> = memo<PostProps>(({
    date, data, files, likesStatus, likes, survey, dislikes, id, dict, commentBlockDicts
                                                           }) => {

    const [isCommentBlockOpen, setIsCommentBlockOpen] = useState(false);

    const toggleIsOpenCommentBlock = useCallback(() => {
        setIsCommentBlockOpen(!isCommentBlockOpen);
    }, [isCommentBlockOpen]);

    return (
        <div className={styles.post}>
            <div style={{
                borderBottom: isCommentBlockOpen ? "1px solid #e6e6e6" : "",
                paddingBottom: isCommentBlockOpen ? "10px" : ""
            }}>
                <div className={styles.date}>{date !== 0 ? parseUnixDate(date) : new Date().toLocaleString()}</div>
                {data}
                {survey !== null && <SurveyInPost
                    surveyInPostDict={dict.surveyInPostDict}
                    data={survey.data}
                    background={survey.background}
                    isMultiVoices={survey.isMultiVoices}
                    parentPostId={id}
                    sl0v={survey.sl0v}
                    sl1v={survey.sl1v}
                    sl2v={survey.sl2v}
                    sl3v={survey.sl3v}
                    sl4v={survey.sl4v}
                    sl5v={survey.sl5v}
                    sl6v={survey.sl6v}
                    sl7v={survey.sl7v}
                    sl8v={survey.sl8v}
                    sl9v={survey.sl9v}
                    votedFor={survey.votedFor}
                />}
                <ButtonsPanel toggleIsOpenCommentBlock={toggleIsOpenCommentBlock} id={id} likes={likes} likesStatus={likesStatus} dislikes={dislikes}/>
            </div>
            {isCommentBlockOpen && <CommentBlock id={id} dicts={commentBlockDicts}/>}
        </div>
    );
});