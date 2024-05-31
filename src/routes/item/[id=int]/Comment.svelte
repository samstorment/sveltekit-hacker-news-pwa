<script lang="ts">
	import { page } from "$app/stores";
	import { navState } from "$lib/stores";
	import { fly, scale, slide } from "svelte/transition";
    import { comments, type Comment } from "$lib/util";

    export let index: number;
    export let comment: Comment;
    export let group: Comment[];
    export let item: any;
    export let comingFrom: string | undefined;

    let copied = false;
    let CUTOFF_DEPTH = 2;

    $: visible = !!comment;
    $: highlighted = $page.url.hash === `#${comment.id}`;

    $: prev = getPrevious(group);
    $: next = getNext(group);
    $: root = getRoot(comment);

    function getRoot(comment: Comment) {
        let root = comment.parent;

        while (root?.parent) {
            root = root.parent;
        }

        return root;
    }

    function getPrevious(group: Comment[]) {
        if (index - 1 < 0) return undefined;
        return group[index - 1];
    }

    function getNext(group: Comment[]) {
        if (index + 1 >= group.length) return undefined;
        return group[index + 1]; 
    }

    function scrollTo(id: number) {
        $navState = 'visible';
        document.getElementById(id.toString())?.scrollIntoView({
            behavior: 'smooth'
        });
    }

    async function copyLink() {
        const commentUrl = `${$page.url.origin}/item/${item.id}/find/${comment.id}`;
        
        const data: ShareData = {
            url: commentUrl,
            text: 'Hacker News Comment',
            title: 'Hacker News Comment'
        };

        // if navigator share API works, we use that, otherwise just write URL to clipboard
        if (navigator.canShare && navigator.canShare(data)) {
            navigator.share(data)
                .then(() => copied = true)
                .catch(() => copied = false);
        } else {
            await navigator.clipboard.writeText(commentUrl);
            copied = true;
        }
    }

    function depthColor(depth: number) {
        if (depth % 8 === 0) return "text-black dark:text-white";
        if (depth % 8 === 1) return "text-red-700";
        if (depth % 8 === 2) return "text-orange-600";
        if (depth % 8 === 3) return "text-yellow-400";
        if (depth % 8 === 4) return "text-green-500";
        if (depth % 8 === 5) return "text-blue-500";
        if (depth % 8 === 6) return "text-indigo-700";
        if (depth % 8 === 7) return "text-violet-600";
    }

    
</script>

<!-- Add border-l here for thread lines - can make this a setting -->
<article 
    id="{comment.id.toString()}"
    class:pl-4={comment.level > 0 && comment.level < 10}
