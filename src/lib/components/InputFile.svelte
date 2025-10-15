<!--
 * InputFile Component
 * Inspired by FluentUI Blazor InputFile component
 * https://www.fluentui-blazor.net/InputFile
 *
 * Provides file upload with drag-and-drop support, validation, and progress tracking
-->

<script lang="ts">
	import Button from "./Button.svelte"
	import ProgressBar from "./Progress.svelte"

	export type FileUploadHandler = (file: File, onProgress: (percent: number) => void) => Promise<void>

	type Props = {
		accept?: string
		multiple?: boolean
		disabled?: boolean
		maxFileSize?: number // in bytes
		maxFileCount?: number
		showDragDropZone?: boolean
		uploadFileCallback?: FileUploadHandler
		onFileSelected?: (files: File[]) => void
		onFileUploaded?: (file: File) => void
		onFileError?: (file: File, error: string) => void
		onCompleted?: () => void
		class?: string
		style?: string
		[prop: string]: any
	}

	let {
		accept = undefined,
		multiple = false,
		disabled = false,
		maxFileSize = 10 * 1024 * 1024, // 10MB default
		maxFileCount = 10,
		showDragDropZone = true,
		uploadFileCallback = undefined,
		onFileSelected = undefined,
		onFileUploaded = undefined,
		onFileError = undefined,
		onCompleted = undefined,
		class: className = "",
		style = "",
		...restProps
	}: Props = $props()

	type FileWithProgress = {
		file: File
		progress: number
		status: "pending" | "uploading" | "completed" | "error"
		error?: string
	}

	let fileInput: HTMLInputElement
	let selectedFiles = $state<FileWithProgress[]>([])
	let isDragging = $state(false)

	// Validate file
	function validateFile(file: File): string | null {
		if (maxFileSize && file.size > maxFileSize) {
			return `File size exceeds ${formatFileSize(maxFileSize)}`
		}

		if (accept) {
			const acceptedTypes = accept.split(",").map(t => t.trim())
			const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
			const fileMimeType = file.type

			const isAccepted = acceptedTypes.some(type => {
				if (type.startsWith(".")) {
					return fileExtension === type.toLowerCase()
				}
				if (type.endsWith("/*")) {
					const category = type.split("/")[0]
					return fileMimeType.startsWith(category + "/")
				}
				return fileMimeType === type
			})

			if (!isAccepted) {
				return `File type not accepted. Accepted types: ${accept}`
			}
		}

		return null
	}

	// Format file size
	function formatFileSize(bytes: number): string {
		if (bytes === 0) return "0 Bytes"
		const k = 1024
		const sizes = ["Bytes", "KB", "MB", "GB"]
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
	}

	// Handle file selection
	async function handleFileSelection(files: FileList | null) {
		if (!files || files.length === 0) return

		const filesArray = Array.from(files)

		// Check file count
		if (multiple && filesArray.length > maxFileCount) {
			onFileError?.(filesArray[0], `Maximum ${maxFileCount} files allowed`)
			return
		}

		// Validate and add files
		const validFiles: FileWithProgress[] = []
		for (const file of filesArray) {
			const error = validateFile(file)
			if (error) {
				onFileError?.(file, error)
				validFiles.push({
					file,
					progress: 0,
					status: "error",
					error
				})
			} else {
				validFiles.push({
					file,
					progress: 0,
					status: "pending"
				})
			}
		}

		selectedFiles = [...selectedFiles, ...validFiles]
		onFileSelected?.(validFiles.map(f => f.file))

		// Start upload if callback is provided
		if (uploadFileCallback) {
			await uploadFiles()
		}
	}

	// Upload files
	async function uploadFiles() {
		const pendingFiles = selectedFiles.filter(f => f.status === "pending")

		for (const fileWithProgress of pendingFiles) {
			if (!uploadFileCallback) continue

			fileWithProgress.status = "uploading"
			selectedFiles = [...selectedFiles]

			try {
				await uploadFileCallback(fileWithProgress.file, (percent) => {
					fileWithProgress.progress = percent
					selectedFiles = [...selectedFiles]
				})

				fileWithProgress.status = "completed"
				fileWithProgress.progress = 100
				selectedFiles = [...selectedFiles]
				onFileUploaded?.(fileWithProgress.file)
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : "Upload failed"
				fileWithProgress.status = "error"
				fileWithProgress.error = errorMessage
				selectedFiles = [...selectedFiles]
				onFileError?.(fileWithProgress.file, errorMessage)
			}
		}

		// Check if all uploads are complete
		const allComplete = selectedFiles.every(f => f.status === "completed" || f.status === "error")
		if (allComplete) {
			onCompleted?.()
		}
	}

	// Handle input change
	function handleInputChange(event: Event) {
		const target = event.target as HTMLInputElement
		handleFileSelection(target.files)
	}

	// Handle drag and drop
	function handleDragEnter(event: DragEvent) {
		event.preventDefault()
		if (!disabled) {
			isDragging = true
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault()
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault()
		isDragging = false
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault()
		isDragging = false

		if (disabled) return

		const files = event.dataTransfer?.files
		handleFileSelection(files)
	}

	// Open file dialog
	function openFileDialog() {
		if (!disabled) {
			fileInput?.click()
		}
	}

	// Remove file
	function removeFile(index: number) {
		selectedFiles = selectedFiles.filter((_, i) => i !== index)
	}

	// Clear all files
	function clearAll() {
		selectedFiles = []
		if (fileInput) {
			fileInput.value = ""
		}
	}
</script>

<div class="fluent-inputfile {className}" style={style}>
	<!-- Hidden file input -->
	<input
		bind:this={fileInput}
		type="file"
		{accept}
		{multiple}
		{disabled}
		onchange={handleInputChange}
		style="display: none;"
		{...restProps}
	/>

	<!-- Drag and drop zone -->
	{#if showDragDropZone}
		<div
			class="drop-zone"
			class:disabled
			class:dragging={isDragging}
			ondragenter={handleDragEnter}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
		>
			<div class="drop-zone-content">
				<svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor" class="upload-icon">
					<path d="M24 4a2 2 0 012 2v20.586l5.293-5.293a2 2 0 112.828 2.828l-8.707 8.708a2 2 0 01-2.828 0l-8.707-8.708a2 2 0 112.828-2.828L22 26.586V6a2 2 0 012-2z"/>
					<path d="M8 32a2 2 0 012-2h4a2 2 0 110 4h-2v6h24v-6h-2a2 2 0 110-4h4a2 2 0 012 2v10a2 2 0 01-2 2H10a2 2 0 01-2-2V32z"/>
				</svg>
				<p class="drop-zone-text">
					{#if isDragging}
						Drop files here
					{:else}
						Drag and drop files here, or
					{/if}
				</p>
				<Button appearance="accent" onClick={openFileDialog} {disabled}>
					Browse
				</Button>
				{#if accept}
					<p class="drop-zone-hint">Accepted: {accept}</p>
				{/if}
				{#if maxFileSize}
					<p class="drop-zone-hint">Max size: {formatFileSize(maxFileSize)}</p>
				{/if}
			</div>
		</div>
	{:else}
		<Button appearance="accent" onClick={openFileDialog} {disabled}>
			Select files
		</Button>
	{/if}

	<!-- File list -->
	{#if selectedFiles.length > 0}
		<div class="file-list">
			<div class="file-list-header">
				<span class="file-count">{selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}</span>
				<button type="button" class="clear-button" onclick={clearAll} disabled={disabled}>
					Clear all
				</button>
			</div>

			{#each selectedFiles as fileWithProgress, index}
				<div class="file-item" class:error={fileWithProgress.status === "error"}>
					<div class="file-info">
						<div class="file-header">
							<span class="file-name">{fileWithProgress.file.name}</span>
							<span class="file-size">{formatFileSize(fileWithProgress.file.size)}</span>
						</div>

						{#if fileWithProgress.status === "uploading"}
							<ProgressBar value={fileWithProgress.progress} max={100} />
							<span class="progress-text">{fileWithProgress.progress}%</span>
						{:else if fileWithProgress.status === "completed"}
							<span class="status-text success">✓ Completed</span>
						{:else if fileWithProgress.status === "error"}
							<span class="status-text error">✗ {fileWithProgress.error}</span>
						{:else}
							<span class="status-text pending">Pending</span>
						{/if}
					</div>

					<button
						type="button"
						class="remove-button"
						onclick={() => removeFile(index)}
						disabled={disabled}
						aria-label="Remove file"
					>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
							<path d="M2.09 2.22a.75.75 0 011.06-.13L8 6.94l4.85-4.85a.75.75 0 111.06 1.06L9.06 8l4.85 4.85a.75.75 0 11-1.06 1.06L8 9.06l-4.85 4.85a.75.75 0 01-1.06-1.06L6.94 8 2.09 3.15a.75.75 0 01-.13-1.06z"/>
						</svg>
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.fluent-inputfile {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.drop-zone {
		border: 2px dashed var(--neutral-stroke-rest);
		border-radius: 8px;
		padding: 2rem;
		background: var(--neutral-layer-2);
		transition: all 0.2s ease;
		cursor: pointer;
	}

	.drop-zone:hover:not(.disabled) {
		border-color: var(--accent-fill-rest);
		background: var(--neutral-layer-3);
	}

	.drop-zone.dragging {
		border-color: var(--accent-fill-rest);
		background: var(--accent-fill-subtle);
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

	.file-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
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

	.clear-button {
		background: transparent;
		border: none;
		color: var(--accent-fill-rest);
		cursor: pointer;
		font-size: 0.875rem;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}

	.clear-button:hover:not(:disabled) {
		background: var(--neutral-fill-secondary-hover);
	}

	.clear-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.file-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem;
		background: var(--neutral-layer-2);
		border: 1px solid var(--neutral-stroke-rest);
		border-radius: 4px;
	}

	.file-item.error {
		border-color: var(--error-foreground-rest);
	}

	.file-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
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

	.progress-text {
		font-size: 0.875rem;
		color: var(--neutral-foreground-hint);
	}

	.status-text {
		font-size: 0.875rem;
	}

	.status-text.success {
		color: var(--success-foreground-rest, #107c10);
	}

	.status-text.error {
		color: var(--error-foreground-rest);
	}

	.status-text.pending {
		color: var(--neutral-foreground-hint);
	}

	.remove-button {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		color: var(--neutral-foreground-rest);
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.remove-button:hover:not(:disabled) {
		background: var(--neutral-fill-secondary-hover);
	}

	.remove-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
