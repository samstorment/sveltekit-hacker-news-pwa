
<script lang="ts">
	import Comment from "./Comment.svelte";

    export let data;

    $: url = data.url.startsWith("item") ? "" : data.url; 
</script>

<div class="max-w-screen-md mx-auto">
    <article>
        <hgroup class="p-4 mb-4">
            <h1 class="text-3xl inline">
                <a href="{url}">{data.title}</a>
            </h1>
            
            {#if data.domain}
                <a href="https://news.ycombinator.com/from?site={data.domain}" class="text-zinc-600 dark:text-zinc-500">({data.domain})</a>
            {/if}

        </hgroup>

        <div class="px-4 py-2 mb-8 text-zinc-600 dark:text-zinc-500 border-y border-zinc-300 dark:border-zinc-700">
            {#if data.type !== "job"}
                <div class="flex flex-wrap gap-1 justify-between mb-1">
                    <p>{data.points} points by <a href="/user/{data.user}">{data.user}</a> {data.time_ago}</p>
                    <p><a href="/item/{data.id}">{data.comments_count} {data.comments_count === 1 ? "comment" : "comments"}</a></p>
                </div>
            {/if}
            <p>
                <a href="https://news.ycombinator.com/item?id={data.id}" class="flex items-center gap-1 w-fit">
                    <iconify-icon icon="cib:y-combinator" class="text-lg"></iconify-icon>
                    <span>View on Hacker News</span>
                </a>
            </p>
        </div>

        {#if data.content}
            <div 
                class="prose text-inherit prose-a:dark:text-zinc-500 prose-a:break-words prose-pre:dark:bg-zinc-950 max-w-full px-4 pb-8 border-zinc-300 dark:border-zinc-700"
                class:border-b-8={data.comments.length > 0}
                class:mb-8={data.comments.length > 0}
            >
                {@html data.content}
            </div>
        {/if}
    </article>

    {#if data.comments.length > 0}
        <div class="px-4">
            {#each data.comments as comment, index}
                <Comment {comment} {index} group={data.comments} item={data} />
            {/each}
        </div>
    {/if}
</div>