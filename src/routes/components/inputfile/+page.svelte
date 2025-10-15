<script lang="ts">
	import {InputFile, Card, Stack} from "$lib/index.js"
	import type {FileUploadHandler} from "$lib/components/InputFile.svelte"

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

<h1>InputFile</h1>

<p>
	The InputFile component provides file upload functionality with drag-and-drop support,
	validation, and progress tracking. Inspired by the FluentUI Blazor InputFile component.
</p>

<h2>Examples</h2>

<!-- Basic InputFile with automatic upload -->
<Card>
	<h3>Basic InputFile with Automatic Upload</h3>
	<p>Drag and drop files or click browse to select. Files are automatically "uploaded" with simulated progress.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
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
</Card>

<!-- Multiple files with limits -->
<Card>
	<h3>Multiple Files with Limits</h3>
	<p>Upload multiple files (max 5) with size limit of 5MB per file.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
		<InputFile
			multiple={true}
			maxFileCount={5}
			maxFileSize={5 * 1024 * 1024}
			uploadFileCallback={simulateUpload}
		/>
	</Stack>
</Card>

<!-- Image files only -->
<Card>
	<h3>Image Files Only</h3>
	<p>Accept only image files (jpg, png, gif).</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
		<InputFile
			accept="image/*"
			multiple={true}
			uploadFileCallback={simulateUpload}
		/>
	</Stack>
</Card>

<!-- Specific file types -->
<Card>
	<h3>Specific File Types</h3>
	<p>Accept only PDF and Word documents.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
		<InputFile
			accept=".pdf,.doc,.docx"
			multiple={true}
			uploadFileCallback={simulateUpload}
		/>
	</Stack>
</Card>

<!-- Without drag-drop zone -->
<Card>
	<h3>Without Drag-Drop Zone</h3>
	<p>Simple button-based file selection without drag-drop area.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
		<InputFile
			showDragDropZone={false}
			multiple={true}
			uploadFileCallback={simulateUpload}
		/>
	</Stack>
</Card>

<!-- Manual upload (no callback) -->
<Card>
	<h3>Manual Upload (No Auto-Upload)</h3>
	<p>Files are selected but not automatically uploaded. You can process them manually.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
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
</Card>

<!-- Disabled -->
<Card>
	<h3>Disabled State</h3>
	<p>InputFile in disabled state.</p>

	<Stack orientation="vertical" gap="1rem" style="margin-top: 1rem;">
		<InputFile
			disabled={true}
		/>
	</Stack>
</Card>

<h2>API</h2>

<Card>
	<h3>Properties</h3>
	<table class="api-table">
		<thead>
			<tr>
				<th>Property</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>accept</code></td>
				<td><code>string</code></td>
				<td><code>undefined</code></td>
				<td>File types to accept (e.g., ".jpg,.png" or "image/*")</td>
			</tr>
			<tr>
				<td><code>multiple</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Allow multiple file selection</td>
			</tr>
			<tr>
				<td><code>disabled</code></td>
				<td><code>boolean</code></td>
				<td><code>false</code></td>
				<td>Disable the component</td>
			</tr>
			<tr>
				<td><code>maxFileSize</code></td>
				<td><code>number</code></td>
				<td><code>10485760</code></td>
				<td>Maximum file size in bytes (default 10MB)</td>
			</tr>
			<tr>
				<td><code>maxFileCount</code></td>
				<td><code>number</code></td>
				<td><code>10</code></td>
				<td>Maximum number of files when multiple is true</td>
			</tr>
			<tr>
				<td><code>showDragDropZone</code></td>
				<td><code>boolean</code></td>
				<td><code>true</code></td>
				<td>Show drag and drop zone</td>
			</tr>
			<tr>
				<td><code>uploadFileCallback</code></td>
				<td><code>FileUploadHandler</code></td>
				<td><code>undefined</code></td>
				<td>Async function to handle file upload with progress</td>
			</tr>
		</tbody>
	</table>

	<h3>Events</h3>
	<table class="api-table">
		<thead>
			<tr>
				<th>Event</th>
				<th>Type</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>onFileSelected</code></td>
				<td><code>(files: File[]) => void</code></td>
				<td>Called when files are selected</td>
			</tr>
			<tr>
				<td><code>onFileUploaded</code></td>
				<td><code>(file: File) => void</code></td>
				<td>Called when a file upload completes successfully</td>
			</tr>
			<tr>
				<td><code>onFileError</code></td>
				<td><code>(file: File, error: string) => void</code></td>
				<td>Called when file validation or upload fails</td>
			</tr>
			<tr>
				<td><code>onCompleted</code></td>
				<td><code>() => void</code></td>
				<td>Called when all file uploads complete</td>
			</tr>
		</tbody>
	</table>

	<h3>FileUploadHandler Type</h3>
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

<h2>Usage Example</h2>

<Card>
	<h3>Custom Upload Handler</h3>
	<pre><code>{`<script lang="ts">
  import { InputFile } from "$lib/index.js"
  import type { FileUploadHandler } from "$lib/components/InputFile.svelte"

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
</script>

<InputFile
  multiple={true}
  accept="image/*"
  maxFileSize={5 * 1024 * 1024}
  uploadFileCallback={uploadToServer}
  onFileUploaded={(file) => console.log("Uploaded:", file.name)}
/>`}</code></pre>
</Card>

<style>
	h1 {
		font-size: 2rem;
		margin: 0 0 2rem 0;
		font-weight: 600;
	}

	h2 {
		font-size: 1.5rem;
		margin: 2rem 0 1rem 0;
		font-weight: 600;
	}

	h3 {
		font-size: 1.25rem;
		margin: 0 0 1rem 0;
		font-weight: 600;
	}

	p {
		margin: 0 0 0.5rem 0;
		line-height: 1.5;
	}

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
