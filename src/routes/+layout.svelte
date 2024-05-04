<script lang="ts">
	import { page } from "$app/stores";
    import "../app.css";
	import { fly } from "svelte/transition";
	import { hand } from "$lib/settings";
	import { scrollY } from "$lib/stores";
	import Menu, { openMenu } from "$lib/components/menu/menu.svelte";
	import { onMount, onDestroy, tick } from "svelte";
	import { clamp, run } from "$lib/util";

    $: selected = $page.url.pathname.split('/')[1] || "top";

    let transY = 0;
    let ending = false;
    let header: HTMLElement;

    let NAV_HEIGHT = 56;


    function handleScroll() {
        $scrollY = window.scrollY;
    }

    function touchStart(start: TouchEvent) {

        // console.log('start');

        window.addEventListener('touchmove', touchMove);
        window.addEventListener('touchend', touchEnd, { once: true });

        let changeStart = 0;
        let changePrev = 0;
        let prev = start.touches[0].clientY;

        function touchMove(move: TouchEvent) {

            // console.log('move');

            changePrev = move.touches[0].clientY - prev;
            changeStart = move.touches[0].clientY - start.touches[0].clientY;
            
            let newTransY = run(() => {
                const aboveStart = changeStart < 0;
                const movingTowardsStart = changePrev > 0;
                const navFullyHidden = transY === -NAV_HEIGHT;
                const scrolledBeyondNavHeight = window.scrollY > NAV_HEIGHT;

                if (aboveStart && movingTowardsStart && navFullyHidden && scrolledBeyondNavHeight) return transY;
                return transY + changePrev
            });


            transY = clamp(newTransY, -NAV_HEIGHT, 0);

            prev = move.touches[0].clientY;
        }

        async function touchEnd(end: TouchEvent) {

            // console.log('end');
            
            ending = true;
            
            if (transY < -(NAV_HEIGHT / 2)) transY = -NAV_HEIGHT;
            else transY = 0;

            if (window.scrollY <= NAV_HEIGHT) {
                transY = 0;
            }

            header.addEventListener('transitionend', e => ending = false);

            window.removeEventListener('touchmove', touchMove);
        }

    }
        
    onMount(() => {
        $scrollY = window.scrollY;
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('touchstart', touchStart);
    });

</script>


<header 
    class="sticky top-0 bg-white dark:bg-zinc-950 z-50 slide"
    style="--translate: {transY}px"
    class:ending
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
    .slide {
        translate: 0 var(--translate);
    }

    .ending {
        transition: translate 300ms ease-out;
    }

    .nav-item {
        @apply no-underline;
    }

    .nav-item:hover::after,
    .nav-item.selected::after {
        content: '';
        @apply absolute h-[2px] w-full bg-blue-500 dark:bg-white left-0 -bottom-1;
    }
</style>