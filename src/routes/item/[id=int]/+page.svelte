
<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import Comment from "./Comment.svelte";
	import Error from "../../+error.svelte";
	import { navState, scrollY } from "$lib/stores";
	import { fly } from "svelte/transition";
    import '../.././../prose.css';
	import { hand } from "$lib/settings";
	import { page } from "$app/stores";

    export let data;

    let comments: HTMLDivElement;
    let observer: IntersectionObserver;
    let intersecting = new Set<HTMLDivElement>();
    let curr: Element | undefined = undefined;

    $: next = curr?.nextElementSibling;

    $: if (intersecting.size === 1) {
        curr = intersecting.values().next().value;
    } else {
        curr = undefined;
    }

    onMount(() => {
        if (!comments) return;
        let topLevelComments = Array.from(comments.querySelectorAll(":scope > article")) as HTMLDivElement[];

        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const ele = entry.target as HTMLDivElement;
                if (entry.isIntersecting) intersecting.add(ele);
                else intersecting.delete(ele);
                intersecting = intersecting;
            });
        });

        topLevelComments.forEach(c => observer.observe(c));

        cleanupCodeBlocks();
    })

    onDestroy(() => {
        observer && observer.disconnect();
    })

    function cleanupCodeBlocks() {
        let codes = Array.from(document.querySelectorAll("pre > code")) as HTMLDivElement[];
        
        let whiteSpaces: number[] = [];
        
        for (let code of codes) {
            
            let minWhite = Infinity;
            let lines = code.innerHTML.split('\n');
                        
            for (let line of lines) {
                if (line.trim() === "") continue;
                const numWhite = line.search(/\S|$/);
                minWhite = Math.min(numWhite, minWhite);
            }

            if (minWhite === Infinity) whiteSpaces.push(0);
            else whiteSpaces.push(minWhite);
        }

        codes.forEach((c, i) => {
            let minWhite = whiteSpaces[i];
            if (minWhite === 0) return;
            let lines = c.innerHTML.split('\n').map(l => [...l].splice(minWhite).join('')).join('\n');
            c.innerHTML = lines;
        });
    }

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
                    <p><a href="/item/{data.item.id}">{data.item.comments_count} {data.item.comments_count === 1 ? "comment" : "comments"} ({data.pageLimit} {data.pageLimit === 1 ? "page" : "pages"})</a></p>
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
                class="prose prose-a:dark:text-zinc-500 prose-a:break-words
                prose-pre:bg-zinc-800 prose-pre:dark:bg-zinc-900 
                prose-pre:first:mt-0 text-inherit max-w-full px-4 pb-8
                border-zinc-300 dark:border-zinc-700"
                class:border-b-8={data.item.comments.length > 0}
                class:mb-8={data.item.comments.length > 0}
            >
                {@html data.item.content}
            </div>
        {/if}
    </article>

    {#if data.item.comments.length > 0}
        <div class="px-4" id="comments" bind:this={comments}>
            {#each data.item.comments as comment, index}
                <Comment {comment} {index} group={data.item.comments} item={data.item} />
            {/each}
        </div>
    {/if}

    {#if data.pageLimit > 1}
        <div class="flex gap-4 p-4">
            {#if data.page > 1}
                <a 
                    href="?p={data.page - 1}#comments" 
                    class="px-4 py-4 border border-zinc-300 dark:border-zinc-700 flex-1 rounded hover:no-underline hover:shadow dark:hover:border-white flex justify-between items-center"
                >
                    <iconify-icon icon="ph:arrow-left-bold" class="text-2xl"></iconify-icon>
                    <span>Previous</span>
                </a>
            {/if}
            {#if data.page < data.pageLimit}
                <a 
                    href="?p={data.page + 1}#comments" 
                    class="px-4 py-4 border border-zinc-300 dark:border-zinc-700 flex-1 rounded text-right hover:no-underline hover:shadow dark:hover:border-white flex justify-between items-center"
                    class:solo-link={data.page <= 1}
                >
                    <span>Next</span>
                    <iconify-icon icon="ph:arrow-right-bold" class="text-2xl"></iconify-icon>
                </a>
            {/if}
        </div>
    {/if}
</div>


{#if next && $scrollY > 200 && data.item.comments.length > 1}
    <button 
        in:fly={{ y: 200 }} out:fly={{ y: 200 }}
        class="fixed bottom-5 right-20 p-2 rounded bg-white/50 dark:bg-black/50 backdrop-blur border border-zinc-300 dark:border-zinc-700 hover:shadow dark:hover:border-white z-10" 
        class:right-20={$hand === "righty"}
        class:left-20={$hand === "lefty"}
        on:click={() => {
            $navState = "visible";
            next?.scrollIntoView({behavior: "smooth" })
        }}
    >
        Next
    </button>
{/if}