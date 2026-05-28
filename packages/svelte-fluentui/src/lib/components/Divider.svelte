<script lang="ts">
	import {fluentDivider, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentDivider()
	)

	type Props = {
		class?: string
		style?: string
	}

	let {class: className = "", style = ""}: Props = $props()
</script>

<!-- fluent-divider's shadow DOM borders itself with `--neutral-stroke-divider-rest`
     (#ebebeb in the default light theme), which sits one shade away from the
     page background and reads as invisible. Re-point the token at the heavier
     `--neutral-stroke-rest` so the line actually shows up. The variable is
     inherited into the shadow DOM, so setting it on the host suffices. -->
<fluent-divider class={className} style="--neutral-stroke-divider-rest: var(--neutral-stroke-rest); {style}"></fluent-divider>

