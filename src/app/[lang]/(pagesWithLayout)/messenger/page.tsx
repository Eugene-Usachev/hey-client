import {Suspense} from "react";
import {MainPart} from "@/app/[lang]/(pagesWithLayout)/messenger/components/MainPart/MainPart";

interface MessengerPageProps {
	params: {lang: string}
	searchParams: {}
}

export default function MessengerPage(query: MessengerPageProps) {

	return (
		<Suspense>
			<MainPart />
		</Suspense>
	);
}