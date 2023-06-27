"use client";
import {ProfileInfo, ProfileStore} from "@/stores/ProfileStore";
import {FC, memo, useEffect} from "react";
import {api} from "@/app/(pagesWithLayout)/profile/ProfileAPI";
interface Props {
	id: number;
	info: ProfileInfo;
}
export const UseProfileStore: FC<Props> = memo<Props>(({id, info}) => {
	useEffect(() => {
		api.getSubs().then((mysubs) => {
			ProfileStore.setInfo(id, info, mysubs)
		})
	}, [])

	return <></>;
})