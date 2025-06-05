import type {IFluentCalendar} from "./fluent-calendar.js"

export class CalendarYear {
	private calendar: IFluentCalendar
	private isInDisabledList: boolean
	public year: Date

	constructor(calendar: IFluentCalendar, year: Date) {
		this.calendar = calendar

		const isFirstDay = calendar.calendarExtended.getCalendarDayOfMonth(year) === 1 && calendar.calendarExtended.getCalendarDayOfMonth(
			year) === 1
		this.year        = isFirstDay ? year : calendar.calendarExtended.startOfYear(year)

		if (calendar.disabledCheckAllDaysOfMonthYear) {
			const start           = calendar.calendarExtended.startOfYear(year)
			const end             = calendar.calendarExtended.endOfYear(year)
			this.isInDisabledList = calendar.allDaysAreDisabled(start, end)
		} else {
			this.isInDisabledList = calendar.disabledDateFunc?.(this.year) ?? false
		}
	}

	// Whether the year is readonly.
	get isReadOnly(): boolean {
		return this.isInDisabledList || this.calendar.readOnly
	}

	// Whether the year is disabled.
	get isDisabled(): boolean {
		return this.isInDisabledList
	}

	// Whether the year is selected by the user.
	get isSelected(): boolean {
		const selectedValue = this.calendar.value
		if (!selectedValue) {
			return false
		}
		// console.log("Year is same", {
		// 	currentYear: this.year.getFullYear(),
		// 	selectedValue: selectedValue.getFullYear()
		// })
		return this.year.getFullYear() === selectedValue.getFullYear()
	}

	// Gets the title of the year in the format [year].
	get title(): string {
		return this.year.toString()
	}

	// Gets the identifier of the year in the format yyyy.
	get yearIdentifier(): string {
		return this.year.toLocaleDateString(this.calendar.culture, {year: "numeric"})
	}
}
