<script lang="ts">
	import {fluentAccordion, fluentAccordionItem, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentAccordion(),
		fluentAccordionItem()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-accordion>
	<!-- todo: finish Accordion -->
</fluent-accordion>

