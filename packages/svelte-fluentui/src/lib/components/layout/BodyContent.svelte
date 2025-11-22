<script lang="ts">
	import type {SlotType} from "../../types/index.js"

	type Props = {
		children?: SlotType
	}

	let {
		children = undefined
	    }: Props = $props()
</script>

<div class="body-content">
	{@render children?.()}
</div>

<style lang="scss">
	.body-content {
		margin: 0;
		align-items: flex-start;
		width: 100%;
		font-family: var(--body-font);
		font-weight: normal;
		font-size: var(--type-ramp-base-font-size);
		line-height: var(--type-ramp-base-line-height);
	}
</style>
