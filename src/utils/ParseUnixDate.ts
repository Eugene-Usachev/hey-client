export interface dict {
	isUSAFormat: boolean;
	january: string;
	february: string;
	march: string;
	april: string;
	may: string;
	june: string;
	july: string;
	august: string;
	september: string;
	october: string;
	november: string;
	december: string;
}
export const parseUnixDate = (date: number): string => {
	return new Date(date * 1000).toLocaleString()
}