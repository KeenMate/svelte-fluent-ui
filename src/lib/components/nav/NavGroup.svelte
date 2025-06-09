<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import NavItem from "./NavItem.svelte"
	import type {NavGroupSvelteContext} from "../../fluent-ui/types/nav-group.js"
	import {setContext} from "svelte"

	type Props = {
		expanded?: boolean
		linkText?: SlotType
		children?: SlotType
		[prop: string]: any
	}

	let {
		expanded = $bindable(),
		    linkText = undefined,
		    children = undefined,
		...restProps
	    }: Props = $props()

	setContext<NavGroupSvelteContext>("nav-group", true)

	// todo: ability to persist expanded state
</script>

<NavItem group {...restProps}>
	<div class="fluent-nav-link notactive">
		<div class="positioning-region" title="Item 6 Item 6 Item 6 Item 6 Item 6">
			<div class="content-region"><!--!-->
				<div class="fluent-nav-text">
					{@render linkText?.()}
				</div>
				<div aria-hidden="true" class="rotate expand-collapse-button" tabindex="-1"></div>
			</div>
		</div>
	</div>
	<div role="group" class="fluent-collapsible-region-container items" style="height: auto;">
		<div
			class="fluent-nav-menu"
			style="width: 100%;"
			role="menu"
			aria-expanded=""
		>
			{@render children?.()}
		</div>
	</div>
</NavItem>


