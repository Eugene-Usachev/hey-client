import {action, observable, runInAction} from "mobx";
import {api, CreateSurveyDTO, PostDTO} from "@/app/[lang]/(pagesWithLayout)/profile/ProfileAPI";
import {ErrorAlert} from "@/components/Alerts/Alerts";
import {ProfileStore} from "@/stores/ProfileStore";

export const enum likesStatus {
	like = 1,
	dislike = -1,
	none = 0
}

export interface Post {
	id: number;
	likes: number;
	dislikes: number;
	likesStatus: likesStatus;
	data: string;
	date: number;
	files: string[];
	survey: Survey | null;
}

interface PostFromServer {
	id: number;
	likes: number;
	dislikes: number;
	likes_status: number;
	data: string;
	date: number;
	files: string[];
	have_survey: boolean;
}

export interface Survey {
	parentPostId: number;
	data: string[];
	sl0v: number;
	sl1v: number;
	sl2v: number;
	sl3v: number;
	sl4v: number;
	sl5v: number;
	sl6v: number;
	sl7v: number;
	sl8v: number;
	sl9v: number;
	votedFor: number[];
	background: number;
	isMultiVoices: boolean;
}

interface SurveyFromServer {
	parent_post_id: number,
	data: string[],
	sl0v: number,
	sl1v: number,
	sl2v: number,
	sl3v: number,
	sl4v: number,
	sl5v: number,
	sl6v: number,
	sl7v: number,
	sl8v: number,
	sl9v: number,
	voted_for: number,
	background: number,
	is_multi_voices: boolean
}

interface PostStoreInterface {
	posts: Post[];
	offset: number;
	isAllPost: boolean;
	wasGetPosts: boolean;
	isGettingPosts: boolean;

	addPost(post: PostDTO, survey: CreateSurveyDTO | null): Promise<Response>;
	getPosts(): Promise<number>;

	likePost(id: number): Promise<void>;
	unlikePost(id: number): Promise<void>;
	dislikePost(id: number): Promise<void>;
	undislikePost(id: number): Promise<void>;
	voteInSurvey(id: number, votedFor: number[]): Promise<void>;
	deletePost(id: number): Promise<void>;
}

