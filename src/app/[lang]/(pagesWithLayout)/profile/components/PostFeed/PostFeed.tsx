"use client";
import React, {FC, useEffect, useRef, useState} from 'react';
import styles from './PostFeed.module.scss';
import {observer} from "mobx-react-lite";
import {PostStore} from "@/stores/PostStore";
import {Post, PostDict} from "@/app/[lang]/(pagesWithLayout)/profile/components/Post/Post";
import {ProfileStore} from "@/stores/ProfileStore";

interface PostFeedDict {
    postDict: PostDict;
}

interface PostFeedProps {
    dict: PostFeedDict;
}

export const PostFeed: FC<PostFeedProps> = observer<PostFeedProps>(({dict}) => {

    const [postVisible, setPostVisible] = useState(20);
    const [posts, setPosts] = useState([...PostStore.posts.slice(0, postVisible)]);
    const lastPost = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
    const selfElement = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
    const observer = useRef<IntersectionObserver>();

    useEffect(() => {
        if (!PostStore.wasGetPosts) PostStore.getPosts();
    }, [ProfileStore.id]);

    useEffect(() => {

        const options = {
            root: selfElement.current,
            rootMargin: "0px",
            threshold: 0
        }

        observer.current = new IntersectionObserver(([target]) => {
            if (target.isIntersecting) {
                PostStore.getPosts();
            }
        }, options);
        (observer.current as IntersectionObserver).observe(lastPost.current);

        return () => {
            observer.current?.disconnect();
        }
    }, [lastPost.current, selfElement.current]);

    useEffect(() => {
        setPosts([...PostStore.posts.slice(0, postVisible)]);
    }, [PostStore.posts]);

    return (
        <div className={styles.postFeed} ref={selfElement}>
            {posts.map(post => {
                return (
                    <Post
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