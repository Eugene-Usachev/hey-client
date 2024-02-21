import {API, APIConfig} from "@/libs/api/API";
import {refresh} from "@/requests/refresh";
import {logout} from "@/utils/logout";
import {MessageStyles} from "@/libs/api/Logger";
import {USERID} from "@/app/config";
import {MiniUser, MiniUsersStore} from "@/stores/MiniUsersStore";
import {WsResponseMethod} from "@/types/wsResponseMethod";
import {WsRequestMethods} from "@/libs/api/WsRequestMethods";
import {ProfileStore} from "@/stores/ProfileStore";
import {DOMAIN_FOR_SERVER} from "@/app/server_config";

export class ProfileAPI {
	public readonly sender: API;
	constructor(cfg: APIConfig) {
		this.sender = new API(cfg)
	}

	getUser(params: getUser): Promise<Response> {
		if (params.id === undefined || +params.id < 1 || typeof params.id !== "number") {
			throw new Error("Missing params");
		}
		return this.sender.get("/api/user/" + params.id, {
			cache: 'no-cache',
		})
	}

	async getUserInServer(params: getUser): Promise<Response> {
		if (params.id === undefined || +params.id < 1 || typeof params.id !== "number") {
			throw new Error("Missing params");
		}
		const res = await fetch("https://" +DOMAIN_FOR_SERVER + "/api/user/" + params.id, {
		    method: 'GET',
			cache: 'no-cache',
		});

		return res;
	}

	async wsConnect() {
		await this.sender.wsConnect();
		this.sender.wsSetHandler(wsHandler);
		MiniUsersStore.setWsSender(this.sender);
	}

	wsDisconnect() {
		this.sender.wsDisconnect();
	}

	async isOnline(id: number) {
		this.sender.wsSend({
			responseMethod: WsResponseMethod.GET_ONLINE_USERS,
			requestMethod: WsRequestMethods.getOnlineUsers,
			body: JSON.stringify([id]),
		});
	}

	async getSubs(): Promise<number[]> {
		if (!USERID || isNaN(+USERID) || +USERID < 1) {
			return [];
		}
		const resp = await this.sender.getAuth("/api/user/subs/", {
			cache: 'no-cache',
		})

		if (resp.status === 200) {
			return resp.json()
		} else {
			return [];
		}
	}

