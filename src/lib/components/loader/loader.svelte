<script lang="ts">
	import { afterNavigate, beforeNavigate } from "$app/navigation";
	import { navigating } from "$app/stores";
	import { onDestroy, onMount, tick } from "svelte";
	import { fade } from "svelte/transition";

    let loader: HTMLDivElement;

    let timeout: number | undefined;
    let progress = 0;

    let loading = false;
    let finishing = false;
    let leaving = false;
    let hidden = true;

    beforeNavigate(() => {
        hidden = false;
        timeout = setTimeout(() => {
            loading = true;
            progress = 50;
        }, 100);
    });

    afterNavigate(({ type }) => {

        clearTimeout(timeout);

        console.log(type);

        if (!loading) {
            hidden = true;
            return;
        };

        loading = false;
        finishing = true;

        progress = 100;

        loader.addEventListener('transitionend', () => {
            finishing = false;
            leaving = true;

            loader.addEventListener('transitionend', () => {
                leaving = false;
                hidden = true;
                progress = 0;
            }, { once: true });


        }, { once: true });
    });
</script>


<div 
    bind:this={loader}
    transition:fade
    class:loading
    class:finishing
    class:leaving
    class:hidden
    class="loader fixed top-0 left-0 h-[2px] bg-blue-500 z-50"
    style="width: {progress}%"
>
</div>


<style>
    div {
        transition: width linear, opacity ease-in-out;
    }
    
    .loading {
        transition-duration: 5000ms;
    }

    .finishing {
        transition-duration: 250ms;
    }

    .leaving {
        opacity: 0;
        transition-duration: 200ms;
    }
</style>