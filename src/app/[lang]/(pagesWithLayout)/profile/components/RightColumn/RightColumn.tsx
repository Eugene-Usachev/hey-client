import React, {memo, FC} from 'react';
import styles from './RigthColumn.module.scss';
import {InfoBlock} from "@/app/[lang]/(pagesWithLayout)/profile/components/InfoBlock/InfoBlock";
import Loading from "@/app/[lang]/(pagesWithLayout)/profile/[id]/loading";
import {getDictionary} from "@/app/dictionaries";

export async function RightColumn() {
	const dict = await getDictionary();

	return (
		<div className={styles.rightColumn} id={"rightColumn"}>
			<InfoBlock  dict={dict.profile.InfoBlock}/>
			<div style={{position: 'fixed', bottom: "0", left: '18%'}}>
				<Loading />
			</div>
		</div>
	);
}