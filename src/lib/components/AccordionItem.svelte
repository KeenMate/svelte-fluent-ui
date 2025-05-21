<script lang="ts">
	import {fluentAccordionItem, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentAccordionItem()
	)

	type Props = {

	}

	let {}: Props = $props()
</script>

<fluent-accordion-item>
	<!-- todo: finish AccordionItem -->
</fluent-accordion-item>

