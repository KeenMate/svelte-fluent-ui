<script lang="ts">
	import {toast, type Toast, type ToastPosition} from "../stores/toast.js"
	import {onMount} from "svelte"

	let toasts = $state<Toast[]>([])
	let mountedToasts = $state(new Set<string>())

	// Group toasts by position
	let toastsByPosition = $derived.by(() => {
		const grouped: Record<ToastPosition, Toast[]> = {
			"top-right": [],
			"top-left": [],
			"top-center": [],
			"bottom-right": [],
			"bottom-left": [],
			"bottom-center": []
		}

		toasts.forEach((t) => {
			grouped[t.position].push(t)
		})

		return grouped
	})

	// Subscribe to toast store
	toast.subscribe((value) => {
		toasts = value
	})

	// Icons for variants
	const icons: Record<string, string> = {
		success: "✓",
		error: "✕",
		warning: "⚠",
		info: "ℹ"
	}

	function handleDismiss(id: string) {
		toast.dismiss(id)
	}

	function handleToastClick(id: string) {
		toast.dismiss(id)
	}

	onMount(() => {
		// Mark all existing toasts as mounted for animation
		toasts.forEach((t) => {
			setTimeout(() => {
				mountedToasts.add(t.id)
				mountedToasts = new Set(mountedToasts)
			}, 10)
		})
	})

	// Watch for new toasts and trigger show animation
	$effect(() => {
		toasts.forEach((t) => {
			if (!mountedToasts.has(t.id)) {
				setTimeout(() => {
					mountedToasts.add(t.id)
					mountedToasts = new Set(mountedToasts)
				}, 10)
			}
		})
	})
</script>

{#each Object.entries(toastsByPosition) as [position, positionToasts]}
	{#if positionToasts.length > 0}
		<div id="toast-container-{position}" class="fluent-toast-container fluent-toast-container--{position}">
			{#each positionToasts as toastItem (toastItem.id)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<div
					id={toastItem.id}
					class="fluent-toast fluent-toast--{toastItem.variant}"
					class:fluent-toast--show={mountedToasts.has(toastItem.id)}
					role="alert"
					aria-live="polite"
					onclick={() => handleToastClick(toastItem.id)}
				>
					<div class="fluent-toast__icon">{icons[toastItem.variant] || "ℹ"}</div>
					<div class="fluent-toast__content">
						<div class="fluent-toast__title">{toastItem.title}</div>
						{#if toastItem.message}
							<div class="fluent-toast__message">{toastItem.message}</div>
						{/if}
					</div>
					<button
						class="fluent-toast__close"
						aria-label="Close"
						onclick={(e) => {
							e.stopPropagation()
							handleDismiss(toastItem.id)
						}}
					>
						✕
					</button>
					{#if toastItem.showProgress && !toastItem.persistent}
						<div
							class="fluent-toast__progress"
							style="animation-duration: {toastItem.duration}ms;"
						></div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
{/each}

<style>
	/* Styles are in src/assets/styles/components/_toast.scss */
</style>
