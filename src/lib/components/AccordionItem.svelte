<script lang="ts">
	import {fluentAccordionItem, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentAccordionItem()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-accordion-item>
	<!-- todo: finish AccordionItem -->
</fluent-accordion-item>

