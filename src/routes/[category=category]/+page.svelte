<script lang="ts">
	import { afterNavigate, beforeNavigate, goto, onNavigate } from '$app/navigation';
	import { hand, showImagePreviews } from '$lib/settings.js';
	import { transition } from '$lib/stores.js';

    export let data;

    let viewTransitionTarget: string | undefined;

    $: showImages = $showImagePreviews && data.category !== "ask";

    beforeNavigate(({ from, to }) => {
        if (to?.route.id === "/item/[id=int]") {
            viewTransitionTarget = to.params?.id;
        } 
    });

    afterNavigate(async ({ from, to }) => {
        if (from?.route.id === "/item/[id=int]") {
            viewTransitionTarget = from.params?.id;

            $transition?.finished.finally(() => viewTransitionTarget = undefined);
        }
    });
</script>

<svelte:head>
    <title>{data.categoryLabel.charAt(0).toUpperCase() + data.categoryLabel.slice(1)} | Hacker News</title>
</svelte:head>

<div class="max-w-screen-md mx-auto">
    
    <h1 class="text-3xl p-4 sr-only">Page {data.page} of {data.categoryLabel}</h1>

    <ul>
        {#each data.items as item, i}
            <li 
                class="border-b border-zinc-300 dark:border-zinc-700 items-center last:border-none"
            >
                <article>
                    <div class="flex lefty:flex-row-reverse">
                        <div 
                            class="px-4 my-4 flex-1 min-w-0 self-center"
                            class:max-xs:mb-2={showImages}
                            class:article-title={item.id.toString() === viewTransitionTarget}
                        >
                            <hgroup>
                                <h2 class="inline"> 
                                    <a href="{item.url}">{item.title}</a>
                                </h2>
                                {#if item.domain}
                                    <a href="https://news.ycombinator.com/from?site={item.domain}" class="text-zinc-600 dark:text-zinc-400 text-sm break-words">({item.domain})</a>
                                {/if}
                            </hgroup>

                            <p 
                                class="text-zinc-600 dark:text-zinc-400"
                                class:max-xs:hidden={showImages}
                            >
                                <span>
                                    {#if item.points}
                                        {item.points} points 
                                    {/if}
                                    {#if item.user}
                                        by <a href="/user/{item.user}">{item.user}</a> 
                                    {/if}
                                    {item.time_ago}
                                    {#if item.type !== "job"}
                                        <span>|</span>
                                    {/if}
                                </span>
                                {#if item.type !== "job"}
                                    <a href="/item/{item.id}" class="inline-block">
                                        {item.comments_count} {item.comments_count === 1 ? "comment" : "comments"}
                                    </a>
                                {/if}
                            </p>

                        </div>

                    
                        {#if !showImages}
                            <div class="ml-auto flex flex-col md:hidden w-[56px] shrink-0">
                                <a 
                                    href="{item.url}" 
                                    class="flex-1 flex items-center justify-center text-2xl px-4 hover:bg-zinc-200 dark:hover:bg-zinc-900"
                                    class:rounded-bl-lg={$hand === "righty" && ((data.category !== "ask" && data.category !== "jobs") || i === data.items.length - 1)}
                                    class:rounded-tl-lg={$hand === "righty" && i === 0}
                                    class:rounded-br-lg={$hand === "lefty" && ((data.category !== "ask" && data.category !== "jobs") || i === data.items.length - 1)}
                                    class:rounded-tr-lg={$hand === "lefty" && i === 0}
                                >
                                    <iconify-icon icon="eva:diagonal-arrow-right-up-fill"></iconify-icon>
                                    <span class="sr-only">Open External Post Link</span>
                                </a>
                                {#if data.category !== "ask" && data.category !== "jobs"}
                                    <a 
                                        href="/item/{item.id}" 
                                        class="flex-1 flex items-center justify-center text-2xl px-4 hover:bg-zinc-200 dark:hover:bg-zinc-900"
                                        class:rounded-bl-lg={$hand === "righty" && i === data.items.length - 1}
                                        class:rounded-tl-lg={$hand === "righty"}
                                        class:rounded-br-lg={$hand === "lefty" && i === data.items.length - 1}
                                        class:rounded-tr-lg={$hand === "lefty"}
                                    >
                                        <iconify-icon icon="octicon:comment-24"></iconify-icon>
                                        <span class="sr-only">Open Post Comments</span>
                                    </a>
                                {/if}
                            </div>
                        {:else}
                            <a href={item.url} class="preview-image flex items-center justify-center self-start lefty:mr-0 lefty:ml-4 mr-4 my-4 max-xs:mb-2 w-[128px] h-[72px] max-sm:w-[100px] max-sm:h-[56px] hover:no-underline max-2xs:hidden">
                                {#await item.ogImage}
                                    <iconify-icon icon="line-md:loading-loop" class="text-2xl"></iconify-icon>
                                {:then src} 
                                    {#if src.url}
                                        <img 
                                            src={src.url} alt="Open External Post Link" 
                                            class="object-cover object-center rounded flex items-center justify-center 
                                                    max-h-full max-sm:max-w-[100px] w-full text-3xl shadow"
                                            on:error={() => src.url = undefined }
                                        />
                                    {:else}
                                        <div
                                            class="h-full w-full bg-zinc-200 dark:bg-zinc-900 rounded flex items-center justify-center text-4xl max-sm:text-3xl text-zinc-400"
                                        >
                                            <iconify-icon icon="eva:diagonal-arrow-right-up-fill"></iconify-icon>
                                            <span class="sr-only">Open External Post Link</span>
                                        </div>
                                    {/if}
                                {/await}
                            </a>
                        {/if}
                    </div>

                    {#if showImages}
                        <div 
                            class="flex gap-2 px-4 items-center pb-4 xs:hidden text-zinc-600 dark:text-zinc-400 text-sm lefty:flex-row-reverse lefty:justify-end"
                        >
                            {#if data.category !== "ask" && data.category !== "jobs"}
                                {#if item.points}
                                    <p class="overflow-hidden text-ellipsis whitespace-nowrap">{item.points} points</p>
                                {/if}
                                <p class="overflow-hidden text-ellipsis whitespace-nowrap">{item.time_ago}</p>
                                {#if item.user}
                                    <a href="/user/{item.user}" class="overflow-hidden text-ellipsis whitespace-nowrap">by {item.user}</a>
                                {/if}
                                <a href="/item/{item.id}" class="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-900 whitespace-nowrap max-xs:ml-auto lefty:max-xs:ml-0">
                                    <iconify-icon icon="octicon:comment-24" inline></iconify-icon> <span class="leading-none">{item.comments_count}</span> 
                                    <span class="sr-only">Open Post Comments</span>
                                </a>
                            {/if}
                        </div>
                    {/if}
                </article>

            </li>
        {/each}
    </ul>

    <div class="flex gap-4 p-4">
        {#if data.page > 1}
            <a 
                href="?p={data.page - 1}" 
                class="px-4 py-4 border border-zinc-300 dark:border-zinc-700 flex-1 rounded hover:no-underline hover:shadow dark:hover:border-white flex justify-between items-center"
            >
                <iconify-icon icon="ph:arrow-left-bold" class="text-2xl"></iconify-icon>
                <span>Previous</span>
            </a>
        {/if}
        {#if data.page < data.pageLimit}
            <a 
                href="?p={data.page + 1}" 
                class="px-4 py-4 border border-zinc-300 dark:border-zinc-700 flex-1 rounded text-right hover:no-underline hover:shadow dark:hover:border-white flex justify-between items-center"
                class:solo-link={data.page <= 1}
            >
                <span>Next</span>
                <iconify-icon icon="ph:arrow-right-bold" class="text-2xl"></iconify-icon>
            </a>
        {/if}
    </div>
</div>

<style lang="postcss">
    .solo-link {
        margin-left: auto;
    }

    .article-title {
        view-transition-name: article-title;
    }

    .preview-image {
        transition: width 300ms ease-in-out, height 300ms ease-in-out;
        transform-origin: right;
    }
</style>



