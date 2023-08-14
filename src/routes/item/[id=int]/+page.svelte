
<script lang="ts">
	import { onMount } from "svelte";
	import Comment from "./Comment.svelte";

    export let data;

    let comments: HTMLDivElement;

    onMount(() => {
        if (!comments) return;
        if (document.documentElement.style.contentVisibility === undefined) return;

        let topLevelComments = Array.from(comments.querySelectorAll(":scope > article")) as HTMLDivElement[];

        let observer = new IntersectionObserver((entries) => {
            // console.log("triggered");
            entries.forEach((entry) => {
                const { height } = entry.boundingClientRect;
                const ele = entry.target as HTMLDivElement;

                ele.style.containIntrinsicSize = `auto ${height}px`;
                
                if (entry.isIntersecting) {
                    // ele.style.outline = "5px solid green";
                    ele.style.contentVisibility = "visible";
                } else {
                    // ele.style.outline = "100px solid red";
                    ele.style.contentVisibility = "hidden";
                }
            });
        });

        topLevelComments.forEach(c => observer.observe(c));
    })

    $: url = data.item.url.startsWith("item") ? "" : data.item.url;
</script>

<div class="max-w-screen-md mx-auto">
    <article>
        <hgroup class="p-4 mb-4">
            <h1 class="text-3xl inline">
                <a href="{url}">{data.item.title}</a>
            </h1>
            
            {#if data.item.domain}
                <a href="https://news.ycombinator.com/from?site={data.item.domain}" class="text-zinc-600 dark:text-zinc-500">({data.item.domain})</a>
            {/if}

        </hgroup>

        <div class="px-4 py-2 mb-8 text-zinc-600 dark:text-zinc-500 border-y border-zinc-300 dark:border-zinc-700">
            {#if data.item.type !== "job"}
                <div class="flex flex-wrap gap-1 justify-between mb-1">
                    <p>{data.item.points} points by <a href="/user/{data.item.user}">{data.item.user}</a> {data.item.time_ago}</p>
                    <p><a href="/item/{data.item.id}">{data.item.comments_count} {data.item.comments_count === 1 ? "comment" : "comments"}</a></p>
                </div>
            {/if}
            <p>
                <a href="https://news.ycombinator.com/item?id={data.item.id}" class="flex items-center gap-1 w-fit">
                    <iconify-icon icon="cib:y-combinator" class="text-lg"></iconify-icon>
                    <span>View on Hacker News</span>
                </a>
            </p>
        </div>

        {#if data.item.content}
            <div 
                class="prose text-inherit prose-a:dark:text-zinc-500 prose-a:break-words prose-pre:dark:bg-zinc-950 max-w-full px-4 pb-8 border-zinc-300 dark:border-zinc-700"
                class:border-b-8={data.item.comments.length > 0}
                class:mb-8={data.item.comments.length > 0}
            >
                {@html data.item.content}
            </div>
        {/if}
    </article>

    {#if data.item.comments.length > 0}
        <div class="px-4" bind:this={comments}>
            {#each data.item.comments as comment, index}
                <Comment {comment} {index} group={data.item.comments} item={data} />
            {/each}
        </div>
    {/if}
</div>