<script lang="ts">
	import { activeTab, type Tab } from "$lib/settings";

    export let tab: Tab;
    export let icon: string;
    export let text: string = tab;

    function activate(tabName: Tab) {
        $activeTab = tabName;
    }
</script>


<button 
    class="p-4 sm:py-2 relative w-full flex items-center gap-2 hover:bg-zinc-100 hover:dark:bg-zinc-800"
    class:active={$activeTab === tab}
    on:click={() => activate(tab)}
>
    <slot name="icon" />
    <iconify-icon {icon} class="text-2xl"></iconify-icon>
    <span class="max-sm:sr-only sm:min-w-[100px] text-left capitalize">{text}</span>
</button>