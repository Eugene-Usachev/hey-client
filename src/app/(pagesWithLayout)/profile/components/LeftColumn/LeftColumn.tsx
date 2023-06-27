import React, {memo, FC} from 'react';
import styles from './LeftColumn.module.scss';
import {LeftPanel} from "@/app/(pagesWithLayout)/profile/components/LeftPanel/LeftPanel";

export const LeftColumn: FC = memo(() => {

	return (
		<div className={styles.leftColumn}>
			<LeftPanel />
		</div>
	);
});