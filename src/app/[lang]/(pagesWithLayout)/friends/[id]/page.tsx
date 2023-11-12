import {UseFriendsStore} from "@/app/[lang]/(pagesWithLayout)/friends/[id]/useFriendsStore";
import {Suspense} from "react";
import {MainPart} from "@/app/[lang]/(pagesWithLayout)/friends/components/MainPart/MainPart";
import Loading from "@/app/[lang]/(pagesWithLayout)/friends/[id]/loading";
import {getDictionaryByLang} from "@/app/dictionaries";

interface FriendsPageProps {
	params: {id: number, lang: string}
	searchParams: {}
}

export default async function FriendsPage(query: FriendsPageProps) {

	const dict = await getDictionaryByLang(query.params.lang)

	return (
		<>
			<UseFriendsStore id={+query.params.id}/>
			<Suspense fallback={<Loading />}>
				{/*@ts-ignore */}
				<MainPart dict={dict}/>
			</Suspense>
		</>
	);
}