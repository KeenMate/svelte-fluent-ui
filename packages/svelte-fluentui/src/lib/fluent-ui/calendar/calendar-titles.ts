// Assume CalendarExtended and CalendarViews are properly defined elsewhere

import type {CalendarView, IFluentCalendar} from "./fluent-calendar.js"
import type {CalendarExtended} from "./fluent-calendar-extended.js"
import {MaxDate} from "../../constants/date.js"

export class CalendarTitles {
	private calendar: IFluentCalendar
	public calendarExtended: CalendarExtended
	public view: CalendarView

	constructor(calendar: IFluentCalendar) {
		this.calendar         = calendar
		this.calendarExtended = calendar.calendarExtended
		this.view             = calendar.view
	}

	// Get the current date from CalendarExtended
	private get date(): Date {
		return this.calendarExtended.date
	}

	// Whether the calendar title is not clickable (readonly)
	get readOnly(): boolean {
		if (this.calendar.readOnly) {
			return true
		}

		switch (this.view) {
			case "days":
			case "months":
				return false
			case "years":
			default:
				return true
		}
	}

	// Gets the main calendar title
	get label(): string {
		switch (this.view) {
			case "days":
				return this.calendarExtended.getMonthNameAndYear()
			case "months":
				return this.calendarExtended.getYear()
			case "years":
				return this.calendarExtended.getYearsRangeLabel(this.date.getFullYear())
			default:
				return ""
		}
	}

	// Gets the previous title based on the view
	get previousTitle(): string {
		switch (this.view) {
			case "days":
				return this.calendarExtended.getMonthNameFromDate(this.calendarExtended.addMonths(this.date, -1))
			case "months":
				return this.calendarExtended.getYearFromDate(this.calendarExtended.addYears(this.date, -1))
			case "years":
				return this.calendarExtended.getYearsRangeLabel(this.date.getFullYear() - 12)
			default:
				return ""
		}
	}

	// Whether the previous title is disabled
	get previousDisabled(): boolean {
		const minDate = new Date(0)

		switch (this.view) {
			case "days":
				return this.date.getFullYear() === minDate.getFullYear() &&
					this.date.getMonth() === minDate.getMonth()
			case "months":
				return this.date.getFullYear() === minDate.getFullYear()
			case "years":
				return this.date.getFullYear() === minDate.getFullYear()
			default:
				return false
		}
	}

	// Gets the next title based on the view
	get nextTitle(): string {
		switch (this.view) {
			case "days":
				return this.calendarExtended.getMonthNameFromDate(this.calendarExtended.addYears(this.date, 1))
			case "months":
				return this.calendarExtended.getYearFromDate(this.calendarExtended.addYears(this.date, 1))
			case "years":
				return this.calendarExtended.getYearsRangeLabel(this.date.getFullYear() + 12)
			default:
				return ""
		}
	}

	// Whether the next title is disabled
	get nextDisabled(): boolean {
		const maxDate = MaxDate

		switch (this.view) {
			case "days":
				return this.date.getFullYear() === maxDate.getFullYear() &&
					this.date.getMonth() === maxDate.getMonth()
			case "months":
				return this.date.getFullYear() === maxDate.getFullYear()
			case "years":
				return this.date.getFullYear() === maxDate.getFullYear()
			default:
				return false
		}
	}
}
