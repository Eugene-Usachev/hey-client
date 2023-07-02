import {MainPart} from "@/components/MainPart/MainPart";
import styles from "./layout.module.scss";
import {Header} from "@/components/Header/Header";
import {LeftMenu} from "@/components/LeftMenu/LeftMenu";
import {getDictionary} from "@/app/dictionaries";

export default async function Layout({children}: {
	children: React.ReactNode
}) {

	const dict = await getDictionary();

	return (
		<div className={styles.Layout}>
			<Header/>
			<div style={{display: 'flex', justifySelf: 'center', alignSelf: 'center', width: '1010px', height: 'calc(100vh - var(--header_height) - var(--header_margin_bottom) - 2px)'}}>
				<LeftMenu dict={dict.layout.LeftMenu}/>
				<MainPart>
					{children}
				</MainPart>
			</div>
		</div>
	)
}
