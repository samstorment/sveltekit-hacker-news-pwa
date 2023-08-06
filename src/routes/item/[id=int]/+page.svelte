
<script lang="ts">
	import Comment from "./Comment.svelte";

    export let data;
</script>

<div class="max-w-screen-md mx-auto">
    <article>
        <hgroup class="p-4">
            <h1 class="text-3xl mb-2 inline">{data.title}</h1>

            {#if data.domain}
                <a href="https://news.ycombinator.com/from?site={data.domain}" class="text-zinc-500">({data.domain})</a>
            {/if}
        </hgroup>

        <div class="p-4 mb-4 text-zinc-500 py-4 flex flex-wrap gap-2 justify-between border-y border-zinc-300 dark:border-zinc-900">
            <p>{data.points} points by <a href="/users/{data.user}">{data.user}</a> {data.time_ago}</p>
            <p><a href="/item/{data.id}">{data.comments_count} {data.comments_count === 1 ? "comment" : "comments"}</a></p>
        </div>

        {#if data.content}
            <div class="prose text-inherit prose-a:text-zinc-500 max-w-full mb-4 px-4 pb-4 border-b-8 border-zinc-300 dark:border-zinc-900">
                {@html data.content}
            </div>
        {/if}
    </article>

    <div class="px-4">
        {#each data.comments as comment}
            <Comment {comment} />
        {/each}
    </div>
</div>