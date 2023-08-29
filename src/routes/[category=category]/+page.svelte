<script lang="ts">
	import { hand } from '$lib/settings.js';

    export let data;
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
                <article 
                    class="flex lefty:flex-row-reverse"
                    style="view-transition-name: article-title-{item.id};"
                >
                    <div 
                        class="px-4 my-4 flex-1 self-center min-w-0" 
                    >
                        <hgroup>
                            <h2 class="text-lg inline"> 
                                <a href="{item.url}">{item.title}</a>
                            </h2>
                            {#if item.domain}
                                <a href="https://news.ycombinator.com/from?site={item.domain}" class="text-zinc-600 dark:text-zinc-400 text-sm break-words">({item.domain})</a>
                            {/if}
                        </hgroup>

                 
                        <p class="text-zinc-600 dark:text-zinc-400">
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
</style>



