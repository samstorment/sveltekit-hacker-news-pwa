<script>

	import { activeTab, settings } from "$lib/settings";
	import { fly } from "svelte/transition";
	import { closeMenu } from "./menu.svelte";
	import SettingsPane from "./panes/settings/settings-pane.svelte";
	import AboutPane from "./panes/about-pane.svelte";
</script>

<div class="flex-1 flex flex-col min-h-0 min-w-0 bg-white dark:bg-zinc-950">
    <header class="p-2 flex justify-between items-center">
        <h2 class="text-2xl capitalize pl-2">{$activeTab}</h2>
        <button 
            type="button" 
            on:click={closeMenu}
            class="text-2xl hover:bg-zinc-200 dark:hover:bg-zinc-900 p-2 rounded flex items-center"
        >
            <iconify-icon icon="ic:round-close"></iconify-icon>
            <span class="sr-only">Close Site Menu</span>
        </button>
    </header>
    {#key $activeTab}
        <div class="overflow-auto" in:fly={{x: 50}}>
            {#if $activeTab === "settings"}
                <SettingsPane />
            {:else if $activeTab === "about"}
                <AboutPane />
            {/if}
        </div>
    {/key}
</div>