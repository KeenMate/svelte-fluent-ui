<script lang="ts">
	import {fluentAccordion, fluentAccordionItem, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentAccordion(),
		fluentAccordionItem()
	)

	type Props = {

	}

	let {}: Props = $props()
</script>

<fluent-accordion>
	<!-- todo: finish Accordion -->
</fluent-accordion>

