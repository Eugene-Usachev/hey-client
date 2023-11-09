"use client";
import React, {FC, useEffect, useRef, useState} from 'react';
import styles from './PostFeed.module.scss';
import {observer} from "mobx-react-lite";
import {PostStore} from "@/stores/PostStore";
import {Post, PostDict} from "@/app/[lang]/(pagesWithLayout)/profile/components/Post/Post";
import {ProfileStore} from "@/stores/ProfileStore";
import {CommentBlockDicts} from "@/app/[lang]/(pagesWithLayout)/profile/components/CommentBlock/CommentBlock";

interface PostFeedDict {
    postDict: PostDict;
    commentBlockDicts: CommentBlockDicts;
}

interface PostFeedProps {
    dict: PostFeedDict;
}

export const PostFeed: FC<PostFeedProps> = observer<PostFeedProps>(({dict}) => {

    const [postsVisible, setPostsVisible] = useState(0);
    const [posts, setPosts] = useState([...PostStore.posts.slice(0, postsVisible)]);
    const lastPost = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
    const observer = useRef<IntersectionObserver>();

    useEffect(() => {
        if (!PostStore.wasGetPosts) PostStore.getPosts().then((numberOfPosts) => {
            setPostsVisible(numberOfPosts);
        });
    }, [ProfileStore.id]);

    useEffect(() => {

        observer.current = new IntersectionObserver(([target]) => {
            if (target.isIntersecting) {
                PostStore.getPosts().then((numberOfPosts) => {
                    setPostsVisible(postsVisible + numberOfPosts);
                });
            }
        });
        (observer.current as IntersectionObserver).observe(lastPost.current);

        return () => {
            observer.current?.disconnect();
        }
    }, [lastPost.current, postsVisible]);

    useEffect(() => {
        setPosts([...PostStore.posts.slice(0, postsVisible)]);
    }, [PostStore.posts, postsVisible]);

    return (
        <div className={styles.postFeed}>
            {posts.map(post => {
                return (
                    <Post
                        commentBlockDicts={dict.commentBlockDicts}
                        dict={dict.postDict}
                        key={post.id}
                        data={post.data}
                        date={post.date}
                        files={post.files}
                        likesStatus={post.likesStatus}
                        likes={post.likes}
                        survey={post.survey}
                        dislikes={post.dislikes}
                        id={post.id}
                    />
                );
            })}
            <div ref={lastPost} style={{height: '1px', width: '1px'}}></div>
        </div>
    );
});