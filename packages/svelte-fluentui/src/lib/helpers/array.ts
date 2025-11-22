export function getSmallest<T>(items: T[]) {
	return items.reduce((acc, x) => (!acc || (x < acc)) ? x : acc)
}

export function getLargest<T>(items: T[]) {
	return items.reduce((acc, x) => (!acc || (x > acc)) ? x : acc)
}
