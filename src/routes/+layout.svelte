<script lang="ts">
	import { page } from "$app/stores";
    import "../app.css";
	import { fly, scale, slide } from "svelte/transition";
	import { hand } from "$lib/settings";
	import { scrollY } from "$lib/stores";
	import Menu, { openMenu } from "$lib/components/menu/menu.svelte";
	import { onMount } from "svelte";
	import { clamp, run } from "$lib/util";
    import { Menu as Burger, ChevronUp } from 'lucide-svelte';

    $: selected = $page.url.pathname.split('/')[1] || "top";

    function handleScroll() {
        $scrollY = window.scrollY;
    }

    onMount(() => {
        $scrollY = window.scrollY;
        window.addEventListener('scroll', handleScroll);
    });

</script>


<header 
    class="bg-white dark:bg-zinc-950 slide"
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
        <button on:click={openMenu} title="Site Menu" class="ml-auto text-2xl p-2 hover:bg-zinc-200 dark:hover:bg-zinc-900 rounded aspect-square flex items-center">
            <Burger />
            <span class="sr-only">Open Site Menu</span>
        </button>
        <Menu />
    </nav>
</header>

<div class="pb-16">
    <slot />
</div>

{#if $scrollY > 200}
    <button 
        type="button"
        class="fixed p-3 right-6 bottom-5 backdrop-blur shadow bg-white/50 dark:bg-black/50 border border-zinc-300 dark:border-zinc-700 rounded-full flex items-center z-10"
        class:right-6={$hand === "righty"}
        class:left-6={$hand === "lefty"}
        transition:fly={{ y: 100 }}
        on:click={() => window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })}
    >
        <span class="sr-only">Scroll to top of page</span>
        <ChevronUp />
    </button>
{/if}


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