export const PostStore: PostStoreInterface = observable<PostStoreInterface>({
	posts: [],
	offset: 0,
	isAllPost: false,
	wasGetPosts: false,
	isGettingPosts: false,

	addPost: action(async (postDTO: PostDTO, surveyDTO: CreateSurveyDTO | null) => {
		const res = await api.createPost(postDTO, surveyDTO);
		if (res.status !== 201) {
			switch (res.status) {
				case 400:
					ErrorAlert("Error creating post. Status: 400");
					return res;
				case 500:
					ErrorAlert("Error creating post. Status: 500");
					return res;
				default:
					ErrorAlert("Error creating post. Status: " + res.status);
					return res;
			}
		}

		const id = (await res.json() as { id: number }).id;
		const post: Post = {
			id: id,
			likes: 0,
			dislikes: 0,
			likesStatus: likesStatus.none,
			data: postDTO.data,
			date: 0,
			files: postDTO.files,
			survey: surveyDTO !== null ? {
				parentPostId: id,
				data: surveyDTO.data,
				sl0v: 0,
				sl1v: 0,
				sl2v: 0,
				sl3v: 0,
				sl4v: 0,
				sl5v: 0,
				sl6v: 0,
				sl7v: 0,
				sl8v: 0,
				sl9v: 0,
				votedFor: [],
				background: surveyDTO.background,
				isMultiVoices: surveyDTO.is_multi_voices,
			} : null,
		}
		runInAction(() => {
			PostStore.posts = [post, ...PostStore.posts];
		});
		return res;
	}),

	getPosts: action(async (): Promise<number> => {
		if (PostStore.isAllPost || ProfileStore.id === -1 || PostStore.isGettingPosts) {
			return 0;
		}

		PostStore.isGettingPosts = true;

		const res = await api.getPosts({
			offset: PostStore.offset,
			authorId: ProfileStore.id
		});
		if (res.status !== 200) {
			switch (res.status) {
				case 400:
					ErrorAlert("Error getting posts. Status: 400");
					return 0;
				case 500:
					ErrorAlert("Error getting posts. Status: 500");
					return 0;
				default:
					ErrorAlert("Error getting posts. Status: " + res.status);
					return 0;
			}
		}

		const parseResponse: {
			posts: PostFromServer[];
			surveys: SurveyFromServer[];
		} = await res.json();
		const buf: Post[] = [];
		if (!parseResponse || parseResponse.posts.length === 0) {
			runInAction(() => {
				PostStore.wasGetPosts = true;
				PostStore.offset += parseResponse.posts.length;
				PostStore.isAllPost = true;
				PostStore.posts = [];
				PostStore.isGettingPosts = false;
			});
			return 0;
		}
		for (const post of parseResponse.posts) {
			let surveyForPost: Survey | null = null;
			if (post.have_survey) {
				for (const survey of parseResponse.surveys) {
					if (survey.parent_post_id == post.id) {
						const votedFor = [];
						// survey.voted_for is uint16. Every bit is a vote, like 0101000000000000 means vote for 2 line and 4 line.
						for (let i = 0; i < 16; i++) {
							if (survey.voted_for & (1 << i)) {
								votedFor.push(i);
							}
						}
						surveyForPost = {
							parentPostId: post.id,
							data: survey.data,
							sl0v: survey.sl0v,
							sl1v: survey.sl1v,
							sl2v: survey.sl2v,
							sl3v: survey.sl3v,
							sl4v: survey.sl4v,
							sl5v: survey.sl5v,
							sl6v: survey.sl6v,
							sl7v: survey.sl7v,
							sl8v: survey.sl8v,
							sl9v: survey.sl9v,
							votedFor: votedFor,
							background: survey.background,
							isMultiVoices: survey.is_multi_voices,
						}
					}
				}
			}
			buf.push({
				id: post.id,
				likes: post.likes,
				dislikes: post.dislikes,
				likesStatus: post.likes_status,
				data: post.data,
				date: post.date,
				files: post.files,
				survey: surveyForPost,
			})
		}
		runInAction(() => {
			PostStore.wasGetPosts = true;
			PostStore.offset += parseResponse.posts.length;
			PostStore.isAllPost = parseResponse.posts.length < 20;
			PostStore.posts = [...PostStore.posts, ...buf];
			PostStore.isGettingPosts = false;
		});

		return parseResponse.posts.length;
	}),

	likePost: action(async (id: number) => {
		const res = await api.likePost(id);
		if (res.status !== 204) {
			ErrorAlert("Error liking post. Status: " + res.status);
			return;
		}

		const post = PostStore.posts.find(p => p.id === id) as Post;
		runInAction(() => {
			if (post.likesStatus == likesStatus.dislike) {
				post.dislikes--;
			}
			post.likesStatus = likesStatus.like;
			post.likes++;
		});
	}),

	unlikePost: action(async (id: number) => {
		const res = await api.unlikePost(id);
		if (res.status !== 204) {
			ErrorAlert("Error unliking post. Status: " + res.status);
			return;
		}

		const post = PostStore.posts.find(p => p.id === id) as Post;
		runInAction(() => {
			post.likesStatus = likesStatus.none;
			post.likes--;
		});
	}),

	dislikePost: action(async (id: number) => {
		const res = await api.dislikePost(id);
		if (res.status !== 204) {
			ErrorAlert("Error disliking post. Status: " + res.status);
			return;
		}

		const post = PostStore.posts.find(p => p.id === id) as Post;
		runInAction(() => {
			if (post.likesStatus == likesStatus.like) {
				post.likes--;
			}
			post.likesStatus = likesStatus.dislike;
			post.dislikes++;
		});
	}),

	undislikePost: action(async (id: number) => {
		const res = await api.undislikePost(id);
		if (res.status !== 204) {
			ErrorAlert("Error undisliking post. Status: " + res.status);
			return;
		}

		const post = PostStore.posts.find(p => p.id === id) as Post;
		runInAction(() => {
			post.likesStatus = likesStatus.none;
			post.dislikes--;
		});
	}),

	voteInSurvey: action(async (id: number, votedFor: number[]) => {
		let votedForUint16 = 0;
		for (const v of votedFor) {
			votedForUint16 |= (1 << v);
		}
		const res = await api.voteInSurvey(id, votedForUint16);
		if (res.status !== 204) {
			ErrorAlert("Error voting in survey. Status: " + res.status);
			return;
		}

		const post = PostStore.posts.find(p => p.id === id) as Post;
		const survey: Survey = JSON.parse(JSON.stringify(post.survey!));
		survey.votedFor = votedFor;
		for (const v of votedFor) {
			switch (v) {
				case 0:
					survey.sl0v++;
					break;
				case 1:
					survey.sl1v++;
					break;
				case 2:
					survey.sl2v++;
					break;
				case 3:
					survey.sl3v++;
					break;
				case 4:
					survey.sl4v++;
					break;
				case 5:
					survey.sl5v++;
					break;
				case 6:
					survey.sl6v++;
					break;
				case 7:
					survey.sl7v++;
					break;
				case 8:
					survey.sl8v++;
					break;
				case 9:
					survey.sl9v++;
					break;
				default:
					return;
			}
		}

		runInAction(() => {
			post.survey = survey;
		});
	}),

	deletePost: action(async (id: number) => {
		const res = await api.deletePost(id);
		if (res.status !== 204) {
			ErrorAlert("Error deleting post. Status: " + res.status);
			return;
		}

		runInAction(() => {
			PostStore.posts = PostStore.posts.filter(p => p.id !== id);
		});
	})
});