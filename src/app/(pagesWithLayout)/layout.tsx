import {MainPart} from "@/components/MainPart/MainPart";
import styles from "./layout.module.scss";
import {Header} from "@/components/Header/Header";

export default function Layout({children}: {
	children: React.ReactNode
}) {
	return (
		<div className={styles.Layout}>
			<Header />
			<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
				<MainPart>
					{children}
				</MainPart>
			</div>
		</div>
	)
}
