import {action, observable} from "mobx";

export interface MiniUser {
	id: number;
	name: string;
	surname: string;
	avatar: string;
	isOnline: boolean;
}

export interface MiniUsersStore {
	users: MiniUser[];

	setUsers(users: MiniUser[]): void;
}

export const MiniUsersStore: MiniUsersStore = observable<MiniUsersStore>({
	users: [],

	setUsers: action((users: MiniUser[]) => {
		MiniUsersStore.users.push(...users);
	})
});