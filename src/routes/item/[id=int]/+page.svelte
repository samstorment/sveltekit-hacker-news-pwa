
<script lang="ts">
	import Comment from "./Comment.svelte";

    export let data;
</script>

<div class="max-w-screen-md mx-auto">
    <article>
        <hgroup class="p-4 mb-4">
            <h1 class="text-3xl inline">
                <a href="{data.url}">{data.title}</a>
            </h1>
            
            {#if data.domain}
                <a href="https://news.ycombinator.com/from?site={data.domain}" class="text-zinc-500">({data.domain})</a>
            {/if}

        </hgroup>

        <div class="px-4 py-2 mb-8 text-zinc-500 border-y border-zinc-300 dark:border-zinc-800">
            <div class="flex flex-wrap gap-1 justify-between mb-1">
                <p>{data.points} points by <a href="/user/{data.user}">{data.user}</a> {data.time_ago}</p>
                <p><a href="/item/{data.id}">{data.comments_count} {data.comments_count === 1 ? "comment" : "comments"}</a></p>
            </div>
            <p>
                <a href="https://news.ycombinator.com/item?id={data.id}" class="flex items-center gap-1 w-fit">
                    <iconify-icon icon="cib:y-combinator" class="text-lg"></iconify-icon>
                    <span>View on Hacker News</span>
                </a>
            </p>
        </div>

        {#if data.content}
            <div class="prose text-inherit prose-a:text-zinc-500 max-w-full mb-8 px-4 pb-8 border-b-8 border-zinc-300 dark:border-zinc-800">
                {@html data.content}
            </div>
        {/if}
    </article>

    <div class="px-4">
        {#each data.comments as comment, index}
            <Comment {comment} {index} group={data.comments} item={data} />
        {/each}
    </div>
</div>