import {MainPart} from "@/app/[lang]/(pagesWithLayout)/profile/components/MainPart/MainPart";
import {UseProfileStore} from "@/app/[lang]/(pagesWithLayout)/profile/useProfileStore";
import {api} from "@/app/[lang]/(pagesWithLayout)/profile/ProfileAPI";
import Loading from "@/app/[lang]/(pagesWithLayout)/profile/[id]/loading";
import {Suspense} from "react";
import {ProfileInfo} from "@/stores/ProfileStore";

interface ProfilePageProps {
	params: {id: number, lang: string}
	searchParams: {}
}

export default async function ProfilePage(query: ProfilePageProps) {

	const [isExists, info] = await api.getUser({id: +query.params.id})
		.then( async (res): Promise<[boolean, ProfileInfo]> => {
			if (res.status === 200) return [true, (await res.json()) as ProfileInfo];
			return [false, {} as ProfileInfo];
		});

	return (
		<>
			<Suspense fallback={<Loading />}>
				<UseProfileStore id={+query.params.id} info={info}/>
				{isExists ? <MainPart /> : <div>{/*TODO not exists*/}Not exists</div>}
			</Suspense>
		</>
	)
}