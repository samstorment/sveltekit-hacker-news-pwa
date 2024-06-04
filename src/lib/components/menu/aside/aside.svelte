<script lang="ts">
    import { Info, Settings } from "lucide-svelte";
	import AsideButton from "./aside-button.svelte";

</script>


<aside class="overflow-auto sm:py-2 min-w-fit bg-zinc-200 dark:bg-zinc-900">
    <ul class="flex flex-col sm:gap-2">
        <AsideButton tab="settings">
            <Settings slot="icon" />
        </AsideButton>

        <AsideButton tab="about">
            <Info slot="icon" />
        </AsideButton>
    </ul>
</aside>