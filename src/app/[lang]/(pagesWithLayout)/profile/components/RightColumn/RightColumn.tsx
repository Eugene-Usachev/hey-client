import React, {} from 'react';
import styles from './RigthColumn.module.scss';
import {InfoBlock} from "@/app/[lang]/(pagesWithLayout)/profile/components/InfoBlock/InfoBlock";
import {getDictionary} from "@/app/dictionaries";
import {CreatePostBlock} from "@/app/[lang]/(pagesWithLayout)/profile/components/CreatePostBlock/CreatePostBlock";
import {PostFeed} from "@/app/[lang]/(pagesWithLayout)/profile/components/PostFeed/PostFeed";

export async function RightColumn() {
	const dict = await getDictionary();

	return (
		<div className={styles.rightColumn} id={"rightColumn"}>
			<InfoBlock dict={dict.profile.InfoBlock}/>
			<CreatePostBlock dict={dict.profile.CreatePostBlock}/>
			<PostFeed
				dict={{
					postDict: {surveyInPostDict: dict.profile.SurveyInPost}
				}}
			/>
		</div>
	);
}