import React, {memo, FC, useState, useCallback} from 'react';
import styles from './Alerts.module.scss';
import {Cross} from "../Cross/Cross";

interface Props {
	text: string;
}

export const SuccessAlertElem: FC<Props> = memo<Props>(({ text }) => {
	const [isExists, setIsExists] = useState(true);

	const remove = useCallback(() => {
		setIsExists(false);
	}, []);

	return (
		<>
			{isExists &&
                <div className={styles.alerts + " " + styles.successAlert}>
					{text}
                    <Cross close={remove}/>
                </div>
			}
		</>
	);
});