<script lang="ts">
	import { activeTab, type Tab } from "$lib/settings";

    export let tab: Tab;
    export let text: string = tab;

    function activate(tabName: Tab) {
        $activeTab = tabName;
    }
</script>


<button 
    class="p-4 sm:py-2 relative w-full flex items-center gap-2 hover:bg-zinc-100 hover:dark:bg-zinc-800 
    after:bg-blue-500 after:dark:bg-zinc-200"
    class:active={$activeTab === tab}
    on:click={() => activate(tab)}
>
    <slot name="icon"></slot>
    <span class="max-sm:sr-only sm:min-w-[100px] text-left capitalize">{text}</span>
</button>

<style>
    .active::after {
        position: absolute;
        display: block;
        height: 100%;
        width: 3px;
        right: 0;
        top: 0;
    }
</style>