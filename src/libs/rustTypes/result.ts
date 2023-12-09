export class Result<T> {
	success: boolean;
	data: T;
	error: Error;

	constructor(success: boolean, data: T, error: Error) {
		this.success = success;
		this.data = data;
		this.error = error;
	}

	public unwrap(): T {
		if (!this.success) {
			throw this.error;
		}
		return this.data;
	}

	public unwrapOr(defaultValue: T): T {
		if (!this.success) {
			return defaultValue;
		}
		return this.data;
	}

	public expect(message: string): T {
		if (!this.success) {
			throw new Error(message);
		}
		return this.data;
	}

	public isOk(): boolean {
		return this.success;
	}

	public isError(): boolean {
		return !this.success;
	}
}

export function Ok<T>(result: Result<T>): T {
	if (result.isError()) {
		throw result.error;
	}
	return result.data;
}