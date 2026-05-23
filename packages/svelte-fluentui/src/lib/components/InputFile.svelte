<!--
 * InputFile Component
 * Inspired by FluentUI Blazor InputFile component
 * https://www.fluentui-blazor.net/InputFile
-->

<script lang="ts" module>
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

	const DEFAULT_LABELS: InputFileLabels = {
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

	let __nextId = 0
	function genId() {
		return `if-${++__nextId}-${Date.now().toString(36)}`
	}

	export function formatInputFileSize(bytes: number): string {
		if (bytes === 0) return "0 Bytes"
		const k = 1024
		const sizes = ["Bytes", "KB", "MB", "GB"]
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
	}

	async function hashFile(file: File): Promise<string> {
		const buf = await file.arrayBuffer()
		const hashBuf = await crypto.subtle.digest("SHA-1", buf)
		return Array.from(new Uint8Array(hashBuf))
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("")
	}
</script>

<script lang="ts">
	import type {Snippet} from "svelte"
	import {untrack} from "svelte"
	import {computePosition, flip, shift, offset, size, autoUpdate} from "@floating-ui/dom"
	import {portal} from "../actions/portal.js"
	import Button from "./Button.svelte"

	type Props = {
		// Bindable rich state — source of truth.
		items?: InputFileItem[]

		// Selection
		accept?: string
		multiple?: boolean
		disabled?: boolean
		selectorAppearance?: InputFileSelectorAppearance
		listAppearance?: InputFileListAppearance
		cardSize?: InputFileCardSize
		// Only meaningful when listAppearance === "chips" — picks where the chip
		// pile sits relative to the selector. "end" flows chips alongside the
		// selector (RTL-friendly trailing axis); "below" puts them on their own
		// row underneath. Default "end" for back-compat with the prior layout.
		chipsPosition?: InputFileChipsPosition

		// Drag-expand: when an external file is dragged anywhere on the document
		// (or on `expandOnDragTarget` if provided), an overlay covers the
		// selector with a `big` layout that acts as a larger drop target.
		// No layout shift — the overlay is rendered above content via portal.
		expandOnDrag?: boolean
		expandOnDragTarget?: HTMLElement | string

		// Initial state (alternative to bind:items for one-shot seeding).
		initialItems?: InputFileItem[]

		// Validation
		maxFileSize?: number
		minFileSize?: number
		totalMaxSize?: number
		maxFileCount?: number
		maxFiles?: number
		minFiles?: number
		customValidator?: InputFileValidator
		rejectionMode?: InputFileRejectionMode
		dedupe?: InputFileDedupeMode

		// Upload mechanics
		uploadFileCallback?: FileUploadHandler
		autoUpload?: boolean
		concurrency?: number
		retryPolicy?: InputFileRetryPolicy
		chunkSize?: number

		// UX
		showThumbnails?: boolean
		pasteFromClipboard?: boolean
		allowFolderDrop?: boolean
		allowReorder?: boolean
		maxVisible?: number
		listMaxHeight?: string | number

		// i18n
		labels?: Partial<InputFileLabels>

		// Limits hint composition. When provided and returns a non-empty string,
		// replaces ALL per-limit hint lines (max/min size, max/min files) with a
		// single composed message under the Browse button. The Accepted-types
		// line is unaffected.
		formatLimits?: (info: {
			minFileSize: number
			maxFileSize: number
			totalMaxSize: number
			maxFiles: number
			minFiles: number
			multiple: boolean
			// Current state of the picker — non-zero whenever items exist (errored
			// items excluded from the size sum, matching the addFiles accept logic).
			// Use these to render a "N of max" or "X MB left" composition.
			currentCount: number
			currentTotalSize: number
		}) => string | null | undefined

		// a11y
		id?: string
		"aria-label"?: string
		"aria-describedby"?: string
		"aria-labelledby"?: string

		// Callbacks
		onFileSelected?: (files: File[]) => void
		onFileUploaded?: (file: File, item: InputFileItem) => void
		onFileError?: (file: File | null, error: string, item?: InputFileItem) => void
		onCompleted?: () => void
		onValidityChange?: (valid: boolean, reasons: string[]) => void
		onItemsChange?: (items: InputFileItem[]) => void
		/**
		 * Fires once per item when it's removed from the list (via removeAt,
		 * removeById, clear, or the row's × button). Receives the removed
		 * item — including its final status and any metadata attached during
		 * upload (e.g. a server guid) — so callers can run cleanup like
		 * `fetch DELETE /api/files/:guid` for files that were already
		 * uploaded but the user changed their mind about before submit.
		 */
		onItemRemove?: (item: InputFileItem) => void

		// Snippets
		dropZone?: Snippet<[{openFileDialog: () => void; isDragging: boolean}]>
		fileItem?: Snippet<
			[
				{
					item: InputFileItem
					remove: () => void
					retry: () => Promise<void>
					pause: () => void
					resume: () => Promise<void>
					cancel: () => void
				}
			]
		>
		emptyState?: Snippet
		actions?: Snippet<[{
			clearAll: () => void
			uploadAll: () => Promise<void>
			pauseAll: () => void
			resumeAll: () => Promise<void>
			retryAll: () => Promise<void>
		}]>

		class?: string
		style?: string
	}

	let {
		items = $bindable<InputFileItem[]>([]),
		accept = undefined,
		multiple = false,
		disabled = false,
		selectorAppearance = "card",
		listAppearance = "list",
		cardSize = "compact",
		chipsPosition = "below",
		expandOnDrag = false,
		expandOnDragTarget = undefined,
		initialItems = undefined,
		maxFileSize = 10 * 1024 * 1024,
		minFileSize = 0,
		totalMaxSize = 0,
		maxFileCount = 10,
		maxFiles: maxFilesProp = undefined,
		minFiles = 0,
		customValidator = undefined,
		rejectionMode = "list",
		dedupe = false,
		uploadFileCallback = undefined,
		autoUpload = true,
		concurrency = 1,
		retryPolicy = undefined,
		chunkSize = undefined,
		showThumbnails = true,
		pasteFromClipboard = true,
		allowFolderDrop = false,
		allowReorder = false,
		maxVisible = undefined,
		listMaxHeight = undefined,
		labels: labelsProp = undefined,
		formatLimits = undefined,
		id = undefined,
		"aria-label": ariaLabel = undefined,
		"aria-describedby": ariaDescribedBy = undefined,
		"aria-labelledby": ariaLabelledBy = undefined,
		onFileSelected = undefined,
		onFileUploaded = undefined,
		onFileError = undefined,
		onCompleted = undefined,
		onValidityChange = undefined,
		onItemsChange = undefined,
		onItemRemove = undefined,
		dropZone = undefined,
		fileItem = undefined,
		emptyState = undefined,
		actions = undefined,
		class: className = "",
		style = ""
	}: Props = $props()

	const labels = $derived<InputFileLabels>({...DEFAULT_LABELS, ...(labelsProp ?? {})})
	const effectiveMaxFiles = $derived(maxFilesProp ?? maxFileCount)
	// Bytes already accepted toward the totalMaxSize cap. Mirrors the
	// `runningTotal` seed inside addFiles() — errored items don't count since
	// they won't upload, so the "remaining" hint matches what the next add
	// will actually be permitted.
	const currentTotalSize = $derived(
		items.reduce((sum, i) => (i.status === "error" ? sum : sum + i.size), 0)
	)
	// Total payload (every item, including errored ones) so the footer
	// progress bar denominator reflects the full picker contents, not just
	// what will eventually be sent.
	const totalBytes = $derived(items.reduce((sum, i) => sum + i.size, 0))
	// Bytes actually uploaded — completed items contribute their full size,
	// in-flight items contribute proportional to their reported progress.
	const uploadedBytes = $derived(
		items.reduce((sum, i) => {
			if (i.status === "completed") return sum + i.size
			if (i.status === "uploading" || i.status === "paused") {
				return sum + Math.floor(i.size * (i.progress / 100))
			}
			return sum
		}, 0)
	)
	const overallProgress = $derived(
		totalBytes === 0 ? 0 : Math.min(100, (uploadedBytes / totalBytes) * 100)
	)
	const completedCount = $derived(items.filter((i) => i.status === "completed").length)
	const failedCount = $derived(items.filter((i) => i.status === "error").length)
	// Gating flags for the footer's batch action buttons — show Pause all only
	// when something's actually uploading, Resume all only when at least one
	// item is paused, Retry all only when at least one errored. Avoids
	// rendering dead buttons that would no-op when clicked.
	const anyUploading = $derived(items.some((i) => i.status === "uploading"))
	const anyPaused = $derived(items.some((i) => i.status === "paused"))
	const anyFailed = $derived(failedCount > 0)
	const limitsHint = $derived(
		formatLimits?.({
			minFileSize,
			maxFileSize,
			totalMaxSize,
			maxFiles: effectiveMaxFiles,
			minFiles,
			multiple,
			currentCount: items.length,
			currentTotalSize
		}) ?? null
	)
	// Same content as the drop-zone hint paragraphs, but flattened into a
	// single-line array for popover-mode rendering (no card → no drop-zone
	// hints visible, so the popover header surfaces them instead).
	const limitPartsForPopover = $derived.by(() => {
		const parts: string[] = []
		if (accept) parts.push(labels.accepted(accept))
		if (limitsHint) {
			parts.push(limitsHint)
		} else {
			if (maxFileSize) parts.push(labels.maxSize(formatInputFileSize(maxFileSize)))
			if (minFileSize) parts.push(labels.minSize(formatInputFileSize(minFileSize)))
			if (totalMaxSize > 0) {
				parts.push(labels.totalMaxSize(
					formatInputFileSize(totalMaxSize),
					items.length > 0
						? formatInputFileSize(Math.max(0, totalMaxSize - currentTotalSize))
						: undefined
				))
			}
			if (multiple && effectiveMaxFiles) {
				parts.push(labels.maxFilesHint(
					effectiveMaxFiles,
					items.length > 0 ? Math.max(0, effectiveMaxFiles - items.length) : undefined
				))
			}
			if (minFiles > 0) parts.push(labels.minFilesHint(minFiles))
		}
		return parts
	})

	let fileInput: HTMLInputElement | undefined = $state()
	let isDragging = $state(false)
	let dragOverIndex = $state<number | null>(null)
	let draggedIndex = $state<number | null>(null)
	let liveAnnouncement = $state("")
	let showAllList = $state(false)
	let popoverOpen = $state(false)
	let rootEl: HTMLDivElement | undefined = $state()
	let selectorWrapEl: HTMLDivElement | undefined = $state()
	let popoverEl: HTMLDivElement | undefined = $state()
	let isExternalDragActive = $state(false)
	let dragOverlayEl: HTMLDivElement | undefined = $state()

	function resolveExpandTarget(): HTMLElement | undefined {
		if (!expandOnDragTarget) return selectorWrapEl
		if (typeof expandOnDragTarget === "string") {
			return document.querySelector(expandOnDragTarget) as HTMLElement | null ?? undefined
		}
		return expandOnDragTarget
	}

	function positionOverlay(node: HTMLElement, anchor: HTMLElement) {
		function update() {
			const rect = anchor.getBoundingClientRect()
			const cx = rect.left + rect.width / 2
			const cy = rect.top + rect.height / 2
			// Anchor the overlay's centre to the target's centre so it expands
			// symmetrically in every direction rather than only downwards.
			node.style.position = "fixed"
			node.style.left = `${cx}px`
			node.style.top = `${cy}px`
			node.style.transform = "translate(-50%, -50%)"
			node.style.minWidth = `${rect.width}px`
			node.style.minHeight = `${rect.height}px`
		}
		const cleanup = autoUpdate(anchor, node, update)
		return {
			destroy() {
				cleanup()
			}
		}
	}

	function positionPopover(node: HTMLElement, anchor: HTMLElement) {
		async function update() {
			const {x, y} = await computePosition(anchor, node, {
				placement: "bottom-end",
				strategy: "fixed",
				middleware: [
					offset(6),
					flip({fallbackPlacements: ["top-end", "bottom-start", "top-start"]}),
					shift({padding: 8}),
					size({
						apply({availableHeight, elements}) {
							// Clear any prior inline cap so getComputedStyle reflects the
							// CSS rule (which reads --fluent-inputfile-popover-max-height).
							// Then only re-apply an inline cap when the viewport actually
							// has less room than the CSS-defined ceiling — otherwise we'd
							// silently override the theme variable on tall screens and the
							// popover would grow to whatever the viewport allows.
							const floating = elements.floating as HTMLElement
							floating.style.maxHeight = ""
							const cssMax = parseFloat(getComputedStyle(floating).maxHeight)
							const viewportCap = availableHeight - 16
							const effective = Number.isFinite(cssMax)
								? Math.min(cssMax, viewportCap)
								: viewportCap
							floating.style.maxHeight = `${Math.max(effective, 160)}px`
						},
						padding: 8
					})
				]
			})
			node.style.left = `${x}px`
			node.style.top = `${y}px`
		}
		const cleanup = autoUpdate(anchor, node, update)
		return {
			destroy() {
				cleanup()
			}
		}
	}

	const controllers = new Map<string, AbortController>()
	const pausedSet = new Set<string>()
	const hashCache = new WeakMap<File, string>()

	// One-shot seed at construction; later changes to initialItems are ignored
	// (use bind:items for reactive control).
	untrack(() => {
		if (initialItems && initialItems.length > 0) {
			items = [...items, ...initialItems]
		}
	})

	$effect(() => {
		const snapshot = items
		untrack(() => onItemsChange?.(snapshot))
	})

	const visibleItems = $derived(
		maxVisible == null || showAllList ? items : items.slice(0, maxVisible)
	)
	const hiddenCount = $derived(items.length - visibleItems.length)
	const listMaxHeightCss = $derived(
		listMaxHeight == null
			? null
			: typeof listMaxHeight === "number"
				? `${listMaxHeight}px`
				: listMaxHeight
	)
	const minimalBadgeStatus = $derived.by(() => {
		if (items.some((i) => i.status === "error")) return "error"
		if (items.some((i) => i.status === "uploading" || i.status === "paused")) return "uploading"
		if (items.length > 0 && items.every((i) => i.status === "completed")) return "completed"
		return "pending"
	})
	const hasPendingPending = $derived(
		!!uploadFileCallback && !autoUpload && items.some((i) => i.status === "pending")
	)

	$effect(() => {
		if (!expandOnDrag || disabled) return
		const onDragEnter = (e: DragEvent) => {
			if (!e.dataTransfer?.types?.includes("Files")) return
			isExternalDragActive = true
		}
		// Dismiss when the cursor leaves the viewport entirely. Browsers signal
		// this with relatedTarget === null; Chrome also fires a final dragleave
		// at clientX/Y 0,0 when the drag is cancelled via Esc on the OS side.
		const onDragLeave = (e: DragEvent) => {
			if (e.relatedTarget) return
			isExternalDragActive = false
			isDragging = false
		}
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				isExternalDragActive = false
				isDragging = false
			}
		}
		const dismiss = () => {
			isExternalDragActive = false
		}
		document.addEventListener("dragenter", onDragEnter)
		document.addEventListener("dragleave", onDragLeave)
		document.addEventListener("dragend", dismiss)
		document.addEventListener("drop", dismiss)
		document.addEventListener("keydown", onKeyDown)
		window.addEventListener("blur", dismiss)
		return () => {
			document.removeEventListener("dragenter", onDragEnter)
			document.removeEventListener("dragleave", onDragLeave)
			document.removeEventListener("dragend", dismiss)
			document.removeEventListener("drop", dismiss)
			document.removeEventListener("keydown", onKeyDown)
			window.removeEventListener("blur", dismiss)
		}
	})

	$effect(() => {
		if (!popoverOpen) return
		const handler = (e: MouseEvent) => {
			// Use the event's composedPath (captured at dispatch time) rather than
			// `popoverEl.contains(target)`. If the click triggered a state update
			// that re-rendered the popover (remove item, retry, etc.), the click
			// target may be a now-detached node by the time this handler runs —
			// `contains()` would return false on a detached node and we'd dismiss
			// the popover even though the click started inside it. The path is a
			// snapshot of the propagation chain, immune to subsequent DOM mutations.
			const path = e.composedPath()
			// rootEl catches synthetic clicks from the hidden <input type="file">
			// fired by openFileDialog() — the input is a sibling of selectorWrapEl
			// inside the component root, so neither selectorWrapEl nor popoverEl
			// would be in its event path, and without this check clicking the
			// popover's "+ Add more" button would dismiss the popover.
			if (rootEl && path.includes(rootEl)) return
			if (selectorWrapEl && path.includes(selectorWrapEl)) return
			if (popoverEl && path.includes(popoverEl)) return
			popoverOpen = false
		}
		const escHandler = (e: KeyboardEvent) => {
			if (e.key === "Escape") popoverOpen = false
		}
		document.addEventListener("click", handler)
		document.addEventListener("keydown", escHandler)
		return () => {
			document.removeEventListener("click", handler)
			document.removeEventListener("keydown", escHandler)
		}
	})

	const validityReasons = $derived.by(() => {
		const reasons: string[] = []
		if (minFiles && items.length < minFiles) reasons.push(labels.tooFewFiles(minFiles))
		if (effectiveMaxFiles && items.length > effectiveMaxFiles)
			reasons.push(labels.tooManyFiles(effectiveMaxFiles))
		if (items.some((i) => i.status === "error")) reasons.push(labels.error)
		return reasons
	})
	const isValid = $derived(validityReasons.length === 0)

	$effect(() => {
		const v = isValid
		const r = validityReasons
		untrack(() => onValidityChange?.(v, r))
	})

	function isImage(file: File | null): boolean {
		return !!file && file.type.startsWith("image/")
	}
	function thumbnailFor(file: File | null): string | null {
		if (!isImage(file) || !showThumbnails) return null
		try {
			return URL.createObjectURL(file!)
		} catch {
			return null
		}
	}
	function revokeThumbnail(item: InputFileItem) {
		if (item.thumbnailUrl?.startsWith("blob:")) {
			try {
				URL.revokeObjectURL(item.thumbnailUrl)
			} catch {
				/* ignore */
			}
		}
	}

	function isAcceptedType(file: File): boolean {
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

	async function validateFile(file: File): Promise<string | null> {
		if (maxFileSize && file.size > maxFileSize)
			return labels.fileTooLarge(formatInputFileSize(maxFileSize))
		if (minFileSize && file.size < minFileSize)
			return labels.fileTooSmall(formatInputFileSize(minFileSize))
		if (!isAcceptedType(file)) return labels.fileTypeNotAccepted(accept ?? "")
		if (customValidator) {
			const r = await customValidator(file)
			if (r) return r
		}
		return null
	}

	async function isDuplicate(file: File): Promise<boolean> {
		if (!dedupe) return false
		if (dedupe === "name") return items.some((i) => i.name === file.name)
		if (dedupe === "name-size")
			return items.some((i) => i.name === file.name && i.size === file.size)
		if (dedupe === "hash") {
			let h = hashCache.get(file)
			if (!h) {
				h = await hashFile(file)
				hashCache.set(file, h)
			}
			for (const i of items) {
				if (!i.file) continue
				let ih = hashCache.get(i.file)
				if (!ih) {
					ih = await hashFile(i.file)
					hashCache.set(i.file, ih)
				}
				if (ih === h) return true
			}
		}
		return false
	}

	function emitRejection(file: File, reason: string) {
		if (rejectionMode === "callback") {
			onFileError?.(file, reason)
		} else if (rejectionMode === "list") {
			const item: InputFileItem = {
				id: genId(),
				file,
				name: file.name,
				size: file.size,
				type: file.type,
				progress: 0,
				status: "error",
				error: reason,
				thumbnailUrl: thumbnailFor(file)
			}
			items = [...items, item]
			onFileError?.(file, reason, item)
		}
	}

	export async function addFiles(files: File[]) {
		console.log("[InputFile] addFiles entry", {
			count: files.length,
			disabled,
			multiple,
			currentItems: items.length
		})
		if (disabled || !files.length) return
		const incoming = multiple ? [...files] : files.slice(0, 1)

		if (effectiveMaxFiles && items.length + incoming.length > effectiveMaxFiles) {
			const room = Math.max(0, effectiveMaxFiles - items.length)
			const overflow = incoming.slice(room)
			for (const f of overflow) emitRejection(f, labels.tooManyFiles(effectiveMaxFiles))
			incoming.length = room
			if (incoming.length === 0) return
		}

		let runningTotal = totalMaxSize > 0
			? items.reduce((sum, i) => (i.status === "error" ? sum : sum + i.size), 0)
			: 0

		const accepted: InputFileItem[] = []
		for (const file of incoming) {
			if (await isDuplicate(file)) {
				emitRejection(file, labels.duplicate)
				continue
			}
			const err = await validateFile(file)
			if (err) {
				emitRejection(file, err)
				continue
			}
			if (totalMaxSize > 0 && runningTotal + file.size > totalMaxSize) {
				emitRejection(file, labels.totalSizeExceeded(formatInputFileSize(totalMaxSize)))
				continue
			}
			runningTotal += file.size
			accepted.push({
				id: genId(),
				file,
				name: file.name,
				size: file.size,
				type: file.type,
				progress: 0,
				status: "pending",
				error: null,
				thumbnailUrl: thumbnailFor(file)
			})
		}

		console.log("[InputFile] addFiles result", {
			accepted: accepted.length,
			rejected: incoming.length - accepted.length,
			willAutoUpload: !!(autoUpload && uploadFileCallback && accepted.length > 0)
		})
		if (accepted.length > 0) {
			items = [...items, ...accepted]
			onFileSelected?.(accepted.map((a) => a.file).filter((f): f is File => !!f))
		}

		if (autoUpload && uploadFileCallback && accepted.length > 0) {
			await uploadAll()
		}
	}

	function patchItem(itemId: string, patch: Partial<InputFileItem>) {
		const idx = items.findIndex((i) => i.id === itemId)
		if (idx === -1) return
		items[idx] = {...items[idx], ...patch}
		items = [...items]
	}

	async function uploadOne(itemId: string, attempt = 0): Promise<void> {
		const item = items.find((i) => i.id === itemId)
		if (!item || !item.file || !uploadFileCallback) return
		if (pausedSet.has(itemId)) return

		const ctrl = new AbortController()
		controllers.set(itemId, ctrl)
		patchItem(itemId, {status: "uploading", progress: 0, error: null})

		try {
			let serverPatch: FileUploadResult | undefined
			if (chunkSize && chunkSize > 0 && item.file.size > chunkSize) {
				serverPatch = await uploadInChunks(item, ctrl.signal)
			} else {
				const res = await uploadFileCallback(
					item.file,
					(p) => patchItem(itemId, {progress: clampPercent(p)}),
					ctrl.signal
				)
				if (res) serverPatch = res
			}
			// Merging the handler's return value here (rather than asking the
			// consumer to wire onFileUploaded + a WeakMap) lets the handler do
			// `return {metadata: {serverGuid}}` and have it land on the item
			// atomically with the "completed" status flip.
			patchItem(itemId, {status: "completed", progress: 100, ...(serverPatch ?? {})})
			const updated = items.find((i) => i.id === itemId)
			if (updated && updated.file) {
				onFileUploaded?.(updated.file, updated)
				liveAnnouncement = labels.uploadedAnnouncement(updated.name)
			}
		} catch (err) {
			if (ctrl.signal.aborted) {
				if (pausedSet.has(itemId)) patchItem(itemId, {status: "paused"})
				else patchItem(itemId, {status: "cancelled"})
				return
			}
			const msg = err instanceof Error ? err.message : "Upload failed"
			const policy = retryPolicy ?? {}
			const maxAttempts = Math.max(1, policy.attempts ?? 1)
			if (attempt + 1 < maxAttempts) {
				const delay = (policy.delayMs ?? 1000) * Math.pow(policy.backoff ?? 2, attempt)
				await new Promise((r) => setTimeout(r, delay))
				if (pausedSet.has(itemId) || !items.find((i) => i.id === itemId)) return
				return uploadOne(itemId, attempt + 1)
			}
			patchItem(itemId, {status: "error", error: msg})
			const failed = items.find((i) => i.id === itemId)
			if (failed) {
				onFileError?.(failed.file, msg, failed)
				liveAnnouncement = labels.failedAnnouncement(failed.name, msg)
			}
		} finally {
			controllers.delete(itemId)
		}
	}

	function clampPercent(p: number): number {
		if (!Number.isFinite(p)) return 0
		return Math.max(0, Math.min(100, Math.round(p)))
	}

	async function uploadInChunks(
		item: InputFileItem,
		signal: AbortSignal
	): Promise<FileUploadResult | undefined> {
		if (!item.file || !uploadFileCallback || !chunkSize) return
		const file = item.file
		const total = file.size
		let offset = 0
		// Only the final chunk typically has the assembled server response
		// (guid, downloadUrl, etc.). Keep the last non-empty return so callers
		// can also opt to return it from an earlier chunk if their protocol
		// assigns the id up-front.
		let lastResult: FileUploadResult | undefined
		while (offset < total) {
			if (signal.aborted) throw new DOMException("Aborted", "AbortError")
			const end = Math.min(offset + chunkSize, total)
			const data = file.slice(offset, end)
			const chunkOffset = offset
			const res = await uploadFileCallback(
				file,
				(p) => {
					const overallBytes = chunkOffset + ((end - chunkOffset) * p) / 100
					patchItem(item.id, {progress: clampPercent((overallBytes / total) * 100)})
				},
				signal,
				{offset: chunkOffset, size: end - chunkOffset, total, data}
			)
			if (res) lastResult = res
			offset = end
		}
		return lastResult
	}

	export async function uploadAll() {
		if (!uploadFileCallback) return
		const queue = items.filter((i) => i.status === "pending" && i.file).map((i) => i.id)
		let cursor = 0
		const worker = async () => {
			while (cursor < queue.length) {
				const id = queue[cursor++]
				if (pausedSet.has(id)) continue
				await uploadOne(id)
			}
		}
		await Promise.all(Array.from({length: Math.max(1, concurrency)}, worker))
		const allDone = items.every(
			(i) => i.status !== "pending" && i.status !== "uploading"
		)
		if (allDone) onCompleted?.()
	}

	export async function retry(itemId: string) {
		pausedSet.delete(itemId)
		patchItem(itemId, {status: "pending", progress: 0, error: null})
		await uploadOne(itemId)
	}

	export function pause(itemId: string) {
		pausedSet.add(itemId)
		const ctrl = controllers.get(itemId)
		if (ctrl) ctrl.abort()
		else patchItem(itemId, {status: "paused"})
	}

	export async function resume(itemId: string) {
		pausedSet.delete(itemId)
		const item = items.find((i) => i.id === itemId)
		if (!item) return
		if (item.status === "paused" || item.status === "cancelled") {
			patchItem(itemId, {status: "pending", progress: 0, error: null})
			await uploadOne(itemId)
		}
	}

	export function cancel(itemId: string) {
		pausedSet.delete(itemId)
		const ctrl = controllers.get(itemId)
		if (ctrl) ctrl.abort()
		else patchItem(itemId, {status: "cancelled"})
	}

	// Batch counterparts of pause/resume/retry. resumeAll/retryAll reset the
	// affected items back to "pending" and then defer to uploadAll() so the
	// queue is drained through the same worker pool that respects `concurrency`
	// rather than firing N parallel uploads ignoring the cap.
	export function pauseAll() {
		for (const i of items) {
			if (i.status === "uploading") pause(i.id)
		}
	}
	export async function resumeAll() {
		for (const i of items) {
			if (i.status === "paused") {
				pausedSet.delete(i.id)
				patchItem(i.id, {status: "pending", progress: 0, error: null})
			}
		}
		await uploadAll()
	}
	export async function retryAll() {
		for (const i of items) {
			if (i.status === "error") {
				pausedSet.delete(i.id)
				patchItem(i.id, {status: "pending", progress: 0, error: null})
			}
		}
		await uploadAll()
	}

	export function removeAt(index: number) {
		const item = items[index]
		if (!item) return
		cancel(item.id)
		revokeThumbnail(item)
		items = items.filter((_, i) => i !== index)
		// Fire after the items array has been updated so consumers that read
		// state inside the handler see the post-removal snapshot. The removed
		// item is captured above so its metadata/status are still accessible.
		onItemRemove?.(item)
	}

	export function removeById(itemId: string) {
		const idx = items.findIndex((i) => i.id === itemId)
		if (idx >= 0) removeAt(idx)
	}

	export function clear() {
		// Snapshot before mutation so we can fire onItemRemove for each one
		// after the state is cleared (consumers reading state inside the
		// handler then see the empty list, matching removeAt's timing).
		const removed = items.slice()
		for (const i of removed) {
			cancel(i.id)
			revokeThumbnail(i)
		}
		items = []
		if (fileInput) fileInput.value = ""
		for (const i of removed) onItemRemove?.(i)
	}

	export function reset() {
		clear()
	}

	export function getItems(): InputFileItem[] {
		return items
	}

	export function openPicker() {
		openFileDialog()
	}

	function handleInputChange(event: Event) {
		const target = event.target as HTMLInputElement
		const fileList = target.files
		console.log("[InputFile] input change event fired", {
			filesCount: fileList?.length ?? 0,
			fileNames: fileList ? Array.from(fileList).map((f) => f.name) : []
		})
		if (fileList) addFiles(Array.from(fileList))
		target.value = ""
	}

	function handleDragEnter(event: DragEvent) {
		event.preventDefault()
		if (!disabled) isDragging = true
	}
	function handleDragOver(event: DragEvent) {
		event.preventDefault()
	}
	function handleDragLeave(event: DragEvent) {
		event.preventDefault()
		if (event.target === event.currentTarget) isDragging = false
	}

	async function handleDrop(event: DragEvent) {
		event.preventDefault()
		isDragging = false
		if (disabled) return

		if (allowFolderDrop && event.dataTransfer?.items) {
			const dataItems = Array.from(event.dataTransfer.items)
			const files: File[] = []
			await Promise.all(
				dataItems.map(async (di) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const entry = (di as any).webkitGetAsEntry?.()
					if (entry) await traverseEntry(entry, files)
					else {
						const f = di.getAsFile()
						if (f) files.push(f)
					}
				})
			)
			await addFiles(files)
		} else {
			const files = event.dataTransfer?.files
			if (files) await addFiles(Array.from(files))
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async function traverseEntry(entry: any, out: File[]) {
		if (entry.isFile) {
			const f = await new Promise<File>((res, rej) => entry.file(res, rej))
			out.push(f)
		} else if (entry.isDirectory) {
			const reader = entry.createReader()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const entries = await new Promise<any[]>((res, rej) =>
				reader.readEntries(res, rej)
			)
			for (const e of entries) await traverseEntry(e, out)
		}
	}

	let __lastDialogOpenAt = 0
	function openFileDialog() {
		if (disabled) {
			console.log("[InputFile] openFileDialog skipped: disabled")
			return
		}
		const now = performance.now()
		const sinceLast = now - __lastDialogOpenAt
		if (sinceLast < 250) {
			console.log(
				"[InputFile] openFileDialog SUPPRESSED — double-trigger guard",
				{sinceLast: Math.round(sinceLast) + "ms"}
			)
			return
		}
		__lastDialogOpenAt = now
		console.log("[InputFile] openFileDialog → fileInput.click()")
		fileInput?.click()
	}

	function handleSelectorClick() {
		// Minimal + popover (the legacy "minimal" preset): click toggles popover when
		// files exist, opens picker when empty.
		if (selectorAppearance === "minimal" && listAppearance === "popover" && items.length > 0) {
			popoverOpen = !popoverOpen
			return
		}
		openFileDialog()
	}

	function handlePaste(event: ClipboardEvent) {
		if (!pasteFromClipboard || disabled) return
		const files = Array.from(event.clipboardData?.files ?? [])
		if (files.length) {
			event.preventDefault()
			addFiles(files)
		}
	}

	function handleRowKeyDown(event: KeyboardEvent, index: number) {
		if (event.key === "Delete" || event.key === "Backspace") {
			event.preventDefault()
			removeAt(index)
		}
	}

	function handleDropZoneKeyDown(event: KeyboardEvent) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault()
			openFileDialog()
		}
	}

	function onRowDragStart(event: DragEvent, index: number) {
		if (!allowReorder) return
		draggedIndex = index
		event.dataTransfer?.setData("text/plain", String(index))
	}
	function onRowDragOver(event: DragEvent, index: number) {
		if (!allowReorder || draggedIndex === null) return
		event.preventDefault()
		dragOverIndex = index
	}
	function onRowDrop(event: DragEvent, index: number) {
		if (!allowReorder || draggedIndex === null) return
		event.preventDefault()
		const from = draggedIndex
		const to = index
		if (from !== to) {
			const next = [...items]
			const [moved] = next.splice(from, 1)
			next.splice(to, 0, moved)
			items = next
		}
		draggedIndex = null
		dragOverIndex = null
	}
	function onRowDragEnd() {
		draggedIndex = null
		dragOverIndex = null
	}

	function rowApi(item: InputFileItem) {
		return {
			item,
			remove: () => removeById(item.id),
			retry: () => retry(item.id),
			pause: () => pause(item.id),
			resume: () => resume(item.id),
			cancel: () => cancel(item.id)
		}
	}

	function statusLabel(status: InputFileStatus): string {
		switch (status) {
			case "pending":
				return labels.pending
			case "uploading":
				return labels.uploading
			case "paused":
				return labels.paused
			case "completed":
				return labels.completed
			case "error":
				return labels.error
			case "cancelled":
				return labels.cancelled
		}
	}

	function iconCategory(item: InputFileItem): string {
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
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={rootEl}
	class="fluent-inputfile fluent-inputfile--selector-{selectorAppearance} fluent-inputfile--list-{listAppearance} {className}"
	class:disabled
	class:has-files={items.length > 0}
	{style}
	aria-label={ariaLabel}
	aria-describedby={ariaDescribedBy}
	aria-labelledby={ariaLabelledBy}
	onpaste={handlePaste}
	role="group"
>
	<input
		bind:this={fileInput}
		{id}
		type="file"
		{accept}
		{multiple}
		{disabled}
		onchange={handleInputChange}
		class="fluent-inputfile__input"
		tabindex="-1"
		aria-hidden="true"
	/>

	{#snippet cardContent()}
		<div class="drop-zone-content">
			<div class="drop-zone-icon">
				<svg
					viewBox="0 0 48 48"
					fill="currentColor"
					class="upload-icon"
					aria-hidden="true"
				>
					<path
						d="M24 4a2 2 0 012 2v20.586l5.293-5.293a2 2 0 112.828 2.828l-8.707 8.708a2 2 0 01-2.828 0l-8.707-8.708a2 2 0 112.828-2.828L22 26.586V6a2 2 0 012-2z"
					/>
					<path
						d="M8 32a2 2 0 012-2h4a2 2 0 110 4h-2v6h24v-6h-2a2 2 0 110-4h4a2 2 0 012 2v10a2 2 0 01-2 2H10a2 2 0 01-2-2V32z"
					/>
				</svg>
			</div>
			<p class="drop-zone-text">
				{isDragging ? labels.dropHere : labels.dragAndDrop}
			</p>
			<div class="drop-zone-action">
				<Button
					appearance="accent"
					onclick={(e) => {
						e?.stopPropagation()
						openFileDialog()
					}}
					{disabled}
				>
					{labels.browse}
				</Button>
			</div>
			{#if accept || limitsHint || maxFileSize || minFileSize || totalMaxSize > 0 || (multiple && effectiveMaxFiles) || minFiles > 0}
				<div class="drop-zone-hints">
					{#if accept}
						<p class="drop-zone-hint">{labels.accepted(accept)}</p>
					{/if}
					{#if limitsHint}
						<p class="drop-zone-hint">{limitsHint}</p>
					{:else}
						{#if maxFileSize}
							<p class="drop-zone-hint">{labels.maxSize(formatInputFileSize(maxFileSize))}</p>
						{/if}
						{#if minFileSize}
							<p class="drop-zone-hint">{labels.minSize(formatInputFileSize(minFileSize))}</p>
						{/if}
						{#if totalMaxSize > 0}
							<p class="drop-zone-hint">
								{labels.totalMaxSize(
									formatInputFileSize(totalMaxSize),
									items.length > 0
										? formatInputFileSize(Math.max(0, totalMaxSize - currentTotalSize))
										: undefined
								)}
							</p>
						{/if}
						{#if multiple && effectiveMaxFiles}
							<p class="drop-zone-hint">
								{labels.maxFilesHint(
									effectiveMaxFiles,
									items.length > 0 ? Math.max(0, effectiveMaxFiles - items.length) : undefined
								)}
							</p>
						{/if}
						{#if minFiles > 0}
							<p class="drop-zone-hint">{labels.minFilesHint(minFiles)}</p>
						{/if}
					{/if}
				</div>
			{/if}
		</div>
	{/snippet}

	{#snippet selectorBlock()}
		{#if dropZone}
			{@render dropZone({openFileDialog, isDragging})}
		{:else if selectorAppearance === "card"}
			<div
				class="drop-zone drop-zone--{cardSize}"
				class:disabled
				class:dragging={isDragging}
				ondragenter={handleDragEnter}
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				ondrop={(e) => {
					e.stopPropagation()
					handleDrop(e)
				}}
				tabindex={disabled ? -1 : 0}
				role="button"
				aria-label={labels.browse}
				aria-expanded={listAppearance === "popover" && items.length > 0
					? popoverOpen
					: undefined}
				onkeydown={handleDropZoneKeyDown}
				onclick={handleSelectorClick}
			>
				{@render cardContent()}
			</div>
		{:else if selectorAppearance === "button"}
			<Button appearance="accent" onclick={handleSelectorClick} {disabled}>
				{labels.selectFiles}
			</Button>
		{:else if selectorAppearance === "minimal"}
			<button
				type="button"
				class="minimal-trigger"
				onclick={(e) => {
					e.stopPropagation()
					handleSelectorClick()
				}}
				{disabled}
				aria-label={items.length > 0 ? labels.viewFiles : labels.browse}
				aria-expanded={listAppearance === "popover" && items.length > 0
					? popoverOpen
					: undefined}
				title={items.length > 0
					? `${labels.fileCount(items.length)} — ${statusLabel(minimalBadgeStatus as InputFileStatus)}`
					: labels.browse}
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm0 7V3.5L19.5 9H14z"
					/>
				</svg>
				{#if items.length > 0}
					<span class="minimal-badge minimal-badge--{minimalBadgeStatus}">
						{#if minimalBadgeStatus === "uploading"}
							<span class="minimal-badge-spinner" aria-hidden="true"></span>
						{/if}
						{items.length}
					</span>
				{/if}
			</button>
		{/if}
	{/snippet}

	{#snippet chipsList()}
		{#each visibleItems as item (item.id)}
			<span
				class="chip"
				class:error={item.status === "error"}
				class:uploading={item.status === "uploading"}
				class:completed={item.status === "completed"}
			>
				<span class="chip-info">
					<span class="chip-name" title={item.name}>{item.name}</span>
					{#if item.status === "uploading"}
						<span class="chip-progress">{item.progress}%</span>
					{/if}
				</span>
				<button
					type="button"
					class="chip-remove"
					onclick={() => removeById(item.id)}
					aria-label={labels.remove}
					title={labels.remove}
				>
					×
				</button>
			</span>
		{/each}
		{#if hiddenCount > 0}
			<button
				type="button"
				class="chip chip-more"
				onclick={() => (showAllList = true)}
			>
				+{hiddenCount}
			</button>
		{:else if showAllList && maxVisible != null && items.length > maxVisible}
			<button
				type="button"
				class="chip chip-more"
				onclick={() => (showAllList = false)}
			>
				−
			</button>
		{/if}
	{/snippet}

	{#snippet overallFooter()}
		{#if uploadFileCallback && items.length > 0}
			<div class="file-list-footer">
				<div
					class="footer-progress"
					role="progressbar"
					aria-valuenow={Math.round(overallProgress)}
					aria-valuemin="0"
					aria-valuemax="100"
				>
					<div class="footer-progress-fill" style:width="{overallProgress}%"></div>
				</div>
				<div class="footer-stats">
					<span class="footer-stats-text">
						{labels.totalProgress({
							completed: completedCount,
							failed: failedCount,
							total: items.length,
							uploadedBytes,
							totalBytes,
							percent: overallProgress
						})}
					</span>
					{#if anyUploading || anyPaused || anyFailed}
						<div class="footer-actions">
							{#if anyUploading}
								<button
									type="button"
									class="footer-action-button"
									onclick={(e) => {
										e.stopPropagation()
										pauseAll()
									}}
								>
									{labels.pauseAll}
								</button>
							{/if}
							{#if anyPaused}
								<button
									type="button"
									class="footer-action-button"
									onclick={(e) => {
										e.stopPropagation()
										resumeAll()
									}}
								>
									{labels.resumeAll}
								</button>
							{/if}
							{#if anyFailed}
								<button
									type="button"
									class="footer-action-button"
									onclick={(e) => {
										e.stopPropagation()
										retryAll()
									}}
								>
									{labels.retryAll}
								</button>
							{/if}
						</div>
					{/if}
					<span class="footer-stats-percent">{Math.round(overallProgress)}%</span>
				</div>
			</div>
		{/if}
	{/snippet}

	{#if listAppearance === "chips" && items.length > 0}
		<!-- chips-row only renders when there are items to show. With zero items,
		     fall through to the plain selector-wrap so the card stays at its
		     natural block width and its inner text changes (e.g. "Drop files
		     here" during drag) don't reflow the wrapper. -->
		<div
			class="chips-row"
			class:dragging={isDragging}
			data-chips-position={chipsPosition}
			bind:this={selectorWrapEl}
			ondragenter={handleDragEnter}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
		>
			{@render selectorBlock()}
			<div class="chips-wrap">
				{@render chipsList()}
			</div>
		</div>
		{@render overallFooter()}
	{:else}
		<div class="fluent-inputfile__selector-wrap" bind:this={selectorWrapEl}>
			{@render selectorBlock()}
		</div>
	{/if}

	{#snippet fileListPanel(inPopover: boolean)}
		<div class="file-list">
			<div class="file-list-sticky">
			<div class="file-list-header">
				<span class="file-count">{labels.fileCount(items.length)}</span>
				{#if actions}
					{@render actions({clearAll: clear, uploadAll, pauseAll, resumeAll, retryAll})}
				{:else}
					<div class="file-list-actions">
						{#if inPopover}
							<button
								type="button"
								class="text-button"
								onclick={(e) => {
									e.stopPropagation()
									openFileDialog()
								}}
								{disabled}
							>
								{labels.addMore}
							</button>
						{/if}
						{#if uploadFileCallback && !autoUpload && items.some((i) => i.status === "pending")}
							<button type="button" class="text-button" onclick={uploadAll} {disabled}>
								{labels.uploadAll}
							</button>
						{/if}
						<button type="button" class="text-button" onclick={clear} {disabled}>
							{labels.clearAll}
						</button>
					</div>
				{/if}
			</div>

			{#if inPopover && limitPartsForPopover.length > 0}
				<div class="file-list-limits">{limitPartsForPopover.join(" · ")}</div>
			{/if}
			</div>

			<div
				class="file-list-rows"
				class:scrollable={listMaxHeightCss != null}
				style:max-height={listMaxHeightCss}
			>
				{#each visibleItems as item, index (item.id)}
					{#if fileItem}
						{@render fileItem(rowApi(item))}
					{:else}
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						<div
							class="file-item"
							class:error={item.status === "error"}
							class:completed={item.status === "completed"}
							class:dragging={draggedIndex === index}
							class:drag-over={dragOverIndex === index && draggedIndex !== index}
							tabindex="0"
							role="listitem"
							aria-label="{item.name}, {statusLabel(item.status)}"
							onkeydown={(e) => handleRowKeyDown(e, index)}
							draggable={allowReorder}
							ondragstart={(e) => onRowDragStart(e, index)}
							ondragover={(e) => onRowDragOver(e, index)}
							ondrop={(e) => onRowDrop(e, index)}
							ondragend={onRowDragEnd}
						>
							{#if item.thumbnailUrl}
								<img class="file-thumb" src={item.thumbnailUrl} alt="" />
							{:else}
								<div class="file-icon" data-category={iconCategory(item)} aria-hidden="true">
									<svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor">
										<path
											d="M19 2H8a2 2 0 00-2 2v24a2 2 0 002 2h16a2 2 0 002-2V9l-7-7zm0 7V3.5L24.5 9H19z"
										/>
									</svg>
								</div>
							{/if}

							<div class="file-info">
								<div class="file-header">
									<span class="file-name" title={item.name}>{item.name}</span>
									<span class="file-size">{formatInputFileSize(item.size)}</span>
								</div>

								{#if item.status === "uploading" || item.status === "paused"}
									<div
										class="progress-bar"
										role="progressbar"
										aria-valuenow={item.progress}
										aria-valuemin="0"
										aria-valuemax="100"
									>
										<div class="progress-fill" style="width: {item.progress}%"></div>
									</div>
									<span class="status-text">
										{item.progress}% — {item.status === "paused"
											? labels.paused
											: labels.uploading}
									</span>
								{:else if item.status === "completed"}
									<span class="status-text success">✓ {labels.completed}</span>
								{:else if item.status === "error"}
									<span class="status-text error">✗ {item.error ?? labels.error}</span>
								{:else if item.status === "cancelled"}
									<span class="status-text muted">⊘ {labels.cancelled}</span>
								{:else}
									<span class="status-text muted">{labels.pending}</span>
								{/if}
							</div>

							<div class="file-actions">
								{#if item.downloadUrl && item.status === "completed"}
									<a
										class="action-button"
										href={item.downloadUrl}
										download={item.name}
										aria-label={labels.download}
									>
										↓
									</a>
								{/if}
								{#if item.status === "uploading"}
									<button
										type="button"
										class="action-button"
										onclick={() => pause(item.id)}
										aria-label={labels.pause}
									>
										‖
									</button>
									<button
										type="button"
										class="action-button"
										onclick={() => cancel(item.id)}
										aria-label={labels.cancel}
									>
										✕
									</button>
								{:else if item.status === "paused"}
									<button
										type="button"
										class="action-button"
										onclick={() => resume(item.id)}
										aria-label={labels.resume}
									>
										▶
									</button>
								{:else if (item.status === "error" || item.status === "cancelled") && item.file && uploadFileCallback}
									<button
										type="button"
										class="action-button"
										onclick={() => retry(item.id)}
										aria-label={labels.retry}
									>
										↻
									</button>
								{/if}
								<button
									type="button"
									class="remove-button"
									onclick={() => removeAt(index)}
									{disabled}
									aria-label={labels.remove}
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											d="M2.09 2.22a.75.75 0 011.06-.13L8 6.94l4.85-4.85a.75.75 0 111.06 1.06L9.06 8l4.85 4.85a.75.75 0 11-1.06 1.06L8 9.06l-4.85 4.85a.75.75 0 01-1.06-1.06L6.94 8 2.09 3.15a.75.75 0 01-.13-1.06z"
										/>
									</svg>
								</button>
							</div>
						</div>
					{/if}
				{/each}

				{#if hiddenCount > 0}
					<button
						type="button"
						class="show-more-toggle"
						onclick={() => (showAllList = true)}
					>
						{labels.showMore(hiddenCount)}
					</button>
				{:else if showAllList && maxVisible != null && items.length > maxVisible}
					<button
						type="button"
						class="show-more-toggle"
						onclick={() => (showAllList = false)}
					>
						{labels.showLess}
					</button>
				{/if}
			</div>

			{@render overallFooter()}
		</div>
	{/snippet}

	{#if listAppearance === "list"}
		{#if items.length > 0}
			{@render fileListPanel(false)}
		{:else if emptyState}
			{@render emptyState()}
		{/if}
	{:else if listAppearance === "popover" && popoverOpen && items.length > 0 && selectorWrapEl}
		<div
			bind:this={popoverEl}
			use:portal
			use:positionPopover={selectorWrapEl}
			class="minimal-popover"
			aria-label={labels.viewFiles}
		>
			{@render fileListPanel(true)}
		</div>
	{/if}

	{#if expandOnDrag && isExternalDragActive && selectorAppearance === "card" && !disabled}
		{@const overlayAnchor = resolveExpandTarget() ?? selectorWrapEl}
		{#if overlayAnchor}
			<div
				bind:this={dragOverlayEl}
				use:portal
				use:positionOverlay={overlayAnchor}
				class="drop-zone drop-zone--big drag-overlay"
				class:dragging={isDragging}
				ondragenter={handleDragEnter}
				ondragover={handleDragOver}
				ondragleave={(e) => {
					// `target === currentTarget` is true even when the cursor moves
					// from the overlay's padding into a descendant (dragleave fires
					// like mouseout). Use relatedTarget containment instead so the
					// overlay only clears its drag-highlight when the cursor really
					// leaves the overlay subtree. Don't toggle isExternalDragActive
					// here — document-level handlers own that lifecycle.
					const overlay = e.currentTarget as HTMLElement
					const related = e.relatedTarget as Node | null
					if (!related || !overlay.contains(related)) {
						isDragging = false
					}
				}}
				ondrop={(e) => {
					handleDrop(e)
					isExternalDragActive = false
				}}
				role="presentation"
			>
				{@render cardContent()}
			</div>
		{/if}
	{/if}

	<div class="sr-only" aria-live="polite" role="status">{liveAnnouncement}</div>
</div>

<style>
	.fluent-inputfile {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.fluent-inputfile.disabled {
		opacity: 0.6;
	}

	.fluent-inputfile__input {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.drop-zone {
		border: 2px dashed var(--neutral-stroke-rest);
		border-radius: var(--fluent-border-radius-xl);
		background: var(--neutral-layer-2);
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			box-shadow 0.2s ease;
		cursor: pointer;
		outline: none;
	}
	.drop-zone:hover:not(.disabled),
	.drop-zone:focus-visible {
		border-color: var(--accent-fill-rest);
		background: var(--neutral-layer-3);
	}
	.drop-zone:focus-visible {
		box-shadow: 0 0 0 2px var(--accent-fill-rest);
	}
	.drop-zone.dragging {
		border-color: var(--accent-fill-rest);
		background: var(--accent-fill-subtle, var(--neutral-layer-3));
	}
	.drop-zone.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.drop-zone-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--neutral-foreground-hint);
	}
	.upload-icon {
		color: inherit;
		display: block;
	}
	.drop-zone-text {
		margin: 0;
		font-size: 1rem;
		color: var(--neutral-foreground-rest);
	}
	.drop-zone-hint {
		margin: 0;
		font-size: 0.875rem;
		color: var(--neutral-foreground-hint);
	}
	.drop-zone-action {
		display: inline-flex;
	}

	/* big — full-height vertical stack (original layout) */
	.drop-zone--big {
		padding: 2rem;
	}
	.drop-zone--big .drop-zone-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
	.drop-zone--big .upload-icon {
		width: 48px;
		height: 48px;
	}
	.drop-zone--big .drop-zone-hints {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	/* compact — horizontal main row + wrapping hints row */
	.drop-zone--compact {
		padding: 1rem 1.25rem;
	}
	.drop-zone--compact .drop-zone-content {
		display: grid;
		grid-template-areas:
			"icon message action"
			"hints hints hints";
		grid-template-columns: auto 1fr auto;
		align-items: center;
		column-gap: 1rem;
		row-gap: 0.5rem;
	}
	.drop-zone--compact .drop-zone-icon {
		grid-area: icon;
	}
	.drop-zone--compact .drop-zone-text {
		grid-area: message;
	}
	.drop-zone--compact .drop-zone-action {
		grid-area: action;
	}
	.drop-zone--compact .drop-zone-hints {
		grid-area: hints;
		display: flex;
		flex-flow: row wrap;
		gap: 0.25rem 1rem;
	}
	.drop-zone--compact .upload-icon {
		width: 28px;
		height: 28px;
	}

	/* minimal — message + hints + button all inline on one wrapping row */
	.drop-zone--minimal {
		padding: 0.5rem 0.875rem;
	}
	.drop-zone--minimal .drop-zone-content {
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		gap: 0.4rem 0.75rem;
	}
	.drop-zone--minimal .drop-zone-text {
		font-size: 0.9rem;
	}
	/* dissolve the hints wrapper so each hint becomes a sibling of text/icon/action */
	.drop-zone--minimal .drop-zone-hints {
		display: contents;
	}
	.drop-zone--minimal .drop-zone-hint {
		font-size: 0.85rem;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
	.drop-zone--minimal .drop-zone-hint::before {
		content: "·";
		color: var(--neutral-foreground-hint);
		opacity: 0.6;
	}
	.drop-zone--minimal .drop-zone-action {
		order: 99;
		margin-left: auto;
	}
	.drop-zone--minimal .upload-icon {
		width: 18px;
		height: 18px;
	}

	/* drag-expand overlay — centred on the selector, expands symmetrically */
	.drag-overlay {
		z-index: var(--fluent-z-popover, 1060);
		background: var(--neutral-layer-2);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
		border-color: var(--accent-fill-rest);
		min-height: 12rem;
		max-width: 90vw;
		max-height: 90vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
	}
	.drag-overlay.dragging {
		background: var(--accent-fill-subtle, var(--neutral-layer-3));
	}

	.minimal-wrap {
		position: relative;
		display: inline-block;
	}
	.minimal-trigger {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		background: transparent;
		border: 1px solid var(--neutral-stroke-rest);
		border-radius: var(--fluent-border-radius-md);
		color: var(--neutral-foreground-rest);
		cursor: pointer;
	}
	.minimal-trigger:hover:not(:disabled) {
		background: var(--neutral-fill-secondary-hover, var(--neutral-layer-2));
	}
	.minimal-trigger:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.minimal-trigger[aria-expanded="true"] {
		background: var(--neutral-layer-3);
		border-color: var(--accent-fill-rest);
	}
	.minimal-badge {
		position: absolute;
		top: -4px;
		right: -4px;
		min-width: 1.1rem;
		height: 1.1rem;
		padding: 0 0.3rem;
		background: var(--neutral-foreground-hint);
		color: white;
		border-radius: var(--fluent-border-radius-pill);
		font-size: 0.7rem;
		font-weight: 700;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.2rem;
		border: 1.5px solid var(--neutral-layer-1, white);
	}
	.minimal-badge--pending {
		background: var(--neutral-foreground-hint);
	}
	.minimal-badge--uploading {
		background: var(--accent-fill-rest);
		color: var(--foreground-on-accent-rest, white);
	}
	.minimal-badge--completed {
		background: var(--success-foreground-rest, #107c10);
		color: white;
	}
	.minimal-badge--error {
		background: var(--error-foreground-rest, #c50f1f);
		color: white;
	}
	.minimal-badge-spinner {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: var(--fluent-border-radius-circle);
		border: 1.5px solid currentColor;
		border-top-color: transparent;
		animation: minimal-spin 0.8s linear infinite;
	}
	@keyframes minimal-spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Width, min-height, and max-height are exposed as CSS vars so consumers can
	   override per theme or per instance (e.g. `style="--fluent-inputfile-popover-width: 32rem"`).
	   Without these bounds, a single long filename would stretch the popover
	   to whatever width that filename needs, and stacked items would let it
	   grow vertically without limit — both produce a jumpy, oversized panel.
	   min-height keeps the box from shrinking on short lists so adding/removing
	   files within that range doesn't cause the popover to resize. */
	.minimal-popover {
		position: fixed;
		top: 0;
		left: 0;
		width: var(--fluent-inputfile-popover-width, 28rem);
		max-width: 90vw;
		min-height: var(--fluent-inputfile-popover-min-height, 16rem);
		max-height: var(--fluent-inputfile-popover-max-height, 24rem);
		background: var(--neutral-layer-1, white);
		border: 1px solid var(--neutral-stroke-rest);
		border-radius: var(--fluent-border-radius-lg);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
		padding: 0.75rem;
		z-index: var(--fluent-z-popover, 1060);
		overflow-y: auto;
		overscroll-behavior: contain;
	}
	/* The popover stays a plain block scroll container (so position:sticky on the
	   header/footer behaves predictably against it). To pin the footer to the
	   visual bottom when the list is short, the inner .file-list is a flex
	   column that's forced to fill the popover via min-height:100%, with the
	   rows set to flex-grow so they consume the empty space and push the
	   footer down. On long lists the popover scrolls naturally. */
	.minimal-popover .file-list {
		gap: 0.4rem;
		min-height: 100%;
	}
	.minimal-popover .file-list-rows {
		flex: 1 0 auto;
	}
	/* Pin header + limits to the top of the popover's scroll viewport while
	   the rows scroll underneath. position: sticky on a single wrapper avoids
	   the brittle "match nested sticky offsets" problem, and the popover keeps
	   content-sizing for short lists (so 2 files don't render a giant box). */
	.minimal-popover .file-list-sticky {
		position: sticky;
		top: -0.75rem;
		background: var(--neutral-layer-1, white);
		z-index: 1;
		/* Negative margins + matching padding extend the sticky background to
		   the popover's inner edge so rows scrolling underneath are hidden. */
		margin: -0.75rem -0.75rem 0;
		padding: 0.75rem 0.75rem 0;
	}
	.minimal-popover .file-list-footer {
		position: sticky;
		bottom: -0.75rem;
		margin: 0 -0.75rem -0.75rem;
		padding: 0.5rem 0.75rem 0.75rem;
		background: var(--neutral-layer-1, white);
		z-index: 1;
		border-top: 1px solid var(--neutral-stroke-rest);
	}
	.file-list-footer {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding-top: 0.5rem;
	}
	.footer-progress {
		width: 100%;
		height: 4px;
		background: var(--neutral-layer-3);
		border-radius: var(--fluent-border-radius-sm);
		overflow: hidden;
	}
	.footer-progress-fill {
		height: 100%;
		background: var(--accent-fill-rest);
		transition: width 0.15s linear;
	}
	.footer-stats {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		color: var(--neutral-foreground-hint);
		font-variant-numeric: tabular-nums;
	}
	.footer-stats-text {
		flex: 1;
		min-width: 0;
	}
	.footer-stats-percent {
		font-weight: 600;
		color: var(--neutral-foreground-rest);
	}
	.footer-actions {
		display: flex;
		gap: 0.1rem;
		align-items: center;
	}
	/* Small text buttons sized to fit the footer's 0.75rem context — same
	   colour cues as the existing .text-button (accent fg, neutral hover bg)
	   but tighter padding so the trio + the percent still fits on one line. */
	.footer-action-button {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.15rem 0.4rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--accent-fill-rest);
		border-radius: var(--fluent-border-radius-sm);
		line-height: 1.2;
		transition: background 0.1s ease, color 0.1s ease;
	}
	.footer-action-button:hover {
		background: var(--neutral-fill-secondary-hover, var(--neutral-layer-3));
	}
	.footer-action-button:focus-visible {
		outline: 2px solid var(--accent-fill-rest);
		outline-offset: -2px;
	}

	/* Transparent layout wrapper — the drop-zone card carries its own drag-over
	   visual via the shared `isDragging` state, so no padding/border here (and
	   no layout shift when chips appear vs. list/none modes). */
	.chips-row {
		display: flex;
		flex-direction: row;
		gap: 0.4rem;
		align-items: flex-start;
	}
	.chips-row[data-chips-position="below"] {
		flex-direction: column;
		align-items: stretch;
	}
	/* Chips live in their own wrap cell so they flow top-down inside the cell
	   instead of mixing into the selector's flex row (which produced row-1
	   chips that vertically centered against a tall card and subsequent rows
	   that wrapped below the card with an awkward gap). min-width: 0 lets the
	   cell shrink below its content's intrinsic width so flex-wrap actually
	   kicks in once chips overflow. */
	.chips-wrap {
		flex: 1 1 0;
		min-width: 0;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		align-items: center;
		gap: 0.4rem;
	}
	.chips-row[data-chips-position="below"] .chips-wrap {
		flex: 0 1 auto;
	}
	/* Two-cell layout: [ info | × ]. `align-items: stretch` + `overflow: hidden`
	   let the remove button fill the chip's full height while still respecting
	   the chip's rounded corners. Padding lives on the children, not the chip
	   itself, so the remove button can reach the chip's right edge. */
	.chip {
		display: inline-flex;
		align-items: stretch;
		background: var(--neutral-layer-2);
		border: 1px solid var(--neutral-stroke-rest);
		border-radius: var(--fluent-border-radius-xl);
		font-size: 0.85rem;
		max-width: 240px;
		overflow: hidden;
	}
	.chip.error {
		border-color: var(--error-foreground-rest, #c50f1f);
		color: var(--error-foreground-rest, #c50f1f);
	}
	.chip.uploading {
		border-color: var(--accent-fill-rest);
	}
	.chip.completed {
		border-color: var(--success-foreground-rest, #107c10);
	}
	.chip-info {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.2rem 0.5rem;
		min-width: 0;
		flex: 1 1 auto;
	}
	.chip-name {
		max-width: 160px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.chip-progress {
		font-variant-numeric: tabular-nums;
		color: var(--neutral-foreground-hint);
	}
	/* Full-height right cell so the entire area from the divider to the chip's
	   end is clickable, not just the × glyph. */
	.chip-remove {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		border-left: 1px solid var(--neutral-stroke-rest);
		cursor: pointer;
		font-size: 1rem;
		line-height: 1;
		padding: 0 0.6rem;
		min-width: 1.75rem;
		color: var(--neutral-foreground-hint);
		transition: background 0.1s ease, color 0.1s ease;
	}
	.chip-remove:hover {
		background: var(--neutral-fill-secondary-hover, var(--neutral-layer-3));
		color: var(--neutral-foreground-rest);
	}
	.chip-remove:focus-visible {
		outline: 2px solid var(--accent-fill-rest);
		outline-offset: -2px;
	}
	/* Keep the divider colour in sync with the status-coloured chip border. */
	.chip.error .chip-remove {
		border-left-color: var(--error-foreground-rest, #c50f1f);
	}
	.chip.uploading .chip-remove {
		border-left-color: var(--accent-fill-rest);
	}
	.chip.completed .chip-remove {
		border-left-color: var(--success-foreground-rest, #107c10);
	}
	.chip-more {
		background: var(--neutral-layer-3);
		color: var(--accent-fill-rest);
		border: 1px dashed var(--neutral-stroke-rest);
		font-weight: 700;
		padding: 0.3rem 0.6rem;
		cursor: pointer;
	}
	.chip-more:hover {
		background: var(--neutral-layer-2);
	}

	.file-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.file-list-rows {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.file-list-rows.scrollable {
		overflow-y: auto;
		padding-right: 0.25rem;
	}
	.show-more-toggle {
		align-self: flex-start;
		background: transparent;
		border: 1px dashed var(--neutral-stroke-rest);
		color: var(--accent-fill-rest);
		padding: 0.4rem 0.75rem;
		border-radius: var(--fluent-border-radius-md);
		cursor: pointer;
		font-size: 0.85rem;
		font-weight: 600;
	}
	.show-more-toggle:hover {
		background: var(--neutral-layer-2);
		border-style: solid;
	}
	.file-list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0;
	}
	/* Compact one-liner that mirrors the drop-zone hint paragraphs. Sits in the
	   popover header where the card (and its inline hints) isn't visible. */
	.file-list-limits {
		font-size: 0.75rem;
		color: var(--neutral-foreground-hint);
		padding: 0 0 0.5rem;
		line-height: 1.35;
	}
	.file-count {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--neutral-foreground-rest);
	}
	.file-list-actions {
		display: flex;
		gap: 0.5rem;
	}

	.text-button {
		background: transparent;
		border: none;
		color: var(--accent-fill-rest);
		cursor: pointer;
		font-size: 0.875rem;
		padding: 0.25rem 0.5rem;
		border-radius: var(--fluent-border-radius-md);
	}
	.text-button:hover:not(:disabled) {
		background: var(--neutral-fill-secondary-hover, var(--neutral-layer-2));
	}
	.text-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.file-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		background: var(--neutral-layer-2);
		border: 1px solid var(--neutral-stroke-rest);
		border-radius: var(--fluent-border-radius-md);
		outline: none;
		transition:
			border-color 0.15s ease,
			background 0.15s ease;
	}
	.file-item:focus-visible {
		border-color: var(--accent-fill-rest);
		box-shadow: 0 0 0 1px var(--accent-fill-rest);
	}
	.file-item.error {
		border-color: var(--error-foreground-rest, #c50f1f);
	}
	.file-item.completed {
		border-color: var(--success-foreground-rest, #107c10);
	}
	.file-item.dragging {
		opacity: 0.5;
	}
	.file-item.drag-over {
		border-top: 2px solid var(--accent-fill-rest);
	}

	.file-thumb {
		width: 40px;
		height: 40px;
		object-fit: cover;
		border-radius: var(--fluent-border-radius-md);
		flex-shrink: 0;
		background: var(--neutral-layer-3);
	}
	/* Single neutral icon color across all file types. The category data
	   attribute is still emitted on the element so consumers who want
	   color-coding can add their own `.file-icon[data-category="pdf"]`
	   rule, but the default treats every file the same to avoid implying
	   semantics from a generic file glyph. */
	.file-icon {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: var(--fluent-inputfile-icon-file-color, var(--neutral-foreground-hint));
	}

	.file-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		min-width: 0;
	}
	.file-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}
	.file-name {
		/* flex + min-width: 0 are required for the ellipsis to actually engage
		   inside the flex parent — without min-width, a flex item never shrinks
		   below its content's intrinsic width and `overflow: hidden` has nothing
		   to clip. */
		flex: 1 1 auto;
		min-width: 0;
		font-weight: 600;
		color: var(--neutral-foreground-rest);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.file-size {
		font-size: 0.875rem;
		color: var(--neutral-foreground-hint);
		white-space: nowrap;
	}

	.progress-bar {
		width: 100%;
		height: 4px;
		background: var(--neutral-layer-3);
		border-radius: var(--fluent-border-radius-sm);
		overflow: hidden;
	}
	.progress-fill {
		height: 100%;
		background: var(--accent-fill-rest);
		transition: width 0.15s linear;
	}

	.status-text {
		font-size: 0.8rem;
		color: var(--neutral-foreground-hint);
		font-variant-numeric: tabular-nums;
	}
	.status-text.success {
		color: var(--success-foreground-rest, #107c10);
	}
	.status-text.error {
		color: var(--error-foreground-rest, #c50f1f);
	}
	.status-text.muted {
		color: var(--neutral-foreground-hint);
	}

	.file-actions {
		display: flex;
		gap: 0.25rem;
		align-items: center;
		flex-shrink: 0;
	}
	.action-button,
	.remove-button {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.4rem;
		color: var(--neutral-foreground-rest);
		border-radius: var(--fluent-border-radius-md);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.95rem;
		text-decoration: none;
		min-width: 1.75rem;
		min-height: 1.75rem;
	}
	.action-button:hover:not(:disabled),
	.remove-button:hover:not(:disabled) {
		background: var(--neutral-fill-secondary-hover, var(--neutral-layer-3));
	}
	.action-button:disabled,
	.remove-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
