// ------------------------------------------------------------------------
// MIT License - Copyright (c) Microsoft Corporation. All rights reserved.
// ------------------------------------------------------------------------

export class RangeOf<T> {
	// Start and End values
	public start: T | null = null
	public end: T | null   = null
	/**
	 * Compares two values and should return negative value if right is bigger or positive if left is bigger
	 * @protected
	 */
	protected compare!: (left: T, right: T) => number

	// Default constructor
	constructor();

	// Constructor with start and end values
	constructor(start: T | null, end: T | null);
	constructor(start?: T | null, end?: T | null) {
		if (start !== undefined && end !== undefined) {
			this.start = start
			this.end   = end
		}
	}

	// Check if the range is empty
	public isEmpty(): boolean {
		return this.start === null && this.end === null
	}

	// Check if the range is valid (start and end are not null and not identical)
	public isValid(): boolean {
		return this.start !== null && this.end !== null && this.compare(this.start, this.end) !== 0
	}

	// Check if the range is a single value (start and end are identical)
	public isSingle(): boolean {
		return this.start !== null && this.end !== null && this.compare(this.start, this.end) === 0
	}

	// Clear the range (set start and end to null)
	public clear(): void {
		this.start = null
		this.end   = null
	}

	// Check if the range includes a value
	public includes(value: T): boolean {
		const min = this.min()
		const max = this.max()

		if (min === null && max === null) {
			return false
		}

		return !(min !== null && this.compare(value, min) < 0) &&
			!(max !== null && this.compare(value, max) > 0)
	}

	// Get all values between start and end using the provided function
	protected getRangeValues(allBetweenMinAndMax: (min: T, max: T) => T[]): T[] {
		const min = this.min()
		const max = this.max()

		if (min !== null && max !== null) {
			return allBetweenMinAndMax(min, max)
		} else if (min !== null) {
			return [min]
		} else if (max !== null) {
			return [max]
		}

		return []
	}

	// Get the minimum of start and end
	protected min(): T | null {
		return this.isStartLowerThanEnd() ? this.start : this.end
	}

	// Get the maximum of start and end
	protected max(): T | null {
		return this.isStartLowerThanEnd() ? this.end : this.start
	}

	// Compare two values of type T (assuming T has a 'compareTo' method or we can use a custom comparison)
	// virtual compare(a: T, b: T): number {
	// 	if (typeof a === "number" && typeof b === "number") {
	// 		return a - b
	// 	}
	// 	throw new Error("Comparison not implemented for this type")
	// }

	// Helper method to check if start is lower than end
	private isStartLowerThanEnd(): boolean {
		return this.start !== null && this.end !== null && this.compare(this.start, this.end) < 0
	}

	// String representation of the range
	public toString(): string {
		return `From ${this.start} to ${this.end}.`
	}
}
