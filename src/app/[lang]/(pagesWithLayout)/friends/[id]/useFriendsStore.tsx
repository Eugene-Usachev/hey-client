"use client";
import {FC, memo, useEffect} from "react";
import {api} from "@/app/[lang]/(pagesWithLayout)/friends/FriendsAPI";
import {FriendsInfo, FriendsStore} from "@/stores/FriendsStore";
import {ErrorAlert} from "@/components/Alerts/Alerts";
interface Props {
	id: number;
}
export const UseFriendsStore: FC<Props> = memo<Props>(({id}) => {
	useEffect(() => {
		api.getFriendsAndSubs(id).then(async (res) => {
			const status = res.status;
			if (status !== 200) {
				ErrorAlert("Error, status code: " + status);
			}
			const info = (await res.json()) as FriendsInfo;
			FriendsStore.setInfo(id, info);
		});
	}, [])

	return <></>;
})