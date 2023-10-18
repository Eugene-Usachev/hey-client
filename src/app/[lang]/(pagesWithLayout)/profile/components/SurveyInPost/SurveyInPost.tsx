"use client";
import React, {FC, useCallback, useMemo, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './SurveyInPost.module.scss';
import {Survey} from "@/stores/PostStore";
import {SurveyColor} from "@/app/[lang]/(pagesWithLayout)/profile/components/CreatePostBlock/CreatePostBlock";
import {USERID} from "@/app/config";

export const SurveyInPost:FC<Survey> = observer<Survey>(({
    background, data, isMultiVoices, parentPostId,
    sl0v, sl0vby, sl1v, sl1vby, sl2v, sl2vby, sl3v, sl3vby, sl4v, sl4vby, sl5v, sl5vby, sl6v, sl6vby, sl7v, sl7vby, sl8v, sl8vby, sl9v, sl9vby,
    voted_by
                                                         }) => {
    const [chosen, setChosen] = useState((): boolean[] => {
        const arr = [];
        const id = +USERID;
        let finish = false;
        if (voted_by.includes(id)) {
            for (let i = 1; i < data.length; i++) {
                if (finish) break;
                switch (i) {
                    case 1:
                        arr.push(sl0vby.includes(id));
                        if (!isMultiVoices) finish = true;
                        break;
                    case 2:
                        arr.push(sl1vby.includes(id));
                        if (!isMultiVoices) finish = true;
                        break;
                    case 3:
                        arr.push(sl2vby.includes(id));
                        if (!isMultiVoices) finish = true;
                        break;
                    case 4:
                        arr.push(sl3vby.includes(id));
                        if (!isMultiVoices) finish = true;
                        break;
                    case 5:
                        arr.push(sl4vby.includes(id));
                        if (!isMultiVoices) finish = true;
                        break;
                    case 6:
                        arr.push(sl5vby.includes(id));
                        if (!isMultiVoices) finish = true;
                        break;
                    case 7:
                        arr.push(sl6vby.includes(id));
                        if (!isMultiVoices) finish = true;
                        break;
                    case 8:
                        arr.push(sl7vby.includes(id));
                        if (!isMultiVoices) finish = true;
                        break;
                    case 9:
                        arr.push(sl8vby.includes(id));
                        if (!isMultiVoices) finish = true;
                        break;
                    case 10:
                        arr.push(sl9vby.includes(id));
                        if (!isMultiVoices) finish = true;
                        break;
                    default:
                        arr.push(false);
                }
            }
        }
        if (arr.length < 10) {
            for (let i = arr.length; i < 10; i++) {
                arr.push(false);
            }
        }
        return arr;
    });
    const choose = useCallback((index: number) => {
        const arr = [...chosen];
        arr[index] = true;
        setChosen(arr);
    }, [chosen]);

    const backgroundColor = useMemo(() => {
        return SurveyColor[background];
    }, [background]);

    return (
        <div className={styles.surveyInPost} style={{background: backgroundColor}}>
            {data[0].length > 0 && <div className={styles.question}>{data[0]}</div>}
            {data.slice(1).map((data, index) => {
                return <div className={`${styles.line} ${chosen[index] ? styles.active : ''}`} key={index}
                            onClick={() => {choose(index)}}>{data}</div>;
            })}
        </div>
    );
});