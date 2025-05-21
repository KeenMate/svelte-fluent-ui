<script lang="ts">
	import {fluentSlider, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentSlider()
	)

	type Props = {

	}

	let {}: Props = $props()
</script>

<fluent-slider>
	<!-- todo: finish Slider -->
</fluent-slider>

