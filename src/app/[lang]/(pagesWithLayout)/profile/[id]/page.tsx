import {MainPart} from "@/app/[lang]/(pagesWithLayout)/profile/components/MainPart/MainPart";
import {UseProfileStore} from "@/app/[lang]/(pagesWithLayout)/profile/useProfileStore";
import {api} from "@/app/[lang]/(pagesWithLayout)/profile/ProfileAPI";
import Loading from "@/app/[lang]/(pagesWithLayout)/profile/[id]/loading";
import {Suspense} from "react";

interface ProfilePageProps {
	params: {id: number, lang: string}
	searchParams: {}
}

export default async function ProfilePage(query: ProfilePageProps) {

	const info = await api.getUser({id: +query.params.id}).then((res) => res.json())

	return (
		<>
			<Suspense fallback={<Loading />}>
				<UseProfileStore id={+query.params.id} info={info}/>
				<MainPart />
			</Suspense>
		</>
	)
}