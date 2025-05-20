<script lang="ts">
	import {fluentSlider, provideFluentDesignSystem} from "@fluentui/web-components"

	provideFluentDesignSystem().register(
		fluentSlider()
	)

	interface IProps {

	}

	let {}: IProps = $props()
</script>

<fluent-slider>
	<!-- todo: finish Slider -->
</fluent-slider>

