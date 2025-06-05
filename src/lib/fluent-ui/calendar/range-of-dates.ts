import {RangeOf} from "../util/range-of.js"

export class RangeOfDates extends RangeOf<Date> {
	constructor();
	constructor(start: Date | null, end: Date | null);

	constructor(start?: Date | null, end?: Date | null) {
		super(start, end);

		this.compare = this.compareDates
	}

	// Returns all values between Start and End
	getAllDates(): Date[] {
		if (!this.start || !this.end) {
			return []
		}

		const min         = this.start
		const max         = this.end
		const daysInRange = (max.getTime() - min.getTime()) / (1000 * 3600 * 24) // Difference in days

		return Array.from({length: daysInRange + 1}, (_, offset) => {
			const newDate = new Date(min)
			newDate.setDate(min.getDate() + offset)
			return newDate
		})
	}

	compareDates(left: Date, right: Date) {
		const newLeft = new Date(left)
		newLeft.setHours(0, 0, 0, 0)
		const newRight = new Date(right)
		newRight.setHours(0, 0, 0, 0)

		// @ts-ignore
		// return left - right
		return newLeft - newRight
	}

	// Custom toString method for RangeOfDates
	toString(): string {
		return `From ${this.start?.toISOString().split("T")[0]} to ${this.end?.toISOString().split("T")[0]}.`;
	}
}
