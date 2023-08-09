<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";
    import "../app.css";
	import Settings from "./Settings.svelte";

    let dialog: HTMLDialogElement;

    $: selected = $page.url.pathname.split('/')[1] || "top";
</script>

<svelte:head>
    <title>Hacker News</title>
</svelte:head>

<header>
    <nav class="p-2 flex items-center gap-4 max-w-screen-md mx-auto">
        <a href="/" class="hover:no-underline ml-2">HN</a>
        <a href="/top" class="relative nav-item" class:selected={selected === "top"}>Top</a>
        <a href="/new" class="relative nav-item" class:selected={selected === "new"}>New</a>
        <a href="/show" class="relative nav-item" class:selected={selected === "show"}>Show</a>
        <a href="/ask" class="relative nav-item" class:selected={selected === "ask"}>Ask</a>
        <a href="/jobs" class="relative nav-item" class:selected={selected === "jobs"}>Jobs</a>
        <button on:click={() => dialog.showModal()} title="Settings" class="ml-auto text-2xl p-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 rounded aspect-square flex items-center">
            <iconify-icon icon="carbon:settings"></iconify-icon>
        </button>
    </nav>
</header>

<Settings bind:dialog />

<slot />


<style lang="postcss">
    .nav-item {
        @apply no-underline;
    }


    .nav-item:hover::after,
    .nav-item.selected::after {
        content: '';
        @apply absolute h-[2px] w-full bg-blue-500 dark:bg-white left-0 -bottom-1;
    }
</style>