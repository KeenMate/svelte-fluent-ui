<script lang="ts">
	import {InputFile, Card, Stack, QuickGrid, Grid, GridItem} from "svelte-fluentui"
	import type {FileUploadHandler} from "svelte-fluentui"

	type Property = {
		name: string
		type: string
		default: string
		description: string
	}

	const properties: Property[] = [
		{name: "accept", type: "string", default: "undefined", description: "File types to accept (e.g., \".jpg,.png\" or \"image/*\")"},
		{name: "multiple", type: "boolean", default: "false", description: "Allow multiple file selection"},
		{name: "disabled", type: "boolean", default: "false", description: "Disable the component"},
		{name: "maxFileSize", type: "number", default: "10485760", description: "Maximum file size in bytes (default 10MB)"},
		{name: "maxFileCount", type: "number", default: "10", description: "Maximum number of files when multiple is true"},
		{name: "showDragDropZone", type: "boolean", default: "true", description: "Show drag and drop zone"},
		{name: "uploadFileCallback", type: "FileUploadHandler", default: "undefined", description: "Async function to handle file upload with progress"},
		{name: "class", type: "string", default: '""', description: "Additional CSS classes"},
		{name: "style", type: "string", default: '""', description: "Inline styles"}
	]

	const callbacks: Property[] = [
		{name: "onFileSelected", type: "(files: File[]) => void", default: "undefined", description: "Called when files are selected"},
		{name: "onFileUploaded", type: "(file: File) => void", default: "undefined", description: "Called when a file upload completes successfully"},
		{name: "onFileError", type: "(file: File, error: string) => void", default: "undefined", description: "Called when file validation or upload fails"},
		{name: "onCompleted", type: "() => void", default: "undefined", description: "Called when all file uploads complete"}
	]

	const slots: Property[] = []

	const propertyColumns = [
		{field: "name", title: "Name", sortable: true, filterable: true},
		{field: "type", title: "Type", sortable: true, filterable: true},
		{field: "default", title: "Default", sortable: true},
		{field: "description", title: "Description", filterable: true}
	]

	// Simulate upload with progress
	const simulateUpload: FileUploadHandler = async (file, onProgress) => {
		return new Promise((resolve, reject) => {
			let progress = 0
			const interval = setInterval(() => {
				progress += 10
				onProgress(progress)

				if (progress >= 100) {
					clearInterval(interval)

					// Simulate random success/failure
					if (Math.random() > 0.2) {
						resolve()
					} else {
						reject(new Error("Upload failed"))
					}
				}
			}, 200)
		})
	}

	let selectedFiles = $state<File[]>([])
	let uploadedFiles = $state<File[]>([])
	let errorFiles = $state<{file: File, error: string}[]>([])
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>InputFile</h1>

	<p>
		The InputFile component provides file upload functionality with drag-and-drop support,
		validation, and progress tracking. Inspired by the FluentUI Blazor InputFile component.
	</p>

	<Card>
		<p>
			<strong>References:</strong>
			<span style="color: #999; cursor: not-allowed;" title="Not available in FluentUI Web Components">FluentUI Web Component (N/A)</span>
			|
			<a href="https://www.fluentui-blazor.net/InputFile" target="_blank" rel="noopener noreferrer">FluentUI Blazor</a>
		</p>
	</Card>

	<Grid spacing={3}>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Properties</h2>
				<QuickGrid items={properties} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Callbacks</h2>
				<QuickGrid items={callbacks} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
		<GridItem xs={12} xl={6} xxl={4}>
			<Card>
				<h2>Slots</h2>
				<QuickGrid items={slots} columns={propertyColumns} sortable filterable striped />
			</Card>
		</GridItem>
	</Grid>

	<Card>
		<h2>FileUploadHandler Type</h2>
		<pre><code>type FileUploadHandler = (
  file: File,
  onProgress: (percent: number) => void
) => Promise&lt;void&gt;</code></pre>
		<p>
			A function that handles file upload. It receives the file and a progress callback function.
			Call <code>onProgress(percent)</code> to update the progress bar (0-100).
			Return a Promise that resolves on success or rejects on error.
		</p>
	</Card>

	<Card>
		<h2>Examples</h2>

		<h3>Basic InputFile with Automatic Upload</h3>
		<p>Drag and drop files or click browse to select. Files are automatically "uploaded" with simulated progress.</p>

		<Stack orientation="vertical" gap="1rem">
			<InputFile
				uploadFileCallback={simulateUpload}
				onFileSelected={(files) => {
					console.log("Files selected:", files)
					selectedFiles = files
				}}
				onFileUploaded={(file) => {
					console.log("File uploaded:", file)
					uploadedFiles = [...uploadedFiles, file]
				}}
				onFileError={(file, error) => {
					console.log("File error:", file, error)
					errorFiles = [...errorFiles, {file, error}]
				}}
				onCompleted={() => {
					console.log("All uploads completed")
				}}
			/>
		</Stack>

		<h3>Multiple Files with Limits</h3>
		<p>Upload multiple files (max 5) with size limit of 5MB per file.</p>

		<Stack orientation="vertical" gap="1rem">
			<InputFile
				multiple={true}
				maxFileCount={5}
				maxFileSize={5 * 1024 * 1024}
				uploadFileCallback={simulateUpload}
			/>
		</Stack>

		<h3>Image Files Only</h3>
		<p>Accept only image files (jpg, png, gif).</p>

		<Stack orientation="vertical" gap="1rem">
			<InputFile
				accept="image/*"
				multiple={true}
				uploadFileCallback={simulateUpload}
			/>
		</Stack>

		<h3>Specific File Types</h3>
		<p>Accept only PDF and Word documents.</p>

		<Stack orientation="vertical" gap="1rem">
			<InputFile
				accept=".pdf,.doc,.docx"
				multiple={true}
				uploadFileCallback={simulateUpload}
			/>
		</Stack>

		<h3>Without Drag-Drop Zone</h3>
		<p>Simple button-based file selection without drag-drop area.</p>

		<Stack orientation="vertical" gap="1rem">
			<InputFile
				showDragDropZone={false}
				multiple={true}
				uploadFileCallback={simulateUpload}
			/>
		</Stack>

		<h3>Manual Upload (No Auto-Upload)</h3>
		<p>Files are selected but not automatically uploaded. You can process them manually.</p>

		<Stack orientation="vertical" gap="1rem">
			<InputFile
				multiple={true}
				onFileSelected={(files) => {
					console.log("Files ready for manual processing:", files)
				}}
			/>
			<p style="margin: 0; font-size: 0.875rem; color: var(--neutral-foreground-hint);">
				Files will stay in "Pending" state until you process them with your own upload logic.
			</p>
		</Stack>

		<h3>Disabled State</h3>
		<p>InputFile in disabled state.</p>

		<Stack orientation="vertical" gap="1rem">
			<InputFile
				disabled={true}
			/>
		</Stack>

		<h3>Custom Upload Handler Example</h3>
		<pre><code>{`${'<'}script lang="ts">
  import { InputFile } from "svelte-fluentui"
  import type { FileUploadHandler } from "svelte-fluentui"

  const uploadToServer: FileUploadHandler = async (file, onProgress) => {
    const formData = new FormData()
    formData.append("file", file)

    const xhr = new XMLHttpRequest()

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100)
          onProgress(percent)
        }
      })

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          resolve()
        } else {
          reject(new Error("Upload failed"))
        }
      })

      xhr.addEventListener("error", () => reject(new Error("Network error")))

      xhr.open("POST", "/api/upload")
      xhr.send(formData)
    })
  }
${'<'}/script>

${'<'}InputFile
  multiple={true}
  accept="image/*"
  maxFileSize={5 * 1024 * 1024}
  uploadFileCallback={uploadToServer}
  onFileUploaded={(file) => console.log("Uploaded:", file.name)}
/>`}</code></pre>
	</Card>
</Stack>

<style>
	.api-table {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	.api-table th {
		text-align: left;
		padding: 0.75rem;
		background: var(--neutral-layer-3);
		font-weight: 600;
		border-bottom: 2px solid var(--neutral-stroke-rest);
	}

	.api-table td {
		padding: 0.75rem;
		border-bottom: 1px solid var(--neutral-stroke-rest);
	}

	.api-table code {
		background: var(--neutral-layer-3);
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
		font-size: 0.875rem;
	}

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
</style>
