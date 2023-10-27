export const getFormatNumber = (number: number): string => {
	if (number < 0) return '';
	if (number < 1_000) {
		return number.toString();
	}
	if (number < 1_000_000) {
		return (number / 1_000).toFixed(1) + 'K';
	}
	if (number < 1_000_000_000) {
		return (number / 1_000_000).toFixed(1) + 'M';
	}
	if (number < 1_000_000_000_000) {
		return (number / 1_000_000_000).toFixed(1) + 'B';
	}
	return '';
}