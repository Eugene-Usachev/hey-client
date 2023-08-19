"use client";
import React, {FC, useCallback, useState} from 'react';
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
    }
}

export const InfoBlock: FC<InfoBlockProps> = observer(({dict}) => {
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
            {ProfileStore.family_status && ProfileStore.family_status.length > 0 &&
                <div className={styles.keyValueBlock}>
                    <div style={{width: `${longestKey}ch`}}>{dict.FamilyStatus}:</div>
                    <div>{ProfileStore.family_status}</div>
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
                    {ProfileStore.attitude_to_smocking && ProfileStore.attitude_to_smocking.length > 0 &&
                        <div className={styles.keyValueBlock}>
                            <div style={{width: `${longestKey}ch`}}>{dict.AttitudeToSmocking}:</div>
                            <div style={{width: `calc(100% - ${longestKey}ch)`, overflowWrap: "break-word", marginBottom: "5px"}}>{ProfileStore.attitude_to_smocking}</div>
                        </div>
                    }
                    {ProfileStore.attitude_to_alcohol && ProfileStore.attitude_to_alcohol.length > 0 &&
                        <div className={styles.keyValueBlock}>
                            <div style={{width: `${longestKey}ch`}}>{dict.AttitudeToAlcohol}:</div>
                            <div style={{width: `calc(100% - ${longestKey}ch)`, overflowWrap: "break-word", marginBottom: "5px"}}>{ProfileStore.attitude_to_alcohol}</div>
                        </div>
                    }
                    {ProfileStore.attitude_to_sport && ProfileStore.attitude_to_sport.length > 0 &&
                        <div className={styles.keyValueBlock}>
                            <div style={{width: `${longestKey}ch`}}>{dict.AttitudeToSport}:</div>
                            <div style={{width: `calc(100% - ${longestKey}ch)`, overflowWrap: "break-word", marginBottom: "5px"}}>{ProfileStore.attitude_to_sport}</div>
                        </div>
                    }
                    {ProfileStore.favourites_meals && ProfileStore.favourites_meals.length > 0 &&
                        <div className={styles.keyValueBlock}>
                            <div style={{width: `${longestKey}ch`}}>{dict.FavoriteMeals}:</div>
                            <div style={{width: `calc(100% - ${longestKey}ch)`, overflowWrap: "break-word", marginBottom: "5px"}}>{ProfileStore.favourites_meals}</div>
                        </div>
                    }
                    {ProfileStore.favourites_books && ProfileStore.favourites_books.length > 0 &&
                        <div className={styles.keyValueBlock}>
                            <div style={{width: `${longestKey}ch`}}>{dict.FavoriteBooks}:</div>
                            <div style={{width: `calc(100% - ${longestKey}ch)`, overflowWrap: "break-word", marginBottom: "5px"}}>{ProfileStore.favourites_books}</div>
                        </div>
                    }
                    {ProfileStore.favourites_films && ProfileStore.favourites_films.length > 0 &&
                        <div className={styles.keyValueBlock}>
                            <div style={{width: `${longestKey}ch`}}>{dict.FavoriteFilms}:</div>
                            <div style={{width: `calc(100% - ${longestKey}ch)`, overflowWrap: "break-word", marginBottom: "5px"}}>{ProfileStore.favourites_films}</div>
                        </div>
                    }
                    {ProfileStore.favourites_games && ProfileStore.favourites_games.length > 0 &&
                        <div className={styles.keyValueBlock}>
                            <div style={{width: `${longestKey}ch`}}>{dict.FavoriteGames}:</div>
                            <div style={{width: `calc(100% - ${longestKey}ch)`, overflowWrap: "break-word", marginBottom: "5px"}}>{ProfileStore.favourites_games}</div>
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