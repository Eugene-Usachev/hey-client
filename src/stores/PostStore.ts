import {action, observable, runInAction} from "mobx";
import {api, CreateSurveyDTO, PostDTO} from "@/app/[lang]/(pagesWithLayout)/profile/ProfileAPI";
import {ErrorAlert} from "@/components/Alerts/Alerts";
import {USERID} from "@/app/config";
import {ProfileStore} from "@/stores/ProfileStore";

export interface Post {
	id: number;
	parentUserId: number;
	likes: number;
	liked_by: number[];
	dislikes: number;
	disliked_by: number[];
	data: string;
	date: number;
	files: string[];
	survey: Survey | null;
}

interface PostFromServer {
	id: number;
	parent_user_id: number;
	likes: number;
	liked_by: number[];
	dislikes: number;
	disliked_by: number[];
	data: string;
	date: number;
	files: string[];
	have_survey: boolean;
}

export interface Survey {
	parentPostId: number;
	data: string[];
	sl0v: number;
	sl0vby: number[];
	sl1v: number;
	sl1vby: number[];
	sl2v: number;
	sl2vby: number[];
	sl3v: number;
	sl3vby: number[];
	sl4v: number;
	sl4vby: number[];
	sl5v: number;
	sl5vby: number[];
	sl6v: number;
	sl6vby: number[];
	sl7v: number;
	sl7vby: number[];
	sl8v: number;
	sl8vby: number[];
	sl9v: number;
	sl9vby: number[];
	voted_by: number[];
	background: number;
	isMultiVoices: boolean;
}

interface SurveyFromServer {
	parent_post_id: number;
	data: string[];
	sl0v: number;
	sl0vby: number[];
	sl1v: number;
	sl1vby: number[];
	sl2v: number;
	sl2vby: number[];
	sl3v: number;
	sl3vby: number[];
	sl4v: number;
	sl4vby: number[];
	sl5v: number;
	sl5vby: number[];
	sl6v: number;
	sl6vby: number[];
	sl7v: number;
	sl7vby: number[];
	sl8v: number;
	sl8vby: number[];
	sl9v: number;
	sl9vby: number[];
	voted_by: number[];
	background: number;
	isMultiVoices: boolean;
}

interface PostStoreInterface {
	posts: Post[];
	offset: number;
	isAllPost: boolean;
	wasGetPosts: boolean;

	addPost(post: PostDTO, survey: CreateSurveyDTO | null): Promise<Response>;
	getPosts(): void;
}

export const PostStore: PostStoreInterface = observable<PostStoreInterface>({
	posts: [],
	offset: 0,
	isAllPost: false,
	wasGetPosts: false,

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
			parentUserId: +USERID,
			likes: 0,
			liked_by: [+USERID],
			dislikes: 0,
			disliked_by: [+USERID],
			data: postDTO.data,
			date:  0,
			files: postDTO.files,
			survey: surveyDTO !== null ? {
				parentPostId: id,
				data: surveyDTO.data,
				sl0v: 0,
				sl0vby: [],
				sl1v: 0,
				sl1vby: [],
				sl2v: 0,
				sl2vby: [],
				sl3v: 0,
				sl3vby: [],
				sl4v: 0,
				sl4vby: [],
				sl5v: 0,
				sl5vby: [],
				sl6v: 0,
				sl6vby: [],
				sl7v: 0,
				sl7vby: [],
				sl8v: 0,
				sl8vby: [],
				sl9v: 0,
				sl9vby: [],
				voted_by: [],
				background: surveyDTO.background,
				isMultiVoices: surveyDTO.is_multi_voices,
			} : null,
		}
		PostStore.posts = [post, ...PostStore.posts];
		return res;
	}),

	getPosts: action(async () => {
		if (PostStore.isAllPost || ProfileStore.id === -1) {
			return;
		}

		const res = await api.getPosts({
			offset: PostStore.offset,
			authorId: ProfileStore.id
		});
		if (res.status !== 200) {
			switch (res.status) {
				case 400:
					ErrorAlert("Error getting posts. Status: 400");
					return;
				case 500:
					ErrorAlert("Error getting posts. Status: 500");
					return;
				default:
					ErrorAlert("Error getting posts. Status: " + res.status);
					return;
			}
		}

		const parseResponse: {
			posts: PostFromServer[];
			surveys: SurveyFromServer[];
		} = await res.json();
		const buf: Post[] = [];
		for (const post of parseResponse.posts) {
			let surveyForPost: Survey | null = null;
			if (post.have_survey) {
				for (const survey of parseResponse.surveys) {
					if (survey.parent_post_id == post.id) {
						surveyForPost = {
							parentPostId: post.id,
							data: survey.data,
							sl0v: survey.sl0v,
							sl0vby: survey.sl0vby,
							sl1v: survey.sl1v,
							sl1vby: survey.sl1vby,
							sl2v: survey.sl2v,
							sl2vby: survey.sl2vby,
							sl3v: survey.sl3v,
							sl3vby: survey.sl3vby,
							sl4v: survey.sl4v,
							sl4vby: survey.sl4vby,
							sl5v: survey.sl5v,
							sl5vby: survey.sl5vby,
							sl6v: survey.sl6v,
							sl6vby: survey.sl6vby,
							sl7v: survey.sl7v,
							sl7vby: survey.sl7vby,
							sl8v: survey.sl8v,
							sl8vby: survey.sl8vby,
							sl9v: survey.sl9v,
							sl9vby: survey.sl9vby,
							voted_by: survey.voted_by,
							background: survey.background,
							isMultiVoices: survey.isMultiVoices,
						}
					}
				}
			}
			buf.push({
				id: post.id,
				parentUserId: post.parent_user_id,
				likes: post.likes,
				liked_by: post.liked_by,
				dislikes: post.dislikes,
				disliked_by: post.disliked_by,
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
		});
	})
});