import React from 'react';
import styles from './RegistrationBackground.module.scss';
import Image from "next/image";
export function RegistrationBackground() {

	return (
		<div className={styles.registrationBackground}>
			<Image src={"/images/Profile_example.png"} className={styles.image} width={800} height={800} alt={"Profile"} />
			<Image src={"/images/Friends_example.png"} className={styles.image} width={800} height={800} alt={"Friends"} />
			<Image src={"/images/Messenger_example.png"} className={styles.image} width={800} height={800} alt={"Messenger"} />
		</div>
	);
}