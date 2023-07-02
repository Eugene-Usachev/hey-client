import {ReferComponent} from "@/components/ReferComponent/ReferComponent";
import {getDictionary} from "@/app/dictionaries";

export default async function Home() {

	const dict = await getDictionary()

	return (
		<main style={{display: "grid", width: "100vw", height: "100vh"}}>
			<ReferComponent dict={dict.ReferComponent}/>
		</main>
	)
}
