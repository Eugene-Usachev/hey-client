import Loading from "@/app/(pagesWithLayout)/profile/[id]/loading";

interface ProfilePageProps {
	params: {id: number}
	searchParams: {}
}

export default async function ProfilePage(query: ProfilePageProps) {

	return (
		<Loading />
	)
}