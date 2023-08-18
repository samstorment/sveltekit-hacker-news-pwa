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
	import { onDestroy } from "svelte";
    
    let container: HTMLDivElement;
    let closing = false;

    function dialogClick(e: MouseEvent) {
        const isInContainer = container.contains(e.target as Element);
        const isContainer = e.target === container;
        if (!(isContainer || isInContainer)) {
            closeSettings();
        }
    }

    onDestroy(() => {
        if (browser) {
            window.removeEventListener("keydown", keyDown);
        }
    });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog 
    bind:this={dialog}
    on:click={dialogClick}
    class="dialog bg-white text-zinc-900 dark:bg-black dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 rounded 
            max-w-[min(768px,calc(100%-2rem))] w-full"
    class:closing
>
    <div 
        bind:this={container}
        class="p-4 w-800px"
    >
        <header class="flex justify-between items-center pb-4 mb-4 border-b border-zinc-300 dark:border-zinc-700">
            <h2 class="text-3xl">Settings</h2>
            <button 
                type="button" 
                on:click={closeSettings}
                class="text-2xl hover:bg-zinc-200 dark:hover:bg-zinc-900 p-2 rounded flex items-center"
            >
                <iconify-icon icon="ic:round-close"></iconify-icon>
                <span class="sr-only">Close Settings Modal</span>
            </button>
        </header>

        <h3 class="text-xl mb-2">Theme</h3>
        <div class="flex flex-wrap gap-2 mb-4 pb-4 border-b border-zinc-300 dark:border-zinc-700">
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

        <div class="flex flex-wrap gap-2">
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
    </div>
</dialog>


<style lang="postcss">

    /* :global(body:has(.dialog[open])) {
        @apply overflow-hidden;
    } */

    .selected {
        @apply outline outline-2 outline-black dark:outline-white;
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