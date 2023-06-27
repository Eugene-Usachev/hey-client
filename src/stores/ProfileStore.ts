import {action, observable} from "mobx";
import {USERID} from "@/app/config";

export interface ProfileInfo {
	name: string;
	surname: string;
	friends: number[];
	subscribers: number[];
	avatar: string;
	birthday: string;
	favourites_books: string;
	favourites_films: string;
	favourites_games: string;
	favourites_meals: string;
	description: string;
	family_status: string;
	place_of_residence: string;
	attitude_to_smocking: string;
	attitude_to_sport: string;
	attitude_to_alcohol: string;
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
}

export const ProfileStore = observable<ProfileStoreInterface>({
	id: -1,
	name: '',
	surname: '',
	friends: [],
	subscribers: [],
	avatar: '',
	birthday: '',
	favourites_books: '',
	favourites_films: '',
	favourites_games: '',
	favourites_meals: '',
	description: '',
	family_status: '',
	place_of_residence: '',
	attitude_to_smocking: '',
	attitude_to_sport: '',
	attitude_to_alcohol: '',
	dreams: '',
	friendStatus: FriendStatus.first,
	mysubs: [],

	setInfo: action((id, info, mysubs) => {
		ProfileStore.id = id;
		ProfileStore.name = info.name;
		ProfileStore.surname = info.surname;
		ProfileStore.friends = info.friends;
		ProfileStore.subscribers = info.subscribers;
		ProfileStore.avatar = info.avatar;
		ProfileStore.birthday = info.birthday;
		ProfileStore.favourites_books = info.favourites_books;
		ProfileStore.favourites_films = info.favourites_films;
		ProfileStore.favourites_games = info.favourites_games;
		ProfileStore.favourites_meals = info.favourites_meals;
		ProfileStore.description = info.description;
		ProfileStore.family_status = info.family_status;
		ProfileStore.place_of_residence = info.place_of_residence;
		ProfileStore.attitude_to_smocking = info.attitude_to_smocking;
		ProfileStore.attitude_to_sport = info.attitude_to_sport;
		ProfileStore.attitude_to_alcohol = info.attitude_to_alcohol;
		ProfileStore.dreams = info.dreams;
		ProfileStore.mysubs = mysubs;
	}),

	changeFriendStatus: action((status) => {
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
	})
})