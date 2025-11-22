<script lang="ts">
	type Props = {
		width?: string | number
	}

	let {
		    width    = undefined
	    }: Props = $props()

	let widthCssVar = $derived(width && `${width}px`)
</script>

<div
	class="spacer"
	class:auto-width={!width}
	style:--spacer-width={widthCssVar}
></div>

<style lang="scss">
	.spacer {
		width: var(--spacer-width);

		&.auto-width {
			flex: 1;
			width: auto;
		}
	}
</style>
