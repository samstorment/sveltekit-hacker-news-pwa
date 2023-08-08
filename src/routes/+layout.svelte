<script lang="ts">
	import { page } from "$app/stores";
	import { onMount } from "svelte";
    import "../app.css";

    let dialog: HTMLDialogElement;

    let theme: string;

    onMount(() => {
        theme = localStorage.getItem("theme") ?? "system";
    });

    $: selected = $page.url.pathname.split('/')[1] || "top";
</script>

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

<dialog bind:this={dialog} class="bg-white text-black dark:bg-black dark:text-zinc-200 p-4 border border-zinc-300 dark:border-zinc-800 max-w-800 rounded">
    
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-3xl">Settings</h2>
        <button type="button" on:click={() => dialog.close()} class="text-3xl">&times;</button>
    </div>
    <h3 class="text-xl mb-2">Theme</h3>
    <div class="flex flex-wrap gap-2">
        <button 
            class="px-3 py-1 border border-zinc-300 dark:border-zinc-800 rounded flex-1"
            class:selected={theme === "light"}
            on:click={() => {
                theme = "light";
                localStorage.setItem("theme", "light");
                document.documentElement.classList.remove("dark");
            }}
        >
            Light
        </button>
        <button 
            class="px-3 py-1 border border-zinc-300 dark:border-zinc-800 rounded flex-1"
            class:selected={theme === "dark"}
            on:click={() => {
                theme = "dark";
                localStorage.setItem("theme", "dark");
                document.documentElement.classList.add("dark");
            }}
        >
            Dark
        </button>
        <button 
            class="px-3 py-1 border border-zinc-300 dark:border-zinc-800 rounded flex-1"
            class:selected={theme === "system"}
            on:click={() => {
                theme = "system";
                localStorage.removeItem("theme");
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                }
            }}
        >
            System
        </button>
    </div>
</dialog>

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

    dialog::backdrop {
        @apply backdrop-blur bg-black/50;
    }

    button.selected {
        @apply outline outline-black dark:outline-white;
    }
</style>