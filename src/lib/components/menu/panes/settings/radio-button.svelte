<script lang="ts">
	import { CircleCheck } from "lucide-svelte";
import { fly } from "svelte/transition";

    export let group: string | number;
    export let value: string;
    export let name: string;

    let className: string | undefined = undefined;
    export { className as class};

    $: selected = group === value;
</script>


<label 
    class="px-3 py-2 overflow-hidden min-w-fit cursor-pointer border border-zinc-300 dark:border-zinc-700 
        rounded w-full flex items-center justify-between gap-2 flex-1 text-zinc-600 dark:text-zinc-400 {className}"
    class:selected
>
    <div class="flex items-center gap-2 {className}">
        <slot />
    </div>
    
    {#if selected}
        <span in:fly={{y: -25}}>
            <CircleCheck />
        </span>
    {/if}

    <input
        class="sr-only"
        type="radio"
        {name}
        {value}
        bind:group={group}
        on:click
    >
</label>


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