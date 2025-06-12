export function classList(...classes: (string | null | undefined | boolean)[]): string {
	return classes
		.filter(x => x)
		.join(" ")
}

export function styleList(...styles: (string | null | undefined | boolean)[]): string {
	return styles
		.filter(x => x)
		.join("; ")
}
