<script lang="ts">
	import {
		InputFile,
		Card,
		Stack,
		QuickGrid,
		Grid,
		GridItem,
		Field,
		Button,
		Checkbox,
		Select,
		Option,
		formatInputFileSize
	} from "svelte-fluentui"
	import type {
		FileUploadHandler,
		FileUploadResult,
		InputFileItem,
		InputFileLabels,
		InputFileSelectorAppearance,
		InputFileListAppearance,
		InputFileCardSize,
		InputFileChipsPosition
	} from "svelte-fluentui"
	import {References, Meta} from "$lib/components"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "items", type: "InputFileItem[] (bindable)", default: "[]", description: "Rich state — id, file, status, progress, error, thumbnailUrl. Use bind:items."},
		{name: "initialItems", type: "InputFileItem[]", default: "undefined", description: "Seed list on mount (e.g. files already uploaded server-side)."},
		{name: "accept", type: "string", default: "undefined", description: "File types to accept (e.g. \".jpg,.png\" or \"image/*\")."},
		{name: "multiple", type: "boolean", default: "false", description: "Allow multiple file selection."},
		{name: "disabled", type: "boolean", default: "false", description: "Disable the component."},
		{name: "selectorAppearance", type: "\"card\" | \"button\" | \"minimal\"", default: "\"card\"", description: "Visual variant of the file picker (drop-zone card, plain button, or compact icon)."},
		{name: "listAppearance", type: "\"list\" | \"chips\" | \"popover\" | \"none\"", default: "\"list\"", description: "How the selected files are displayed: vertical rows, inline chips, anchored popover, or hidden."},
		{name: "cardSize", type: "\"minimal\" | \"compact\" | \"big\"", default: "\"compact\"", description: "Card density when selectorAppearance=\"card\". minimal=single line, compact=horizontal row + wrapping hints, big=full vertical showcase."},
		{name: "expandOnDrag", type: "boolean", default: "false", description: "When true, an overlay covers the selector (or `expandOnDragTarget`) with a `big` drop layout as soon as a file is dragged anywhere on the document. No layout shift — overlay is portalled above content."},
		{name: "expandOnDragTarget", type: "HTMLElement | string", default: "undefined", description: "CSS selector or element ref the drag-expand overlay should cover. Defaults to the selector itself. Use to size the overlay to a parent form/section."},
		{name: "maxFileSize", type: "number", default: "10485760", description: "Max bytes per file (default 10MB)."},
		{name: "minFileSize", type: "number", default: "0", description: "Min bytes per file."},
		{name: "totalMaxSize", type: "number", default: "0", description: "Max combined bytes across all accepted files. 0 disables. Files that would push the running total over the cap are rejected per rejectionMode."},
		{name: "maxFileCount / maxFiles", type: "number", default: "10", description: "Max number of files. Extras are rejected per rejectionMode."},
		{name: "minFiles", type: "number", default: "0", description: "Field-level minimum. Surfaces via onValidityChange."},
		{name: "customValidator", type: "(file) => string | null | Promise<...>", default: "undefined", description: "Custom per-file validator. Return error message or null."},
		{name: "rejectionMode", type: "\"list\" | \"callback\" | \"silent\"", default: "\"list\"", description: "How invalid files are surfaced."},
		{name: "dedupe", type: "\"name\" | \"name-size\" | \"hash\" | false", default: "false", description: "Reject duplicates by chosen key. Hash uses SHA-1."},
		{name: "uploadFileCallback", type: "FileUploadHandler", default: "undefined", description: "Async upload handler. Receives file, progress, AbortSignal, optional chunk."},
		{name: "autoUpload", type: "boolean", default: "true", description: "Start upload immediately on selection. Set false for submit-time uploads."},
		{name: "concurrency", type: "number", default: "1", description: "Parallel upload workers."},
		{name: "retryPolicy", type: "{attempts, delayMs, backoff}", default: "undefined", description: "Auto-retry failed uploads with exponential backoff."},
		{name: "chunkSize", type: "number", default: "undefined", description: "When set, files are uploaded in chunks. Handler gets {offset, size, total, data}."},
		{name: "showThumbnails", type: "boolean", default: "true", description: "Generate object-URL thumbnails for image/* files."},
		{name: "pasteFromClipboard", type: "boolean", default: "true", description: "Accept files pasted via Ctrl+V."},
		{name: "allowFolderDrop", type: "boolean", default: "false", description: "Recursively traverse dropped folders."},
		{name: "allowReorder", type: "boolean", default: "false", description: "Drag-to-reorder file rows."},
		{name: "labels", type: "Partial<InputFileLabels>", default: "undefined", description: "Override any built-in string for i18n."},
		{name: "formatLimits", type: "(info) => string | null", default: "undefined", description: "Compose the limits hint shown under Browse. Receives {minFileSize, maxFileSize, totalMaxSize, maxFiles, minFiles, multiple} (maxFileSize is per file). Replaces ALL size/count lines; the Accepted-types line is unaffected. Return null/empty to keep the default per-limit lines."},
		{name: "id / aria-label / aria-describedby / aria-labelledby", type: "string", default: "undefined", description: "Standard a11y plumbing. Pair id with <Field id=\"\"> for label-for."},
		{name: "class", type: "string", default: "\"\"", description: "Additional CSS classes."},
		{name: "style", type: "string", default: "\"\"", description: "Inline styles."}
	]

	const callbacks: Property[] = [
		{name: "onFileSelected", type: "(files: File[]) => void", default: "undefined", description: "Fires when files are accepted."},
		{name: "onFileUploaded", type: "(file, item) => void", default: "undefined", description: "Per-file upload success."},
		{name: "onFileError", type: "(file, error, item?) => void", default: "undefined", description: "Validation or upload failure."},
		{name: "onCompleted", type: "() => void", default: "undefined", description: "All uploads finished (success or error)."},
		{name: "onValidityChange", type: "(valid, reasons) => void", default: "undefined", description: "Field-level validity changed (minFiles, maxFiles, item errors)."},
		{name: "onItemsChange", type: "(items) => void", default: "undefined", description: "Items array mutated."},
		{name: "onItemRemove", type: "(item) => void", default: "undefined", description: "Fires per item on removal (removeAt / removeById / clear / × button). Receives the removed item with final status and metadata — use it to send server-side cleanup like DELETE /api/files/:guid."}
	]

	const slots: Property[] = [
		{name: "dropZone", type: "Snippet<[{openFileDialog, isDragging}]>", default: "undefined", description: "Replace the default drop zone content."},
		{name: "fileItem", type: "Snippet<[{item, remove, retry, pause, resume, cancel}]>", default: "undefined", description: "Replace the default file row renderer."},
		{name: "actions", type: "Snippet<[{clearAll, uploadAll}]>", default: "undefined", description: "Replace the file-list header actions."},
		{name: "emptyState", type: "Snippet", default: "undefined", description: "Rendered when items is empty."}
	]

	const instanceMethods: Property[] = [
		{name: "addFiles(File[])", type: "Promise<void>", default: "—", description: "Programmatically add files (validates + dedupes)."},
		{name: "removeAt(index)", type: "void", default: "—", description: "Remove by index."},
		{name: "removeById(id)", type: "void", default: "—", description: "Remove by item id."},
		{name: "clear() / reset()", type: "void", default: "—", description: "Clear all files and abort in-flight uploads."},
		{name: "uploadAll()", type: "Promise<void>", default: "—", description: "Trigger upload of all pending items."},
		{name: "retry(id)", type: "Promise<void>", default: "—", description: "Retry a failed or cancelled upload."},
		{name: "pause(id)", type: "void", default: "—", description: "Pause an in-flight upload (aborts current request)."},
		{name: "resume(id)", type: "Promise<void>", default: "—", description: "Resume a paused upload."},
		{name: "cancel(id)", type: "void", default: "—", description: "Cancel an in-flight upload (no resume)."},
		{name: "openPicker()", type: "void", default: "—", description: "Open the native file dialog."},
		{name: "getItems()", type: "InputFileItem[]", default: "—", description: "Snapshot of current items."}
	]

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]

	const simulateUpload: FileUploadHandler = async (file, onProgress, signal) => {
		return new Promise<void>((resolve, reject) => {
			let progress = 0
			const interval = setInterval(() => {
				if (signal?.aborted) {
					clearInterval(interval)
					reject(new DOMException("Aborted", "AbortError"))
					return
				}
				progress += 10
				onProgress(progress)
				if (progress >= 100) {
					clearInterval(interval)
					if (Math.random() > 0.45) resolve()
					else reject(new Error("Upload failed"))
				}
			}, 200)
			signal?.addEventListener("abort", () => {
				clearInterval(interval)
				reject(new DOMException("Aborted", "AbortError"))
			})
		})
	}

	const slowUpload: FileUploadHandler = async (file, onProgress, signal) => {
		return new Promise<void>((resolve, reject) => {
			let progress = 0
			const interval = setInterval(() => {
				if (signal?.aborted) {
					clearInterval(interval)
					reject(new DOMException("Aborted", "AbortError"))
					return
				}
				progress += 5
				onProgress(progress)
				if (progress >= 100) {
					clearInterval(interval)
					resolve()
				}
			}, 300)
			signal?.addEventListener("abort", () => {
				clearInterval(interval)
				reject(new DOMException("Aborted", "AbortError"))
			})
		})
	}

	const PLAYGROUND_STORAGE_KEY = "svelte-fluentui:inputfile-playground"
	type PlaygroundConfig = {
		selector: InputFileSelectorAppearance
		list: InputFileListAppearance
		cardSize: InputFileCardSize
		chipsPosition: InputFileChipsPosition
		expandOnDrag: boolean
		multiple: boolean
		disabled: boolean
	}
	const PLAYGROUND_DEFAULTS: PlaygroundConfig = {
		selector: "card",
		list: "list",
		cardSize: "compact",
		chipsPosition: "below",
		expandOnDrag: false,
		multiple: true,
		disabled: false
	}
	function loadPlaygroundConfig(): PlaygroundConfig {
		if (typeof window === "undefined") return PLAYGROUND_DEFAULTS
		try {
			const raw = window.localStorage.getItem(PLAYGROUND_STORAGE_KEY)
			if (!raw) return PLAYGROUND_DEFAULTS
			const parsed = JSON.parse(raw) as Partial<PlaygroundConfig>
			return {...PLAYGROUND_DEFAULTS, ...parsed}
		} catch {
			return PLAYGROUND_DEFAULTS
		}
	}
	const initialPlayground = loadPlaygroundConfig()

	let playgroundSelector = $state<InputFileSelectorAppearance>(initialPlayground.selector)
	let playgroundList = $state<InputFileListAppearance>(initialPlayground.list)
	let playgroundCardSize = $state<InputFileCardSize>(initialPlayground.cardSize)
	let playgroundChipsPosition = $state<InputFileChipsPosition>(initialPlayground.chipsPosition)
	let playgroundExpandOnDrag = $state(initialPlayground.expandOnDrag)
	let playgroundMultiple = $state(initialPlayground.multiple)
	let playgroundDisabled = $state(initialPlayground.disabled)
	let playgroundItems = $state<InputFileItem[]>([])

	$effect(() => {
		if (typeof window === "undefined") return
		const cfg: PlaygroundConfig = {
			selector: playgroundSelector,
			list: playgroundList,
			cardSize: playgroundCardSize,
			chipsPosition: playgroundChipsPosition,
			expandOnDrag: playgroundExpandOnDrag,
			multiple: playgroundMultiple,
			disabled: playgroundDisabled
		}
		try {
			window.localStorage.setItem(PLAYGROUND_STORAGE_KEY, JSON.stringify(cfg))
		} catch {
			// quota exceeded / private mode — silently ignore
		}
	})

	// Fake server state for demo 16 (server-sync flow). A real app would talk
	// to /api/upload + /api/files/:guid; here we simulate with an in-memory
	// Map keyed by guid and a parallel log so you can see when "DELETE" fires.
	type ServerRecord = {guid: string; name: string; size: number; uploadedAt: number}
	type ServerLogEntry = {time: string; action: "UPLOAD" | "DELETE"; guid: string; name: string}
	let serverFiles = $state<ServerRecord[]>([])
	let serverLog = $state<ServerLogEntry[]>([])
	let serverSyncItems = $state<InputFileItem[]>([])

	function nowHms(): string {
		const d = new Date()
		return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`
	}

	const serverSyncUpload: FileUploadHandler = async (file, onProgress, signal) => {
		return new Promise<FileUploadResult>((resolve, reject) => {
			let progress = 0
			const interval = setInterval(() => {
				if (signal?.aborted) {
					clearInterval(interval)
					reject(new DOMException("Aborted", "AbortError"))
					return
				}
				progress += 12
				onProgress(progress)
				if (progress >= 100) {
					clearInterval(interval)
					const guid = (crypto.randomUUID?.() ?? `g-${Math.random().toString(36).slice(2)}`)
					serverFiles = [...serverFiles, {guid, name: file.name, size: file.size, uploadedAt: Date.now()}]
					const entry: ServerLogEntry = {time: nowHms(), action: "UPLOAD", guid, name: file.name}
					serverLog = [entry, ...serverLog].slice(0, 20)
					// The handler return is merged into the InputFileItem after success
					// (see FileUploadResult). The server guid lands in metadata so
					// onItemRemove can read it back later when the user removes
					// the item from the list.
					resolve({metadata: {serverGuid: guid, uploadedAt: Date.now()}})
				}
			}, 180)
			signal?.addEventListener("abort", () => {
				clearInterval(interval)
				reject(new DOMException("Aborted", "AbortError"))
			})
		})
	}

	function handleServerSyncRemove(item: InputFileItem) {
		// Only completed items have a server-side counterpart to delete. Pending
		// or errored items were never persisted, so there's nothing to clean up.
		if (item.status !== "completed") return
		const guid = item.metadata?.serverGuid as string | undefined
		if (!guid) return
		serverFiles = serverFiles.filter((r) => r.guid !== guid)
		const entry: ServerLogEntry = {time: nowHms(), action: "DELETE", guid, name: item.name}
		serverLog = [entry, ...serverLog].slice(0, 20)
	}

	let basicItems = $state<InputFileItem[]>([])
	let validationItems = $state<InputFileItem[]>([])
	let validationValid = $state(true)
	let validationReasons = $state<string[]>([])
	let imperativeRef: any = $state(null)
	let imperativeItems = $state<InputFileItem[]>([])
	let i18nItems = $state<InputFileItem[]>([])
	let chipsItems = $state<InputFileItem[]>([])
	let preloadedItems = $state<InputFileItem[]>([])
	let formItems = $state<InputFileItem[]>([])
	let bigBatchItems = $state<InputFileItem[]>([])

	function makeBigBatch(): InputFileItem[] {
		const exts = ["pdf", "jpg", "png", "docx", "xlsx", "txt", "zip", "mp4"]
		const statuses: ("completed" | "uploading" | "error" | "pending")[] = [
			"completed", "completed", "completed", "completed", "completed",
			"uploading", "error", "pending"
		]
		return Array.from({length: 34}, (_, i) => {
			const ext = exts[i % exts.length]
			const status = statuses[i % statuses.length]
			return {
				id: `big-${i}`,
				file: null,
				name: `file-${String(i + 1).padStart(2, "0")}.${ext}`,
				size: Math.round(50_000 + Math.random() * 5_000_000),
				type: "",
				progress: status === "uploading" ? Math.round(Math.random() * 90) : status === "completed" ? 100 : 0,
				status,
				error: status === "error" ? "Network timeout" : null,
				thumbnailUrl: null
			}
		})
	}

	const initialBigBatch = makeBigBatch()
	const initialMinimalSeed: InputFileItem[] = [
		{id: "min-1", file: null, name: "presentation.pptx", size: 4_200_000, type: "", progress: 100, status: "completed", thumbnailUrl: null},
		{id: "min-2", file: null, name: "logo-final.png", size: 280_000, type: "", progress: 100, status: "completed", thumbnailUrl: null},
		{id: "min-3", file: null, name: "draft-report.docx", size: 92_000, type: "", progress: 60, status: "uploading", thumbnailUrl: null},
		{id: "min-4", file: null, name: "old-data.csv", size: 12_000, type: "", progress: 0, status: "error", error: "Server error", thumbnailUrl: null}
	]

	const customValidator = async (file: File) => {
		if (file.name.toLowerCase().includes("forbidden")) return "Filename contains forbidden word"
		return null
	}

	const seededInitial: InputFileItem[] = [
		{
			id: "preloaded-1",
			file: null,
			name: "report-q1.pdf",
			size: 482371,
			type: "application/pdf",
			progress: 100,
			status: "completed",
			thumbnailUrl: null,
			downloadUrl: "/CHANGELOG.md"
		},
		{
			id: "preloaded-2",
			file: null,
			name: "team-photo.jpg",
			size: 1284992,
			type: "image/jpeg",
			progress: 100,
			status: "completed",
			thumbnailUrl: null,
			downloadUrl: "/CHANGELOG.md"
		}
	]

	const czechLabels: Partial<InputFileLabels> = {
		dropHere: "Pusťte soubory zde",
		dragAndDrop: "Přetáhněte soubory sem nebo",
		browse: "Procházet",
		selectFiles: "Vybrat soubory",
		clearAll: "Smazat vše",
		uploadAll: "Nahrát vše",
		pending: "Čeká",
		uploading: "Nahrává se",
		paused: "Pozastaveno",
		completed: "Hotovo",
		error: "Chyba",
		cancelled: "Zrušeno",
		remove: "Odebrat soubor",
		retry: "Zkusit znovu",
		pause: "Pozastavit",
		resume: "Pokračovat",
		cancel: "Zrušit",
		fileTooLarge: (m) => `Soubor je větší než ${m}`,
		totalSizeExceeded: (m) => `Celková velikost by překročila ${m}`,
		tooManyFiles: (m) => `Maximálně ${m} souborů`,
		duplicate: "Duplicitní soubor",
		fileCount: (n) => `${n} ${n === 1 ? "soubor" : n < 5 ? "soubory" : "souborů"}`,
		accepted: (a) => `Povolené typy: ${a}`,
		maxSize: (s) => `Max velikost: ${s}`,
		minSize: (s) => `Min velikost: ${s}`,
		totalMaxSize: (s) => `Celková max velikost: ${s}`,
		maxFilesHint: (n) => `Max souborů: ${n}`,
		minFilesHint: (n) => `Min souborů: ${n}`
	}

	function submitForm() {
		alert(`Form submit. Files ready for upload: ${formItems.filter(i => i.status === "pending").length}`)
	}
</script>

<Stack orientation="vertical" gap="1rem">
	<Meta
		title="InputFile"
		description="File upload Svelte component with drag and drop, validation, progress, retry, pause/resume, chunking, deduplication, thumbnails, and full i18n."
		keywords="svelte, fluentui, inputfile, file upload, drag drop, upload, form"
	/>

	<h1>InputFile</h1>

	<p>
		File upload with drag &amp; drop, validation, progress, retry, pause/resume, chunking,
		concurrency, deduplication, thumbnails, snippet customization, full i18n, and a rich
		imperative API. Inspired by FluentUI Blazor; built from scratch (no FluentUI Web Components
		equivalent exists).
	</p>

	<References links={[
		{label: "FluentUI Web Component", na: true},
		{label: "FluentUI Blazor", href: "https://www.fluentui-blazor.net/InputFile"}
	]} />

	<h2>Examples</h2>
	<p>
		Each demo lives in its own grid column so you can see how the component behaves in cramped
		widths. Resize the window or zoom out to test responsiveness.
	</p>

	<Grid spacing={3}>
		<GridItem xs={12}>
			<Card>
				<h3>0. Playground — selector × list</h3>
				<small>Mix selectorAppearance and listAppearance to preview every combination live.</small>
				<Stack orientation="vertical" gap="1rem">
					<Stack orientation="horizontal" gap="1rem" horizontalAlign="start" verticalAlign="end" wrap={true}>
						<Select label="selectorAppearance" bind:value={playgroundSelector}>
							{#snippet children()}
								<Option value="card">card</Option>
								<Option value="button">button</Option>
								<Option value="minimal">minimal</Option>
							{/snippet}
						</Select>
						<Select label="listAppearance" bind:value={playgroundList}>
							{#snippet children()}
								<Option value="list">list</Option>
								<Option value="chips">chips</Option>
								<Option value="popover">popover</Option>
								<Option value="none">none</Option>
							{/snippet}
						</Select>
						<Select label="cardSize" bind:value={playgroundCardSize} disabled={playgroundSelector !== "card"}>
							{#snippet children()}
								<Option value="minimal">minimal</Option>
								<Option value="compact">compact</Option>
								<Option value="big">big</Option>
							{/snippet}
						</Select>
						<Select label="chipsPosition" bind:value={playgroundChipsPosition} disabled={playgroundList !== "chips"}>
							{#snippet children()}
								<Option value="end">end</Option>
								<Option value="below">below</Option>
							{/snippet}
						</Select>
						<Checkbox bind:checked={playgroundMultiple}>multiple</Checkbox>
						<Checkbox bind:checked={playgroundDisabled}>disabled</Checkbox>
						<Checkbox bind:checked={playgroundExpandOnDrag}>expandOnDrag</Checkbox>
					</Stack>
					<InputFile
						bind:items={playgroundItems}
						multiple={playgroundMultiple}
						disabled={playgroundDisabled}
						selectorAppearance={playgroundSelector}
						listAppearance={playgroundList}
						cardSize={playgroundCardSize}
						chipsPosition={playgroundChipsPosition}
						expandOnDrag={playgroundExpandOnDrag}
						uploadFileCallback={simulateUpload}
					/>
					<Stack orientation="horizontal" gap="0.75rem" verticalAlign="center" horizontalAlign="space-between">
						<small>
							Current combo:
							<code>selectorAppearance="{playgroundSelector}"</code>
							·
							<code>listAppearance="{playgroundList}"</code>
							{#if playgroundSelector === "card"}· <code>cardSize="{playgroundCardSize}"</code>{/if}
							{#if playgroundList === "chips"}· <code>chipsPosition="{playgroundChipsPosition}"</code>{/if}
							{#if playgroundExpandOnDrag}· <code>expandOnDrag</code>{/if}
							· {playgroundItems.length} item{playgroundItems.length === 1 ? "" : "s"}
						</small>
						<Button appearance="outline" disabled={playgroundItems.length === 0} onclick={() => (playgroundItems = [])}>Reset items</Button>
					</Stack>
					{#if playgroundExpandOnDrag}
						<small style="color: var(--neutral-foreground-hint);">
							Tip: drag any file from your OS onto this page to see the overlay expand.
						</small>
					{/if}
				</Stack>
			</Card>
		</GridItem>

		<GridItem xs={12} md={6} xl={4}>
			<Card>
				<h3>1. Basic auto-upload</h3>
				<small>xl=4 (33%)</small>
				<Stack orientation="vertical" gap="0.5rem">
					<InputFile
						bind:items={basicItems}
						multiple
						uploadFileCallback={simulateUpload}
						retryPolicy={{attempts: 3, delayMs: 500, backoff: 2}}
					/>
					<small>Items: {basicItems.length} ({basicItems.filter(i => i.status === "completed").length} done)</small>
				</Stack>
			</Card>
		</GridItem>

		<GridItem xs={12} md={6} xl={4}>
			<Card>
				<h3>2. Field-level validation</h3>
				<small>xl=4 (33%) — wrapped in Field</small>
				<Field
					label="Attachments"
					required
					hint="1–3 files. 'forbidden' in name is rejected. Dedupe by name+size."
					validationState={validationValid ? "none" : "error"}
					validationMessage={validationReasons.join(" · ")}
				>
					<InputFile
						bind:items={validationItems}
						multiple
						minFiles={1}
						maxFiles={3}
						dedupe="name-size"
						customValidator={customValidator}
						rejectionMode="list"
						uploadFileCallback={simulateUpload}
						onValidityChange={(valid, reasons) => {
							validationValid = valid
							validationReasons = reasons
						}}
					/>
				</Field>
			</Card>
		</GridItem>

		<GridItem xs={12} md={6} xl={4}>
			<Card>
				<h3>3. Imperative control</h3>
				<small>xl=4 (33%) — bind:this, manual upload, pause/resume</small>
				<Stack orientation="vertical" gap="0.5rem">
					<InputFile
						bind:this={imperativeRef}
						bind:items={imperativeItems}
						multiple
						autoUpload={false}
						concurrency={2}
						uploadFileCallback={slowUpload}
					/>
					<Stack orientation="horizontal" gap="0.5rem">
						<Button onclick={() => imperativeRef?.uploadAll()}>uploadAll</Button>
						<Button onclick={() => imperativeRef?.clear()}>clear</Button>
						<Button onclick={() => {
							const blob = new Blob(["hello"], {type: "text/plain"})
							const f = new File([blob], `synth-${Date.now()}.txt`, {type: "text/plain"})
							imperativeRef?.addFiles([f])
						}}>+synth</Button>
					</Stack>
					<small>Use ‖ pause, ▶ resume, ✕ cancel, ↻ retry on each row.</small>
				</Stack>
			</Card>
		</GridItem>

		<GridItem xs={12} md={6} xl={4}>
			<Card>
				<h3>4. Initial items (preloaded)</h3>
				<small>xl=4 (33%) — server-already-uploaded rows with download links</small>
				<InputFile
					bind:items={preloadedItems}
					initialItems={seededInitial}
					multiple
					uploadFileCallback={simulateUpload}
				/>
			</Card>
		</GridItem>

		<GridItem xs={12} md={6} xl={4}>
			<Card>
				<h3>5. Power UX</h3>
				<small>xl=4 (33%) — folder drop, reorder, paste, thumbnails</small>
				<InputFile
					multiple
					accept="image/*"
					allowFolderDrop
					allowReorder
					pasteFromClipboard
					showThumbnails
					uploadFileCallback={simulateUpload}
				/>
				<small>Drop a folder, paste a screenshot (Ctrl+V), drag rows to reorder.</small>
			</Card>
		</GridItem>

		<GridItem xs={12} md={6} xl={4}>
			<Card>
				<h3>6. i18n (Czech)</h3>
				<small>xl=4 (33%) — every string overridden via labels</small>
				<InputFile
					bind:items={i18nItems}
					multiple
					labels={czechLabels}
					uploadFileCallback={simulateUpload}
				/>
			</Card>
		</GridItem>

		<GridItem xs={12} md={6} xl={3}>
			<Card>
				<h3>7. Compact-chips</h3>
				<small>xl=3 (25%) — fits inline with other inputs</small>
				<Field label="Quick attach" hint="Chips appear inline.">
					<InputFile
						bind:items={chipsItems}
						selectorAppearance="button"
						listAppearance="chips"
						multiple
						accept="image/*,.pdf"
						uploadFileCallback={simulateUpload}
					/>
				</Field>
			</Card>
		</GridItem>

		<GridItem xs={12} md={6} xl={3}>
			<Card>
				<h3>8. Minimal</h3>
				<small>xl=3 (25%) — color-coded badge + click to open popover</small>
				<Stack orientation="horizontal" gap="1rem" verticalAlign="center">
					<span>Attach:</span>
					<InputFile
						multiple
						selectorAppearance="minimal"
						listAppearance="popover"
						initialItems={initialMinimalSeed}
						uploadFileCallback={simulateUpload}
					/>
				</Stack>
				<small>
					Badge color: gray=pending, blue=uploading, green=all done, red=any error.
					Click the icon to open a panel with the file list, upload/clear actions, and "+ Add more".
					Click outside or press Escape to dismiss.
				</small>
			</Card>
		</GridItem>

		<GridItem xs={12} md={6} xl={3}>
			<Card>
				<h3>9. Disabled</h3>
				<small>xl=3 (25%)</small>
				<InputFile disabled />
			</Card>
		</GridItem>

		<GridItem xs={12} md={6} xl={3}>
			<Card>
				<h3>10. Button-only</h3>
				<small>xl=3 (25%) — selectorAppearance="button"</small>
				<InputFile multiple selectorAppearance="button" uploadFileCallback={simulateUpload} />
			</Card>
		</GridItem>

		<GridItem xs={12} md={6} xl={6}>
			<Card>
				<h3>11. Custom snippets</h3>
				<small>xl=6 (50%) — fully bespoke row renderer via fileItem snippet</small>
				<InputFile multiple uploadFileCallback={simulateUpload}>
					{#snippet fileItem({item, remove, retry, cancel})}
						<div style="display: flex; gap: 0.75rem; align-items: center; padding: 0.5rem; border: 1px solid var(--neutral-stroke-rest); border-radius: 4px;">
							<span style="font-family: monospace; color: var(--accent-fill-rest);">[{item.status}]</span>
							<span style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{item.name}</span>
							<span style="color: var(--neutral-foreground-hint);">{formatInputFileSize(item.size)}</span>
							{#if item.status === "uploading"}
								<span>{item.progress}%</span>
								<button type="button" onclick={cancel}>stop</button>
							{:else if item.status === "error"}
								<button type="button" onclick={retry}>retry</button>
							{/if}
							<button type="button" onclick={remove}>×</button>
						</div>
					{/snippet}
				</InputFile>
			</Card>
		</GridItem>

		<GridItem xs={12} md={6} xl={6}>
			<Card>
				<h3>12. Deferred upload (form submit)</h3>
				<small>xl=6 (50%) — autoUpload=false; files stay pending until submit</small>
				<form onsubmit={(e) => { e.preventDefault(); submitForm() }}>
					<Stack orientation="vertical" gap="0.5rem">
						<InputFile
							bind:items={formItems}
							multiple
							autoUpload={false}
						/>
						<small>Useful when posting alongside other FormData fields.</small>
						<div>
							<Button type="submit" appearance="accent">Submit form</Button>
						</div>
					</Stack>
				</form>
			</Card>
		</GridItem>

		<GridItem xs={12} md={6} xl={6}>
			<Card>
				<h3>13. Single-line limits hint — formatLimits</h3>
				<small>xl=6 (50%) — one line that updates live as you add/remove files</small>
				<InputFile
					multiple
					maxFileSize={5 * 1024 * 1024}
					maxFileCount={3}
					minFiles={1}
					totalMaxSize={10 * 1024 * 1024}
					formatLimits={({
						maxFiles,
						minFiles,
						maxFileSize,
						totalMaxSize,
						currentCount,
						currentTotalSize
					}) =>
						`${currentCount}/${maxFiles} files (min ${minFiles}), ${formatInputFileSize(maxFileSize)} each, ${formatInputFileSize(currentTotalSize)} / ${formatInputFileSize(totalMaxSize)} total`}
					uploadFileCallback={simulateUpload}
				/>
				<small>
					Composer receives <code>currentCount</code> and <code>currentTotalSize</code> in
					addition to the static limits, so the hint reflects what's already accepted.
					Returning <code>null</code> falls back to the default per-limit lines.
				</small>
			</Card>
		</GridItem>

		<GridItem xs={12} md={6} xl={6}>
			<Card>
				<h3>14. Long file list — maxVisible + listMaxHeight</h3>
				<small>xl=6 (50%) — 34 seeded files, collapses to 6 visible, list scrolls to 18rem when expanded</small>
				<InputFile
					bind:items={bigBatchItems}
					initialItems={initialBigBatch}
					multiple
					maxVisible={6}
					listMaxHeight="18rem"
					uploadFileCallback={simulateUpload}
				/>
				<small>
					Without these props you'd render 34 rows ≈ 2400px tall. With <code>maxVisible=6</code>
					the list shows 6 + a "Show 28 more" toggle; once expanded, <code>listMaxHeight</code>
					scopes the scroll to one panel.
				</small>
			</Card>
		</GridItem>

		<GridItem xs={12} md={6} xl={6}>
			<Card>
				<h3>15. totalMaxSize — cumulative byte cap with running counter</h3>
				<small>xl=6 (50%) — default hint rendering shows "X MB · Y MB left"</small>
				<InputFile
					multiple
					maxFileSize={5 * 1024 * 1024}
					maxFileCount={10}
					totalMaxSize={8 * 1024 * 1024}
					uploadFileCallback={simulateUpload}
				/>
				<small>
					<code>maxFileSize</code> caps each file at 5 MB; <code>totalMaxSize</code> caps the
					whole batch at 8 MB. Add a couple of files and watch the
					<code>Total max size:</code> line tick down — files that would push the running
					total over 8 MB are rejected per <code>rejectionMode</code>.
				</small>
			</Card>
		</GridItem>

		<GridItem xs={12}>
			<Card>
				<h3>16. Server sync — return guid from handler, fire DELETE on remove</h3>
				<small>xl=12 (full) — handler returns <code>FileUploadResult</code> with metadata; <code>onItemRemove</code> cleans up server-side</small>
				<Stack orientation="horizontal" gap="1rem" wrap>
					<div style="flex: 1 1 22rem; min-width: 18rem;">
						<InputFile
							bind:items={serverSyncItems}
							multiple
							maxFileCount={5}
							uploadFileCallback={serverSyncUpload}
							onItemRemove={handleServerSyncRemove}
						/>
						<small style="display: block; margin-top: 0.5rem;">
							Upload a few files, then remove them. Each handler return spreads
							into the matching <code>InputFileItem</code> on success — here
							<code>{`{metadata: {serverGuid}}`}</code> — and <code>onItemRemove</code>
							reads that guid back to "delete" from the fake server. Errored or
							pending items are skipped (nothing was persisted).
						</small>
					</div>
					<div style="flex: 1 1 18rem; min-width: 16rem; display: flex; flex-direction: column; gap: 0.75rem;">
						<div>
							<strong style="font-size: 0.85rem;">Files on server ({serverFiles.length})</strong>
							<ul style="margin: 0.25rem 0 0; padding-left: 1rem; font-size: 0.75rem; font-family: ui-monospace, monospace; max-height: 8rem; overflow-y: auto;">
								{#each serverFiles as r (r.guid)}
									<li title={r.guid}>{r.name} <span style="color: var(--neutral-foreground-hint);">({r.guid.slice(0, 8)}…, {formatInputFileSize(r.size)})</span></li>
								{:else}
									<li style="list-style: none; color: var(--neutral-foreground-hint); font-style: italic;">empty</li>
								{/each}
							</ul>
						</div>
						<div>
							<strong style="font-size: 0.85rem;">Activity log</strong>
							<ul style="margin: 0.25rem 0 0; padding-left: 1rem; font-size: 0.75rem; font-family: ui-monospace, monospace; max-height: 10rem; overflow-y: auto;">
								{#each serverLog as e, i (i + e.time + e.guid)}
									<li>
										<span style="color: var(--neutral-foreground-hint);">{e.time}</span>
										<span style="color: {e.action === 'UPLOAD' ? 'var(--success-foreground-rest, #107c10)' : 'var(--error-foreground-rest, #c50f1f)'}; font-weight: 600;">{e.action}</span>
										{e.name}
										<span style="color: var(--neutral-foreground-hint);">{e.guid.slice(0, 8)}…</span>
									</li>
								{:else}
									<li style="list-style: none; color: var(--neutral-foreground-hint); font-style: italic;">no activity yet</li>
								{/each}
							</ul>
						</div>
					</div>
				</Stack>
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h3>Custom upload handler with chunking</h3>
		<pre><code>{`const chunkedUpload: FileUploadHandler = async (file, onProgress, signal, chunk) => {
  const formData = new FormData()
  formData.append("file", chunk?.data ?? file)
  if (chunk) {
    formData.append("offset", String(chunk.offset))
    formData.append("total", String(chunk.total))
  }

  const xhr = new XMLHttpRequest()
  signal?.addEventListener("abort", () => xhr.abort())

  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener("progress", e => {
      if (e.lengthComputable) onProgress((e.loaded / e.total) * 100)
    })
    xhr.addEventListener("load", () => xhr.status === 200 ? resolve() : reject(new Error("Failed")))
    xhr.addEventListener("error", () => reject(new Error("Network error")))
    xhr.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")))
    xhr.open("POST", "/api/upload")
    xhr.send(formData)
  })
}

