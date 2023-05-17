import React, {memo, FC} from 'react';
import styles from './RegistrationBackground.module.scss';
import {RegistrationBlock} from "../RegistrationBlock/RegistrationBlock";

// TODO After all, comeback here and update. U need to add screenshots of social network. Like U have a button login in header and body is an add of social network.

export const RegistrationBackground: FC = memo(() => {

	return (
		<div className={styles.registrationBackground}>
			<RegistrationBlock />
		</div>
	);
});