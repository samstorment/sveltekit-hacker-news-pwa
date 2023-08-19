<script>
	import { hand, theme } from "$lib/settings";
	import RadioButton from "./radio-button.svelte";

</script>


<div class="py-2 px-4">
    <h3 class="text-xl mb-2">Theme</h3>
    
    <div class="flex gap-2 max-sm:flex-col">
        <RadioButton name="theme" value="light" bind:group={$theme}>
            <iconify-icon icon="ph:sun" class="text-2xl"></iconify-icon>
            Light
        </RadioButton>
        <RadioButton name="theme" value="dark" bind:group={$theme}>
            <iconify-icon icon="tabler:moon-stars" class="text-2xl"></iconify-icon>
            Dark
        </RadioButton>
        <RadioButton name="theme" value="system" bind:group={$theme}>
            <iconify-icon icon="ph:monitor" class="text-2xl"></iconify-icon>
            System
        </RadioButton>
    </div>
</div>


<div class="py-2 px-4">
    <h3 class="text-xl mb-2">Hand Mode</h3>

    <div class="flex 2xs:flex-wrap gap-2 max-2xs:flex-col">
        <RadioButton name="hand" value="lefty" bind:group={$hand}>
            <iconify-icon icon="ion:hand-left-outline" class="text-2xl"></iconify-icon>
            Lefty
        </RadioButton>

        <RadioButton name="hand" value="righty" bind:group={$hand} class="2xs:flex-row-reverse">
            <iconify-icon icon="ion:hand-right-outline" class="text-2xl"></iconify-icon>
            Righty
        </RadioButton>
    </div>
</div>

