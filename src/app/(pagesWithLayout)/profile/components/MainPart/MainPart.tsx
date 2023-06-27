import React, {memo, FC} from 'react';
import styles from './MainPart.module.scss';
import {LeftColumn} from "@/app/(pagesWithLayout)/profile/components/LeftColumn/LeftColumn";
import {RightColumn} from "@/app/(pagesWithLayout)/profile/components/RightColumn/RightColumn";

export const MainPart: FC = memo(() => {

	return (
		<>
			{/*<Loading/>*/}
			<div className={styles.mainPart}>
				<LeftColumn />
				<RightColumn />
			</div>
		</>
	);
});