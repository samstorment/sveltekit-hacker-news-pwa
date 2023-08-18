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
        window.addEventListener("keydown", keyDown);
    }

    export function closeMenu() {
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
            closeMenu();
        }
    }

    // onMount(openMenu);

    onDestroy(() => {
        if (browser) {
            window.removeEventListener("keydown", keyDown);
        }
    });


    function activate(tabName: Tab) {
        function run() {
            tab = tabName;
        }

        // @ts-ignore
        if (document.startViewTransition) {
            // @ts-ignore
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
    class:closing
    class="dialog bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-200 
            border border-zinc-300 dark:border-zinc-700 rounded overflow-hidden
            w-full h-full max-w-[min(768px,calc(100%-2rem))] max-h-[min(500px,calc(100%-2rem))]"
>
    <div bind:this={container} class="h-full flex">
        <aside class="overflow-auto p-2 border-r min-w-fit">
            <p>TOP</p>
            <p>BOTTOM</p>
        </aside>
        <div class="flex-1 flex flex-col min-h-0 min-w-0">
            <header class="p-2">
                <h1>HEADING</h1>
            </header>
            <div class="p-2 overflow-auto">
                <p>TOP</p>
                <p class="whitespace-nowrap overflow-hidden text-ellipsis">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi nesciunt dolorum perspiciatis sunt deserunt soluta architecto corporis dicta repellendus, ullam eos incidunt itaque id. Unde qui natus optio a distinctio?
                Veritatis rem magni iste facilis nihil nobis provident doloribus amet possimus, ipsum officiis doloremque tempore! Dolores libero rem explicabo et commodi ratione architecto, corporis, adipisci recusandae similique eum eaque tempore.
                Eum, sed recusandae blanditiis incidunt atque, consequatur temporibus veniam quis reprehenderit porro dolorem repudiandae quam, dignissimos in fugiat! Amet rem harum ex adipisci ab maiores eos, perspiciatis repudiandae sapiente doloremque?
                Ex mollitia culpa saepe ratione recusandae quas qui, enim temporibus sed reiciendis! Unde dolores dignissimos est eos voluptates ut sunt nemo at neque modi, ducimus repudiandae accusamus quidem. Quisquam, dicta.
                Modi fugit consequuntur voluptates ipsum similique laboriosam qui, exercitationem reiciendis pariatur assumenda? Quis ullam eum, iste fuga ut consequatur id pariatur aliquid sequi placeat possimus porro maiores nisi, praesentium ad.
                Odit sunt voluptatem mollitia similique cumque vitae nobis et commodi esse voluptate officiis, sit deleniti, asperiores, magnam enim suscipit debitis recusandae in? Tenetur, nemo mollitia nisi vitae dignissimos exercitationem repellendus.
                Molestias hic voluptas quibusdam iste perspiciatis voluptate commodi, quod deleniti enim excepturi facilis laudantium eligendi nulla eos cum deserunt sed id, quaerat reiciendis repellat ipsum possimus fugit. Nam, quidem ipsa?
                Quis tenetur explicabo molestiae earum voluptates beatae exercitationem enim magnam unde recusandae amet nisi incidunt, fuga tempore odio cumque distinctio quibusdam, in illo labore. Fuga, ex sapiente! Voluptatum, voluptatem labore.
                Tempore enim quam unde, voluptatum porro omnis provident sed, totam quasi similique, atque nam sit! Culpa ab, est reprehenderit facere tempora atque officia at sit libero excepturi repudiandae aliquid delectus.
                Maxime officia quasi corrupti quia voluptatum a vitae esse cumque. Alias optio nihil voluptatem quis laudantium nisi molestias, consectetur atque neque ad vel porro illum error eaque? Neque, voluptas repudiandae.</p>
                <p>BOTTOM</p>
            </div>
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