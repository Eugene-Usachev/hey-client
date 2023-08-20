import React, {FC, useCallback, useMemo, useState} from 'react';
import {observer} from "mobx-react-lite";
import styles from './ChangeMenu.module.scss';
import styles_leftPanel from '../LeftPanel/LeftPanel.module.scss';
import {LazyAvatar} from "@/components/LazyAvatar/LazyAvatar";
import {ProfileStore} from "@/stores/ProfileStore";
import {Input, InputDict} from "@/components/Input/Input";
import {Select} from "@/components/Select/Select";
import {api} from "@/app/[lang]/(pagesWithLayout)/profile/ProfileAPI";

export interface ChangeMenuDict {
    ChangeAvatar: string;
    TypeYourName: string;
    TypeYourSurname: string;
    TypeDescription: string;
    SelectYourBirthday: string;
    WriteYourAddress: string;
    SelectYourFamilyStatus: string;
    SelectYourAttitudeToAlcohol: string;
    SelectYourAttitudeToSmocking: string;
    SelectYourAttitudeToSport: string;
    WriteYourFavoriteMeals: string;
    WriteYourFavoriteFilms: string;
    WriteYourFavoriteGames: string;
    WriteYourFavoriteBooks: string;
    DescribeYourDreams: string;
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
    Safe: string;
    NotSafe: string;
}

interface Props {
    dict: ChangeMenuDict;
    inputDict: InputDict;
	stopChange: () => void;
}

// TODO if we change lang, all select options should be changed to zero (because it will not be able to found need text on the dicts). We need to store the index of value, not a value

