import React from 'react';
import styles from './LeftColumn.module.scss';
import {LeftPanel} from "@/app/[lang]/(pagesWithLayout)/profile/components/LeftPanel/LeftPanel";
import {getDictionary} from "@/app/dictionaries";

export async function LeftColumn() {

	const dictionary = await getDictionary();

	return (
		<div className={styles.leftColumn}>
			<LeftPanel inputDict={dictionary.UI.Input} dictionary={dictionary.profile.leftPanel} changeMenuDict={dictionary.profile.ChangeMenu}/>
		</div>
	);
}