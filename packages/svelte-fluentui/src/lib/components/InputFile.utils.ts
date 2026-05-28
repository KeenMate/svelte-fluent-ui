import type {InputFileItem, InputFileLabels} from "./InputFile.types.js"

export function formatInputFileSize(bytes: number): string {
	if (bytes === 0) return "0 Bytes"
	const k = 1024
	const sizes = ["Bytes", "KB", "MB", "GB"]
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

let __nextId = 0
export function genId(): string {
	return `if-${++__nextId}-${Date.now().toString(36)}`
}

export async function hashFile(file: File): Promise<string> {
	const buf = await file.arrayBuffer()
	const hashBuf = await crypto.subtle.digest("SHA-1", buf)
	return Array.from(new Uint8Array(hashBuf))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("")
}

export function clampPercent(p: number): number {
	if (!Number.isFinite(p)) return 0
	return Math.max(0, Math.min(100, Math.round(p)))
}

export function isAcceptedType(file: File, accept: string | undefined): boolean {
	if (!accept) return true
	const types = accept
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean)
	const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "")
	const mime = file.type
	return types.some((t) => {
		if (t.startsWith(".")) return ext === t.toLowerCase()
		if (t.endsWith("/*")) return mime.startsWith(t.slice(0, -1))
		return mime === t
	})
}

export function iconCategory(item: InputFileItem): string {
	const ext = (item.name.split(".").pop() ?? "").toLowerCase()
	const t = item.type
	if (t.startsWith("image/")) return "image"
	if (t.startsWith("video/")) return "video"
	if (t.startsWith("audio/")) return "audio"
	if (t.includes("pdf") || ext === "pdf") return "pdf"
	if (t.includes("zip") || ["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "zip"
	if (["xls", "xlsx", "csv"].includes(ext)) return "spreadsheet"
	if (["doc", "docx"].includes(ext)) return "doc"
	if (["ppt", "pptx"].includes(ext)) return "slides"
	return "file"
}

export const DEFAULT_LABELS: InputFileLabels = {
	dropHere: "Drop files here",
	dragAndDrop: "Drag and drop files here, or",
	browse: "Browse",
	selectFiles: "Select files",
	accepted: (a) => `Accepted: ${a}`,
	maxSize: (s) => `Max size: ${s}`,
	minSize: (s) => `Min size: ${s}`,
	totalMaxSize: (s, remaining) =>
		remaining != null ? `Total max size: ${s} · ${remaining} left` : `Total max size: ${s}`,
	maxFilesHint: (max, remaining) =>
		remaining != null ? `Max files: ${max} · ${remaining} more` : `Max files: ${max}`,
	minFilesHint: (n) => `Min files: ${n}`,
	clearAll: "Clear all",
	uploadAll: "Upload all",
	addMore: "+ Add more",
	showMore: (n) => `Show ${n} more`,
	showLess: "Show less",
	viewFiles: "View files",
	pending: "Pending",
	uploading: "Uploading",
	paused: "Paused",
	completed: "Completed",
	error: "Error",
	cancelled: "Cancelled",
	remove: "Remove file",
	retry: "Retry upload",
	pause: "Pause upload",
	resume: "Resume upload",
	pauseAll: "Pause all",
	resumeAll: "Resume all",
	retryAll: "Retry all",
	cancel: "Cancel upload",
	download: "Download",
	fileTooLarge: (m) => `File size exceeds ${m}`,
	totalSizeExceeded: (m) => `Total size would exceed ${m}`,
	fileTooSmall: (m) => `File size below ${m}`,
	fileTypeNotAccepted: (a) => `File type not accepted. Accepted: ${a}`,
	tooManyFiles: (m) => `Maximum ${m} files allowed`,
	tooFewFiles: (m) => `At least ${m} file${m === 1 ? "" : "s"} required`,
	duplicate: "Duplicate file",
	fileCount: (n) => `${n} file${n === 1 ? "" : "s"}`,
	totalProgress: ({completed, failed, total, uploadedBytes, totalBytes}) => {
		const sizes = `${formatInputFileSize(uploadedBytes)} / ${formatInputFileSize(totalBytes)}`
		const counts = failed > 0
			? `${completed} of ${total} done · ${failed} failed`
			: `${completed} of ${total} done`
		return `${counts} · ${sizes}`
	},
	emptyState: "No files selected",
	uploadedAnnouncement: (n) => `Uploaded ${n}`,
	failedAnnouncement: (n, e) => `Failed to upload ${n}: ${e}`
}
