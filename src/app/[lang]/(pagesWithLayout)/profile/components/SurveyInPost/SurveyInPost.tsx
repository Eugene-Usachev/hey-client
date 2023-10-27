"use client";
import React, {FC, useCallback, useMemo, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './SurveyInPost.module.scss';
import {PostStore, Survey} from "@/stores/PostStore";
import {SurveyColor} from "@/app/[lang]/(pagesWithLayout)/profile/components/CreatePostBlock/CreatePostBlock";
import {getFormatNumber} from "@/utils/getFormatNumber";

export interface SurveyInPostDict {
    Vote: string;
}

interface SurveyInPostProps extends Survey {
    surveyInPostDict: SurveyInPostDict;
}

export const SurveyInPost:FC<SurveyInPostProps> = observer<SurveyInPostProps>(({
    background, data, isMultiVoices, parentPostId,
    sl0v, sl1v, sl2v, sl3v, sl4v, sl5v,
    sl6v, sl7v, sl8v, sl9v, votedFor, surveyInPostDict
                                                         }) => {

    const [votedForHere, setVotedForHere] = useState([...votedFor]);
    const [wasVoted, setWasVoted] = useState(votedFor.length !== 0);

    const choose = useCallback((index: number) => {
        if (wasVoted) {
            return;
        }
        if (!isMultiVoices) {
            const arr = [index];
            PostStore.voteInSurvey(parentPostId, arr);
            setWasVoted(true);
            return;
        } else {
            const arr = [...votedForHere];
            const indexOf = arr.indexOf(index);
            if (indexOf !== -1) {
                arr.splice(indexOf, 1);
            } else {
                arr.push(index);
            }
            setVotedForHere(arr);
        }
        // const arr = [...chosen];
        // arr[index] = true;
        // setChosen(arr);
    }, [isMultiVoices, parentPostId, wasVoted, votedForHere]);

    const backgroundColor = useMemo(() => {
        return SurveyColor[background];
    }, [background]);

    const voteInMultivoices = useCallback(() => {
        if (wasVoted || votedForHere.length === 0) {
            return;
        }
        PostStore.voteInSurvey(parentPostId, [...votedForHere]);
        setWasVoted(true);
    }, [wasVoted, parentPostId, votedForHere]);

    return (
        <div className={styles.surveyInPost} style={{background: backgroundColor}}>
            {data[0].length > 0 && <div className={styles.question}>{data[0]}</div>}
            {data.slice(1).map((data, index) => {
                let voices = 0;
                switch (index) {
                    case 0:
                        voices = sl0v;
                        break;
                    case 1:
                        voices = sl1v;
                        break;
                    case 2:
                        voices = sl2v;
                        break;
                    case 3:
                        voices = sl3v;
                        break;
                    case 4:
                        voices = sl4v;
                        break;
                    case 5:
                        voices = sl5v;
                        break;
                    case 6:
                        voices = sl6v;
                        break;
                    case 7:
                        voices = sl7v;
                        break;
                    case 8:
                        voices = sl8v;
                        break;
                    case 9:
                        voices = sl9v;
                        break;
                }
                return (
                    <div className={`${styles.line} ${votedForHere.indexOf(index) !== -1 ? styles.active : ''}`} key={index}
                         onClick={() => {choose(index)}}>
                        <div>{data}</div>
                        {wasVoted && <div>{getFormatNumber(voices)}</div>}
                        {isMultiVoices && !wasVoted && <input type={"checkbox"} className={styles.checkBox} readOnly={true} checked={votedForHere.indexOf(index) !== -1} onClick={
                            () => choose(index)
                        }></input>}
                    </div>
                );
            })}
            {isMultiVoices && !wasVoted && <div className={styles.button} onClick={voteInMultivoices}>{surveyInPostDict.Vote}</div>}
        </div>
    );
});