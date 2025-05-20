<script lang="ts">
	import "@fluentui/web-components/drawer.js"
	import type {Drawer, DrawerPosition, DrawerSize, DrawerType} from "@fluentui/web-components"
	import {onMount} from "svelte"
	import type {SlotType} from "../fluent-ui/types.js"

	interface IProps {
		children?: SlotType
		type?: DrawerType
		size?: DrawerSize
		position?: DrawerPosition
		show?: VoidFunction
		hide?: VoidFunction
		clickHandler?: (ev: Event) => void
		emitToggle?: VoidFunction
		emitBeforeToggle?: VoidFunction
		onToggle?: (ev: CustomEvent<{oldState: "open" | "closed", newState: "open" | "closed"}>) => void
		onBeforeToggle?: (ev: CustomEvent<{oldState: "open" | "closed", newState: "open" | "closed"}>) => void
	}

	let {
    children = undefined,
    type = undefined,
    size = undefined,
    position = undefined,
    show = $bindable(undefined),
    hide = $bindable(undefined),
    clickHandler = $bindable(undefined),
    emitToggle = $bindable(undefined),
    emitBeforeToggle = $bindable(undefined),
    onToggle = undefined,
    onBeforeToggle = undefined,
	}: IProps = $props()

	let element: Drawer | undefined = $state()

	onMount(() => {
		if (element) {
			show = element.show
			hide = element.hide
			clickHandler = element.clickHandler
			emitToggle = element.emitToggle
			emitBeforeToggle = element.emitBeforeToggle
		}
	})
</script>

<fluent-drawer
	bind:this={element}
	{type}
	{position}
	{size}
	ontoggle={onToggle}
	onbeforetoggle={onBeforeToggle}
>
	<!-- todo: finish Drawer -->
	{@render children?.()}
</fluent-drawer>

