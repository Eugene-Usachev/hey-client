import {API, APIConfig} from "@/libs/api/API";
import {refresh} from "@/requests/refresh";
import {logout} from "@/utils/logout";
import {MessageStyles} from "@/libs/api/Logger";
import {USERID} from "@/app/config";

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
				favourites_meals: params.favoriteMeals,
				favourites_books: params.favoriteBooks,
				favourites_games: params.favoriteGames,
				favourites_films: params.favoriteFilms,
				dreams: params.dreams,
				family_status: params.familyStatus,
				attitude_to_smocking: params.attitudeToSmocking,
				attitude_to_sport: params.attitudeToSport,
				attitude_to_alcohol: params.attitudeToAlcohol,
			})
		})
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
		if (!authorId || authorId < 1 || typeof authorId !== "number") {
			throw new Error("Missing params");
		}
		if (offset === undefined || offset < 0 || typeof offset !== "number") {
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
	domain: "http://localhost:4040",
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