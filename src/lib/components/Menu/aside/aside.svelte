<script lang="ts">
	import type { Tab } from "$lib/settings";
	import AsideButton from "./aside-button.svelte";

    let tabs: Array<{ tab: Tab, icon: string}> = [
        { tab: "settings", icon: "carbon:settings" },
        { tab: "about", icon: "fluent:info-24-regular" }
    ]
</script>


<aside class="overflow-auto sm:py-2 min-w-fit bg-zinc-200 dark:bg-zinc-900">
    <ul class="flex flex-col sm:gap-2">
        {#each tabs as t}
            <AsideButton {...t} />
        {/each}
    </ul>
</aside>