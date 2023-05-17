export interface HTTPRequestParams<T> {
	params: T,
	successCallback: (res: Response) => void,
	failCallback: (reason: any) => void
}