<!--
 * InputFile Component
 * Inspired by FluentUI Blazor InputFile component
 * https://www.fluentui-blazor.net/InputFile
-->

<script lang="ts" module>
	// Re-export types/utils for back-compat with any consumer that imports
	// them straight from "./InputFile.svelte". The canonical locations are
	// InputFile.types.ts and InputFile.utils.ts.
	export type {
		InputFileStatus,
		InputFileItem,
		FileUploadChunk,
		FileUploadResult,
		FileUploadHandler,
		InputFileValidationResult,
		InputFileValidator,
		InputFileRejectionMode,
		InputFileDedupeMode,
		InputFileRetryPolicy,
		InputFileLabels,
		InputFileSelectorAppearance,
		InputFileListAppearance,
		InputFileCardSize,
		InputFileChipsPosition
	} from "./InputFile.types.js"
	export {formatInputFileSize} from "./InputFile.utils.js"
</script>

<script lang="ts">
	import type {Snippet} from "svelte"
	import {untrack} from "svelte"
	import {computePosition, flip, shift, offset, size, autoUpdate} from "@floating-ui/dom"
	import {portal} from "../actions/portal.js"
	import Button from "./Button.svelte"
	import DismissIcon from "./icons/DismissIcon.svelte"
	import InputFileSelectorCard from "./InputFileSelectorCard.svelte"
	import InputFileSelectorButton from "./InputFileSelectorButton.svelte"
	import InputFileSelectorMinimal from "./InputFileSelectorMinimal.svelte"
	import type {
		InputFileItem,
		InputFileLabels,
		InputFileStatus,
		InputFileSelectorAppearance,
		InputFileListAppearance,
		InputFileCardSize,
		InputFileChipsPosition,
		InputFileValidator,
		InputFileRejectionMode,
		InputFileDedupeMode,
		InputFileRetryPolicy,
		FileUploadHandler,
		FileUploadResult
	} from "./InputFile.types.js"
	import {
		DEFAULT_LABELS,
		clampPercent,
		formatInputFileSize,
		genId,
		hashFile,
		iconCategory,
		isAcceptedType
	} from "./InputFile.utils.js"

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
	// Drop-zone hint lines (file-type, size caps, file-count caps). Rendered
	// as <p> rows under the card selector, and as a single "·"-joined line in
	// the popover header where the card (and its inline hints) isn't visible.
	const dropZoneHints = $derived.by(() => {
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

	async function validateFile(file: File): Promise<string | null> {
		if (maxFileSize && file.size > maxFileSize)
			return labels.fileTooLarge(formatInputFileSize(maxFileSize))
		if (minFileSize && file.size < minFileSize)
			return labels.fileTooSmall(formatInputFileSize(minFileSize))
		if (!isAcceptedType(file, accept)) return labels.fileTypeNotAccepted(accept ?? "")
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
	async function restartItemsWithStatus(status: InputFileStatus) {
		for (const i of items) {
			if (i.status === status) {
				pausedSet.delete(i.id)
				patchItem(i.id, {status: "pending", progress: 0, error: null})
			}
		}
		await uploadAll()
	}
	export async function resumeAll() {
		await restartItemsWithStatus("paused")
	}
	export async function retryAll() {
		await restartItemsWithStatus("error")
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
		if (disabled) return
		const now = performance.now()
		// Guard against the dialog being opened twice in quick succession
		// (e.g. when a click target both triggers `openFileDialog` and
		// bubbles to a parent that does the same).
		if (now - __lastDialogOpenAt < 250) return
		__lastDialogOpenAt = now
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
			{#if dropZoneHints.length > 0}
				<div class="drop-zone-hints">
					{#each dropZoneHints as hint}
						<p class="drop-zone-hint">{hint}</p>
					{/each}
				</div>
			{/if}
		</div>
	{/snippet}

	{#snippet selectorBlock()}
		{#if dropZone}
			{@render dropZone({openFileDialog, isDragging})}
		{:else if selectorAppearance === "card"}
			<InputFileSelectorCard
				{cardSize}
				{isDragging}
				{disabled}
				popoverExpanded={listAppearance === "popover" && items.length > 0
					? popoverOpen
					: undefined}
				ariaLabel={labels.browse}
				ondragenter={handleDragEnter}
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				ondrop={handleDrop}
				onclick={handleSelectorClick}
				onkeydown={handleDropZoneKeyDown}
				content={cardContent}
			/>
		{:else if selectorAppearance === "button"}
			<InputFileSelectorButton
				{disabled}
				label={labels.selectFiles}
				onclick={handleSelectorClick}
			/>
		{:else if selectorAppearance === "minimal"}
			<InputFileSelectorMinimal
				{disabled}
				itemsLength={items.length}
				popoverExpanded={listAppearance === "popover" && items.length > 0
					? popoverOpen
					: undefined}
				ariaLabel={items.length > 0 ? labels.viewFiles : labels.browse}
				title={items.length > 0
					? `${labels.fileCount(items.length)} — ${statusLabel(minimalBadgeStatus as InputFileStatus)}`
					: labels.browse}
				badgeStatus={minimalBadgeStatus as InputFileStatus}
				onclick={(e) => {
					e.stopPropagation()
					handleSelectorClick()
				}}
			/>
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
					<DismissIcon size={14} />
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

			{#if inPopover && dropZoneHints.length > 0}
				<div class="file-list-limits">{dropZoneHints.join(" · ")}</div>
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
										<DismissIcon size={14} />
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
									<DismissIcon size={16} />
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
		<!-- The .fluent-inputfile wrapper restores the CSS scope for the portal'd
		     popover. Component styles are nested under `.fluent-inputfile X`, so
		     descendants of the popover only match if the popover sits inside a
		     .fluent-inputfile root. We portal the wrapper (rather than the popover
		     itself) and let positionPopover place the inner element. -->
		<div class="fluent-inputfile" use:portal>
			<div
				bind:this={popoverEl}
				use:positionPopover={selectorWrapEl}
				class="minimal-popover"
				aria-label={labels.viewFiles}
			>
				{@render fileListPanel(true)}
			</div>
		</div>
	{/if}

	{#if expandOnDrag && isExternalDragActive && selectorAppearance === "card" && !disabled}
		{@const overlayAnchor = resolveExpandTarget() ?? selectorWrapEl}
		{#if overlayAnchor}
			<!-- See popover note above — the .fluent-inputfile wrapper restores
			     the CSS scope for the portal'd overlay's nested rules. -->
			<div class="fluent-inputfile" use:portal>
				<div
					bind:this={dragOverlayEl}
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
			</div>
		{/if}
	{/if}

	<div class="sr-only" aria-live="polite" role="status">{liveAnnouncement}</div>
</div>

