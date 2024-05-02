<script lang="ts" context="module">

    let dialog: HTMLDialogElement;

    function keyDown(e: KeyboardEvent) {
        if (e.key === 'Escape' && dialog.open) {
            e.preventDefault();
            closeMenu();
        }
    }

    export function openMenu() {
        dialog.showModal();
        document.documentElement.classList.add("overflow-hidden");
        window.addEventListener("keydown", keyDown);
    }

    export function closeMenu() {
        if (!dialog.open || dialog.classList.contains("closing")) return;

        document.documentElement.classList.remove("overflow-hidden");
        dialog.classList.add("closing");
        
        dialog.addEventListener('animationend', () => {
            dialog.classList.remove("closing");
            dialog.close();
            // last to prevent Escape spam bug
            window.removeEventListener("keydown", keyDown);
        }, { once: true });
    }
</script>

<script lang="ts">
	import { browser } from "$app/environment";

	import { onDestroy, onMount, setContext } from "svelte";
	import MenuAside from "./aside/aside.svelte";
	import MenuMain from "./menu-main.svelte";
	import { writable } from "svelte/store";
    
    let container: HTMLDivElement;
    let closing = false;

    let dialogReference = writable(dialog);
    setContext('dialog', dialogReference);

    function dialogClick(e: MouseEvent) {
        const isInContainer = container.contains(e.target as Element);
        const isContainer = e.target === container;
        if (!(isContainer || isInContainer)) {
            closeMenu();
        }
    }

    onMount(() => {
        $dialogReference = dialog;
    });

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
    class:closing
    class="dialog text-zinc-900 bg-transparent dark:text-zinc-200 border border-transparent dark:border-zinc-700 rounded-lg overflow-hidden w-full h-full"
>
    <div bind:this={container} class="h-full flex">
        <MenuAside />
        <MenuMain />
    </div>
</dialog>

<style lang="postcss">

    :global(body:has(.dialog[open])) {
        @apply overflow-hidden;
    }

    dialog {
        z-index: 9999999;
        max-width: min(768px, calc(100% - 2rem)); 
        max-height: min(500px, calc(100% - 2rem));
    }

    dialog {
        transition: 
            background-color 0.35s ease, 
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

    @media (max-width: 640px) {
        dialog {
            @apply rounded-t-xl rounded-b-none dark:shadow-md dark:shadow-zinc-200;
            max-width: 100%;
            max-height: min(600px, calc(100% - 4rem));
            margin-top: auto;
            margin-bottom: 0;
            border: none;
        }
    }
</style>
