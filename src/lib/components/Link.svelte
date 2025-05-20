<script lang="ts">
	import "@fluentui/web-components/link.js"
	import type {SlotType} from "../fluent-ui/types.js"

	interface IProps {
		href?: string
		hreflang?: string
		referrerpolicy?: string
		rel?: string
		type?: string
		target?: string
		inline?: boolean
		appearance?: string
		children?: SlotType
	}

	let {
		    href           = undefined,
		    hreflang       = undefined,
		    referrerpolicy = undefined,
		    rel            = undefined,
		    type           = undefined,
		    target         = undefined,
		    inline         = undefined,
		    appearance     = undefined,
		    children       = undefined
	    }: IProps = $props()
</script>

<fluent-link
	{href}
	{hreflang}
	{referrerpolicy}
	{rel}
	{type}
	{target}
	{inline}
	{appearance}
>
	{@render children?.()}
</fluent-link>

