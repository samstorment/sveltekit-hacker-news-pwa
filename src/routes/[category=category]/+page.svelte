<script lang="ts">
	import { goto } from '$app/navigation';

    export let data;

    let hand: "left" | "right" = "right"; 
</script>


<div class="max-w-screen-md mx-auto">
    
    <h1 class="p-4 text-3xl sr-only">Page {data.page} of {data.category}</h1>

    <ul>
        {#each data.items as item, i}
            <li 
                class="border-b border-zinc-300 dark:border-zinc-800 items-center last:border-none"
            >
                <article 
                    class="flex"
                    class:flex-row-reverse={hand === "left"}
                >
                    <div class="px-4 my-4 flex-1 self-center">
                        <hgroup>
                            <h2 class="text-lg inline"> 
                                <a href="{item.url}">{item.title}</a>
                            </h2>
                            {#if item.domain}
                                <a href="https://news.ycombinator.com/from?site={item.domain}" class="text-zinc-500 text-sm">({item.domain})</a>
                            {/if}
                        </hgroup>

                        <p class="text-zinc-500 flex flex-wrap">
                            <span>{item.points} points by <a href="/users/{item.user}">{item.user}</a> {item.time_ago}<span class="mx-1">|</span></span>
                            <a href="/item/{item.id}">{item.comments_count} {item.comments_count === 1 ? "comment" : "comments"}</a>
                        </p>
                    </div>

                    <div class="ml-auto flex flex-col md:hidden">
                        <a 
                            href="{item.url}" 
                            class="flex-1 flex items-center justify-center text-2xl px-3 hover:bg-zinc-950"
                            class:rounded-bl-lg={hand === "right" && (data.category !== "ask" || i === data.items.length - 1)}
                            class:rounded-tl-lg={hand === "right" && i === 0}
                            class:rounded-br-lg={hand === "left" && (data.category !== "ask" || i === data.items.length - 1)}
                            class:rounded-tr-lg={hand === "left" && i === 0}
                        >
                            <iconify-icon icon="eva:diagonal-arrow-right-up-fill"></iconify-icon>
                        </a>
                        {#if data.category !== "ask"}
                            <a 
                                href="/item/{item.id}" 
                                class="flex-1 flex items-center justify-center text-2xl px-3 hover:bg-zinc-950"
                                class:rounded-bl-lg={hand === "right" && i === data.items.length - 1}
                                class:rounded-tl-lg={hand === "right"}
                                class:rounded-br-lg={hand === "left" && i === data.items.length - 1}
                                class:rounded-tr-lg={hand === "left"}


                            >
                                
                                <iconify-icon icon="octicon:comment-24"></iconify-icon>
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
                class="px-4 py-4 border border-zinc-300 dark:border-zinc-800 flex-1 rounded hover:no-underline hover:shadow dark:hover:border-white flex justify-between items-center"
            >
                <iconify-icon icon="ph:arrow-left-bold" class="text-2xl"></iconify-icon>
                <span>Previous</span>
            </a>
        {/if}
            {#if data.page < data.pageLimit}
            <a 
                href="?p={data.page + 1}" 
                class="px-4 py-4 border border-zinc-300 dark:border-zinc-800 flex-1 rounded text-right hover:no-underline hover:shadow dark:hover:border-white flex justify-between items-center"
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



