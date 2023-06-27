export function getPromiseFromEvent(item: HTMLElement, event: string) {
	return new Promise((resolve) => {
		const listener = () => {
			item.removeEventListener(event, listener);
			resolve();
		}
		item.addEventListener(event, listener);
	})
}