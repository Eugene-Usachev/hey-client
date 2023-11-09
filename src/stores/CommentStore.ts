import {action, observable, runInAction} from "mobx";
import {api, CommentDTO, CommentUpdateDTO} from "@/app/[lang]/(pagesWithLayout)/profile/ProfileAPI";
import {ProfileStore} from "@/stores/ProfileStore";
import {ErrorAlert} from "@/components/Alerts/Alerts";
import {likesStatus} from "@/stores/PostStore";
import {TopProfileStore} from "@/stores/TopProfileStore";
import {MiniUsersStore} from "@/stores/MiniUsersStore";
import {USERID} from "@/app/config";

export interface Comment {
	id: number;
	parentPostId: number;
	data: string;
	date: number;
	parentUserId: number;
	likes: number;
	dislikes: number;
	likesStatus: number;
	files: string[];
	parentCommentId: number;
}

interface CommentFromServer {
	id: number;
	parent_post_id: number;
	data: string;
	date: number;
	parent_user_id: number;
	likes: number;
	dislikes: number;
	likes_status: number;
	files: string[];
	parent_comment_id: number;
}

interface CommentStoreInterface {
	/** We store comments for 10 posts**/
	posts: CommentsForPost[],
	/** ID of post to get comments for.**/
	gettingIDs: Set<number>,

	createComment(parentPostId: number, dto: CommentDTO): Promise<void>;
	getCommentsForPost(postId: number): Promise<number>;
	likeComment(postId: number, commentId: number): Promise<void>;
	unlikeComment(postId: number, commentId: number): Promise<void>;
	dislikeComment(postId: number, commentId: number): Promise<void>;
	undislikeComment(postId: number, commentId: number): Promise<void>;
	deleteComment(postId: number, commentId: number): Promise<void>;
	updateComment(postId: number, commentId: number, comment: CommentUpdateDTO): Promise<void>;
}

