<script lang="ts">

	import type {SlotType} from "../../types/index.js"

	type Props = {
		children?: SlotType
		[prop: string]: any
	}

	let {
		    children = undefined,
		    ...restProps
	    }: Props = $props()
</script>

<footer
	{...restProps}
	style="height: 50px; {restProps?.style || ''}"
	class="footer {restProps?.class || ''}"
>
	<div class="header-gutters">
		{@render children?.()}
	</div>
</footer>
