export type WeekInfo = {
	firstDay: number,
	weekend: number[]
}

export class CalendarExtended {
	readonly culture: Intl.Locale
	readonly weekInfo: WeekInfo
	date: Date

	constructor(culture: Intl.Locale, currentDate: Date) {
		this.culture = culture
		/*this.weekInfo = (culture as any).getWeekInfo() // any, because WebStorm does not recognize getWeekInfo() method of Locale*/
		const locale = culture as any
		this.weekInfo = locale.weekInfo ?? {
			firstDay: 1,
			weekend: [6, 0]
		}
		this.date = currentDate
	}

	getDaysOfWeek(weekNumber: number, monthOffset = 0): Date[] {
		if (weekNumber < 0 || weekNumber > 5) {
			throw new Error("Index must be between 0 and 5")
		}

		const theDate = new Date(this.date)
		theDate.setHours(0, 0, 0, 0)

		const monthFirst = this.addMonths(theDate, monthOffset)
		const maxDate = new Date(9999, 11, 31) // Max safe Date
		const maxLimit =
			monthFirst.getFullYear() === maxDate.getFullYear() &&
			monthFirst.getMonth() === maxDate.getMonth() &&
			weekNumber > 3
		// console.log("Get days of week", {
		// 	weekNumber,
		// 	monthFirst,
		// 	maxDate,
		// 	maxLimit
		// })

		if (!maxLimit) {
			const monthWeek = this.addDays(monthFirst, weekNumber * 7)
			const weekFirst = this.startOfWeek(monthWeek)
			const res = Array.from({ length: 7 }, (_, i) => this.addDays(weekFirst, i))
			// console.log("Result days of week", {monthWeek, weekFirst, res})
			return res
		}

		return []
	}

	getMonthName(): string {
		return this.getMonthNameFromDate(this.date)
	}

	getMonthNameFromDate(date: Date): string {
		return this.toTitleCase(date.toLocaleString(this.culture.toString(), { month: "long" }))
	}

	getMonthNames(): { index: number; abbreviated: string; name: string }[] {
		const names: { index: number; abbreviated: string; name: string }[] = []
		for (let i = 0; i < 12; i++) {
			const dt = new Date(this.date.getFullYear(), i, 1)
			names.push({
				index: i,
				abbreviated: this.toTitleCase(dt.toLocaleString(this.culture.toString(), { month: "short" })),
				name: this.toTitleCase(dt.toLocaleString(this.culture.toString(), { month: "long" })),
			})
		}
		return names
	}

	getYearsRange(): { index: number; year: number }[] {
		const result: { index: number; year: number }[] = []
		const currentYear = this.date.getFullYear()
		const maxYear = 9999 // Mimic .NET max year
		const count = Math.min(12, maxYear - currentYear + 1)
		for (let i = 0; i < count; i++) {
			result.push({ index: i, year: currentYear + i })
		}
		return result
	}

	getMonthNameAndYear(): string {
		return `${this.getMonthName()} ${this.date.getFullYear()}`
	}

	getYear(): string {
		return this.date.getFullYear().toString()
	}

	getYearFromDate(date: Date): string {
		return date.getFullYear().toString()
	}

	getYearsRangeLabel(fromYear: number): string {
		const min = Math.max(fromYear, 1)
		const max = Math.min(fromYear + 11, 9999)
		return min === max ? `${min}` : `${min} - ${max}`
	}

	getDayNames(): { abbreviated: string; shorted: string; name: string }[] {
		const df = new Intl.DateTimeFormat(this.culture.toString(), { weekday: "long" })
		const shortDf = new Intl.DateTimeFormat(this.culture.toString(), { weekday: "short" })

		const baseDate = new Date(Date.UTC(2021, 7, 1)) // arbitrary Sunday
		const names = Array.from({ length: 7 }, (_, i) => {
			const date = new Date(baseDate)
			date.setUTCDate(date.getUTCDate() + i)
			return {
				name: this.toTitleCase(df.format(date)),
				shorted: shortDf.format(date).slice(0, 2),
				abbreviated: this.toTitleCase(shortDf.format(date)),
			}
		})

		const firstDay = new Intl.DateTimeFormat(this.culture.toString(), {
			weekday: "short",
		}).resolvedOptions().weekday
		const firstDayIndex = 0 // Can't reliably extract this, so default to Sunday
		return this.shift(names, firstDayIndex)
	}

	isInCurrentMonth(date: Date): boolean {
		const start = this.startOfMonth(this.date)
		const end = this.endOfMonth(this.date)

		if (date.getMonth() === 4 && date.getDate() === 31) {
			console.log("isInCurrentMonth", {
				date, start, end
			})
		}
		return date >= start && date <= end
	}

	getCalendarDayOfMonth(date: Date): number {
		return date.getDate()
	}

	getCalendarDayWithMonthName(date: Date): string {
		return `${this.getMonthNameFromDate(date)} ${this.getCalendarDayOfMonth(date)}`
	}

	toTitleCase(value: string): string {
		return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
	}

	shift<T>(array: T[], positions: number): T[] {
		const len = array.length
		return array.slice(positions).concat(array.slice(0, positions))
	}

	addYears(date: Date, years: number): Date {
		const d = new Date(date)
		d.setFullYear(d.getFullYear() + years)
		return d
	}

	addMonths(date: Date, months: number): Date {
		const d = new Date(date)
		d.setMonth(d.getMonth() + months, 1)
		return d
	}

	addDays(date: Date, days: number): Date {
		const d = new Date(date)
		d.setDate(d.getDate() + days)
		return d
	}

	startOfYear(date: Date) {
		return new Date(date.getFullYear(), 0, 1)
	}

	endOfYear(date: Date) {
		return new Date(date.getFullYear() + 1, 0, 0)
	}

	startOfMonth(date: Date): Date {
		return new Date(date.getFullYear(), date.getMonth(), 1)
	}

	endOfMonth(date: Date): Date {
		return new Date(date.getFullYear(), date.getMonth() + 1, 0)
	}

	startOfWeek(date: Date): Date {
		/**
		 *          Monday	Tuesday	Wednesday	Thursday	Friday	Saturday	Sunday
		 * getDay	  1	      2       3         4         5       6         0
		 * firstDay	1	      2       3         4         5       6         7
		 */

		const dayOfWeek = date.getDay()
		const diff = (this.weekInfo.firstDay % 7) - dayOfWeek
		const d = new Date(date)
		d.setDate(d.getDate() + diff)
		// console.log("start of week", {
		// 	origDate: date,
		// 	dayOfWeek,
		// 	diff,
		// 	newDate:  d
		// })
		return d
	}
}
