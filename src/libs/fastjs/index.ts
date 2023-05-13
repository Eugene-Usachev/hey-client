import {
	CompareFn, getByKey, getByKeyIfExists,
	insert,
	insertObj,
	qSort,
	qSortObj,
	remove,
	removeAll, removeAllObj,
	removeObj,
	search,
	searchObj
} from "./arraysMethods";

export const initFastArrays = (willShow: boolean) => {
	Array.prototype.checkSorted = function<T> (this: T[]) {
		for (let i = 1; i < this.length; i++) {
			if (this[i] < this[i - 1]) {
				return false;
			}
		}
		return true;
	}
	Array.prototype.qSort = function <T extends Object, KeyType extends keyof T>(this: T[], key?: KeyType) {
		if (key != undefined) {
			qSortObj(this, key);
			return;
		}
		qSort(this);
	};
	Array.prototype.qSortObj = function <T extends Object>(this: T[], key: string) {
		const qSortHelper = (arr: T[], left = 0, right = arr.length - 1) => {
			if (left < right) {
				const pivotIndex = partition(arr, left, right, key);
				qSortHelper(arr, left, pivotIndex - 1);
				qSortHelper(arr, pivotIndex + 1, right);
			}
		};

		const partition = (arr: T[], left: number, right: number, key: string) => {
			// @ts-ignore
			const pivotValue = arr[right][key];
			let pivotIndex = left;

			for (let i = left; i < right; i++) {
				// @ts-ignore
				if (arr[i][key] < pivotValue) {
					[arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
					pivotIndex++;
				}
			}

			[arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
			return pivotIndex;
		};

		qSortHelper(this);
	};

	Array.prototype.forEach = function <T>(this: T[], callbackFn: (value: T, index: number, array: T[]) => void) {
		let i = 0;
		const len = this.length;
		while (i < len) {
			callbackFn(this[i], i, this);
			i++;
		}
	};

	Array.prototype.search = function <T>(this: T[], value: T, compareFn?: CompareFn<T>) {
		return search(this, value, compareFn)
	}
	Array.prototype.searchObj = function <T extends Object>(value: any, key: keyof T, compareFn?: CompareFn<T[]>): number {
		return searchObj(this, value, key, compareFn)
	}

	Array.prototype.getByKey = function<T extends Object>(value: T, key: keyof T): T {
		return getByKey(this, value, key)
	}
	Array.prototype.getByKeyIfExists = function<T extends Object>(value: T, key: keyof T): T | undefined {
		return getByKeyIfExists(this, value, key)
	}

	Array.prototype.insert = function<ArrayType extends any>(value: ArrayType): boolean {
		return insert(this, value)
	}
	Array.prototype.insertObj = function<ValueType extends Object, KeyType extends keyof ValueType>(value: ValueType, attributeName: KeyType): boolean {
		return insertObj(this, value, attributeName)
	}

	Array.prototype.remove = function<ArrayType extends any>(value: ArrayType): boolean {
		return remove(this, value);
	}
	Array.prototype.removeObj = function<ArrayType extends Object, KeyType extends keyof ArrayType>(value: ArrayType, attributeName: KeyType): boolean {
		return removeObj(this, value, attributeName)
	}
	Array.prototype.removeAll = function<ArrayType extends any>(value: ArrayType): number {
		return removeAll(this, value);
	}
	Array.prototype.removeAllObj = function<ArrayType extends Object, KeyType extends keyof ArrayType>(value: ArrayType, attributeName: KeyType): number {
		return removeAllObj(this, value, attributeName);
	}
	if (willShow) {
		console.log('initConfig fastjs Array!');
	}
}

declare global {
	interface Array<T> {
		/**
		 * isSorted need to dev. You can use it to give know is an array sorted/*/
		isSorted?: boolean;
		/**checkSorted returns a boolean indicating whether the array is sorted or not.*/
		checkSorted(): boolean;
		/** qSort sorts the array in ascending order.
		 * If the array contains objects, key is the name of the attribute to sort by.
		 * If key is not provided, the function sorts the array as a list of numbers or strings.
		 * */
		qSort(key?: string): void
		/** qSortObj sorts an array of objects by the given key.*/
		qSortObj(key: string): void

		/** search searches for a value in a sorted array and returns its position.
		 *  If the value is not found, returns a negative position.
		 *  The compareFn parameter is an optional comparison function to use in the search.*/
		search<T>(value: T, compareFn?: CompareFn<T>): number;

		/** searchObj searches for an object with a given value of key in a sorted array and returns its position.
		 *  If the object is not found, returns a negative position.
		 *  The compareFn parameter is an optional comparison function to use in the search.*/
		searchObj<T extends Object, KeyType extends keyof T>(value: any, key: KeyType, compareFn?: CompareFn<T[]>): number

		/**
		 * getByKey finds an item from an array of objects by its key.
		 * @Param: value what the function is looking for. Not an object, value of field.
		 * @Param: key what the function is looking for in an object.
		 * @Returns: T: The object with the matching key
		 * @Throws Error: No item found in the array with that key
		 */
		getByKey<T extends Object>(value: any, key: keyof T): T

		/**
		 * getByKey finds an item from an array of objects by its key.
		 * @Param: value what the function is looking for. Not an object, value of field.
		 * @Param: key what the function is looking for in an object.
		 * @Returns: T: The object with the matching key or undefined if no item found.
		 */
		getByKeyIfExists<T extends Object>(value: any, key: keyof T): T | undefined

		/** insert inserts a value into a sorted array, maintaining the order of the array.
		 * @Returns a boolean indicating whether the operation was successful.*/
		insert<ArrayType extends any[], ValueType>(value: ValueType): boolean
		/** insertObj inserts an object into a sorted array by the given attributeName.
		 * @Returns a boolean indicating whether the operation was successful.*/
		insertObj<ValueType extends Object, KeyType extends keyof ValueType>(value: ValueType, attributeName: KeyType): boolean

		/**remove remove elem by value in sorted arrays.
		 * @Returns: a boolean indicating whether the operation was successful.*/
		remove<ArrayType extends any[], ValueType>(value: ValueType): boolean
		/**remove remove elem by value and key in sorted objects arrays.
		 * @Returns: a boolean indicating whether the operation was successful.*/
		removeObj<ArrayType extends Object, KeyType extends keyof ArrayType>(value: ArrayType, attributeName: KeyType): boolean
		/**
		 * Removes all elements with the specified value from the array and returns the number of elements removed.
		 * @param value The value to remove from the array.
		 * @returns The number of elements removed.
		 */
		removeAll<ArrayType extends any>(value: ArrayType): number
		/**
		 * Removes all occurrences of an object from the array.
		 * @param value The object to remove.
		 * @param attributeName The name of the attribute to use for comparison.
		 * @returns The number of elements removed.
		 */
		removeAllObj<ArrayType extends Object, KeyType extends keyof ArrayType>(value: ArrayType, attributeName: KeyType): number
	}
	interface String {
		parse<ResultType>(): ResultType
	}
}