	async subscribe(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}
		return this.sender.patchAuth("/api/user/subscribers/add/" + id, {
			cache: 'no-cache',
		})
	}

	async unsubscribe(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}
		return this.sender.patchAuth("/api/user/subscribers/delete/" + id, {
			cache: 'no-cache',
		})
	}

	async addFriend(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}
		return this.sender.patchAuth("/api/user/friends/add/" + id, {
			cache: 'no-cache',
		})
	}

	async deleteFriend(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}
		return this.sender.patchAuth("/api/user/friends/delete/" + id, {
			cache: 'no-cache',
		})
	}

	async changeProfile(params: changeProfileParams): Promise<Response> {
		if (!params.name || params.name.length < 1 || typeof params.name !== "string") {
			throw new Error("Missing params");
		}
		if (!params.surname || params.surname.length < 1 || typeof params.surname !== "string") {
			throw new Error("Missing params");
		}

		return this.sender.patchAuth("/api/user/", {
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: params.name,
				surname: params.surname,
				// TODO avatar
				avatar: "",
				// TODO birthday
				birthday: "",
				description: params.description,
				place_of_residence: params.address,
				favorites_meals: params.favoriteMeals,
				favorites_books: params.favoriteBooks,
				favorites_games: params.favoriteGames,
				favorites_films: params.favoriteFilms,
				dreams: params.dreams,
				family_status: params.familyStatus,
				attitude_to_smocking: params.attitudeToSmocking,
				attitude_to_sport: params.attitudeToSport,
				attitude_to_alcohol: params.attitudeToAlcohol,
			})
		})
	}

	changeAvatar(avatar: File): Promise<Response> {
		const formData = new FormData();
		formData.append("avatar", avatar);
		return this.sender.patchAuth("/api/user/avatar/", {
			body: formData
		});
	}

	async createPost(post: PostDTO, survey: CreateSurveyDTO | null): Promise<Response> {
		const postJSON = JSON.stringify(post);
		const surveyJSON = survey !== null ? JSON.stringify(survey) : "";
		const formData = new FormData();
		formData.append("post", postJSON);
		formData.append("survey", surveyJSON);

		return this.sender.postAuth("/api/post/", {
			body: formData
		});
	}

	async getPosts(params: getPostsParams): Promise<Response> {
		const { authorId, offset } = params;
		if (!authorId || authorId < 1) {
			throw new Error("Missing params");
		}
		if (offset === undefined || offset < 0) {
			throw new Error("Missing params");
		}

		const fst = localStorage.getItem("accessToken");
		if (!fst) {
			return this.sender.get(`/api/post/${authorId}?offset=${offset}`, {
				cache: 'no-cache',
			})
		}

		return this.sender.get(`/api/post/${authorId}?offset=${offset}`, {
			cache: 'no-cache',
			headers: {
				"Authorization": fst,
			},
		})
	}

	async getMiniUsers(userIds: number[]): Promise<MiniUser[]> {
		let stringsIds = JSON.stringify(userIds);
		stringsIds = stringsIds.slice(1, stringsIds.length - 1);
		stringsIds = '(' + stringsIds + ')';
		const res = await this.sender.get("/api/user/many/?idsOfUsers=" + stringsIds, {
			cache: 'no-cache',
		});

		if (res.status === 200) {
			return await res.json();
		}
		return [];
	}

	async likePost(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}

		return this.sender.patchAuth(`/api/post/${id}/likes/like`, {
			cache: 'no-cache',
		})
	}

	async unlikePost(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}

		return this.sender.patchAuth(`/api/post/${id}/likes/unlike`, {
			cache: 'no-cache',
		})
	}

	async dislikePost(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}

		return this.sender.patchAuth(`/api/post/${id}/dislikes/dislike`, {
			cache: 'no-cache',
		})
	}

	async undislikePost(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}

		return this.sender.patchAuth(`/api/post/${id}/dislikes/undislike`, {
			cache: 'no-cache',
		})
	}

	async voteInSurvey(id: number, votedFor: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}
		if (votedFor < 1 || typeof votedFor !== "number") {
			throw new Error("Missing params");
		}

		return this.sender.patchAuth(`/api/post/${id}/survey`, {
			cache: 'no-cache',
			body: JSON.stringify({
				voted_for: votedFor
			})
		})
	}

	async deletePost(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}

		return this.sender.deleteAuth(`/api/post/${id}`, {
			cache: 'no-cache',
		});
	}

	async getComments(params: getCommentsParams): Promise<Response> {
		const { postId, offset } = params;
		if (!postId || postId < 1 || typeof postId !== "number") {
			throw new Error("Missing params");
		}
		if (offset === undefined || offset < 0 || typeof offset !== "number") {
			throw new Error("Missing params");
		}

		const fst = localStorage.getItem("accessToken");
		if (!fst) {
			return this.sender.get(`/api/comment/${postId}?offset=${offset}`, {
				cache: 'no-cache',
			})
		}

		return this.sender.get(`/api/comment/${postId}?offset=${offset}`, {
			cache: 'no-cache',
			headers: {
				"Authorization": fst,
			},
		})
	}

	async createComment(postId: number, comment: CommentDTO): Promise<Response> {
		return this.sender.postAuth("/api/comment/" + postId, {
			body: JSON.stringify(comment),
		})
	}

	async likeComment(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}

		return this.sender.patchAuth(`/api/comment/${id}/likes/like`, {
			cache: 'no-cache',
		})
	}

	async unlikeComment(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}

		return this.sender.patchAuth(`/api/comment/${id}/likes/unlike`, {
			cache: 'no-cache',
		})
	}

	async dislikeComment(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}

		return this.sender.patchAuth(`/api/comment/${id}/dislikes/dislike`, {
			cache: 'no-cache',
		})
	}

	async undislikeComment(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}

		return this.sender.patchAuth(`/api/comment/${id}/dislikes/undislike`, {
			cache: 'no-cache',
		})
	}

	async deleteComment(id: number): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}

		return this.sender.deleteAuth(`/api/comment/${id}`, {
			cache: 'no-cache',
		})
	}

	async updateComment(id: number, comment: CommentUpdateDTO): Promise<Response> {
		if (!id || id < 1 || typeof id !== "number") {
			throw new Error("Missing params");
		}

		const commentJSON = JSON.stringify(comment);
		return this.sender.patchAuth(`/api/comment/${id}`, {
			body: commentJSON,
			cache: 'no-cache',
		})
	}
}

const wsHandler = (method: string, data: any) => {
	switch (method) {
		case WsResponseMethod.GET_ONLINE_USERS: {
			if ((data as number[]).indexOf(ProfileStore.id) > -1) {
				ProfileStore.setOnline(true);
			}
			MiniUsersStore.handleGetOnlineUsers(data);
			return;
		}

		case WsResponseMethod.USER_ONLINE: {
			if (+data === ProfileStore.id) {
				ProfileStore.setOnline(true);
				return;
			}
			MiniUsersStore.handleUserOnlineStatusChange(+data, true);
			return;
		}

		case WsResponseMethod.USER_OFFLINE: {
			if (+data === ProfileStore.id) {
				ProfileStore.setOnline(false);
				return;
			}
			MiniUsersStore.handleUserOnlineStatusChange(+data, false);
			return;
		}

		default:
			return;
	}
}

export interface CreateSurveyDTO {
	data: string[];
	background: number;
	is_multi_voices: boolean;
}

export interface PostDTO {
	data:        string;
	files:       string[];
	have_survey: boolean;
}

export let api = new ProfileAPI({
	domain: "https://localhost:4040",
	loggerCfg: {
		showDate: true,
		readyStyleName: MessageStyles.success,
		baseStyle: undefined,
		errorStyle: undefined,
		warnStyle: undefined,
		infoStyle: undefined,
		readyStyle: undefined,
		successStyle: undefined,
	},
	refreshFunc: refresh,
	logoutFunc: logout,
})

interface getUser {
	id: number;
}

export interface changeProfileParams {
	name: string;
	surname: string;
	description: string;
	address: string;
	favoriteMeals: string;
	favoriteBooks: string;
	favoriteGames: string;
	favoriteFilms: string;
	dreams: string;

	familyStatus: number;
	attitudeToAlcohol: number;
	attitudeToSmocking: number;
	attitudeToSport: number;
}

export interface getPostsParams {
	authorId: number;
	offset: number;
}

export interface getCommentsParams {
	postId: number;
	offset: number;
}

export interface CommentDTO {
	parent_comment_id: number;
	data: string;
	files: string[];
}

export interface CommentUpdateDTO {
	data: string;
	files: string[];
}