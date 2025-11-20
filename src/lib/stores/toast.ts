import {writable} from "svelte/store"

export type ToastVariant = "success" | "error" | "warning" | "info"

export type ToastPosition =
	| "top-right"
	| "top-left"
	| "top-center"
	| "bottom-right"
	| "bottom-left"
	| "bottom-center"

export interface ToastOptions {
	variant?: ToastVariant
	title?: string
	message?: string
	position?: ToastPosition
	duration?: number
	showProgress?: boolean
	persistent?: boolean
}

export interface Toast extends Required<Omit<ToastOptions, "title" | "message">> {
	id: string
	title: string
	message: string
}

// Toast counter for unique IDs
let toastCounter = 0

// Default configuration
const defaults = {
	position: "top-right" as ToastPosition,
	duration: 5000,
	showProgress: false,
	persistent: false
}

// Title mapping for variants
const titles: Record<ToastVariant, string> = {
	success: "Success",
	error: "Error",
	warning: "Warning",
	info: "Information"
}

// Create the toast store
function createToastStore() {
	const {subscribe, update} = writable<Toast[]>([])

	/**
	 * Add a new toast to the store
	 */
	function addToast(options: ToastOptions): string {
		const {
			variant = "info",
			title = titles[variant],
			message = "",
			position = defaults.position,
			duration = defaults.duration,
			showProgress = defaults.showProgress,
			persistent = defaults.persistent
		} = options

		// Generate unique ID
		const id = `fluent-toast-${++toastCounter}`

		// Create toast object
		const toast: Toast = {
			id,
			variant,
			title,
			message,
			position,
			duration,
			showProgress,
			persistent
		}

		// Add to store
		update((toasts) => {
			const newToasts = [...toasts, toast]
			return newToasts
		})

		// Auto-dismiss if not persistent
		if (!persistent) {
			setTimeout(() => {
				dismiss(id)
			}, duration)
		}

		return id
	}

	/**
	 * Remove a toast by ID
	 */
	function dismiss(id: string): void {
		update((toasts) => {
			const filtered = toasts.filter((toast) => toast.id !== id)
			return filtered
		})
	}

	/**
	 * Remove all toasts (optionally filtered by position)
	 */
	function dismissAll(position?: ToastPosition): void {
		if (position) {
			update((toasts) => toasts.filter((toast) => toast.position !== position))
		} else {
			update(() => [])
		}
	}

	return {
		subscribe,
		/**
		 * Show a toast with full control over options
		 * @param options - Toast configuration
		 * @returns Toast ID for programmatic dismissal
		 */
		show: (options: ToastOptions): string => {
			return addToast(options)
		},

		/**
		 * Show a success toast
		 * @param message - Toast message
		 * @param options - Additional options (position, duration, etc.)
		 * @returns Toast ID
		 */
		success: (message: string, options: Omit<ToastOptions, "variant" | "message"> = {}): string => {
			return addToast({
				variant: "success",
				message,
				...options
			})
		},

		/**
		 * Show an error toast
		 * @param message - Toast message
		 * @param options - Additional options
		 * @returns Toast ID
		 */
		error: (message: string, options: Omit<ToastOptions, "variant" | "message"> = {}): string => {
			return addToast({
				variant: "error",
				message,
				...options
			})
		},

		/**
		 * Show a warning toast
		 * @param message - Toast message
		 * @param options - Additional options
		 * @returns Toast ID
		 */
		warning: (message: string, options: Omit<ToastOptions, "variant" | "message"> = {}): string => {
			return addToast({
				variant: "warning",
				message,
				...options
			})
		},

		/**
		 * Show an info toast
		 * @param message - Toast message
		 * @param options - Additional options
		 * @returns Toast ID
		 */
		info: (message: string, options: Omit<ToastOptions, "variant" | "message"> = {}): string => {
			return addToast({
				variant: "info",
				message,
				...options
			})
		},

		/**
		 * Dismiss a specific toast by ID
		 * @param id - Toast ID returned from show/success/error/etc
		 */
		dismiss,

		/**
		 * Dismiss all toasts (optionally filtered by position)
		 * @param position - Optional position filter
		 */
		dismissAll
	}
}

export const toast = createToastStore()