<InputFile
  multiple
  chunkSize={1024 * 1024}      // 1 MB chunks
  concurrency={3}              // 3 files in parallel
  retryPolicy={{attempts: 3, delayMs: 1000, backoff: 2}}
  uploadFileCallback={chunkedUpload}
/>`}</code></pre>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6}>
			<Card>
				<h2>Callbacks</h2>
				<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6}>
			<Card>
				<h2>Snippets</h2>
				<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6}>
			<Card>
				<h2>Instance API (bind:this)</h2>
				<QuickGrid items={instanceMethods} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>FileUploadHandler Type</h2>
		<pre><code>{`type FileUploadHandler = (
  file: File,
  onProgress: (percent: number) => void,
  signal?: AbortSignal,
  chunk?: { offset: number; size: number; total: number; data: Blob }
) => Promise<void>`}</code></pre>
		<p>
			<code>signal</code> is fired when the user pauses or cancels — your handler should abort
			its in-flight request. <code>chunk</code> is supplied only when <code>chunkSize</code> is
			set on the component, in which case your handler is called once per chunk.
		</p>
	</Card>
</Stack>

<style>
	pre {
		background: var(--neutral-layer-3);
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		margin: 1rem 0;
	}

	pre code {
		background: none;
		padding: 0;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	h3 {
		margin-top: 1.75rem;
	}
</style>
