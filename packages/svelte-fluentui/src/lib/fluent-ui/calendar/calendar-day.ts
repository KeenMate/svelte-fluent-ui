import type {IFluentCalendar} from "./fluent-calendar.js"
import DayFormat from "./day-format.js"

export class CalendarDay {
	private calendar: IFluentCalendar
	private isInDisabledList: boolean
	private isOutsideCurrentMonth: boolean

	public date: Date

	constructor(calendar: IFluentCalendar, day: Date) {
		this.calendar = calendar
		this.date     = new Date(day)
		// this.date     = new Date(day)
		// this.date.setHours(0, 0, 0)

		this.isInDisabledList      = calendar.disabledDateFunc ? calendar.disabledDateFunc(day) : false
		this.isOutsideCurrentMonth = !calendar.calendarExtended.isInCurrentMonth(day)
	}

	public get isDisabled(): boolean {
		return this.isInactive ? false : this.isInDisabledList && this.calendar.disabledSelectable
	}

	public get isInactive(): boolean {
		return this.isOutsideCurrentMonth || (this.isInDisabledList && !this.calendar.disabledSelectable)
	}

	public get isToday(): boolean {
		const today = new Date()
		return this.isSameDate(this.date, today) && !this.isOutsideCurrentMonth
	}

	public get isSelected(): boolean {
		return this.calendar.value ? this.isSameDate(this.date, this.calendar.value) : false
	}

	public get isMultiDaySelected(): boolean {
		return this.calendar.selectMode !== "single" &&
			this.calendar.selectedDates.some(d => this.isSameDate(d, this.date)) &&
			!this.isDisabled
	}

	public get title(): string {
		return this.calendar.calendarExtended.getCalendarDayWithMonthName(this.date)
	}

	public get dayNumber(): string {
		const day = this.calendar.calendarExtended.getCalendarDayOfMonth(this.date)

		if (this.calendar.dayFormat === DayFormat.TwoDigit) {
			return day.toString().padStart(2, "0")
		} else {
			return day.toString()
		}
	}

	public get dayIdentifier(): string {
		const y = this.date.getFullYear()
		const m = (this.date.getMonth() + 1).toString().padStart(2, "0")
		const d = this.date.getDate().toString().padStart(2, "0")
		return `${y}-${m}-${d}`
	}

	private isSameDate(date1: Date, date2: Date): boolean {
		return date1.getFullYear() === date2.getFullYear()
			&& date1.getMonth() === date2.getMonth()
			&& date1.getDate() === date2.getDate()
	}
}
