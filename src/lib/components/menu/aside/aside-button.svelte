<script lang="ts">
	import { activeTab, type Tab } from "$lib/settings";
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";

    export let tab: Tab;
    export let icon: string;
    export let text: string = tab;

    let dialog = getContext<Writable<HTMLDialogElement>>('dialog');

    function activate(tabName: Tab) {
        $activeTab = tabName;
        // function run() {
        //     $activeTab = tabName;
        // }
        // // @ts-ignore
        // if ($dialog.startViewTransition) {
        //     // @ts-ignore
        //     $dialog.startViewTransition(() => run());
        // } else {
        //     run();
        // }
    }
</script>


<button 
    class="p-4 sm:py-2 relative w-full flex items-center gap-2"
    class:active={$activeTab === tab}
    on:click={() => activate(tab)}
>
    <slot name="icon" />
    <iconify-icon {icon} class="text-2xl"></iconify-icon>
    <span class="max-sm:sr-only sm:min-w-[100px] text-left capitalize">{text}</span>
</button>


<style lang="postcss">
    button:hover {
        @apply bg-zinc-100 dark:bg-zinc-800;
    }
    
    .active::after {
        @apply absolute block h-full w-[3px] right-0 top-0 bg-blue-500 dark:bg-zinc-200;
        view-transition-name: active-after;
        content: '';
    }
</style>