export const ChangeMenu:FC<Props>  = observer<Props>(({dict, inputDict, stopChange}) => {

	const [name, setName] = useState(ProfileStore.name);
	const [surname, setSurname] = useState(ProfileStore.surname);
	const [description, setDescription] = useState(ProfileStore.description ? ProfileStore.description : "");
	const [address, setAddress] = useState(ProfileStore.place_of_residence ? ProfileStore.place_of_residence : "");
	const [favoriteMeals, setFavoriteMeals] = useState(ProfileStore.favourites_meals ? ProfileStore.favourites_meals : "");
	const [favoriteBooks, setFavoriteBooks] = useState(ProfileStore.favourites_books ? ProfileStore.favourites_books : "");
	const [favoriteGames, setFavoriteGames] = useState(ProfileStore.favourites_games ? ProfileStore.favourites_games : "");
	const [favoriteFilms, setFavoriteFilms] = useState(ProfileStore.favourites_films ? ProfileStore.favourites_films : "");
	const [dreams, setDreams] = useState(ProfileStore.dreams ? ProfileStore.dreams : "");


	const familyStatus = useMemo(() => [
        dict.LeaveThisFieldEmpty,
        dict.Married,
        dict.HaveABoyfriendOrGirlfriend,
        dict.LookingFor,
        dict.Single
    ], [dict.SelectYourFamilyStatus]);

    const attitudeToAlcohol = useMemo(() => [
		dict.LeaveThisFieldEmpty,
        dict.SharplyNegative,
        dict.Negative,
        dict.Neutral,
        dict.Positive,
        dict.SharplyPositive
    ], [dict.SelectYourAttitudeToAlcohol]);
    const attitudeToSmocking = useMemo(() => [
		dict.LeaveThisFieldEmpty,
        dict.SharplyNegative,
        dict.Negative,
        dict.Neutral,
        dict.Positive,
        dict.SharplyPositive
    ], [dict.SelectYourAttitudeToSmocking]);
    const attitudeToSport = useMemo(() => [
		dict.LeaveThisFieldEmpty,
        dict.SharplyNegative,
        dict.Negative,
        dict.Neutral,
        dict.Positive,
        dict.SharplyPositive
    ], [dict.SelectYourAttitudeToSport]);

    const [familyStatusIndex, setFamilyStatusIndex] = useState(() => {
        const index = ProfileStore.family_status;
        if (index === -1) {
            return 0;
        }
        return index;
    });
    const [attitudeToAlcoholIndex, setAttitudeToAlcoholIndex] = useState(() => {
        const index = ProfileStore.attitude_to_alcohol;
        if (index === -1) {
            return 0;
        }
        return index;
    });
    const [attitudeToSmockingIndex, setAttitudeToSmockingIndex] = useState(() => {
        const index = ProfileStore.attitude_to_smocking;
        if (index === -1) {
            return 0;
        }
        return index;
    });
    const [attitudeToSportIndex, setAttitudeToSportIndex] = useState(() => {
        const index = ProfileStore.attitude_to_sport;
        if (index === -1) {
            return 0;
        }
        return index;
    });

	const declineChanges = useCallback(() => {
		stopChange();
	}, []);

	const acceptChanges = useCallback(() => {
		const res = api.changeProfile({
			address: address,
			description: description,
			dreams: dreams,
			favoriteBooks: favoriteBooks,
			favoriteFilms: favoriteFilms,
			favoriteGames: favoriteGames,
			favoriteMeals: favoriteMeals,
			name: name,
			surname: surname,

			familyStatus: familyStatusIndex != 0 ? familyStatusIndex : -1,
			attitudeToAlcohol: attitudeToAlcoholIndex != 0 ? attitudeToAlcoholIndex : -1,
			attitudeToSmocking: attitudeToSmockingIndex != 0 ? attitudeToSmockingIndex : -1,
			attitudeToSport: attitudeToSportIndex != 0 ? attitudeToSportIndex : -1,
		});
		res.then((res) => {
			if (res.status != 204) {
				throw new Error(res.statusText);
			}
			ProfileStore.changeProfile({
				address: address,
				description: description,
				dreams: dreams,
				favoriteBooks: favoriteBooks,
				favoriteFilms: favoriteFilms,
				favoriteGames: favoriteGames,
				favoriteMeals: favoriteMeals,
				name: name,
				surname: surname,

				familyStatus: familyStatusIndex != 0 ? familyStatusIndex : -1,
				attitudeToAlcohol: attitudeToAlcoholIndex != 0 ? attitudeToAlcoholIndex: -1,
				attitudeToSmocking: attitudeToSmockingIndex != 0 ? attitudeToSmockingIndex : -1,
				attitudeToSport: attitudeToSportIndex != 0 ? attitudeToSportIndex : -1
			});
		})

		stopChange();
	}, [address, description, dreams, favoriteBooks, favoriteFilms, favoriteGames, favoriteMeals, name, surname, familyStatusIndex, attitudeToAlcoholIndex, attitudeToSmockingIndex, attitudeToSportIndex]);

    return (
        <div className={styles.changeMenu} style={{margin: "0 14px"}}>
            <div className={styles_leftPanel.leftPanel} style={{height: '170px', marginRight: '5px'}}>
                <LazyAvatar size={130} borderRadius={"50%"} style={{marginBottom: '10px'}} src={ProfileStore.avatar === "" ? "" :`/${ProfileStore.id}/Image/${ProfileStore.avatar}`} />
                <div className={styles_leftPanel.button}>{dict.ChangeAvatar}</div>
            </div>
            <div className={styles.propertiesPart}>
                <div style={{display: 'flex', alignItems: 'end', marginBottom: '10px'}}>
                    <Input onChangeValue={setName} blockStyle={{width: '170px', marginRight: '5px'}} dict={inputDict} placeholder={dict.TypeYourName} withLabel={true} checkSpace={false} maxLength={16} minLength={1} type={"cross"} startValue={ProfileStore.name} defaultValue={ProfileStore.name} reg={"eng_and_rus"} />
                    <Input onChangeValue={setSurname} blockStyle={{width: '320px'}} dict={inputDict} placeholder={dict.TypeYourSurname} withLabel={true} checkSpace={false} maxLength={32} minLength={1} type={"cross"} startValue={ProfileStore.surname} defaultValue={ProfileStore.surname} reg={"eng_and_rus"} />
                </div>
                <Input onChangeValue={setDescription} blockStyle={{width: '640px', marginRight: '5px', marginBottom: '10px'}} dict={inputDict} placeholder={dict.TypeDescription} withLabel={true} checkSpace={false} maxLength={256} minLength={-1} type={"cross"} startValue={ProfileStore.description} defaultValue={ProfileStore.description ? ProfileStore.description : ""} reg={"all"} />
                <Select onChangeValue={setFamilyStatusIndex} options={familyStatus} blockStyle={{width: '640px', marginRight: '5px', marginBottom: '10px'}} placeholder={dict.SelectYourFamilyStatus} withLabel={true} value={familyStatusIndex} />
                <Input onChangeValue={setAddress} blockStyle={{width: '640px', marginRight: '5px', marginBottom: '10px'}} dict={inputDict} placeholder={dict.WriteYourAddress} withLabel={true} checkSpace={false} maxLength={256} minLength={-1} type={"cross"} startValue={ProfileStore.place_of_residence} defaultValue={ProfileStore.place_of_residence ? ProfileStore.place_of_residence : ""} reg={"all"} />
                <Select onChangeValue={setAttitudeToAlcoholIndex} options={attitudeToAlcohol} blockStyle={{width: '640px', marginRight: '5px', marginBottom: '10px'}} placeholder={dict.SelectYourAttitudeToAlcohol} withLabel={true} value={attitudeToAlcoholIndex} />
                <Select onChangeValue={setAttitudeToSmockingIndex} options={attitudeToSmocking} blockStyle={{width: '640px', marginRight: '5px', marginBottom: '10px'}} placeholder={dict.SelectYourAttitudeToSmocking} withLabel={true} value={attitudeToSmockingIndex} />
                <Select onChangeValue={setAttitudeToSportIndex} options={attitudeToSport} blockStyle={{width: '640px', marginRight: '5px', marginBottom: '10px'}} placeholder={dict.SelectYourAttitudeToSport} withLabel={true} value={attitudeToSportIndex} />
                <Input onChangeValue={setFavoriteMeals} blockStyle={{width: '640px', marginRight: '5px', marginBottom: '10px'}} dict={inputDict} placeholder={dict.WriteYourFavoriteMeals} withLabel={true} checkSpace={false} maxLength={256} minLength={-1} type={"cross"} startValue={ProfileStore.favourites_meals} defaultValue={ProfileStore.favourites_meals ? ProfileStore.favourites_meals : ""} reg={"all"} />
                <Input onChangeValue={setFavoriteBooks} blockStyle={{width: '640px', marginRight: '5px', marginBottom: '10px'}} dict={inputDict} placeholder={dict.WriteYourFavoriteBooks} withLabel={true} checkSpace={false} maxLength={256} minLength={-1} type={"cross"} startValue={ProfileStore.favourites_books} defaultValue={ProfileStore.favourites_books ? ProfileStore.favourites_books : ""} reg={"all"} />
                <Input onChangeValue={setFavoriteGames} blockStyle={{width: '640px', marginRight: '5px', marginBottom: '10px'}} dict={inputDict} placeholder={dict.WriteYourFavoriteGames} withLabel={true} checkSpace={false} maxLength={256} minLength={-1} type={"cross"} startValue={ProfileStore.favourites_games} defaultValue={ProfileStore.favourites_games ? ProfileStore.favourites_games : ""} reg={"all"} />
                <Input onChangeValue={setFavoriteFilms} blockStyle={{width: '640px', marginRight: '5px', marginBottom: '10px'}} dict={inputDict} placeholder={dict.WriteYourFavoriteFilms} withLabel={true} checkSpace={false} maxLength={256} minLength={-1} type={"cross"} startValue={ProfileStore.favourites_films} defaultValue={ProfileStore.favourites_films ? ProfileStore.favourites_films : ""} reg={"all"} />
                <Input onChangeValue={setDreams} blockStyle={{width: '640px', marginRight: '5px', marginBottom: '10px'}} dict={inputDict} placeholder={dict.DescribeYourDreams} withLabel={true} checkSpace={false} maxLength={256} minLength={-1} type={"cross"} startValue={ProfileStore.dreams} defaultValue={ProfileStore.dreams ? ProfileStore.dreams : ""} reg={"all"} />
                <div className={styles.buttonBlock}>
                   <div onClick={declineChanges} className={styles.button} style={{backgroundColor: "var(--red)", marginRight: '5px'}}>{dict.NotSafe}</div>
                   <div onClick={acceptChanges} className={styles.button} style={{backgroundColor: "var(--green)"}}>{dict.Safe}</div>
                </div>
            </div>
        </div>
    );
});