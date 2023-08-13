<script lang="ts">
	import { hand, settings, theme } from "$lib/settings";
	import { onMount } from "svelte";

    export let dialog: HTMLDialogElement;

    let closing = false;

    onMount(() => {
        // theme = localStorage.getItem("theme") ?? "system";
        // dialog.showModal();

        const observer = new MutationObserver((mutations, observer) => {
            for (const mut of mutations) {
                if (mut.type === "attributes" && mut.attributeName === "open") {
                    if (dialog.open) {
                        document.body.classList.add("overflow-hidden");

                        window.addEventListener("keydown", function handler(event) {
                            if (event.key === 'Escape') {

                                if (dialog.open) {
                                    event.preventDefault();
                                    closeDialog();
                                }

                                window.removeEventListener("keydown", handler);
                            }
                        });
                    } else {
                        document.body.classList.remove("overflow-hidden");
                    }
                }
            }
        });

        observer.observe(dialog, { attributes: true });
    });

    function closeDialog() {
        
        closing = true;

        dialog.addEventListener('animationend', () => {
            closing = false;
            dialog.close();
        }, { once: true });
    }

</script>

<dialog 
    bind:this={dialog} 
    class="dialog z-50 p-4 bg-white text-black dark:bg-black dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 rounded"
    class:closing
>
    <header class="flex justify-between items-center pb-4 mb-4 border-b border-zinc-300 dark:border-zinc-700">
        <h2 class="text-3xl">Settings</h2>
        <button 
            type="button" 
            on:click={closeDialog} 
            class="text-2xl hover:bg-zinc-200 dark:hover:bg-zinc-900 aspect-square p-2 rounded"
        >
            <iconify-icon icon="ic:round-close"></iconify-icon>
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

    <div class="flex flex-wrap gap-2 mb-4">
        <button 
            class="px-3 py-1 border border-zinc-300 dark:border-zinc-700 rounded w-fit"
            class:selected={$hand === "lefty"}
            on:click={hand.setLefty}
        >
            Lefty
        </button>
        <button 
            class="px-3 py-1 border border-zinc-300 dark:border-zinc-700 rounded w-fit"
            class:selected={$hand === "righty"}
            on:click={hand.setRighty}
        >
            Righty
        </button>
    </div>

</dialog>


<style lang="postcss">

    .selected {
        @apply outline outline-2 outline-black dark:outline-white;
    }

    :global(body:has(.dialog[open])) {
        @apply overflow-hidden;
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