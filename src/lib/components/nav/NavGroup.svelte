<script lang="ts">
	import type {SlotType} from "../../types/index.js"
	import NavItem from "./NavItem.svelte"
	import NavLink from "$lib/components/nav/NavLink.svelte"
	import ExpandIcon from "$lib/components/icons/ExpandIcon.svelte"

	type Props = {
		expanded?: boolean
		disabled?: boolean
		linkIcon?: SlotType
		linkText?: SlotType
		children?: SlotType
		[prop: string]: any
	}

	let {
		    expanded = $bindable(),
		    disabled = undefined,
		    linkIcon = undefined,
		    linkText = undefined,
		    children = undefined,
		    ...restProps
	    }: Props = $props()

	const navItemClass = $derived([
		expanded && "expanded",
		restProps.class
	].filter(x => x)
		.join(" "))

	// todo: ability to persist expanded state

	function onNavLinkClicked(ev: MouseEvent) {
		expanded = !expanded
	}
</script>

<NavItem
	group
	{disabled}
	{...restProps}
	class={navItemClass}
>
	<NavLink class="notactive" onClick={onNavLinkClicked}>
		{#snippet icon()}
			{@render linkIcon?.()}
		{/snippet}

		{@render linkText?.()}

		{#snippet afterText()}
			<div
				aria-hidden="true"
				class="expand-collapse-button"
				class:rotate={expanded}
				tabindex="-1"
			>
				<ExpandIcon />
			</div>
		{/snippet}
	</NavLink>

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


<!--<div id="f57d0b841" class="fluent-nav-item expanded fluent-nav-group" role="menuitem">-->
<!--	<div class="fluent-nav-link notactive" tabindex="0">-->
<!--		<div class="positioning-region" title="Item 6 Item 6 Item 6 Item 6 Item 6">-->
<!--			<div class="content-region">&lt;!&ndash;!&ndash;&gt;-->
<!--				<div class="fluent-nav-text">Item 6 Item 6 Item 6 Item 6 Item 6&lt;!&ndash;!&ndash;&gt;-->
<!--				</div>&lt;!&ndash;!&ndash;&gt;-->
<!--				<div aria-hidden="true" class="rotate expand-collapse-button" tabindex="-1">&lt;!&ndash;!&ndash;&gt;</div>-->
<!--			</div>-->
<!--		</div>-->
<!--	</div>&lt;!&ndash;!&ndash;&gt;-->
<!--	<div role="group" class="fluent-collapsible-region-container items" style="height: {expanded ? 'auto' : '0'};">&lt;!&ndash;!&ndash;&gt;-->
<!--		<div-->
<!--			id="f3d3e4a79"-->
<!--			class="fluent-nav-menu"-->
<!--			style="width: 100%;"-->
<!--			aria-label="Navigation menu"-->
<!--			role="menu"-->
<!--			aria-expanded=""-->
<!--			b-kk64vrpquy=""-->
<!--			_bl_116=""-->
<!--		>&lt;!&ndash;!&ndash;&gt;&lt;!&ndash;!&ndash;&gt;-->
<!--			<div class="fluent-nav-item" role="menuitem">-->
<!--				<div class="positioning-region">-->
<!--					<div class="content-region">-->
<!--						<div class="fluent-nav-link">&lt;!&ndash;!&ndash;&gt;-->
<!--							<div class="fluent-nav-text ">Item 6.1</div>-->
<!--						</div>-->
<!--					</div>-->
<!--				</div>-->
<!--			</div>&lt;!&ndash;!&ndash;&gt;-->
<!--			&lt;!&ndash;!&ndash;&gt;-->
<!--			<div class="fluent-nav-item" role="menuitem">-->
<!--				<div class="positioning-region">-->
<!--					<div class="content-region">-->
<!--						<div class="fluent-nav-link">&lt;!&ndash;!&ndash;&gt;-->
<!--							<div class="fluent-nav-text ">Item 6.2</div>-->
<!--						</div>-->
<!--					</div>-->
<!--				</div>-->
<!--			</div>&lt;!&ndash;!&ndash;&gt;-->
<!--			&lt;!&ndash;!&ndash;&gt;&lt;!&ndash;!&ndash;&gt;&lt;!&ndash;!&ndash;&gt;-->
<!--			<div id="f50cde551" class="fluent-nav-item expanded fluent-nav-group" role="menuitem" _bl_121="">-->
<!--				<div class="fluent-nav-link notactive" tabindex="0">-->
<!--					<div class="positioning-region" title="Item 6.3">-->
<!--						<div class="content-region">&lt;!&ndash;!&ndash;&gt;-->
<!--							<div class="fluent-nav-text">Item 6.3&lt;!&ndash;!&ndash;&gt;-->
<!--							</div>&lt;!&ndash;!&ndash;&gt;-->
<!--							<div aria-hidden="true" class="rotate expand-collapse-button" tabindex="-1">&lt;!&ndash;!&ndash;&gt;</div>-->
<!--						</div>-->
<!--					</div>-->
<!--				</div>&lt;!&ndash;!&ndash;&gt;-->
<!--				<div role="group" class="fluent-collapsible-region-container items" style="height: auto;">-->
<!--					&lt;!&ndash;!&ndash;&gt;-->
<!--					<div-->
<!--						id="f31e6b63e"-->
<!--						class="fluent-nav-menu"-->
<!--						style="width: 100%;"-->
<!--						aria-label="Navigation menu"-->
<!--						role="menu"-->
<!--						aria-expanded=""-->
<!--						b-kk64vrpquy=""-->
<!--						_bl_124=""-->
<!--					>&lt;!&ndash;!&ndash;&gt;&lt;!&ndash;!&ndash;&gt;-->
<!--						<div class="fluent-nav-item" role="menuitem">-->
<!--							<div class="positioning-region">-->
<!--								<div class="content-region">-->
<!--									<div class="fluent-nav-link">&lt;!&ndash;!&ndash;&gt;-->
<!--										<div class="fluent-nav-text ">Item 6.3.1 Item 6.3.1 Item 6.3.1</div>-->
<!--									</div>-->
<!--								</div>-->
<!--							</div>-->
<!--						</div>&lt;!&ndash;!&ndash;&gt;-->
<!--						&lt;!&ndash;!&ndash;&gt;-->
<!--						<div class="fluent-nav-item" role="menuitem">-->
<!--							<div class="positioning-region">-->
<!--								<div class="content-region">-->
<!--									<div class="fluent-nav-link">&lt;!&ndash;!&ndash;&gt;-->
<!--										<div class="fluent-nav-text ">Item 6.3.2</div>-->
<!--									</div>-->
<!--								</div>-->
<!--							</div>-->
<!--						</div>&lt;!&ndash;!&ndash;&gt;-->
<!--						&lt;!&ndash;!&ndash;&gt;&lt;!&ndash;!&ndash;&gt;&lt;!&ndash;!&ndash;&gt;-->
<!--						<div-->
<!--							id="f4b2c0c5e"-->
<!--							class="fluent-nav-item expanded fluent-nav-group"-->
<!--							role="menuitem"-->
<!--							_bl_127=""-->
<!--						>-->
<!--							<div class="fluent-nav-link notactive" tabindex="0">-->
<!--								<div class="positioning-region" title="Item 6.3.3 Item 6.3.3 Item 6.3.3">-->
<!--									<div class="content-region">&lt;!&ndash;!&ndash;&gt;-->
<!--										<div class="fluent-nav-text">Item 6.3.3 Item 6.3.3 Item 6.3.3&lt;!&ndash;!&ndash;&gt;-->
<!--										</div>&lt;!&ndash;!&ndash;&gt;-->
<!--										<div aria-hidden="true" class="rotate expand-collapse-button" tabindex="-1">-->
<!--											&lt;!&ndash;!&ndash;&gt;</div>-->
<!--									</div>-->
<!--								</div>-->
<!--							</div>&lt;!&ndash;!&ndash;&gt;-->
<!--							<div role="group" class="fluent-collapsible-region-container items" style="height: auto;">-->
<!--								&lt;!&ndash;!&ndash;&gt;-->
<!--								<div-->
<!--									id="fccdcdf2"-->
<!--									class="fluent-nav-menu"-->
<!--									style="width: 100%;"-->
<!--									aria-label="Navigation menu"-->
<!--									role="menu"-->
<!--									aria-expanded=""-->
<!--									b-kk64vrpquy=""-->
<!--									_bl_128=""-->
<!--								>&lt;!&ndash;!&ndash;&gt;&lt;!&ndash;!&ndash;&gt;-->
<!--									<div class="fluent-nav-item" role="menuitem">-->
<!--										<div class="positioning-region">-->
<!--											<div class="content-region">-->
<!--												<div class="fluent-nav-link">&lt;!&ndash;!&ndash;&gt;-->
<!--													<div class="fluent-nav-text ">Item 6.3.3.1</div>-->
<!--												</div>-->
<!--											</div>-->
<!--										</div>-->
<!--									</div>&lt;!&ndash;!&ndash;&gt;-->
<!--									&lt;!&ndash;!&ndash;&gt;-->
<!--									<div class="fluent-nav-item" disabled="" role="menuitem">-->
<!--										<div class="positioning-region">-->
<!--											<div class="content-region">-->
<!--												<div class="disabled fluent-nav-link">&lt;!&ndash;!&ndash;&gt;-->
<!--													<div class="fluent-nav-text disabled">Item 6.3.3.2</div>-->
<!--												</div>-->
<!--											</div>-->
<!--										</div>-->
<!--									</div>&lt;!&ndash;!&ndash;&gt;-->
<!--									&lt;!&ndash;!&ndash;&gt;&lt;!&ndash;!&ndash;&gt;&lt;!&ndash;!&ndash;&gt;-->
<!--									<div-->
<!--										id="f661f4077"-->
<!--										class="fluent-nav-item expanded disabled fluent-nav-group"-->
<!--										disabled=""-->
<!--										role="menuitem"-->
<!--										_bl_129=""-->
<!--									>-->
<!--										<div class="fluent-nav-link notactive" tabindex="-1">-->
<!--											<div class="positioning-region" title="Item 6.3.3.3">-->
<!--												<div class="content-region">&lt;!&ndash;!&ndash;&gt;-->
<!--													<div class="fluent-nav-text">Item 6.3.3.3&lt;!&ndash;!&ndash;&gt;-->
<!--													</div>&lt;!&ndash;!&ndash;&gt;-->
<!--													<div aria-hidden="true" class="rotate expand-collapse-button" tabindex="-1">-->
<!--														&lt;!&ndash;!&ndash;&gt;</div>-->
<!--												</div>-->
<!--											</div>-->
<!--										</div>&lt;!&ndash;!&ndash;&gt;-->
<!--										<div-->
<!--											role="group"-->
<!--											class="fluent-collapsible-region-container items"-->
<!--											style="height: auto;"-->
<!--										>&lt;!&ndash;!&ndash;&gt;-->
<!--											<div-->
<!--												id="f3440a178"-->
<!--												class="fluent-nav-menu"-->
<!--												style="width: 100%;"-->
<!--												aria-label="Navigation menu"-->
<!--												role="menu"-->
<!--												aria-expanded=""-->
<!--												b-kk64vrpquy=""-->
<!--												_bl_130=""-->
<!--											>&lt;!&ndash;!&ndash;&gt;&lt;!&ndash;!&ndash;&gt;-->
<!--												<div class="fluent-nav-item" role="menuitem">-->
<!--													<div class="positioning-region">-->
<!--														<div class="content-region">-->
<!--															<div class="fluent-nav-link">&lt;!&ndash;!&ndash;&gt;-->
<!--																<div class="fluent-nav-text ">Item 6.3.3.3.1</div>-->
<!--															</div>-->
<!--														</div>-->
<!--													</div>-->
<!--												</div>&lt;!&ndash;!&ndash;&gt;-->
<!--												&lt;!&ndash;!&ndash;&gt;-->
<!--												<div class="fluent-nav-item" role="menuitem">-->
<!--													<div class="positioning-region">-->
<!--														<div class="content-region">-->
<!--															<div class="fluent-nav-link">&lt;!&ndash;!&ndash;&gt;-->
<!--																<div class="fluent-nav-text ">Item 6.3.3.3.2</div>-->
<!--															</div>-->
<!--														</div>-->
<!--													</div>-->
<!--												</div>-->
<!--											</div>-->
<!--										</div>-->
<!--									</div>-->
<!--								</div>-->
<!--							</div>-->
<!--						</div>-->
<!--					</div>-->
<!--				</div>-->
<!--			</div>-->
<!--		</div>-->
<!--	</div>-->
<!--</div>-->
