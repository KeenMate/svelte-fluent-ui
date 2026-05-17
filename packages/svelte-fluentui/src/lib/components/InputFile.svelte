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

	export type FileUploadHandler = (
		file: File,
		onProgress: (percent: number) => void,
		signal?: AbortSignal,
		chunk?: FileUploadChunk
	) => Promise<void>

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
		totalMaxSize: (size: string) => string
		maxFilesHint: (n: number) => string
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
		emptyState: string
		uploadedAnnouncement: (name: string) => string
		failedAnnouncement: (name: string, err: string) => string
	}

	export type InputFileAppearance = "card" | "button" | "minimal" | "compact-chips"

	const DEFAULT_LABELS: InputFileLabels = {
		dropHere: "Drop files here",
		dragAndDrop: "Drag and drop files here, or",
		browse: "Browse",
		selectFiles: "Select files",
		accepted: (a) => `Accepted: ${a}`,
		maxSize: (s) => `Max size: ${s}`,
		minSize: (s) => `Min size: ${s}`,
		totalMaxSize: (s) => `Total max size: ${s}`,
		maxFilesHint: (n) => `Max files: ${n}`,
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
		appearance?: InputFileAppearance
		showDragDropZone?: boolean

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
		actions?: Snippet<[{clearAll: () => void; uploadAll: () => Promise<void>}]>

		class?: string
		style?: string
	}

	let {
		items = $bindable<InputFileItem[]>([]),
		accept = undefined,
		multiple = false,
		disabled = false,
		appearance: appearanceProp = undefined,
		showDragDropZone = true,
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
		dropZone = undefined,
		fileItem = undefined,
		emptyState = undefined,
		actions = undefined,
		class: className = "",
		style = ""
	}: Props = $props()

	const labels = $derived<InputFileLabels>({...DEFAULT_LABELS, ...(labelsProp ?? {})})
	const effectiveMaxFiles = $derived(maxFilesProp ?? maxFileCount)
	const effectiveAppearance = $derived<InputFileAppearance>(
		appearanceProp ?? (showDragDropZone ? "card" : "button")
	)
	const limitsHint = $derived(
		formatLimits?.({
			minFileSize,
			maxFileSize,
			totalMaxSize,
			maxFiles: effectiveMaxFiles,
			minFiles,
			multiple
		}) ?? null
	)

	let fileInput: HTMLInputElement | undefined = $state()
	let isDragging = $state(false)
	let dragOverIndex = $state<number | null>(null)
	let draggedIndex = $state<number | null>(null)
	let liveAnnouncement = $state("")
	let showAllList = $state(false)
	let minimalPanelOpen = $state(false)
	let minimalContainer: HTMLDivElement | undefined = $state()
	let minimalTriggerEl: HTMLButtonElement | undefined = $state()
	let minimalPopoverEl: HTMLDivElement | undefined = $state()

	function positionMinimalPopover(node: HTMLElement, anchor: HTMLElement) {
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
							elements.floating.style.maxHeight = `${Math.max(availableHeight - 16, 160)}px`
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
		if (!minimalPanelOpen) return
		const handler = (e: MouseEvent) => {
			const target = e.target as Node
			// Trigger and popover live in different DOM subtrees once the
			// popover is portalled, so check both independently.
			if (minimalContainer?.contains(target)) return
			if (minimalPopoverEl?.contains(target)) return
			minimalPanelOpen = false
		}
		const escHandler = (e: KeyboardEvent) => {
			if (e.key === "Escape") minimalPanelOpen = false
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
			if (chunkSize && chunkSize > 0 && item.file.size > chunkSize) {
				await uploadInChunks(item, ctrl.signal)
			} else {
				await uploadFileCallback(
					item.file,
					(p) => patchItem(itemId, {progress: clampPercent(p)}),
					ctrl.signal
				)
			}
			patchItem(itemId, {status: "completed", progress: 100})
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

	async function uploadInChunks(item: InputFileItem, signal: AbortSignal) {
		if (!item.file || !uploadFileCallback || !chunkSize) return
		const file = item.file
		const total = file.size
		let offset = 0
		while (offset < total) {
			if (signal.aborted) throw new DOMException("Aborted", "AbortError")
			const end = Math.min(offset + chunkSize, total)
			const data = file.slice(offset, end)
			const chunkOffset = offset
			await uploadFileCallback(
				file,
				(p) => {
					const overallBytes = chunkOffset + ((end - chunkOffset) * p) / 100
					patchItem(item.id, {progress: clampPercent((overallBytes / total) * 100)})
				},
				signal,
				{offset: chunkOffset, size: end - chunkOffset, total, data}
			)
			offset = end
		}
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

	export function removeAt(index: number) {
		const item = items[index]
		if (!item) return
		cancel(item.id)
		revokeThumbnail(item)
		items = items.filter((_, i) => i !== index)
	}

	export function removeById(itemId: string) {
		const idx = items.findIndex((i) => i.id === itemId)
		if (idx >= 0) removeAt(idx)
	}

	export function clear() {
		for (const i of items) {
			cancel(i.id)
			revokeThumbnail(i)
		}
		items = []
		if (fileInput) fileInput.value = ""
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
	class="fluent-inputfile fluent-inputfile--{effectiveAppearance} {className}"
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

	{#if dropZone}
		{@render dropZone({openFileDialog, isDragging})}
	{:else if effectiveAppearance === "card"}
		<div
			class="drop-zone"
			class:disabled
			class:dragging={isDragging}
			ondragenter={handleDragEnter}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={(e) => {
				console.log("[InputFile] drop-zone ondrop fired")
				handleDrop(e)
			}}
			tabindex={disabled ? -1 : 0}
			role="button"
			aria-label={labels.browse}
			onkeydown={handleDropZoneKeyDown}
			onclick={(e) => {
				console.log("[InputFile] drop-zone ONCLICK", {
					target: (e.target as HTMLElement)?.tagName,
					currentTarget: (e.currentTarget as HTMLElement)?.className
				})
				openFileDialog()
			}}
		>
			<div class="drop-zone-content">
				<svg
					width="48"
					height="48"
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
				<p class="drop-zone-text">
					{isDragging ? labels.dropHere : labels.dragAndDrop}
				</p>
				<Button
					appearance="accent"
					onclick={(e) => {
						console.log("[InputFile] Browse Button ONCLICK")
						e?.stopPropagation()
						openFileDialog()
					}}
					{disabled}
				>
					{labels.browse}
				</Button>
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
						<p class="drop-zone-hint">{labels.totalMaxSize(formatInputFileSize(totalMaxSize))}</p>
					{/if}
					{#if multiple && effectiveMaxFiles}
						<p class="drop-zone-hint">{labels.maxFilesHint(effectiveMaxFiles)}</p>
					{/if}
					{#if minFiles > 0}
						<p class="drop-zone-hint">{labels.minFilesHint(minFiles)}</p>
					{/if}
				{/if}
			</div>
		</div>
	{:else if effectiveAppearance === "button"}
		<Button appearance="accent" onclick={openFileDialog} {disabled}>
			{labels.selectFiles}
		</Button>
	{:else if effectiveAppearance === "minimal"}
		<div class="minimal-wrap" bind:this={minimalContainer}>
			<button
				bind:this={minimalTriggerEl}
				type="button"
				class="minimal-trigger"
				onclick={(e) => {
					e.stopPropagation()
					if (items.length > 0) {
						minimalPanelOpen = !minimalPanelOpen
					} else {
						openFileDialog()
					}
				}}
				{disabled}
				aria-label={items.length > 0 ? labels.viewFiles : labels.browse}
				aria-expanded={items.length > 0 ? minimalPanelOpen : undefined}
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
		</div>
		{#if minimalPanelOpen && items.length > 0 && minimalTriggerEl}
			<div
				bind:this={minimalPopoverEl}
				use:portal
				use:positionMinimalPopover={minimalTriggerEl}
				class="minimal-popover"
				aria-label={labels.viewFiles}
			>
				{@render fileListPanel(true)}
			</div>
		{/if}
	{:else if effectiveAppearance === "compact-chips"}
		<div
			class="chips-row"
			class:dragging={isDragging}
			ondragenter={handleDragEnter}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
		>
			<Button appearance="accent" onclick={openFileDialog} {disabled}>
				{labels.selectFiles}
			</Button>
			{#each visibleItems as item (item.id)}
				<span
					class="chip"
					class:error={item.status === "error"}
					class:uploading={item.status === "uploading"}
					class:completed={item.status === "completed"}
				>
					<span class="chip-name" title={item.name}>{item.name}</span>
					{#if item.status === "uploading"}
						<span class="chip-progress">{item.progress}%</span>
					{/if}
					<button
						type="button"
						class="chip-remove"
						onclick={() => removeById(item.id)}
						aria-label={labels.remove}
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
		</div>
	{/if}

	{#snippet fileListPanel(includeAddMore: boolean)}
		<div class="file-list">
			<div class="file-list-header">
				<span class="file-count">{labels.fileCount(items.length)}</span>
				{#if actions}
					{@render actions({clearAll: clear, uploadAll})}
				{:else}
					<div class="file-list-actions">
						{#if includeAddMore}
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
		</div>
	{/snippet}

	{#if effectiveAppearance !== "compact-chips" && effectiveAppearance !== "minimal"}
		{#if items.length > 0}
			{@render fileListPanel(false)}
		{:else if emptyState}
			{@render emptyState()}
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
		border-radius: 8px;
		padding: 2rem;
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

	.drop-zone-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
	.upload-icon {
		color: var(--neutral-foreground-hint);
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
		border-radius: 4px;
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
		border-radius: 999px;
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
		border-radius: 50%;
		border: 1.5px solid currentColor;
		border-top-color: transparent;
		animation: minimal-spin 0.8s linear infinite;
	}
	@keyframes minimal-spin {
		to {
			transform: rotate(360deg);
		}
	}

	.minimal-popover {
		position: fixed;
		top: 0;
		left: 0;
		min-width: 22rem;
		max-width: 90vw;
		background: var(--neutral-layer-1, white);
		border: 1px solid var(--neutral-stroke-rest);
		border-radius: 6px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
		padding: 0.75rem;
		z-index: var(--fluent-z-popover, 1060);
		overflow-y: auto;
	}
	.minimal-popover .file-list {
		gap: 0.4rem;
	}

	.chips-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		align-items: center;
		padding: 0.4rem;
		border: 1px dashed transparent;
		border-radius: 4px;
		transition: border-color 0.2s ease;
	}
	.chips-row.dragging {
		border-color: var(--accent-fill-rest);
		background: var(--neutral-layer-2);
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.2rem 0.5rem;
		background: var(--neutral-layer-2);
		border: 1px solid var(--neutral-stroke-rest);
		border-radius: 999px;
		font-size: 0.85rem;
		max-width: 240px;
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
	.chip-remove {
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		line-height: 1;
		padding: 0 0.2rem;
		color: var(--neutral-foreground-hint);
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
		border-radius: 4px;
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
		border-radius: 4px;
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
		border-radius: 4px;
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
		border-radius: 4px;
		flex-shrink: 0;
		background: var(--neutral-layer-3);
	}
	.file-icon {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: var(--neutral-foreground-hint);
	}
	.file-icon[data-category="image"] {
		color: #00a86b;
	}
	.file-icon[data-category="video"] {
		color: #6264a7;
	}
	.file-icon[data-category="audio"] {
		color: #d83b01;
	}
	.file-icon[data-category="pdf"] {
		color: #c50f1f;
	}
	.file-icon[data-category="zip"] {
		color: #c19c00;
	}
	.file-icon[data-category="spreadsheet"] {
		color: #107c10;
	}
	.file-icon[data-category="doc"] {
		color: #2b579a;
	}
	.file-icon[data-category="slides"] {
		color: #d24726;
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
		border-radius: 2px;
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
		border-radius: 4px;
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
