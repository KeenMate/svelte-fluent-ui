<script lang="ts">
	import {fluentListbox, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentListbox()
	)

	type Props = {

	}

	let {}: Props = $props()
</script>

<fluent-listbox>
	<!-- todo: finish Listbox -->
</fluent-listbox>

