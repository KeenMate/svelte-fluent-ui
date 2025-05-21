<script lang="ts">
	import {fluentOption, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentOption()
	)

	type Props = {
		value: string;
		children: any;
		selected?: boolean;
		disabled?: boolean;
	}

	let {
		    value,
		    children,
		    selected = false,
		    disabled = false,
	    }: Props = $props()
</script>

<fluent-option {value} {selected} {disabled}>
	{@render children()}
</fluent-option>
