import React, {FC, useRef, useEffect, useState, useCallback} from 'react';
import styles from './CommentBlock.module.scss';
import {observer} from "mobx-react-lite";
import {CommentStore} from "@/stores/CommentStore";
import {NoComments} from "@/app/[lang]/(pagesWithLayout)/profile/components/CommentBlock/NoComments";
import {Input, InputDict} from "@/components/Input/Input";
import {Comment} from "@/app/[lang]/(pagesWithLayout)/profile/components/Comment/Comment";

export interface CommentBlockDicts {
    inputDict: InputDict;
    commentBlock: {
        NoComments: string;
        WriteYourComment: string;
        You: string;
    };
}

interface CommentBlockProps {
    id: number;
    dicts: CommentBlockDicts;
}

// TODO BUG: scroll to top after load more than 20 comments

export const CommentBlock:FC<CommentBlockProps> = observer<CommentBlockProps>(({id, dicts}) => {

    const observer = useRef<IntersectionObserver>();
    const lastComment = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
    const info = useRef(CommentStore.posts.find((info) => info.postId === id));
    const [commentsVisible, setCommentsVisible] = useState(info.current ? info.current.offset : 0);
    const [comments, setComments] = useState(
        info.current ? info.current.comments.slice(0, commentsVisible) : []
    );

    const submit = useCallback((text: string): boolean => {
        if (text.length < 1) {
            return false;
        }
        CommentStore.createComment(id, {
            parent_comment_id: 0,
            files: [],
            data: text
        }).then(() => {
           setCommentsVisible(commentsVisible + 1);
        });
        return true;
    }, [id, commentsVisible]);

    useEffect(() => {
        observer.current = new IntersectionObserver(([target]) => {
            if (target.isIntersecting) {
                CommentStore.getCommentsForPost(id).then((numberOfComments) => {
                    setCommentsVisible(commentsVisible + numberOfComments);
                });
            }
        });
        (observer.current as IntersectionObserver).observe(lastComment.current);

        return () => {
            observer.current?.disconnect();
        }
    }, [lastComment.current, commentsVisible]);

    useEffect(() => {
        CommentStore.getCommentsForPost(id).then((numberOfComments) => {
            setCommentsVisible(commentsVisible + numberOfComments);
        });
    }, []);

    useEffect(() => {
        info.current = CommentStore.posts.find((info) => info.postId === id);
        setComments(info.current ? info.current.comments.slice(0, commentsVisible) : []);
    }, [CommentStore.posts.findIndex((info) => info.postId === id), commentsVisible]);

    return (
        <div className={styles.commentBlock}>
            <Input dict={dicts.inputDict} checkSpace={true} maxLength={128} minLength={1} type={"send"} onEnter={submit} placeholder={dicts.commentBlock.WriteYourComment}/>
            {info.current == undefined
                ? <NoComments text={dicts.commentBlock.NoComments}/>
                : comments.length === 0 && info.current.wasGet && <NoComments text={dicts.commentBlock.NoComments}/>
            }
            {comments.map((comment) => {
                return <Comment
                    key={comment.id}
                    id={comment.id}
                    dict={{You: dicts.commentBlock.You}}
                    data={comment.data}
                    date={comment.date}
                    files={comment.files}
                    likesStatus={comment.likesStatus}
                    likes={comment.likes}
                    parentPostId={comment.parentPostId}
                    parentUserId={comment.parentUserId}
                    dislikes={comment.dislikes}
                    parentCommentId={comment.parentCommentId}
                />
            })}
            <div ref={lastComment} style={{height: '1px', width: '1px'}}></div>
        </div>
    );
});