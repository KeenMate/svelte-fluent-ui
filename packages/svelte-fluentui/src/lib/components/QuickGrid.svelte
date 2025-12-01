<script lang="ts" generics="T">
	import type {Snippet} from "svelte"
	import type {SlotType} from "../types/index.js"
	import GridCellEditor from "./GridCellEditor.svelte"

	type EditorType = "text" | "number" | "checkbox" | "select" | "date" | "autocomplete" | "custom"
	type EditTrigger = "click" | "dblclick" | "button" | "always" | "navigate"
	type OptionsLoadTrigger = "immediate" | "oneditstart" | "ondropdownopen"

	type EditorOption = {
		value: string
		label: string
	}

	type EditorOptions = {
		// For select/autocomplete - static options
		options?: EditorOption[]
		// For select/autocomplete - dynamic options loading
		loadOptions?: (row: T, field: string) => Promise<EditorOption[]>
		optionsLoadTrigger?: OptionsLoadTrigger  // Default: "oneditstart"
		// For number
		min?: number
		max?: number
		step?: number
		// For text
		maxLength?: number
		// For autocomplete
		onSearch?: (query: string, row: T) => Promise<EditorOption[]>
	}

	type CustomEditorContext<T> = {
		value: any
		row: T
		rowIndex: number
		field: string
		commit: (newValue: any) => void
		cancel: () => void
	}

	type Column<T> = {
		field: keyof T | string
		title: string
		sortable?: boolean
		filterable?: boolean
		width?: string
		align?: "left" | "center" | "right"
		format?: (value: any, row: T) => string
		template?: (row: T) => string
		snippet?: Snippet<[T]>
		// Editing props
		editable?: boolean
		editor?: EditorType
		editTrigger?: EditTrigger  // Per-column override
		editorOptions?: EditorOptions
		// Validation - sync or async
		validate?: (value: any, row: T) => string | null | Promise<string | null>
		// Custom editor callback
		oncelledit?: (context: CustomEditorContext<T>) => void
		// Show edit button in cell
		showEditButton?: boolean
	}

	type RowChangeDetail<T> = {
		row: T
		rowIndex: number
		field: string
		oldValue: any
		newValue: any
	}

	type Props<T> = {
		items: T[]
		columns: Column<T>[]
		sortable?: boolean
		filterable?: boolean
		pageable?: boolean
		pageSize?: number
		striped?: boolean
		hoverable?: boolean
		class?: string
		style?: string
		cellTemplate?: SlotType
		// Editing props
		editable?: boolean
		editTrigger?: EditTrigger
		onrowchange?: (detail: RowChangeDetail<T>) => void
		onroweditstart?: (detail: { row: T, rowIndex: number, field: string }) => void
		onroweditcancel?: (detail: { row: T, rowIndex: number, field: string }) => void
		onvalidationerror?: (detail: { row: T, rowIndex: number, field: string, error: string }) => void
	}

	let {
		items = [],
		columns = [],
		sortable = false,
		filterable = false,
		pageable = false,
		pageSize = 10,
		striped = true,
		hoverable = true,
		class: className = "",
		style = "",
		cellTemplate = undefined,
		// Editing props
		editable = false,
		editTrigger = "dblclick",
		onrowchange = undefined,
		onroweditstart = undefined,
		onroweditcancel = undefined,
		onvalidationerror = undefined
	}: Props<T> = $props()

	// Sorting state
	let sortColumn = $state<string | null>(null)
	let sortDirection = $state<"asc" | "desc">("asc")

	// Filtering state
	let filters = $state<Record<string, string>>({})

	// Pagination state
	let currentPage = $state(1)

	// Editing state
	let editingCell = $state<{ rowIndex: number; field: string } | null>(null)
	let validationError = $state<string | null>(null)
	let isValidating = $state(false)

	// Navigation mode state (for "navigate" editTrigger)
	let focusedCell = $state<{ rowIndex: number; colIndex: number } | null>(null)
	let isNavigateMode = $derived(editTrigger === "navigate" || columns.some(c => c.editTrigger === "navigate"))
	let tableElement: HTMLTableElement | undefined = $state()
	let isCommittingFromKeyboard = $state(false)

	// Dynamic options cache (for "immediate" load trigger)
	let dynamicOptionsCache = $state<Record<string, EditorOption[]>>({})
	let loadingOptions = $state<Record<string, boolean>>({})

	// Load options with "immediate" trigger on mount
	$effect(() => {
		columns.forEach(column => {
			const field = String(column.field)
			if (
				column.editorOptions?.loadOptions &&
				column.editorOptions?.optionsLoadTrigger === "immediate" &&
				!dynamicOptionsCache[field]
			) {
				loadOptionsForColumn(column, items[0], field)
			}
		})
	})

	// Computed: filtered items
	let filteredItems = $derived.by(() => {
		if (!filterable || Object.keys(filters).length === 0) return items

		return items.filter((item) => {
			return Object.entries(filters).every(([field, filterValue]) => {
				if (!filterValue) return true
				const cellValue = String(item[field as keyof T] ?? "").toLowerCase()
				return cellValue.includes(filterValue.toLowerCase())
			})
		})
	})

	// Computed: sorted items
	let sortedItems = $derived.by(() => {
		if (!sortColumn) return filteredItems

		return [...filteredItems].sort((a, b) => {
			const aVal = a[sortColumn as keyof T]
			const bVal = b[sortColumn as keyof T]

			if (aVal === bVal) return 0

			let comparison = 0
			if (typeof aVal === "string" && typeof bVal === "string") {
				comparison = aVal.localeCompare(bVal)
			} else if (typeof aVal === "number" && typeof bVal === "number") {
				comparison = aVal - bVal
			} else {
				comparison = String(aVal).localeCompare(String(bVal))
			}

			return sortDirection === "asc" ? comparison : -comparison
		})
	})

	// Computed: paginated items
	let paginatedItems = $derived.by(() => {
		if (!pageable) return sortedItems

		const start = (currentPage - 1) * pageSize
		const end = start + pageSize
		return sortedItems.slice(start, end)
	})

	// Computed: total pages
	let totalPages = $derived(Math.ceil(sortedItems.length / pageSize))

	// Display items (final result)
	let displayItems = $derived(paginatedItems)

	function handleSort(column: Column<T>) {
		if (!sortable || !column.sortable) return

		const field = String(column.field)
		if (sortColumn === field) {
			sortDirection = sortDirection === "asc" ? "desc" : "asc"
		} else {
			sortColumn = field
			sortDirection = "asc"
		}
	}

	function handleFilter(field: string, value: string) {
		filters[field] = value
		currentPage = 1 // Reset to first page when filtering
	}

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page
		}
	}

	function getCellValue(item: T, column: Column<T>): string {
		if (column.template) {
			return column.template(item)
		}
		const value = item[column.field as keyof T]
		if (column.format) {
			return column.format(value, item)
		}
		return String(value ?? "")
	}

	function hasTemplate(column: Column<T>): boolean {
		return !!column.template
	}

	function hasSnippet(column: Column<T>): boolean {
		return !!column.snippet
	}

	// Dynamic options loading
	async function loadOptionsForColumn(column: Column<T>, row: T, field: string): Promise<EditorOption[]> {
		if (!column.editorOptions?.loadOptions) return column.editorOptions?.options || []

		const cacheKey = field
		loadingOptions[cacheKey] = true

		try {
			const options = await column.editorOptions.loadOptions(row, field)
			dynamicOptionsCache[cacheKey] = options
			return options
		} catch (error) {
			console.error(`Failed to load options for ${field}:`, error)
			return []
		} finally {
			loadingOptions[cacheKey] = false
		}
	}

	function getOptionsForColumn(column: Column<T>): EditorOption[] {
		const field = String(column.field)
		// Return cached dynamic options if available
		if (dynamicOptionsCache[field]) {
			return dynamicOptionsCache[field]
		}
		// Otherwise return static options
		return column.editorOptions?.options || []
	}

	// Editing functions
	function isEditing(rowIndex: number, field: string): boolean {
		return editingCell?.rowIndex === rowIndex && editingCell?.field === field
	}

	function isCellEditable(column: Column<T>): boolean {
		return editable && (column.editable ?? false)
	}

	function getColumnEditTrigger(column: Column<T>): EditTrigger {
		return column.editTrigger || editTrigger
	}

	async function startEdit(rowIndex: number, field: string, item: T, column: Column<T>, colIndex?: number) {
		const columnField = String(column.field)
		validationError = null

		// Handle custom editor
		if (column.editor === "custom" && column.oncelledit) {
			const context: CustomEditorContext<T> = {
				value: item[column.field as keyof T],
				row: item,
				rowIndex,
				field: columnField,
				commit: (newValue: any) => {
					commitEditDirect(rowIndex, column, newValue, item, colIndex)
				},
				cancel: () => {
					editingCell = null
					// Refocus cell on cancel in navigate mode
					if (isNavigateMode && colIndex !== undefined) {
						focusCell(rowIndex, colIndex)
					}
				}
			}
			column.oncelledit(context)
			// Mark as editing so we can show visual feedback
			editingCell = { rowIndex, field }
			return
		}

		// Load options if needed (oneditstart trigger)
		if (
			column.editorOptions?.loadOptions &&
			(column.editorOptions?.optionsLoadTrigger === "oneditstart" || !column.editorOptions?.optionsLoadTrigger)
		) {
			await loadOptionsForColumn(column, item, columnField)
		}

		editingCell = { rowIndex, field }
		onroweditstart?.({ row: item, rowIndex, field })
	}

	function cancelEdit(item: T, rowIndex: number) {
		if (editingCell) {
			const field = editingCell.field
			onroweditcancel?.({ row: item, rowIndex, field })
			editingCell = null
			validationError = null
		}
	}

	// Direct commit without validation (used by custom editors that handle their own validation)
	function commitEditDirect(rowIndex: number, column: Column<T>, newValue: any, item: T, colIndex?: number) {
		const field = String(column.field)
		const oldValue = item[column.field as keyof T]

		// Only fire event if value changed
		if (oldValue !== newValue) {
			onrowchange?.({
				row: item,
				rowIndex,
				field,
				oldValue,
				newValue
			})
		}

		editingCell = null
		validationError = null

		// Refocus cell in navigate mode so arrow key navigation continues to work
		if (isNavigateMode && colIndex !== undefined) {
			focusCell(rowIndex, colIndex)
		}
	}

	async function commitEdit(rowIndex: number, column: Column<T>, newValue: any, item: T, colIndex?: number) {
		const field = String(column.field)
		const oldValue = item[column.field as keyof T]

		// Validate if validator exists (supports sync and async)
		if (column.validate) {
			isValidating = true
			try {
				const result = column.validate(newValue, item)
				const error = result instanceof Promise ? await result : result

				if (error) {
					validationError = error
					isValidating = false
					onvalidationerror?.({ row: item, rowIndex, field, error })
					return
				}
			} catch (err) {
				const errorMsg = err instanceof Error ? err.message : "Validation failed"
				validationError = errorMsg
				isValidating = false
				onvalidationerror?.({ row: item, rowIndex, field, error: errorMsg })
				return
			}
			isValidating = false
		}

		validationError = null

		// Only fire event if value changed
		if (oldValue !== newValue) {
			onrowchange?.({
				row: item,
				rowIndex,
				field,
				oldValue,
				newValue
			})
		}

		editingCell = null

		// For immediate-commit editors (checkbox, select, date) in navigate mode,
		// refocus the cell so arrow key navigation continues to work
		if (isNavigateMode && colIndex !== undefined) {
			const isImmediateCommitEditor = column.editor === "checkbox" || column.editor === "select" || column.editor === "date"
			if (isImmediateCommitEditor) {
				focusCell(rowIndex, colIndex)
			}
		}
	}

	function handleCellClick(e: MouseEvent, rowIndex: number, colIndex: number, column: Column<T>, item: T) {
		if (!isCellEditable(column)) return
		const trigger = getColumnEditTrigger(column)
		if (trigger === "click") {
			startEdit(rowIndex, String(column.field), item, column, colIndex)
		}
	}

	function handleCellDblClick(e: MouseEvent, rowIndex: number, colIndex: number, column: Column<T>, item: T) {
		if (!isCellEditable(column)) return
		const trigger = getColumnEditTrigger(column)
		if (trigger === "dblclick") {
			startEdit(rowIndex, String(column.field), item, column, colIndex)
		}
	}

	function handleEditButtonClick(e: MouseEvent, rowIndex: number, colIndex: number, column: Column<T>, item: T) {
		e.stopPropagation()
		startEdit(rowIndex, String(column.field), item, column, colIndex)
	}

	function getEditorType(column: Column<T>): EditorType {
		return column.editor || "text"
	}

	function shouldShowEditButton(column: Column<T>): boolean {
		return column.showEditButton === true || getColumnEditTrigger(column) === "button"
	}

	// Navigation mode functions
	function getEditableColumns(): { index: number; column: Column<T> }[] {
		return columns
			.map((col, index) => ({ index, column: col }))
			.filter(({ column }) => isCellEditable(column))
	}

	function isCellFocused(rowIndex: number, colIndex: number): boolean {
		return focusedCell?.rowIndex === rowIndex && focusedCell?.colIndex === colIndex
	}

	function focusCell(rowIndex: number, colIndex: number) {
		focusedCell = { rowIndex, colIndex }
		// Focus the td element for keyboard events
		requestAnimationFrame(() => {
			const cell = tableElement?.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`) as HTMLElement
			cell?.focus()
		})
	}

	function handleCellFocus(rowIndex: number, colIndex: number) {
		if (isNavigateMode && !editingCell) {
			focusedCell = { rowIndex, colIndex }
		}
	}

	function handleNavigationKeyDown(e: KeyboardEvent, rowIndex: number, colIndex: number, column: Column<T>, item: T) {
		if (!isNavigateMode || editingCell) return

		const editableCols = getEditableColumns()
		const currentEditableIndex = editableCols.findIndex(ec => ec.index === colIndex)

		switch (e.key) {
			case "ArrowUp":
				e.preventDefault()
				if (rowIndex > 0) {
					focusCell(rowIndex - 1, colIndex)
				}
				break
			case "ArrowDown":
				e.preventDefault()
				if (rowIndex < displayItems.length - 1) {
					focusCell(rowIndex + 1, colIndex)
				}
				break
			case "ArrowLeft":
				e.preventDefault()
				if (currentEditableIndex > 0) {
					focusCell(rowIndex, editableCols[currentEditableIndex - 1].index)
				}
				break
			case "ArrowRight":
				e.preventDefault()
				if (currentEditableIndex < editableCols.length - 1) {
					focusCell(rowIndex, editableCols[currentEditableIndex + 1].index)
				}
				break
			case "Tab":
				e.preventDefault()
				if (e.shiftKey) {
					// Move to previous cell
					if (currentEditableIndex > 0) {
						focusCell(rowIndex, editableCols[currentEditableIndex - 1].index)
					} else if (rowIndex > 0) {
						focusCell(rowIndex - 1, editableCols[editableCols.length - 1].index)
					}
				} else {
					// Move to next cell
					if (currentEditableIndex < editableCols.length - 1) {
						focusCell(rowIndex, editableCols[currentEditableIndex + 1].index)
					} else if (rowIndex < displayItems.length - 1) {
						focusCell(rowIndex + 1, editableCols[0].index)
					}
				}
				break
			case "Enter":
			case "F2":
				e.preventDefault()
				startEdit(rowIndex, String(column.field), item, column, colIndex)
				break
			case " ":
				// Space toggles checkbox immediately
				if (column.editor === "checkbox") {
					e.preventDefault()
					const newValue = !item[column.field as keyof T]
					commitEditDirect(rowIndex, column, newValue, item, colIndex)
				}
				break
			default:
				// Any printable character starts editing (for text/number fields)
				if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
					if (column.editor === "text" || column.editor === "number" || !column.editor) {
						startEdit(rowIndex, String(column.field), item, column, colIndex)
						// Don't prevent default - let the character be typed
					}
				}
				break
		}
	}

	async function handleEditorKeyDownInNavigateMode(e: KeyboardEvent, rowIndex: number, colIndex: number, column: Column<T>, item: T) {
		if (!isNavigateMode) return

		const editableCols = getEditableColumns()
		const currentEditableIndex = editableCols.findIndex(ec => ec.index === colIndex)

		if (e.key === "Tab") {
			e.preventDefault()
			e.stopPropagation()  // Prevent bubbling to handleNavigationKeyDown
			isCommittingFromKeyboard = true

			// Commit current edit first (for text/number inputs)
			const input = e.target as HTMLInputElement
			if (column.editor === "checkbox") {
				// Checkbox already committed on change, just clear editing state
				editingCell = null
			} else if (input?.value !== undefined) {
				await commitEdit(rowIndex, column, column.editor === "number" ? Number(input.value) : input.value, item)
			}

			isCommittingFromKeyboard = false

			// Only move if no validation error
			if (!validationError) {
				// Then move to next/prev cell
				if (e.shiftKey) {
					if (currentEditableIndex > 0) {
						focusCell(rowIndex, editableCols[currentEditableIndex - 1].index)
					} else if (rowIndex > 0) {
						focusCell(rowIndex - 1, editableCols[editableCols.length - 1].index)
					}
				} else {
					if (currentEditableIndex < editableCols.length - 1) {
						focusCell(rowIndex, editableCols[currentEditableIndex + 1].index)
					} else if (rowIndex < displayItems.length - 1) {
						focusCell(rowIndex + 1, editableCols[0].index)
					}
				}
			}
		} else if (e.key === "Escape") {
			e.preventDefault()
			e.stopPropagation()  // Prevent bubbling to handleNavigationKeyDown
			cancelEdit(item, rowIndex)
			focusCell(rowIndex, colIndex)
		} else if (e.key === "Enter") {
			e.preventDefault()
			e.stopPropagation()  // Prevent bubbling to handleNavigationKeyDown
			isCommittingFromKeyboard = true

			const input = e.target as HTMLInputElement
			if (column.editor === "checkbox") {
				// Checkbox already committed on change, just clear editing state
				editingCell = null
			} else if (input?.value !== undefined) {
				await commitEdit(rowIndex, column, column.editor === "number" ? Number(input.value) : input.value, item)
			}

			isCommittingFromKeyboard = false

			// Only move if no validation error
			if (!validationError) {
				// Move to cell below after Enter
				if (rowIndex < displayItems.length - 1) {
					focusCell(rowIndex + 1, colIndex)
				} else {
					focusCell(rowIndex, colIndex)
				}
			}
		} else if (e.key === " " && column.editor === "checkbox") {
			// Space toggles checkbox while in edit mode
			e.preventDefault()
			e.stopPropagation()
			const newValue = !item[column.field as keyof T]
			await commitEdit(rowIndex, column, newValue, item, colIndex)
		} else if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
			// Arrow keys navigate while editing - commit current value and move
			e.preventDefault()
			e.stopPropagation()
			isCommittingFromKeyboard = true

			// Commit current edit first
			const input = e.target as HTMLInputElement
			if (column.editor === "checkbox") {
				editingCell = null
			} else if (input?.value !== undefined) {
				await commitEdit(rowIndex, column, column.editor === "number" ? Number(input.value) : input.value, item)
			}

			isCommittingFromKeyboard = false

			// Only move if no validation error
			if (!validationError) {
				if (e.key === "ArrowUp" && rowIndex > 0) {
					focusCell(rowIndex - 1, colIndex)
				} else if (e.key === "ArrowDown" && rowIndex < displayItems.length - 1) {
					focusCell(rowIndex + 1, colIndex)
				} else if (e.key === "ArrowLeft" && currentEditableIndex > 0) {
					focusCell(rowIndex, editableCols[currentEditableIndex - 1].index)
				} else if (e.key === "ArrowRight" && currentEditableIndex < editableCols.length - 1) {
					focusCell(rowIndex, editableCols[currentEditableIndex + 1].index)
				} else {
					// Stay in current cell if can't move
					focusCell(rowIndex, colIndex)
				}
			}
		}
	}

	let computedClass = $derived(`quickgrid ${striped ? "striped" : ""} ${hoverable ? "hoverable" : ""} ${editable ? "editable" : ""} ${isNavigateMode ? "navigate-mode" : ""} ${className}`.trim())
</script>

<div class="quickgrid-container" {style} >
	<table bind:this={tableElement} class={computedClass}>
		<thead>
			{#if filterable}
				<tr class="filter-row">
					{#each columns as column}
						<th style={column.width ? `width: ${column.width}` : ""}>
							{#if column.filterable !== false}
								<input
									type="text"
									class="filter-input"
									placeholder="Filter..."
									value={filters[String(column.field)] || ""}
									oninput={(e) => handleFilter(String(column.field), e.currentTarget.value)}
								/>
							{/if}
						</th>
					{/each}
				</tr>
			{/if}
			<tr>
				{#each columns as column}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<th
						class={`column-header ${column.sortable !== false && sortable ? "sortable" : ""} ${
							sortColumn === String(column.field) ? `sorted sorted-${sortDirection}` : ""
						}`}
						style={column.width ? `width: ${column.width}; text-align: ${column.align || "left"}` : `text-align: ${column.align || "left"}`}
						onclick={() => handleSort(column)}
					>
						<div class="column-header-content">
							<span>{column.title}</span>
							{#if column.sortable !== false && sortable}
								<span class="sort-indicator">
									{#if sortColumn === String(column.field)}
										{sortDirection === "asc" ? "▲" : "▼"}
									{:else}
										<span class="sort-placeholder">⬍</span>
									{/if}
								</span>
							{/if}
						</div>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#if displayItems.length === 0}
				<tr>
					<td colspan={columns.length} class="empty-message">
						No items to display
					</td>
				</tr>
			{:else}
				{#each displayItems as item, rowIndex}
					<tr>
						{#each columns as column, colIndex}
							<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
							<td
								data-row={rowIndex}
								data-col={colIndex}
								tabindex={isNavigateMode && isCellEditable(column) ? 0 : undefined}
								style={`text-align: ${column.align || "left"}`}
								class={`${isCellEditable(column) ? "editable-cell" : ""} ${isEditing(rowIndex, String(column.field)) && validationError ? "validation-error" : ""} ${isCellFocused(rowIndex, colIndex) ? "focused" : ""}`}
								onclick={(e) => handleCellClick(e, rowIndex, colIndex, column, item)}
								ondblclick={(e) => handleCellDblClick(e, rowIndex, colIndex, column, item)}
								onfocus={() => handleCellFocus(rowIndex, colIndex)}
								onkeydown={(e) => handleNavigationKeyDown(e, rowIndex, colIndex, column, item)}
								title={isEditing(rowIndex, String(column.field)) && validationError ? validationError : undefined}
							>
								{#if isEditing(rowIndex, String(column.field))}
									{#if column.editor === "custom"}
										<!-- Custom editor - handled via callback, show indicator -->
										<span class="custom-editing-indicator">Editing...</span>
									{:else}
										<!-- svelte-ignore a11y_no_static_element_interactions -->
										<div
											class="editor-wrapper"
											class:validating={isValidating}
											onkeydown={(e) => handleEditorKeyDownInNavigateMode(e, rowIndex, colIndex, column, item)}
										>
											<GridCellEditor
												type={getEditorType(column)}
												value={item[column.field as keyof T]}
												options={{
													...column.editorOptions,
													options: getOptionsForColumn(column)
												}}
												oncommit={(newValue) => commitEdit(rowIndex, column, newValue, item, colIndex)}
												oncancel={() => cancelEdit(item, rowIndex)}
												skipBlurCommit={isCommittingFromKeyboard}
												skipKeyboardCommit={isNavigateMode}
											/>
											{#if isValidating}
												<span class="validating-indicator">...</span>
											{/if}
										</div>
										{#if validationError}
											<div class="validation-error-message">{validationError}</div>
										{/if}
									{/if}
								{:else if isCellEditable(column) && getColumnEditTrigger(column) === "always"}
									<GridCellEditor
										type={getEditorType(column)}
										value={item[column.field as keyof T]}
										options={{
											...column.editorOptions,
											options: getOptionsForColumn(column)
										}}
										oncommit={(newValue) => commitEdit(rowIndex, column, newValue, item)}
										oncancel={() => {}}
									/>
								{:else}
									<div class="cell-content">
										{#if hasSnippet(column)}
											{@render column.snippet?.(item)}
										{:else if hasTemplate(column)}
											{@html getCellValue(item, column)}
										{:else if isNavigateMode && column.editor === "checkbox"}
											<!-- Show checkbox display in navigate mode -->
											<input
												type="checkbox"
												class="cell-checkbox-display"
												checked={!!item[column.field as keyof T]}
												disabled
												tabindex={-1}
											/>
										{:else}
											{getCellValue(item, column)}
										{/if}
										{#if isCellEditable(column) && shouldShowEditButton(column)}
											<button
												class="cell-edit-btn"
												onclick={(e) => handleEditButtonClick(e, rowIndex, colIndex, column, item)}
												title="Edit"
											>
												✎
											</button>
										{/if}
									</div>
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>

	{#if pageable && totalPages > 1}
		<div class="pagination">
			<button
				class="pagination-btn"
				disabled={currentPage === 1}
				onclick={() => goToPage(currentPage - 1)}
			>
				Previous
			</button>

			<div class="pagination-info">
				Page {currentPage} of {totalPages}
				<span class="item-count">
					({sortedItems.length} item{sortedItems.length !== 1 ? "s" : ""})
				</span>
			</div>

			<button
				class="pagination-btn"
				disabled={currentPage === totalPages}
				onclick={() => goToPage(currentPage + 1)}
			>
				Next
			</button>
		</div>
	{/if}
</div>

<style>
	.quickgrid-container {
		width: 100%;
		overflow-x: auto;
	}

	.quickgrid {
		width: 100%;
		border-collapse: collapse;
		border: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		background: var(--neutral-layer-1, #ffffff);
		font-size: var(--type-ramp-base-font-size, 14px);
		line-height: var(--type-ramp-base-line-height, 20px);
	}

	.column-header {
		background: var(--neutral-layer-2, #f5f5f5);
		color: var(--neutral-foreground-rest, #242424);
		font-weight: var(--font-weight-semibold, 600);
		padding: calc(var(--design-unit) * 2px) calc(var(--design-unit) * 3px);
		border-bottom: 2px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		text-align: left;
		user-select: none;
	}

	.column-header.sortable {
		cursor: pointer;
	}

	.column-header.sortable:hover {
		background: var(--neutral-layer-3, #ebebeb);
	}

	.column-header-content {
		display: flex;
		align-items: center;
		gap: 4px;
		justify-content: space-between;
	}

	.sort-indicator {
		font-size: 10px;
		opacity: 0.8;
		min-width: 12px;
		text-align: center;
	}

	.sort-placeholder {
		opacity: 0.3;
	}

	.column-header.sorted {
		background: var(--neutral-layer-3, #ebebeb);
	}

	.filter-row th {
		padding: calc(var(--design-unit) * 1px) calc(var(--design-unit) * 2px);
		background: var(--neutral-layer-1, #ffffff);
		border-bottom: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
	}

	.filter-input {
		width: 100%;
		padding: 4px 8px;
		border: 1px solid var(--neutral-stroke-input-rest, #d1d1d1);
		border-radius: var(--control-corner-radius, 4px);
		background: var(--neutral-layer-1, #ffffff);
		color: var(--neutral-foreground-rest, #242424);
		font-size: 12px;
		box-sizing: border-box;
	}

	.filter-input:focus {
		outline: none;
		border-color: var(--accent-fill-rest, #0078d4);
		box-shadow: 0 0 0 1px var(--accent-fill-rest, #0078d4);
	}

	tbody tr {
		border-bottom: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
	}

	tbody td {
		padding: calc(var(--design-unit) * 2px) calc(var(--design-unit) * 3px);
		color: var(--neutral-foreground-rest, #242424);
	}

	.quickgrid.striped tbody tr:nth-child(even) {
		background: var(--neutral-layer-2, #fafafa);
	}

	.quickgrid.hoverable tbody tr:hover {
		background: var(--neutral-layer-3, #f0f0f0);
	}

	.empty-message {
		text-align: center;
		padding: calc(var(--design-unit) * 6px);
		color: var(--neutral-foreground-hint, #707070);
		font-style: italic;
	}

	.pagination {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		padding: calc(var(--design-unit) * 3px);
		border-top: 1px solid var(--neutral-stroke-layer-rest, #e0e0e0);
		background: var(--neutral-layer-1, #ffffff);
	}

	.pagination-btn {
		padding: 6px 16px;
		background: var(--neutral-layer-1, #ffffff);
		border: 1px solid var(--neutral-stroke-input-rest, #d1d1d1);
		border-radius: var(--control-corner-radius, 4px);
		color: var(--neutral-foreground-rest, #242424);
		font-size: var(--type-ramp-base-font-size, 14px);
		cursor: pointer;
		transition: all 0.1s ease;
	}

	.pagination-btn:hover:not(:disabled) {
		background: var(--neutral-layer-2, #f5f5f5);
		border-color: var(--neutral-stroke-input-hover, #a0a0a0);
	}

	.pagination-btn:active:not(:disabled) {
		background: var(--neutral-layer-3, #ebebeb);
	}

	.pagination-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.pagination-info {
		font-size: var(--type-ramp-base-font-size, 14px);
		color: var(--neutral-foreground-rest, #242424);
	}

	.item-count {
		font-size: 12px;
		color: var(--neutral-foreground-hint, #707070);
		margin-left: 4px;
	}

	/* Dark mode support */
	[data-theme="dark"] .quickgrid {
		background: var(--neutral-layer-1, #1f1f1f);
		border-color: var(--neutral-stroke-layer-rest, #3d3d3d);
	}

	[data-theme="dark"] .column-header {
		background: var(--neutral-layer-2, #2b2b2b);
		color: var(--neutral-foreground-rest, #e0e0e0);
	}

	[data-theme="dark"] tbody td {
		color: var(--neutral-foreground-rest, #e0e0e0);
	}

	[data-theme="dark"] .quickgrid.striped tbody tr:nth-child(even) {
		background: var(--neutral-layer-2, #262626);
	}

	[data-theme="dark"] .quickgrid.hoverable tbody tr:hover {
		background: var(--neutral-layer-3, #333333);
	}

	/* Editable cell styles */
	.quickgrid.editable .editable-cell {
		cursor: pointer;
		position: relative;
	}

	.quickgrid.editable .editable-cell:hover {
		background: var(--neutral-fill-secondary-hover, #f0f0f0);
	}

	.quickgrid.editable .editable-cell:hover::after {
		content: "";
		position: absolute;
		inset: 2px;
		border: 1px dashed var(--neutral-stroke-input-rest, #d1d1d1);
		border-radius: 2px;
		pointer-events: none;
	}

	[data-theme="dark"] .quickgrid.editable .editable-cell:hover {
		background: var(--neutral-fill-secondary-hover, #3a3a3a);
	}

	[data-theme="dark"] .quickgrid.editable .editable-cell:hover::after {
		border-color: var(--neutral-stroke-input-rest, #5a5a5a);
	}

	/* Cell content with edit button */
	.cell-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
	}

	.cell-edit-btn {
		opacity: 0;
		padding: 2px 6px;
		background: var(--neutral-layer-2, #f5f5f5);
		border: 1px solid var(--neutral-stroke-input-rest, #d1d1d1);
		border-radius: var(--control-corner-radius, 4px);
		cursor: pointer;
		font-size: 12px;
		line-height: 1;
		transition: opacity 0.15s ease;
	}

	.editable-cell:hover .cell-edit-btn {
		opacity: 1;
	}

	.cell-edit-btn:hover {
		background: var(--neutral-layer-3, #ebebeb);
		border-color: var(--accent-fill-rest, #0078d4);
	}

	/* Validation error styles */
	.validation-error {
		background: var(--error-fill-rest, #fde7e9) !important;
	}

	.validation-error::after {
		border-color: var(--error-stroke-rest, #d13438) !important;
		border-style: solid !important;
	}

	.validation-error-message {
		font-size: 11px;
		color: var(--error-foreground, #d13438);
		margin-top: 2px;
	}

	/* Editor wrapper and validating state */
	.editor-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.editor-wrapper.validating {
		opacity: 0.7;
		pointer-events: none;
	}

	.validating-indicator {
		font-size: 10px;
		color: var(--neutral-foreground-hint, #707070);
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}

	/* Custom editing indicator */
	.custom-editing-indicator {
		font-size: 12px;
		color: var(--accent-foreground-rest, #0078d4);
		font-style: italic;
	}

	/* Dark mode for new styles */
	[data-theme="dark"] .cell-edit-btn {
		background: var(--neutral-layer-2, #2b2b2b);
		border-color: var(--neutral-stroke-input-rest, #5a5a5a);
		color: var(--neutral-foreground-rest, #e0e0e0);
	}

	[data-theme="dark"] .cell-edit-btn:hover {
		background: var(--neutral-layer-3, #333333);
	}

	[data-theme="dark"] .validation-error {
		background: var(--error-fill-rest, #442726) !important;
	}

	[data-theme="dark"] .validation-error-message {
		color: var(--error-foreground, #f87c86);
	}

	/* Navigate mode styles */
	.quickgrid.navigate-mode .editable-cell {
		cursor: cell;
	}

	.quickgrid.navigate-mode .editable-cell:focus {
		outline: none;
	}

	.quickgrid.navigate-mode .editable-cell.focused {
		outline: 2px solid var(--accent-fill-rest, #0078d4);
		outline-offset: -2px;
		background: var(--neutral-fill-secondary-hover, #f0f0f0);
	}

	.quickgrid.navigate-mode .editable-cell.focused::after {
		display: none;
	}

	[data-theme="dark"] .quickgrid.navigate-mode .editable-cell.focused {
		background: var(--neutral-fill-secondary-hover, #3a3a3a);
	}

	/* Editing cell styles - seamless input */
	.editable-cell .editor-wrapper {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		padding: calc(var(--design-unit) * 2px) calc(var(--design-unit) * 3px);
		box-sizing: border-box;
	}

	/* Make editable cells position relative for absolute editor */
	tbody td.editable-cell {
		position: relative;
	}

	/* When a cell is being edited, show the accent border on the cell itself */
	tbody td:has(.editor-wrapper) {
		outline: 2px solid var(--accent-fill-rest, #0078d4);
		outline-offset: -2px;
		background: var(--neutral-layer-1, #ffffff);
	}

	tbody td:has(.editor-wrapper)::after {
		display: none;
	}

	[data-theme="dark"] tbody td:has(.editor-wrapper) {
		background: var(--neutral-layer-1, #1f1f1f);
	}

	/* Always-editing mode - different styling */
	.editable-cell :global(.grid-cell-editor:not(:has(:focus))) {
		/* When not focused, no border */
	}

	.editable-cell :global(.grid-cell-editor:has(:focus)) {
		/* Show accent border when focused in always mode */
	}

	/* Checkbox display in navigate mode (read-only visual) */
	.cell-checkbox-display {
		width: 18px;
		height: 18px;
		pointer-events: none;
		accent-color: var(--accent-fill-rest, #0078d4);
	}
</style>
