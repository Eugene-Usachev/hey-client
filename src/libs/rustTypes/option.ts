export class Option<T> {
	value?: T;

	constructor(value?: T) {
		this.value = value;
	}

	public set(value: T): void {
		this.value = value;
	}

	public unwrap(): T {
		if (!this.value) {
			throw new Error("Option is empty");
		}
		return this.value;
	}

	public unwrapOr(value: T): T {
		if (!this.value) {
			return value;
		}
		return this.value;
	}

	public isSome(): boolean {
		return this.value !== undefined;
	}

	public isNone(): boolean {
		return this.value === undefined;
	}

	public expect(message: string): T {
		if (!this.value) {
			throw new Error(message);
		}
		return this.value;
	}
}

export function Some<T>(value: T): Option<T> {
	return new Option(value);
}

export function None<T>(): Option<T> {
	return new Option();
}