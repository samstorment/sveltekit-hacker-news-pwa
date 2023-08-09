<script lang="ts">
	import { onMount } from "svelte";

    export let dialog: HTMLDialogElement;

    let theme: string;
    let open: boolean;

    let closing = false;


    onMount(() => {
        theme = localStorage.getItem("theme") ?? "system";
        // dialog.showModal();

        

        const observer = new MutationObserver((mutations, observer) => {
            for (const mut of mutations) {
                if (mut.type === "attributes" && mut.attributeName === "open") {
                    console.log(`${mut.attributeName} changed`, dialog.open);

                    if (dialog.open) {
                        document.body.classList.add("overflow-hidden");

                        window.addEventListener("keydown", function handler(event) {
                            if (event.key === 'Escape'){
                                event.preventDefault();
                                closeDialog();
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

    function setLight() {
        theme = "light";
        localStorage.setItem("theme", "light");
        document.documentElement.classList.remove("dark");
    }

    function setDark() {
        theme = "dark";
        localStorage.setItem("theme", "dark");
        document.documentElement.classList.add("dark");
    }

    function setSystem() {
        theme = "system";
        localStorage.removeItem("theme");
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }

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
    class="dialog bg-transparent"
    class:closing
>
    <div
        class="bg-white text-black dark:bg-black dark:text-zinc-200 p-4 border border-zinc-300 dark:border-zinc-800 rounded"
    >
        <aside>
            <ul>
                <li>

                </li>
            </ul>
        </aside>

        <div class="flex justify-between items-center pb-4 mb-4 border-b border-zinc-300 dark:border-zinc-700">
            <h2 class="text-3xl">Settings</h2>
            <button type="button" on:click={closeDialog} class="text-2xl">
                <iconify-icon icon="ic:round-close"></iconify-icon>
            </button>
        </div>

        <h3 class="text-xl mb-2">Theme</h3>
        <div class="flex flex-wrap gap-2">
            <button 
                class="px-3 py-1 border border-zinc-300 dark:border-zinc-800 rounded flex-1"
                class:selected={theme === "light"}
                on:click={setLight}
            >
                Light
            </button>
            <button 
                class="px-3 py-1 border border-zinc-300 dark:border-zinc-800 rounded flex-1"
                class:selected={theme === "dark"}
                on:click={setDark}
            >
                Dark
            </button>
            <button 
                class="px-3 py-1 border border-zinc-300 dark:border-zinc-800 rounded flex-1"
                class:selected={theme === "system"}
                on:click={setSystem}
            >
                System
            </button>
        </div>
    </div>
</dialog>


<style lang="postcss">

    button.selected {
        @apply outline outline-black dark:outline-white;
    }

    :global(body:has(.dialog[open])) {
        @apply overflow-hidden;
    }

    dialog::backdrop {
        @apply bg-black/70 fixed inset-0;
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