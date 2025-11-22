import type DayFormat from "./day-format.js"
import type {CalendarExtended} from "./fluent-calendar-extended.js"

export type CalendarView = "days" | "months" | "years"
export type CalendarSelectMode = "single" | "multiple" | "range"

export interface IFluentCalendar {
	view: CalendarView
	disabledDateFunc(date: Date): boolean
	calendarExtended: CalendarExtended
	disabledSelectable: boolean
	value: Date
	selectMode: CalendarSelectMode
	selectedDates: Date[]
	dayFormat: typeof DayFormat["TwoDigit"] | undefined | null
	culture: Intl.Locale
	disabledCheckAllDaysOfMonthYear: boolean
	allDaysAreDisabled(date1: Date, date2: Date): boolean
	readOnly: boolean
}
