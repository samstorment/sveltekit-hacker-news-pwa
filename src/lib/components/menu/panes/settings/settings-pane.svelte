<script>
	import { hand, showImagePreviews, theme, highlightLastPost } from "$lib/settings";
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


<div class="py-2 px-4">
    <h3 class="text-xl mb-2">Feed</h3>

    <div class="grid gap-2">
        <label 
            class="flex-1 text-zinc-600 dark:text-zinc-400 flex justify-between items-center border border-zinc-300 dark:border-zinc-700 cursor-pointer px-3 py-2 rounded"
            class:selected={$showImagePreviews}
        >
            <span>Show Preview Images</span>
            <input type="checkbox" class="w-4 h-4" bind:checked={$showImagePreviews}>
        </label>
    
        <label 
            class="flex-1 text-zinc-600 dark:text-zinc-400 flex justify-between items-center border border-zinc-300 dark:border-zinc-700 cursor-pointer px-3 py-2 rounded"
            class:selected={$highlightLastPost}
        >
            <span>Highlight Last Visited Post</span>
            <input type="checkbox" class="w-4 h-4" bind:checked={$highlightLastPost}>
        </label>
    </div>
</div>

<style lang="postcss">
    label:has(input:focus-visible) {
        @apply outline border-inherit outline-offset-2 outline-blue-500 ring-blue-500;
    }

    .selected {
        @apply outline outline-2 outline-blue-500 dark:outline-white
            border-blue-500 dark:border-inherit
            text-zinc-900 dark:text-zinc-200;
    }
</style>