export const CommentStore: CommentStoreInterface = observable<CommentStoreInterface>({
	posts: [],
	gettingIDs: new Set<number>(),

	createComment: action(async (parentPostId: number, dto: CommentDTO) => {
		const res = await api.createComment(parentPostId, dto);
		if (res.status !== 201) {
			ErrorAlert("Error creating comment. Status: " + res.status);
			return;
		}

		const commentInfo = CommentStore.posts.find((info) => info.postId === parentPostId);
		if (!commentInfo) {
			return;
		}

		const id = await res.json() as number;

		runInAction(() => {
			const comment = {
				id: id,
				parentPostId: parentPostId,
				data: dto.data,
				date: 0,
				parentUserId: +(localStorage.getItem("id") || -1),
				likes: 0,
				dislikes: 0,
				likesStatus: likesStatus.none,
				files: dto.files,
				parentCommentId: dto.parent_comment_id,
			};
			commentInfo.comments = [comment, ...commentInfo.comments];
		});
	}),

	getCommentsForPost: action(async (postId: number) => {
		if (CommentStore.gettingIDs.has(postId)) return 0;
		CommentStore.gettingIDs.add(postId);

		const index = CommentStore.posts.findIndex((info) => {
			return info.postId === postId;
		});

		let commentsForPost: CommentsForPost;

		if (index === -1) {
			commentsForPost = {
				postId: postId,
				offset: 0,
				isAll: false,
				wasGet: false,
				comments: [],
			}
		} else {
			commentsForPost = JSON.parse(JSON.stringify(CommentStore.posts.splice(index, 1)[0]));
		}

		if (commentsForPost.isAll || ProfileStore.id === -1) {
			if (CommentStore.posts.length > 9) {
				CommentStore.posts.shift();
			}
			CommentStore.posts.push(commentsForPost);
			CommentStore.gettingIDs.delete(postId);
			return 0;
		}

		const res = await api.getComments({postId: postId, offset: commentsForPost.offset});
		if (res.status !== 200) {
			switch (res.status) {
				case 400:
					ErrorAlert("Error getting comments. Status: 400");
					if (CommentStore.posts.length > 9) {
						CommentStore.posts.shift();
					}
					CommentStore.posts.push(commentsForPost);
					CommentStore.gettingIDs.delete(postId);
					return 0;
				case 500:
					ErrorAlert("Error getting comments. Status: 500");
					if (CommentStore.posts.length > 9) {
						CommentStore.posts.shift();
					}
					CommentStore.posts.push(commentsForPost);
					CommentStore.gettingIDs.delete(postId);
					return 0;
				default:
					ErrorAlert("Error getting comments. Status: " + res.status);
					if (CommentStore.posts.length > 9) {
						CommentStore.posts.shift();
					}
					CommentStore.posts.push(commentsForPost);
					CommentStore.gettingIDs.delete(postId);
					return 0;
			}
		}

		commentsForPost.wasGet = true;
		const comments = await res.json();
		if (!comments || comments.length === 0) {
			if (CommentStore.posts.length > 9) {
				CommentStore.posts.shift();
			}
			CommentStore.posts.push(commentsForPost);
			CommentStore.gettingIDs.delete(postId);
			return 0;
		}

		const needToGet = new Set<number>();

		for (const commentFromServer of comments as CommentFromServer[]) {
			const comment: Comment = {
				id: commentFromServer.id,
				parentPostId: commentFromServer.parent_post_id,
				data: commentFromServer.data,
				date: commentFromServer.date,
				parentUserId: commentFromServer.parent_user_id,
				likes: commentFromServer.likes,
				dislikes: commentFromServer.dislikes,
				likesStatus: commentFromServer.likes_status,
				files: commentFromServer.files,
				parentCommentId: commentFromServer.parent_comment_id,
			}
			commentsForPost.comments.push(comment);
			const index = MiniUsersStore.users.findIndex((user) => user.id === comment.parentUserId);
			if (index === -1) {
				if (comment.parentUserId !== +USERID) {
					needToGet.add(comment.parentUserId)
				} else {
					MiniUsersStore.users.push({
						id: +USERID,
						avatar: TopProfileStore.avatar || "",
						name: TopProfileStore.name,
						surname: TopProfileStore.surname,
						isOnline: true
					});
				}
			}
		}

		const needToGetArr = Array.from(needToGet);
		if (needToGetArr.length > 0) {
			MiniUsersStore.setUsers(await api.getMiniUsers(needToGetArr));
		}

		commentsForPost.isAll = comments.length < 20;
		commentsForPost.offset += comments.length;
		commentsForPost.wasGet = true;

		runInAction(() => {
			if (CommentStore.posts.length > 9) {
				CommentStore.posts.shift();
			}
			CommentStore.posts.push(commentsForPost);
			CommentStore.gettingIDs.delete(postId);
		});

		return comments.length;
	}),

	likeComment: action(async (postId: number, commentId: number) => {
		const res = await api.likeComment(commentId);
		if (res.status !== 204) {
			ErrorAlert("Error liking comment. Status: " + res.status);
			return;
		}

		const commentInfo = CommentStore.posts.find(c => c.postId  === postId) as CommentsForPost;
		const comment = commentInfo.comments.find(c => c.id === commentId) as Comment;
		runInAction(() => {
			if (comment.likesStatus == likesStatus.dislike) {
				comment.dislikes--;
			}
			comment.likesStatus = likesStatus.like;
			comment.likes++;
		});
	}),

	unlikeComment: action(async (postId: number, commentId: number) => {
		const res = await api.unlikeComment(commentId);
		if (res.status !== 204) {
			ErrorAlert("Error unliking comment. Status: " + res.status);
			return;
		}

		const commentInfo = CommentStore.posts.find(c => c.postId  === postId) as CommentsForPost;
		const comment = commentInfo.comments.find(c => c.id === commentId) as Comment;

		runInAction(() => {
			comment.likesStatus = likesStatus.none;
			comment.likes--;
		});
	}),

	dislikeComment: action(async (postId: number, commentId: number) => {
		const res = await api.dislikeComment(commentId);
		if (res.status !== 204) {
			ErrorAlert("Error disliking comment. Status: " + res.status);
			return;
		}

		const commentInfo = CommentStore.posts.find(c => c.postId  === postId) as CommentsForPost;
		const comment = commentInfo.comments.find(c => c.id === commentId) as Comment;
		runInAction(() => {
			if (comment.likesStatus == likesStatus.like) {
				comment.likes--;
			}
			comment.likesStatus = likesStatus.dislike;
			comment.dislikes++;
		});
	}),

	undislikeComment: action(async (postId: number, commentId: number) => {
		const res = await api.undislikeComment(commentId);
		if (res.status !== 204) {
			ErrorAlert("Error undisliking comment. Status: " + res.status);
			return;
		}

		const commentInfo = CommentStore.posts.find(c => c.postId  === postId) as CommentsForPost;
		const comment = commentInfo.comments.find(c => c.id === commentId) as Comment;

		runInAction(() => {
			comment.likesStatus = likesStatus.none;
			comment.dislikes--;
		});
	}),

	deleteComment: action(async (postId: number, commentId: number) => {
		const res = await api.deleteComment(commentId);
		if (res.status !== 204) {
			ErrorAlert("Error deleting comment. Status: " + res.status);
			return;
		}

		const commentInfo = CommentStore.posts.find(c => c.postId  === postId) as CommentsForPost;
		const commentIndex = commentInfo.comments.findIndex(c => c.id === commentId) as number;

		runInAction(() => {
			commentInfo.comments.splice(commentIndex, 1);
		});
	}),

	updateComment: action(async (postId: number, commentId: number, commentDTO: CommentUpdateDTO) => {
		const res = await api.updateComment(commentId, commentDTO);
		if (res.status !== 204) {
			ErrorAlert("Error updating comment. Status: " + res.status);
			return;
		}

		const commentInfo = CommentStore.posts.find(c => c.postId  === postId) as CommentsForPost;
		const comment = commentInfo.comments.find(c => c.id === commentId) as Comment;

		runInAction(() => {
			comment.data = commentDTO.data;
			comment.files = commentDTO.files;
		});
	})
});

export type CommentsForPost = {
	postId: number;
	offset: number;
	isAll: boolean;
	wasGet: boolean;
	comments: Comment[];
}