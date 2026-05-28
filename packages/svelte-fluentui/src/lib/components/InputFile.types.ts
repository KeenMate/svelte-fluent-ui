export type InputFileStatus =
	| "pending"
	| "uploading"
	| "paused"
	| "completed"
	| "error"
	| "cancelled"

export type InputFileItem = {
	id: string
	file: File | null
	name: string
	size: number
	type: string
	progress: number
	status: InputFileStatus
	error?: string | null
	thumbnailUrl?: string | null
	downloadUrl?: string | null
	metadata?: Record<string, unknown>
}

export type FileUploadChunk = {
	offset: number
	size: number
	total: number
	data: Blob
}

/**
 * Fields the upload handler can return to be merged into the InputFileItem
 * after a successful upload. Restricted on purpose: handlers should not be
 * able to overwrite internal lifecycle fields (id, file, size, status,
 * progress, error) by accident. Use `metadata` for arbitrary server payload
 * (e.g. `{serverGuid, etag}`) so it survives in the item for later use
 * (e.g. firing a DELETE when the user removes the item from the list).
 */
export type FileUploadResult = Partial<
	Pick<InputFileItem, "metadata" | "downloadUrl" | "thumbnailUrl" | "name">
>

export type FileUploadHandler = (
	file: File,
	onProgress: (percent: number) => void,
	signal?: AbortSignal,
	chunk?: FileUploadChunk
) => Promise<void | FileUploadResult>

export type InputFileValidationResult = string | null | undefined
export type InputFileValidator = (
	file: File
) => InputFileValidationResult | Promise<InputFileValidationResult>

export type InputFileRejectionMode = "list" | "callback" | "silent"
export type InputFileDedupeMode = "name" | "name-size" | "hash" | false

export type InputFileRetryPolicy = {
	attempts?: number
	delayMs?: number
	backoff?: number
}

export type InputFileLabels = {
	dropHere: string
	dragAndDrop: string
	browse: string
	selectFiles: string
	accepted: (accept: string) => string
	maxSize: (size: string) => string
	minSize: (size: string) => string
	// `remaining` is supplied only when items are already present, so a fresh
	// drop-zone reads "Total max size: 10 MB" and an in-progress one reads
	// "Total max size: 10 MB · 7 MB left" (default formatting; override
	// freely to change the separator/order).
	totalMaxSize: (size: string, remaining?: string) => string
	maxFilesHint: (max: number, remaining?: number) => string
	minFilesHint: (n: number) => string
	clearAll: string
	uploadAll: string
	addMore: string
	showMore: (n: number) => string
	showLess: string
	viewFiles: string
	pending: string
	uploading: string
	paused: string
	completed: string
	error: string
	cancelled: string
	remove: string
	retry: string
	pause: string
	resume: string
	pauseAll: string
	resumeAll: string
	retryAll: string
	cancel: string
	download: string
	fileTooLarge: (max: string) => string
	totalSizeExceeded: (max: string) => string
	fileTooSmall: (min: string) => string
	fileTypeNotAccepted: (accept: string) => string
	tooManyFiles: (max: number) => string
	tooFewFiles: (min: number) => string
	duplicate: string
	fileCount: (n: number) => string
	// Footer text below the file-list progress bar. Receives the running
	// totals so any composition is possible (size-first, percentage-first,
	// hide-when-idle, localized number formatting, etc).
	totalProgress: (info: {
		completed: number
		failed: number
		total: number
		uploadedBytes: number
		totalBytes: number
		percent: number
	}) => string
	emptyState: string
	uploadedAnnouncement: (name: string) => string
	failedAnnouncement: (name: string, err: string) => string
}

export type InputFileSelectorAppearance = "card" | "button" | "minimal"
export type InputFileListAppearance = "list" | "chips" | "popover" | "none"
export type InputFileCardSize = "minimal" | "compact" | "big"
export type InputFileChipsPosition = "end" | "below"
