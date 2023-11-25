import {Suspense} from "react";
import {MainPart} from "@/app/[lang]/(pagesWithLayout)/messenger/components/MainPart/MainPart";
import {getDictionary} from "@/app/dictionaries";

interface MessengerPageProps {
	params: {lang: string}
	searchParams: {}
}

export default async function MessengerPage(query: MessengerPageProps) {

	const dict = await getDictionary();

	return (
		<Suspense>
			<MainPart dict={{
				ChatsBlock: dict.messenger.ChatsBlock,
				WindowToCreateChatsList: dict.messenger.WindowToCreateChatsList,
				WindowToCreateChat: dict.messenger.WindowToCreateChat,
				UI: dict.UI
			}}/>
		</Suspense>
	);
}