<div id="f57d0b841" class="fluent-nav-item expanded fluent-nav-group" role="menuitem">
	<div class="fluent-nav-link notactive" tabindex="0">
		<div class="positioning-region" title="Item 6 Item 6 Item 6 Item 6 Item 6">
			<div class="content-region"><!--!-->
				<div class="fluent-nav-text">Item 6 Item 6 Item 6 Item 6 Item 6<!--!-->
				</div><!--!-->
				<div aria-hidden="true" class="rotate expand-collapse-button" tabindex="-1"><!--!--></div>
			</div>
		</div>
	</div><!--!-->
	<div role="group" class="fluent-collapsible-region-container items" style="height: {expanded ? 'auto' : '0'};"><!--!-->
		<div
			id="f3d3e4a79"
			class="fluent-nav-menu"
			style="width: 100%;"
			aria-label="Navigation menu"
			role="menu"
			aria-expanded=""
			b-kk64vrpquy=""
			_bl_116=""
		><!--!--><!--!-->
			<div class="fluent-nav-item" role="menuitem">
				<div class="positioning-region">
					<div class="content-region">
						<div class="fluent-nav-link"><!--!-->
							<div class="fluent-nav-text ">Item 6.1</div>
						</div>
					</div>
				</div>
			</div><!--!-->
			<!--!-->
			<div class="fluent-nav-item" role="menuitem">
				<div class="positioning-region">
					<div class="content-region">
						<div class="fluent-nav-link"><!--!-->
							<div class="fluent-nav-text ">Item 6.2</div>
						</div>
					</div>
				</div>
			</div><!--!-->
			<!--!--><!--!--><!--!-->
			<div id="f50cde551" class="fluent-nav-item expanded fluent-nav-group" role="menuitem" _bl_121="">
				<div class="fluent-nav-link notactive" tabindex="0">
					<div class="positioning-region" title="Item 6.3">
						<div class="content-region"><!--!-->
							<div class="fluent-nav-text">Item 6.3<!--!-->
							</div><!--!-->
							<div aria-hidden="true" class="rotate expand-collapse-button" tabindex="-1"><!--!--></div>
						</div>
					</div>
				</div><!--!-->
				<div role="group" class="fluent-collapsible-region-container items" style="height: auto;">
					<!--!-->
					<div
						id="f31e6b63e"
						class="fluent-nav-menu"
						style="width: 100%;"
						aria-label="Navigation menu"
						role="menu"
						aria-expanded=""
						b-kk64vrpquy=""
						_bl_124=""
					><!--!--><!--!-->
						<div class="fluent-nav-item" role="menuitem">
							<div class="positioning-region">
								<div class="content-region">
									<div class="fluent-nav-link"><!--!-->
										<div class="fluent-nav-text ">Item 6.3.1 Item 6.3.1 Item 6.3.1</div>
									</div>
								</div>
							</div>
						</div><!--!-->
						<!--!-->
						<div class="fluent-nav-item" role="menuitem">
							<div class="positioning-region">
								<div class="content-region">
									<div class="fluent-nav-link"><!--!-->
										<div class="fluent-nav-text ">Item 6.3.2</div>
									</div>
								</div>
							</div>
						</div><!--!-->
						<!--!--><!--!--><!--!-->
						<div
							id="f4b2c0c5e"
							class="fluent-nav-item expanded fluent-nav-group"
							role="menuitem"
							_bl_127=""
						>
							<div class="fluent-nav-link notactive" tabindex="0">
								<div class="positioning-region" title="Item 6.3.3 Item 6.3.3 Item 6.3.3">
									<div class="content-region"><!--!-->
										<div class="fluent-nav-text">Item 6.3.3 Item 6.3.3 Item 6.3.3<!--!-->
										</div><!--!-->
										<div aria-hidden="true" class="rotate expand-collapse-button" tabindex="-1">
											<!--!--></div>
									</div>
								</div>
							</div><!--!-->
							<div role="group" class="fluent-collapsible-region-container items" style="height: auto;">
								<!--!-->
								<div
									id="fccdcdf2"
									class="fluent-nav-menu"
									style="width: 100%;"
									aria-label="Navigation menu"
									role="menu"
									aria-expanded=""
									b-kk64vrpquy=""
									_bl_128=""
								><!--!--><!--!-->
									<div class="fluent-nav-item" role="menuitem">
										<div class="positioning-region">
											<div class="content-region">
												<div class="fluent-nav-link"><!--!-->
													<div class="fluent-nav-text ">Item 6.3.3.1</div>
												</div>
											</div>
										</div>
									</div><!--!-->
									<!--!-->
									<div class="fluent-nav-item" disabled="" role="menuitem">
										<div class="positioning-region">
											<div class="content-region">
												<div class="disabled fluent-nav-link"><!--!-->
													<div class="fluent-nav-text disabled">Item 6.3.3.2</div>
												</div>
											</div>
										</div>
									</div><!--!-->
									<!--!--><!--!--><!--!-->
									<div
										id="f661f4077"
										class="fluent-nav-item expanded disabled fluent-nav-group"
										disabled=""
										role="menuitem"
										_bl_129=""
									>
										<div class="fluent-nav-link notactive" tabindex="-1">
											<div class="positioning-region" title="Item 6.3.3.3">
												<div class="content-region"><!--!-->
													<div class="fluent-nav-text">Item 6.3.3.3<!--!-->
													</div><!--!-->
													<div aria-hidden="true" class="rotate expand-collapse-button" tabindex="-1">
														<!--!--></div>
												</div>
											</div>
										</div><!--!-->
										<div
											role="group"
											class="fluent-collapsible-region-container items"
											style="height: auto;"
										><!--!-->
											<div
												id="f3440a178"
												class="fluent-nav-menu"
												style="width: 100%;"
												aria-label="Navigation menu"
												role="menu"
												aria-expanded=""
												b-kk64vrpquy=""
												_bl_130=""
											><!--!--><!--!-->
												<div class="fluent-nav-item" role="menuitem">
													<div class="positioning-region">
														<div class="content-region">
															<div class="fluent-nav-link"><!--!-->
																<div class="fluent-nav-text ">Item 6.3.3.3.1</div>
															</div>
														</div>
													</div>
												</div><!--!-->
												<!--!-->
												<div class="fluent-nav-item" role="menuitem">
													<div class="positioning-region">
														<div class="content-region">
															<div class="fluent-nav-link"><!--!-->
																<div class="fluent-nav-text ">Item 6.3.3.3.2</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
