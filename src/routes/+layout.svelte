<script lang="ts">
	import { navigating, page } from "$app/stores";
	import { onDestroy, onMount } from "svelte";
    import "../app.css";
	import { fly } from "svelte/transition";
	import { hand } from "$lib/settings";
	import { navState, scrollY } from "$lib/stores";
	import Menu, { openMenu } from "$lib/components/menu/menu.svelte";
	import { beforeNavigate, onNavigate } from "$app/navigation";
	import Loader from "$lib/components/loader/loader.svelte";

    let uppies = true;
    let scrollTimeout = 0;

    $: selected = $page.url.pathname.split('/')[1] || "top";
    
    $: if ($page.url.hash) {
        $navState = 'visible';
        setTimeout(() => $navState = 'auto', 100);
    }

    onNavigate(() => {
        // @ts-ignore
        if (document.startViewTransition) {
            return new Promise(res => {
                // @ts-ignore
                document.startViewTransition(() => new Promise(res));
            });
        }
    });
    
    beforeNavigate(({ willUnload, to }) => {

        if (willUnload) return;
        if (!to?.route.id) return;

        // always hide the nav on navigate
        // handleScroll below will cause the nav to be shown anyway if we're at the top of the page
        // this is great for back/forward without jarring nav animations
        $navState = "hidden";
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => $navState = 'auto', 100);
    });


    function handleScroll() {
        $scrollY = window.scrollY;
        
        window.addEventListener('scroll', (_) => {
            let change = window.scrollY - $scrollY;
            $scrollY = window.scrollY;

            const scrollHeight = document.documentElement.scrollHeight;
            const innerHeight = window.innerHeight;

            // if we are 64 pixels or closer to the bottom, show the nav
            const atBottom = scrollHeight - 64 <= $scrollY + innerHeight;

            if (window.scrollY <= 16 || atBottom) return uppies = true;

            // return nav state to auto 100ms after last scroll
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => $navState = 'auto', 100);

            if ($navState === 'visible') return uppies = true;
            if ($navState === 'hidden') return uppies = false;

            uppies = change <= 0;
        });
    }

    onMount(() => {
        $navState = 'auto';
        handleScroll();
    });
</script>


<Loader />
<header 
    class="sticky top-0 bg-white dark:bg-zinc-950 slide z-10 slide"
    class:-translate-y-full={!uppies}
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
            <iconify-icon icon="lucide:menu"></iconify-icon>
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
        <iconify-icon icon="ion:chevron-up" class="text-2xl"></iconify-icon>
    </button>
{/if}


<style lang="postcss">
    header {
        view-transition-name: main-header;
    }

    .slide {
        transition: transform 300ms ease;
    }

    .nav-item {
        @apply no-underline;
    }

    .nav-item {
        animation-duration: 10ms;
    }

    .nav-item.selected::after {
        view-transition-name: nav-selected;
    }
    
    .nav-item:hover::after,
    .nav-item.selected::after {
        content: '';
        @apply absolute h-[2px] w-full bg-blue-500 dark:bg-white left-0 -bottom-1;
    }
</style>