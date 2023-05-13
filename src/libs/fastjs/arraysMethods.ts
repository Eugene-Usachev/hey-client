export type CompareFn<T> = (a: T, b: T) => number;

export function search<T>(arr: T[], value: T, compareFn?: CompareFn<T>): number {
	let left = 0;
	let right = arr.length - 1;

	while (left <= right) {
		const mid = (left + right) >>> 1;
		const cmp = compareFn ? compareFn(arr[mid], value) : arr[mid] < value ? -1 : arr[mid] > value ? 1 : 0;

		if (cmp === 0) {
			return mid;
		} else if (cmp < 0) {
			left = mid + 1;
		} else {
			right = mid - 1;
		}
	}

	return ~left;
}

export function searchObj<ValueType extends Object, KeyType extends keyof ValueType>(arr: ValueType[], value: any, key: KeyType, compareFn?: CompareFn<ValueType[]>): number {
	let left = 0;
	let right = arr.length - 1;
	while (left <= right) {
		const mid = (left + right) >>> 1;// @ts-ignore
		const cmp = compareFn ? compareFn(arr[mid][key], value) : arr[mid][key] < value ? -1 : arr[mid][key] > value ? 1 : 0;

		if (cmp === 0) {
			return mid;
		} else if (cmp < 0) {
			left = mid + 1;
		} else {
			right = mid - 1;
		}
	}

	return ~left;
}

export function getByKey <T extends Object, KeyType extends keyof T>(arr: T[], value: any, attributeName: KeyType): T {
	const index = arr.searchObj<T, KeyType>(value, attributeName);
	if (index > -1) {
		return arr[index];
	}
	throw new Error(`No item found with key ${attributeName.toString()} = ${value} from array ${arr}`);
}

export function getByKeyIfExists <T extends Object, KeyType extends keyof T>(arr: T[], value: any, key: KeyType): T | undefined {
	const index = arr.searchObj<T, KeyType>(value, key);
	if (index > -1) {
		return arr[index];
	}
	return undefined;
}

export function qSort<T>(array: T[]) {
	const qSortHelper = (arr: T[], left = 0, right = arr.length - 1) => {
		if (left < right) {
			const pivotIndex = partition(arr, left, right);
			qSortHelper(arr, left, pivotIndex - 1);
			qSortHelper(arr, pivotIndex + 1, right);
		}
	};

	const partition = (arr: T[], left: number, right: number) => {
		const pivotValue = arr[right];
		let pivotIndex = left;

		for (let i = left; i < right; i++) {
			if (arr[i] < pivotValue) {
				[arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
				pivotIndex++;
			}
		}

		[arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
		return pivotIndex;
	};

	qSortHelper(array);
}

export function qSortObj <T extends Object>(array: T[], key: keyof T) {
	const qSortHelper = (arr: T[], left = 0, right = arr.length - 1) => {
		if (left < right) {
			const pivotIndex = partition(arr, left, right, key);
			qSortHelper(arr, left, pivotIndex - 1);
			qSortHelper(arr, pivotIndex + 1, right);
		}
	};

	const partition = (arr: T[], left: number, right: number, key: keyof T) => {
		const pivotValue = arr[right][key];
		let pivotIndex = left;

		for (let i = left; i < right; i++) {
			if (arr[i][key] < pivotValue) {
				[arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
				pivotIndex++;
			}
		}

		[arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
		return pivotIndex;
	};

	qSortHelper(array);
}

export const insert = <ArrayType extends any[], ValueType>(array: ArrayType, value: ValueType): boolean => {
	const index = array.search(value);
	if (index < 0) {
		array.splice(-(index + 1), 0, value);
		return true;
	}
	return false;
}

export const insertObj = <ValueType extends Object, KeyType extends keyof ValueType>(array: ValueType[], value: ValueType, attributeName: KeyType): boolean => {
	const index = array.searchObj<ValueType, KeyType>(value[attributeName] as any, attributeName)
	if (index < 0) {
		array.splice(-(index + 1), 0, value);
		return true;
	}
	return false;
};

export const remove = <ArrayType extends any[], ValueType>(array: ArrayType, value: ValueType): boolean => {
	const index = array.search(value);
	if (index > -1) {
		array.splice(index, 1);
		return true;
	}
	return false;
}

export const removeObj = <ValueType extends Object, KeyType extends keyof ValueType>(array: ValueType[], value: ValueType, attributeName: KeyType): boolean => {
	const index = array.searchObj<ValueType, KeyType>(value, attributeName);
	if (index > -1) {
		array.splice(index, 1);
		return true;
	}
	return false;
}

export const removeAll = function <ArrayType extends any>(array: ArrayType[], value: ArrayType): number {
	let count = 0;
	let index = array.search(value);
	while (index > -1) {
		array.splice(index, 1);
		count++;
		index = array.search(value);
	}
	return count;
};

export const removeAllObj = <ArrayType extends Object, KeyType extends keyof ArrayType>(array: ArrayType[], value: ArrayType, attributeName: KeyType): number => {
	let count = 0;
	let index = array.searchObj<ArrayType, KeyType>(value, attributeName);
	while (index > -1) {
		array.splice(index, 1);
		count++;
		index = array.searchObj<ArrayType, KeyType>(value, attributeName);
	}
	return count;
}