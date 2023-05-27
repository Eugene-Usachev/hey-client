import React, {memo, FC, useEffect} from 'react';
import styles from './MainPart.module.scss';

export const MainPart: FC = memo(({children}: {
	children: React.ReactNode
}) => {

	return (
		<div className={styles.mainPart}>
			{children}
		</div>
	);
});