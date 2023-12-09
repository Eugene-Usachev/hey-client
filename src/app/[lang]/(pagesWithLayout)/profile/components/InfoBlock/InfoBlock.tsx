"use client";
import React, {FC, useCallback, useMemo, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './InfoBlock.module.scss';
import {ProfileStore} from "@/stores/ProfileStore";
import {
    LoadingRightColumn
} from "@/app/[lang]/(pagesWithLayout)/profile/components/LoadingRightColumn/LoadingRightColumn";

interface InfoBlockProps {
    dict: {
        FamilyStatus: string;
        PlaceOfResidence: string;
        AttitudeToSmocking: string;
        AttitudeToAlcohol: string;
        AttitudeToSport: string;
        FavoriteMeals: string;
        FavoriteFilms: string;
        FavoriteGames: string;
        FavoriteBooks: string;
        Dreams: string;
        ShowMore: string;
        ShowLess: string;
        SharplyNegative: string;
        Negative: string;
        Neutral: string;
        Positive: string;
        SharplyPositive: string;
        Married: string;
        Single: string;
        LookingFor: string;
        HaveABoyfriendOrGirlfriend: string;
        LeaveThisFieldEmpty: string;
    }
}

export const InfoBlock: FC<InfoBlockProps> = observer(({dict}) => {

    const familyStatus = useMemo(() => [
        dict.LeaveThisFieldEmpty,
        dict.Married,
        dict.HaveABoyfriendOrGirlfriend,
        dict.LookingFor,
        dict.Single
    ], []);

    const attitudeToAlcohol = useMemo(() => [
        dict.LeaveThisFieldEmpty,
        dict.SharplyNegative,
        dict.Negative,
        dict.Neutral,
        dict.Positive,
        dict.SharplyPositive
    ], []);
    const attitudeToSmocking = useMemo(() => [
        dict.LeaveThisFieldEmpty,
        dict.SharplyNegative,
        dict.Negative,
        dict.Neutral,
        dict.Positive,
        dict.SharplyPositive
    ], []);
    const attitudeToSport = useMemo(() => [
        dict.LeaveThisFieldEmpty,
        dict.SharplyNegative,
        dict.Negative,
        dict.Neutral,
        dict.Positive,
        dict.SharplyPositive
    ], []);

    const longestKey = Math.max(dict.FamilyStatus.length, dict.PlaceOfResidence.length,
        dict.AttitudeToAlcohol.length, dict.AttitudeToSmocking.length, dict.AttitudeToSport.length, dict.FavoriteMeals.length, dict.FavoriteFilms.length,
        dict.FavoriteGames.length, dict.FavoriteBooks.length, dict.Dreams.length) + 1;

    const [isShowingMore, setIsShowingMore] = useState(false);

    const toggleIsShowingMore = useCallback(() => {
        setIsShowingMore(!isShowingMore);
    }, [isShowingMore]);

    if (!ProfileStore.name || !ProfileStore.surname || !ProfileStore.name.length || !ProfileStore.surname.length) {
        return <LoadingRightColumn />;
    }

    return (
        <div className={styles.infoBlock}>
            <div style={{marginBottom: '3px'}}>
                <div className={styles.nameBlock}>{ProfileStore.name[0].toUpperCase()}{ProfileStore.name.slice(1)} {ProfileStore.surname[0].toUpperCase()}{ProfileStore.surname.slice(1)}</div>
                <div className={styles.descriptionBlock}>{ProfileStore.description}</div>
            </div>
            {ProfileStore.family_status && ProfileStore.family_status > -1 &&
                <div className={styles.keyValueBlock}>
                    <div style={{width: `${longestKey}ch`}}>{dict.FamilyStatus}:</div>
                    <div>{familyStatus[ProfileStore.family_status]}</div>
                </div>
            }
            {/*<div> TODO birthday </div>*/}
            {ProfileStore.place_of_residence && ProfileStore.place_of_residence.length > 0 &&
                <div className={styles.keyValueBlock}>
                    <div style={{width: `${longestKey}ch`}}>{dict.PlaceOfResidence}:</div>
                    <div>{ProfileStore.place_of_residence}</div>
                </div>
            }
            {isShowingMore &&
                <>
                    {ProfileStore.attitude_to_smocking && ProfileStore.attitude_to_smocking > -1 &&
                        <div className={styles.keyValueBlock}>
                            <div style={{width: `${longestKey}ch`}}>{dict.AttitudeToSmocking}:</div>
                            <div style={{width: `calc(100% - ${longestKey}ch)`, overflowWrap: "break-word", marginBottom: "5px"}}>{attitudeToSmocking[ProfileStore.attitude_to_smocking]}</div>
                        </div>
                    }
                    {ProfileStore.attitude_to_alcohol && ProfileStore.attitude_to_alcohol > -1 &&
                        <div className={styles.keyValueBlock}>
                            <div style={{width: `${longestKey}ch`}}>{dict.AttitudeToAlcohol}:</div>
                            <div style={{width: `calc(100% - ${longestKey}ch)`, overflowWrap: "break-word", marginBottom: "5px"}}>{attitudeToAlcohol[ProfileStore.attitude_to_alcohol]}</div>
                        </div>
                    }
                    {ProfileStore.attitude_to_sport && ProfileStore.attitude_to_sport > -1 &&
                        <div className={styles.keyValueBlock}>
                            <div style={{width: `${longestKey}ch`}}>{dict.AttitudeToSport}:</div>
                            <div style={{width: `calc(100% - ${longestKey}ch)`, overflowWrap: "break-word", marginBottom: "5px"}}>{attitudeToSport[ProfileStore.attitude_to_sport]}</div>
                        </div>
                    }
                    {ProfileStore.favorites_meals && ProfileStore.favorites_meals.length > 0 &&
                        <div className={styles.keyValueBlock}>
                            <div style={{width: `${longestKey}ch`}}>{dict.FavoriteMeals}:</div>
                            <div style={{width: `calc(100% - ${longestKey}ch)`, overflowWrap: "break-word", marginBottom: "5px"}}>{ProfileStore.favorites_meals}</div>
                        </div>
                    }
                    {ProfileStore.favorites_books && ProfileStore.favorites_books.length > 0 &&
                        <div className={styles.keyValueBlock}>
                            <div style={{width: `${longestKey}ch`}}>{dict.FavoriteBooks}:</div>
                            <div style={{width: `calc(100% - ${longestKey}ch)`, overflowWrap: "break-word", marginBottom: "5px"}}>{ProfileStore.favorites_books}</div>
                        </div>
                    }
                    {ProfileStore.favorites_films && ProfileStore.favorites_films.length > 0 &&
                        <div className={styles.keyValueBlock}>
                            <div style={{width: `${longestKey}ch`}}>{dict.FavoriteFilms}:</div>
                            <div style={{width: `calc(100% - ${longestKey}ch)`, overflowWrap: "break-word", marginBottom: "5px"}}>{ProfileStore.favorites_films}</div>
                        </div>
                    }
                    {ProfileStore.favorites_games && ProfileStore.favorites_games.length > 0 &&
                        <div className={styles.keyValueBlock}>
                            <div style={{width: `${longestKey}ch`}}>{dict.FavoriteGames}:</div>
                            <div style={{width: `calc(100% - ${longestKey}ch)`, overflowWrap: "break-word", marginBottom: "5px"}}>{ProfileStore.favorites_games}</div>
                        </div>
                    }
                    {ProfileStore.dreams && ProfileStore.dreams.length > 0 &&
                        <div className={styles.keyValueBlock}>
                            <div style={{width: `${longestKey}ch`}}>{dict.Dreams}:</div>
                            <div style={{width: `calc(100% - ${longestKey}ch)`, overflowWrap: "break-word", marginBottom: "5px"}}>{ProfileStore.dreams}</div>
                        </div>
                    }
                </>
            }
            <div onClick={toggleIsShowingMore} className={styles.button}>
                {isShowingMore ? dict.ShowLess : dict.ShowMore}
            </div>
        </div>
    );
});