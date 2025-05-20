<script lang="ts">
	import {fluentListbox, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentListbox()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-listbox>
	<!-- todo: finish Listbox -->
</fluent-listbox>

