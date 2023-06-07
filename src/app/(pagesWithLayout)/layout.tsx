import {MainPart} from "@/components/MainPart/MainPart";
import styles from "./layout.module.scss";
import {Header} from "@/components/Header/Header";
import {LeftMenu} from "@/components/LeftMenu/LeftMenu";

export default function Layout({children}: {
	children: React.ReactNode
}) {

	return (
		<div className={styles.Layout}>
			<Header/>
			<div style={{display: 'flex', justifySelf: 'center', alignSelf: 'center', width: '1010px', height: 'calc(100vh - var(--header_height) - var(--header_margin_bottom) - 2px)'}}>
				<LeftMenu />
				<MainPart>
					{children}
				</MainPart>
			</div>
		</div>
	)
}
