import React, {memo, FC} from 'react';
import styles from './ThreePoints.module.scss';

interface ThreePointsProps {
	color: string
}

export const ThreePoints: FC = memo<ThreePointsProps>(({color}) => {
	return (
		<div className={styles.container}>
			<div className={styles.point} style={{backgroundColor: color}}></div>
			<div className={styles.point} style={{backgroundColor: color}}></div>
			<div className={styles.point} style={{backgroundColor: color}}></div>
		</div>
	);
});