>
    <div class="pb-6">
        <div 
            class:highlighted
            class:minimized={!visible && !highlighted}
            class="comment-outline"
        >
            <div class="text-zinc-600 dark:text-zinc-400 flex justify-between max-sm:flex-col">
                <div class="mb-1 flex items-center gap-1 mr-2 min-w-0">
                    <button 
                        class="group relative {depthColor(comment.level)}"
                        aria-describedby="copy-{comment.id}"
                        on:click={copyLink}
                        on:focusout={() => copied = false}
                    >
                        <!-- <iconify-icon icon="fa-solid:link"></iconify-icon> -->
                        <iconify-icon icon="ph:link-bold" class="w-4" inline></iconify-icon>
                        <div 
                            role="tooltip" 
                            id="copy-{comment.id}" 
                            class="absolute hidden group-focus-visible:block group-hover:block 
                            left-full bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 
                            px-2 py-1 dark:py-0 shadow dark:shadow-zinc-950 rounded text-zinc-600 dark:text-zinc-400 whitespace-nowrap text-sm"
                            class:copy-tooltip={true}
                        >
                            {copied ? "Link Copied!" : "Copy Link"}
                        </div>
                    </button>
                    <span class="whitespace-nowrap overflow-hidden text-ellipsis">
                        {#if comment.user}
                            <a href="/user/{comment.user}" class:text-blue-500={comment.user === item.user}>{comment.user}</a>
                        {:else}
                            [removed]
                        {/if}
                        <span>{comment.time_ago}</span>
                    </span>
                </div>
                    
                <div class="flex flex-wrap justify-end lefty:max-sm:flex-row-reverse items-center gap-1 mb-1 text-sm">
                    <div class="flex items-center sm:hidden flex-1 h-[22px] border border-zinc-300 dark:border-zinc-700 rounded nothing"></div>
                    {#if root?.id && comment.level > 1}
                        {@const id = root.id}
                        <button 
                            type="button" 
                            class="flex items-center px-2 border border-zinc-300 dark:border-zinc-700 rounded" 
                            on:click={() => scrollTo(id)}
                        >
                            Root
                        </button>
                    {/if}
                    {#if comment.parent}
                        {@const id = comment.parent.id}
                        <button 
                            type="button" 
                            class="flex items-center px-2 border border-zinc-300 dark:border-zinc-700 rounded" 
                            on:click={() => scrollTo(id)}
                        >
                            Parent
                        </button>
                    {/if}
                    {#if prev}
                        {@const id = prev.id}
                        <button 
                            type="button" 
                            class="flex items-center px-2 border border-zinc-300 dark:border-zinc-700 rounded" 
                            on:click={() => scrollTo(id)}
                        >
                            Prev
                        </button>
                    {/if}
                    {#if next}
                        {@const id = next.id}
                        <button 
                            type="button" 
                            class="flex items-center px-2 border border-zinc-300 dark:border-zinc-700 rounded" 
                            on:click={() => scrollTo(id)}
                        >
                            Next
                        </button>
                    {/if}

                    <button
                        type="button" 
                        class="flex items-center px-2 border border-zinc-300 dark:border-zinc-700 rounded font-mono" 
                        aria-expanded="{visible}"
                        aria-controls="content-{comment.id}"
                        on:click={() => visible = !visible}
                    >
                        <span class="sr-only">
                            {visible ? "Collapse Comment" : "Expand Comment"}
                        </span>
                        {visible ? "-" : "+"}
                    </button>
                </div>
            </div>

            {#if visible}
                <div 
                    id="content-{comment.id}"
                    transition:slide
                    class="rounded border border-zinc-300 dark:border-zinc-700"
                >
                    <div 
                        class="prose text-inherit prose-a:dark:text-zinc-400  
                        prose-pre:dark:bg-zinc-900 prose-pre:bg-zinc-800 
                        prose-pre:border prose-pre:border-zinc-700 prose-pre:text-sm
                        max-w-full break-words p-2"
                    >
                        {@html comment.content}
                    </div>
                </div>
            {/if}
            
            <div 
                class="text-zinc-600 dark:text-zinc-400 text-sm flex items-center gap-1 mt-1" 
            >
                <iconify-icon icon="cib:y-combinator" class="text-base w-4"></iconify-icon>
                <a href="https://news.ycombinator.com/reply?id={comment.id}&goto=item?id={item.id}#{comment.id}">Reply</a>
                <a href="https://news.ycombinator.com/item?id={item.id}#{comment.id}">View</a>
                <span class="hidden" class:lefty:max-sm:block={!visible}>|</span>
                <a
                    href="/item/{comment.id}"
                    class="ml-auto whitespace-nowrap overflow-hidden text-ellipsis"
                    class:lefty:max-sm:ml-0={!visible}
                >
                    {comments(comment)}
                </a>
            </div>
        </div>
    </div>

    {#if comment.level < CUTOFF_DEPTH || (comment.level === CUTOFF_DEPTH && comment.comments_count === 1)}
        {#if comment.comments.length > 0}
            <ul class:hidden={!visible}>
                {#each comment.comments as child, index}
                    <li>
                        <svelte:self 
                            comment={{ ...child, parent: comment}} 
                            {index} 
                            group={comment.comments}
                            {item}
                            bind:comingFrom
                        />
                    </li>
                {/each}
            </ul>
        {/if}
    {:else if comment.comments_count > 0}
        <div class="pl-4 pb-6" >
            <a
                href="/item/{comment.id}"
                class="border-2 border-blue-500 text-blue-500 dark:text-inherit dark:border-white p-2 rounded flex items-center gap-2 hover:no-underline"
                class:pulse={comment.id.toString() === comingFrom}
            >
                <iconify-icon icon="octicon:comment-24" class="text-2xl w-6"></iconify-icon>
                {comment.comments_count} more {comment.comments_count === 1 ? "reply" : "replies"}
            </a>
        </div>
    {/if}
</article>


<style lang="postcss">

    .highlighted {
        @apply outline outline-offset-8 outline-black dark:outline-white rounded-sm;
    }

    .minimized {
        @apply outline outline-1 outline-offset-8 outline-zinc-300 dark:outline-zinc-700 rounded-[1px];
    }

    .copy-tooltip {
        top: 50%;
        transform: translate(.25rem, -50%);
    }

    .copy-tooltip::before {
        display: block;
        position: absolute;
        content: '';
        width: 5px;
        height: 100%;
        /* background-color: red; */
        left: -5px;
    }

    .nothing {
        background: repeating-linear-gradient(
            -45deg,
            rgb(228 228 231),
            rgb(228 228 231) 3px,
            white 3px,
            white 7px
        );

    }

    /* quick, bad fix */
    :global(.dark .nothing) {
        background: repeating-linear-gradient(
            -45deg,
            #27272a,
            #27272a 3px,
            #09090b 3px,
            #09090b 7px
        );
    }

    .pulse {
        animation-name: pulse;
        animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        animation-duration: 400ms;
        animation-iteration-count: 1;
    }

    @keyframes pulse {
        0% {
            scale: 1;
        }

        30% {
            scale: .6;
        }

        100% {
            scale: 1;
        }
    }

</style>