<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";
    import "../app.css";
	import Settings from "./Settings.svelte";
	import { afterNavigate, beforeNavigate } from "$app/navigation";
	import { fly } from "svelte/transition";
	import { hand } from "$lib/settings";

    let dialog: HTMLDialogElement;
    let header: HTMLElement;
    let navigating = false;
    let uppies = true;
    let scrollY = 0;

    $: selected = $page.url.pathname.split('/')[1] || "top";


    function handleScroll() {
        scrollY = window.scrollY;  
        
        window.addEventListener('scroll', (_) => {

            let change = window.scrollY - scrollY;
            scrollY = window.scrollY;

            const scrollHeight = document.documentElement.scrollHeight;
            const innerHeight = window.innerHeight;

            // if we are 64 pixels or closer to the bottom, show the nav
            const atBottom = scrollHeight - 64 <= scrollY + innerHeight;

            if (window.scrollY <= 16 || atBottom) return uppies = true;

            uppies = change <= 0;
        });
    }

    onMount(() => {
        handleScroll();

    });
</script>

<svelte:head>
    <title>Hacker News</title>
</svelte:head>

<header 
    class="sticky top-0 bg-white dark:bg-black slide z-10 slide"
    class:-translate-y-full={!uppies}
    bind:this={header}
>
    <nav class="p-2 flex items-center gap-4 max-w-screen-md mx-auto">
        <div class="flex items-center gap-4 flex-wrap p-2">
            <a href="/" class="hover:no-underline">HN</a>
            <a href="/top" class="relative nav-item" class:selected={selected === "top"}>Top</a>
            <a href="/new" class="relative nav-item" class:selected={selected === "new"}>New</a>
            <a href="/show" class="relative nav-item" class:selected={selected === "show"}>Show</a>
            <a href="/ask" class="relative nav-item" class:selected={selected === "ask"}>Ask</a>
            <a href="/jobs" class="relative nav-item" class:selected={selected === "jobs"}>Jobs</a>
        </div>
        <button on:click={() => dialog.showModal()} title="Settings" class="ml-auto text-2xl p-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 rounded aspect-square flex items-center">
            <iconify-icon icon="carbon:settings"></iconify-icon>
            <span class="sr-only">Open Settings</span>
        </button>
        <Settings bind:dialog />
    </nav>
</header>

{#if scrollY > 200}
    <button 
        type="button"
        class="fixed p-2 right-6 bottom-5 backdrop-blur border border-zinc-300 dark:border-zinc-700 rounded-full flex items-center z-10"
        class:right-6={$hand === "righty"}
        class:left-6={$hand === "lefty"}
        transition:fly={{ y: 100 }}
        on:click={() => window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })}
    >
        <span class="sr-only">Scroll to top of page</span>
        <iconify-icon icon="ion:chevron-up" class="text-2xl"></iconify-icon>
    </button>
{/if}

<div class="pb-16">
    <slot />
</div>


<style lang="postcss">
    .slide {
        transition: transform 300ms ease;
    }

    .nav-item {
        @apply no-underline;
    }

    .nav-item.selected::after {
        view-transition-name: nav-select-indicator;
    }

    .nav-item:hover::after,
    .nav-item.selected::after {
        content: '';
        @apply absolute h-[2px] w-full bg-blue-500 dark:bg-white left-0 -bottom-1;
    }
</style>