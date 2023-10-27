import React, {memo, FC, useState, useCallback} from 'react';
import styles from './Alerts.module.scss';
import {Cross} from "../Cross/Cross";

interface Props {
	text: string;
}

export const WarningAlertElem: FC<Props> = memo<Props>(({ text }) => {
	const [isExists, setIsExists] = useState(true);

	const remove = useCallback(() => {
		setIsExists(false);
	}, []);

	return (
		<>
			{isExists &&
                <div className={styles.alerts + " " + styles.warningAlert}>
					{text}
                    <Cross close={remove}/>
                </div>
			}
		</>
	);
});