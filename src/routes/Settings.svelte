<script lang="ts" context="module">
    let dialog: HTMLDialogElement;

    function keyDown(e: KeyboardEvent) {
        if (e.key === 'Escape' && dialog.open) {
            e.preventDefault();
            closeSettings();
        }
    }

    export function openSettings() {
        dialog.showModal();
        window.addEventListener("keydown", keyDown);
    }

    export function closeSettings() {
        window.removeEventListener("keydown", keyDown);

        dialog.classList.add("closing");

        dialog.addEventListener('animationend', () => {
            dialog.classList.remove("closing");
            dialog.close();
        }, { once: true });
    }
</script>

<script lang="ts">
	import { browser } from "$app/environment";

	import { hand, theme } from "$lib/settings";
	import { onDestroy, onMount } from "svelte";
	import { fly } from "svelte/transition";
    
    let container: HTMLDivElement;
    let closing = false;

    type Tab = 'settings' | 'about';

    let tab: Tab = "settings";

    function dialogClick(e: MouseEvent) {
        const isInContainer = container.contains(e.target as Element);
        const isContainer = e.target === container;
        if (!(isContainer || isInContainer)) {
            closeSettings();
        }
    }

    onMount(openSettings);

    onDestroy(() => {
        if (browser) {
            window.removeEventListener("keydown", keyDown);
        }
    });


    function activate(tabName: Tab) {
        function run() {
            tab = tabName;
        }

        if (document.startViewTransition) {
            document.startViewTransition(() => run());
        } else {
            run();
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog 
    bind:this={dialog}
    on:click={dialogClick}
    class="dialog bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 rounded-lg
            max-w-[min(768px,calc(100%-2rem))] w-full h-full max-h-[min(500px,calc(100%-2rem))] overflow-hidden"
    class:closing
>
    <div bind:this={container} class="h-full flex">
        
        <aside class="py-2 bg-zinc-100 dark:bg-zinc-900 min-h-0 overflow-y-auto shrink-0 min-w-fit">
            <ul class="flex flex-col gap-2">
                <li>
                    <button 
                        class="px-4 p-2 relative w-full flex items-center gap-2"
                        class:active={tab === "settings"}
                        on:click={() => activate("settings")}
                    >
                        <iconify-icon icon="carbon:settings" class="text-2xl"></iconify-icon>
                        <span class="max-sm:sr-only sm:min-w-[100px] text-left">Settings</span>
                    </button>
                </li>
                <li>
                    <button 
                        class="px-4 p-2 relative w-full flex items-center gap-2"
                        class:active={tab === "about"}
                        on:click={() => activate("about")}
                    >
                        <iconify-icon icon="fluent:info-24-regular" class="text-2xl"></iconify-icon>
                        <span class="max-sm:sr-only sm:min-w-[100px] text-left">About</span>
                    </button>
                </li>
            </ul>
        </aside>

        <div class="flex flex-1 min-h-0 min-w-0 flex-col w-full">
            <header class="flex justify-between items-center p-2">
                <h2 class="text-2xl capitalize pl-2">{tab}</h2>
                <button 
                    type="button" 
                    on:click={closeSettings}
                    class="text-2xl hover:bg-zinc-200 dark:hover:bg-zinc-900 p-2 rounded flex items-center"
                >
                    <iconify-icon icon="ic:round-close"></iconify-icon>
                    <span class="sr-only">Close Site Menu</span>
                </button>
            </header>
            
            {#key tab}
                <div class="px-4 pt-2 pb-8 overflow-auto flex-1 h-full w-full min-w-0" in:fly={{x: 500}}>
                    {#if tab === "about"}
                        <p class="mb-4 text-zinc-600 dark:text-zinc-400">
                            Hacker News Progressive Web App powered by <a href="https://github.com/davideast/hnpwa-api" class="underline">David East's Hacker News PWA API</a>.
                        </p>
                        
                        <h3 class="text-xl mb-2">GitHub Repo</h3>
                        <div class="text-zinc-600 dark:text-zinc-400">
                            <a href="https://github.com/samstorment/sveltekit-hacker-news-pwa" class="flex items-center gap-2 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
                                <iconify-icon icon="mdi:github"></iconify-icon>
                                https://github.com/samstorment/sveltekit-hacker-news-pwa
                            </a>
                        </div>
                    {:else if tab === "settings"}
                        <h3 class="text-xl mb-2">Theme</h3>
                        <div class="flex flex-wrap gap-2 mb-4 text-zinc-600 dark:text-zinc-400">
                            <button 
                                class="px-3 py-1 border border-zinc-300 dark:border-zinc-700 rounded w-fit"
                                class:selected={$theme === "light"}
                                on:click={theme.setLight}
                            >
                                Light
                            </button>
                            <button 
                                class="px-3 py-1 border border-zinc-300 dark:border-zinc-700 rounded w-fit"
                                class:selected={$theme === "dark"}
                                on:click={theme.setDark}
                            >
                                Dark
                            </button>
                            <button 
                                class="px-3 py-1 border border-zinc-300 dark:border-zinc-700 rounded w-fit"
                                class:selected={$theme === "system"}
                                on:click={theme.setSystem}
                            >
                                System
                            </button>
                        </div>
                
                        <h3 class="text-xl mb-2">Hand Mode</h3>
                
                        <div class="flex flex-wrap gap-2 text-zinc-600 dark:text-zinc-400">
                            <button 
                                class="px-3 py-1 border border-zinc-300 dark:border-zinc-700 rounded w-fit"
                                class:selected={$hand === "lefty"}
                                on:click={() => $hand = "lefty"}
                            >
                                Lefty
                            </button>
                            <button 
                                class="px-3 py-1 border border-zinc-300 dark:border-zinc-700 rounded w-fit"
                                class:selected={$hand === "righty"}
                                on:click={() => $hand = "righty"}
                            >
                                Righty
                            </button>
                        </div>
                    {/if}
                </div>
            {/key}
        </div>
    </div>
</dialog>


<style lang="postcss">

    :global(body:has(.dialog[open])) {
        @apply overflow-hidden;
    }

    aside li:hover {
        @apply bg-zinc-200 dark:bg-zinc-800;
    }
    
    .active::after {
        @apply absolute block h-full w-[3px] right-0 top-0 bg-blue-500 dark:bg-white;
        view-transition-name: active-after;
        content: '';
    }

    .selected {
        @apply border-black dark:border-white text-zinc-900 dark:text-zinc-200;
    }

    .selected:focus-within {
        @apply outline-inherit;
    }

    dialog {
        transition: 
            background-color 0.35s ease, 
            border-color 0.35s ease,
            color 0.35s ease,
            outline-color .35s ease;
    }

    dialog::backdrop {
        @apply backdrop-blur-sm bg-black/70 fixed inset-0;
    }

    dialog[open] {
        animation-name: open-settings;
        animation-duration: 250ms;
        animation-timing-function: ease;
    }

    dialog.closing {
        animation-name: close-settings;
        animation-duration: 250ms;
        animation-timing-function: ease;
        pointer-events: none;
    }

    dialog[open]::backdrop {
        animation-name: open-backdrop;
        animation-duration: 250ms;
        animation-timing-function: ease;
    }

    dialog.closing::backdrop {
        animation-name: close-backdrop;
        animation-duration: 250ms;
        animation-timing-function: ease;
    }

    @keyframes open-settings {
        from {
            transform: translateY(110vh);
        }
    }

    @keyframes close-settings {
        to {
            transform: translateY(100vh);
        }
    }

    @keyframes open-backdrop {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    @keyframes close-backdrop {
        to {
            opacity: 0;
        }
    }
</style>