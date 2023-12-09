import {action, observable} from "mobx";
import {USERID} from "@/app/config";
import {changeProfileParams} from "@/app/[lang]/(pagesWithLayout)/profile/ProfileAPI";

export interface ProfileInfo {
	name: string;
	surname: string;
	friends: number[];
	subscribers: number[];
	avatar: string;
	birthday: string;
	favorites_books: string;
	favorites_films: string;
	favorites_games: string;
	favorites_meals: string;
	description: string;
	family_status: number;
	place_of_residence: string;
	attitude_to_smocking: number;
	attitude_to_sport: number;
	attitude_to_alcohol: number;
	dreams: string;
}

export const enum FriendStatus {
	idol,
	friend,
	subscriber,
	nobody,
	first,
}

export interface ProfileStoreInterface extends ProfileInfo{
	id: number;
	friendStatus: FriendStatus;
	mysubs: number[];

	setInfo(id: number, info: ProfileInfo, mysubs: number[]): void
	changeFriendStatus(status: FriendStatus): void
	changeProfile(params: changeProfileParams): void
}

export const ProfileStore: ProfileStoreInterface = observable<ProfileStoreInterface>({
	id: -1,
	name: '',
	surname: '',
	friends: [],
	subscribers: [],
	avatar: '',
	birthday: '',
	favorites_books: '',
	favorites_films: '',
	favorites_games: '',
	favorites_meals: '',
	description: '',
	family_status: -1,
	place_of_residence: '',
	attitude_to_smocking: -1,
	attitude_to_sport: -1,
	attitude_to_alcohol: -1,
	dreams: '',
	friendStatus: FriendStatus.first,
	mysubs: [],

	setInfo: action((id: number, info: ProfileInfo, mysubs: number[]) => {
		ProfileStore.id = id;
		ProfileStore.name = info.name;
		ProfileStore.surname = info.surname;
		ProfileStore.friends = info.friends;
		ProfileStore.subscribers = info.subscribers;
		ProfileStore.avatar = info.avatar;
		ProfileStore.birthday = info.birthday;
		ProfileStore.favorites_books = info.favorites_books;
		ProfileStore.favorites_films = info.favorites_films;
		ProfileStore.favorites_games = info.favorites_games;
		ProfileStore.favorites_meals = info.favorites_meals;
		ProfileStore.description = info.description;
		ProfileStore.family_status = info.family_status;
		ProfileStore.place_of_residence = info.place_of_residence;
		ProfileStore.attitude_to_smocking = info.attitude_to_smocking;
		ProfileStore.attitude_to_sport = info.attitude_to_sport;
		ProfileStore.attitude_to_alcohol = info.attitude_to_alcohol;
		ProfileStore.dreams = info.dreams;
		ProfileStore.mysubs = mysubs;
	}),

	changeFriendStatus: action((status: FriendStatus) => {
		let index: number;
		switch (status) {
			case FriendStatus.idol:
				ProfileStore.subscribers.push(+USERID);
				break;
			case FriendStatus.friend:
				ProfileStore.friends.push(+USERID);
				index = ProfileStore.mysubs.indexOf(+USERID);
				while (index !== -1) {
					ProfileStore.mysubs.splice(index, 1);
					index = ProfileStore.mysubs.indexOf(+USERID);
				}
				break;
			case FriendStatus.subscriber:
				ProfileStore.mysubs.push(+USERID);
				index = ProfileStore.friends.indexOf(+USERID);
				while (index !== -1) {
					ProfileStore.friends.splice(index, 1);
					index = ProfileStore.friends.indexOf(+USERID);
				}
				ProfileStore.friends.splice(ProfileStore.friends.indexOf(+USERID), 1);
				break;
			case FriendStatus.nobody:
				index = ProfileStore.subscribers.indexOf(+USERID);
				while (index !== -1) {
					ProfileStore.subscribers.splice(index, 1);
					index = ProfileStore.subscribers.indexOf(+USERID);
				}
				break;
		}
		ProfileStore.friendStatus = status
	}),

	changeProfile(params: changeProfileParams) {
		ProfileStore.name = params.name;
		ProfileStore.surname = params.surname;
		// TODO ProfileStore.avatar = params.avatar;
		// TODO ProfileStore.birthday = params.birthday;
		ProfileStore.description = params.description;
		ProfileStore.family_status = params.familyStatus;
		ProfileStore.place_of_residence = params.address;
		ProfileStore.attitude_to_smocking = params.attitudeToSmocking;
		ProfileStore.attitude_to_sport = params.attitudeToSport;
		ProfileStore.attitude_to_alcohol = params.attitudeToAlcohol;
		ProfileStore.dreams = params.dreams;
		ProfileStore.favorites_meals = params.favoriteMeals;
		ProfileStore.favorites_books = params.favoriteBooks;
		ProfileStore.favorites_films = params.favoriteFilms;
		ProfileStore.favorites_games = params.favoriteGames;
	}
})