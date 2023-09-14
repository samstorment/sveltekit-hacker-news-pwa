<script lang="ts">
	import { onDestroy } from "svelte";
	import Comment from "./Comment.svelte";
    import '../.././../prose.css';
	import { afterNavigate, beforeNavigate, onNavigate } from "$app/navigation";
	import { navigating, page } from "$app/stores";
	import { navState, scrollY } from "$lib/stores";
	import { hand } from "$lib/settings";
	import { fly } from "svelte/transition";
    import { comments, findItemInPage, points } from "$lib/util";
    import { browser } from "$app/environment";

    export let data;

    let commentsDiv: HTMLDivElement;
    let observer: IntersectionObserver;
    let intersecting = new Set<HTMLDivElement>();
    let curr: Element | undefined = undefined;
    let article: HTMLElement;

    $: next = curr?.nextElementSibling;

    $: if (intersecting.size === 1) {
        curr = intersecting.values().next().value;
    } else {
        curr = undefined;
    }

    // keep article stuck just off the top of the screen so view transitions don't travel ridiculously far/fast
    function pinArticle() {
        const { height } = article.getBoundingClientRect();
        article.style.top = `${-height}px`;
    }

    afterNavigate(() => {
       pinArticle();
    });

    beforeNavigate(() => {
        pinArticle();

        intersecting.clear();
        observer && observer.disconnect();
    });

    afterNavigate(({ from }) => {
        if (!commentsDiv) return;
        let topLevelComments = Array.from(commentsDiv.querySelectorAll(":scope > article")) as HTMLDivElement[];
    
        observer = observer || new IntersectionObserver((entries) => {    
            entries.forEach((entry) => {
                const ele = entry.target as HTMLDivElement;
                if (entry.isIntersecting) intersecting.add(ele);
                else intersecting.delete(ele);
                intersecting = intersecting;
            });
        });
    
        topLevelComments.forEach(c => observer.observe(c));
    
        cleanupCodeBlocks();
    });

    onDestroy(() => {
        observer && observer.disconnect();
    });

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

    let shareData: ShareData;
    $: shareData = {
        url: `${$page.url.origin}/item/${data.item.id}`,
        text: data.item.type === 'comment' ? 'Hacker News Comment' : data.item.title,
        title: data.item.type === 'comment' ? 'Hacker News Comment' : data.item.title
    }

    $: shareable = browser && navigator.canShare && navigator.canShare(shareData);

    let copied = false;

    async function copyLink() {
        if (shareable) {
            navigator.share(shareData)
                .then(() => copied = true)
                .catch(() => copied = false);
        } else if (shareData?.url) {
            await navigator.clipboard.writeText(shareData.url);
            copied = true;
        }
    }
</script>

<svelte:head>
    {#if data.item.title}
        <title>{data.item.title}</title>
    {:else if data.item.type === "comment" && !data.item.deleted}
        <title>Comment by {data.item.user}</title>
    {:else if data.item.type === "comment"}
        <title>Deleted Comment</title>
    {/if}
</svelte:head>

<div class="max-w-screen-md mx-auto">
    <article 
        bind:this={article}
        class="sticky"
    >
        <hgroup 
            class="p-4 mb-4"
            style="view-transition-name: article-title;"
        >
            <h1 class="text-3xl inline">
                {#if data.item.title}
                    <a href="{url}">{data.item.title}</a>
                {:else if data.item.type === "comment" && !data.item.deleted}
                    Comment by <a href="/user/{data.item.user}">{data.item.user}</a>
                {:else if data.item.type === "comment"}
                    Deleted Comment
                {/if}
            </h1>
            
            {#if data.item.domain}
                <a href="https://news.ycombinator.com/from?site={data.item.domain}" class="text-zinc-600 dark:text-zinc-400">({data.item.domain})</a>
            {/if}
        </hgroup>

        <div class="px-4 py-3 mb-8 text-zinc-600 dark:text-zinc-400 border-y border-zinc-300 dark:border-zinc-700">
            {#if data.item.type !== "job"}
                <div class="flex flex-wrap gap-1 justify-between mb-2">
                    <p>
                        {#if data.item.type === "comment" && data.item.deleted}
                            Deleted Comment
                        {:else}
                            {#if data.item.points}
                                {points(data.item)}
                            {:else if data.item.type === "comment"}
                                Comment
                            {/if}
                            {#if data.item.user}
                                by <a href="/user/{data.item.user}">{data.item.user}</a> {data.item.time_ago}
                            {/if}
                        {/if}
                    </p>
                    <p>
                        <a href="/item/{data.item.id}#comments">
                            {comments(data.item)}
                            {#if data.pageLimit > 1}
                                | {data.pageLimit} pages
                            {/if}
                        </a>
                    </p>
                </div>
            {/if}
            <div class="flex flex-wrap gap-1 items-center">
                <button 
                    class="mr-1 px-2 py-1 bg-zinc-200 dark:bg-zinc-900 rounded"
                    on:click={copyLink}
                    on:focusout={() => copied = false}
                >
                    {#if shareable}
                        <iconify-icon icon="material-symbols:share" class="w-4" inline></iconify-icon>
                        <span>Share</span>
                    {:else}
                        <iconify-icon icon="material-symbols:share" class="w-4" inline></iconify-icon>
                        <span>{copied ? "Copied!" : "Copy Link"}</span>
                    {/if}
                </button>
                <a href="https://news.ycombinator.com/item?id={data.item.id}" class="inline-block">
                    <iconify-icon icon="cib:y-combinator" class="w-4" inline></iconify-icon>
                    <span>View on Hacker News</span>
                </a>
            </div>
        </div>

        {#if data.item.content}
            <div 
                class="prose prose-a:dark:text-zinc-400 break-words
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
        <div class="px-4 z-10 relative" id="comments" bind:this={commentsDiv}>
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
        class="fixed bottom-5 right-20 p-3 rounded bg-white/50 dark:bg-black/50 backdrop-blur shadow border border-zinc-300 dark:border-zinc-700 z-10" 
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