<script lang="ts">
	import {page} from "$app/stores"

	type Props = {
		title: string
		description: string
		keywords?: string
	}

	let {title, description, keywords}: Props = $props()

	const siteUrl = "https://svelte-fluentui.keenmate.dev"
	const fullTitle = $derived(`${title} · Svelte FluentUI`)
	const canonical = $derived(`${siteUrl}${$page.url.pathname}`)
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Svelte FluentUI" />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
</svelte:head>
