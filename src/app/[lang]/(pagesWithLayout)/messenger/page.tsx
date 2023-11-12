import {Suspense} from "react";

interface MessengerPageProps {
	params: {lang: string}
	searchParams: {}
}

export default function MessengerPage(query: MessengerPageProps) {

	return (
		<Suspense>
			<div></div>
		</Suspense>
	);
}