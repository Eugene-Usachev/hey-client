import React, {memo, FC} from 'react';
import styles from './Post.module.scss';
import {Post as PostInterface} from "@/stores/PostStore";
import {parseUnixDate} from "@/utils/ParseUnixDate";
import {SurveyInPost} from "@/app/[lang]/(pagesWithLayout)/profile/components/SurveyInPost/SurveyInPost";

export const Post:FC<PostInterface> = memo<PostInterface>(({
    date, data, files, parentUserId, liked_by, disliked_by, likes, survey, dislikes, id
                                                           }) => {

    return (
        <div className={styles.post}>
            <div className={styles.date}>{date !== 0 ? parseUnixDate(date) : new Date().toLocaleString()}</div>
            {data}
            {survey !== null && <SurveyInPost
                data={survey.data}
                sl0vby={survey.sl1vby}
                sl1vby={survey.sl1vby}
                sl2vby={survey.sl2vby}
                sl3vby={survey.sl3vby}
                sl4vby={survey.sl4vby}
                sl5vby={survey.sl5vby}
                sl6vby={survey.sl6vby}
                sl7vby={survey.sl7vby}
                sl8vby={survey.sl8vby}
                sl9vby={survey.sl9vby}
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
                voted_by={survey.voted_by}
            />}
        </div>
    );
});