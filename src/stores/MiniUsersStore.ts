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

	addUsers(users: MiniUser[]): void;
}

export const MiniUsersStore: MiniUsersStore = observable<MiniUsersStore>({
	users: [],

	addUsers: action((users: MiniUser[]) => {
		for (const user of users) {
			// TODO we use sort bonus only in messenger now
			MiniUsersStore.users.insertObj<MiniUser>(user, 'id');
		}
	})
});