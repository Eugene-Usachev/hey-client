import {TopProfileStore} from "@/stores/TopProfileStore";

export const getHREF = (path: string): string => {
	return `/${TopProfileStore.lang}/${path}`;
}