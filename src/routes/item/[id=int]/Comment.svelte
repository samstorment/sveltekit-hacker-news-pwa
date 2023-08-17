<script lang="ts">
	import { page } from "$app/stores";
	import { navState } from "$lib/stores";
	import { fly, scale, slide } from "svelte/transition";
    import type { Comment } from "./+page";

    export let index: number;
    export let comment: Comment;
    export let group: Comment[];
    export let item: any;

    let visible = true;
    let copied = false;
    $: highlighted = $page.url.hash === `#${comment.id}`;

    let prev = getPrevious();
    let next = getNext();
    let root = getRoot();

    function getRoot() {
        let root = comment.parent;

        while (root?.parent) {
            root = root.parent;
        }

        return root;
    }

    function getPrevious() {
        let prev: Comment;
        let prevIndex = index;

        do {
            if (--prevIndex < 0) return undefined;
            prev = group[prevIndex];
        } while (prev.deleted)

        return prev;
    }

    function getNext() {
        let next: Comment;
        let nextIndex = index;

        do { 
            if (++nextIndex >= group.length) return undefined;
            next = group[nextIndex];
        } while(next.deleted);

        return next;
    }

    function scrollTo(id: string) {
        $navState = 'visible';
        document.getElementById(id)?.scrollIntoView({
            behavior: 'smooth'
        });
    }

    async function copyLink() {
        const commentUrl = `${$page.url.origin}${$page.url.pathname}#${comment.id}`;
        await navigator.clipboard.writeText(commentUrl);
        copied = true;
    }
</script>


{#if !comment.deleted}
    <article id="{comment.id}">
        <div 
            class="pb-6"
            style={comment.level > 0 ? `margin-left: ${comment.level}rem;` : ""}
        >
            <div class:highlighted class:minimized={!highlighted && !visible} class="comment-outline">
                <div class="text-zinc-600 dark:text-zinc-500 flex justify-between max-sm:flex-col">
                    <div class="mb-1 flex items-center gap-2 mr-2 min-w-0">
                        <button 
                            class="flex items-center justify-center font-mono rounded-full shrink-0 group relative"
                            class:text-black={comment.level % 8 === 0}
                            class:dark:text-white={comment.level % 8 === 0}
                            class:text-red-700={comment.level % 8 === 1}
                            class:text-orange-600={comment.level % 8 === 2}
                            class:text-yellow-400={comment.level % 8 === 3}
                            class:text-green-500={comment.level % 8 === 4}
                            class:text-blue-500={comment.level % 8 === 5}
                            class:text-indigo-700={comment.level % 8 === 6}
                            class:text-violet-600={comment.level % 8 === 7}
                            aria-describedby="copy-{comment.id}"
                            on:click={copyLink}
                            on:focusout={() => copied = false}
                        >
                            <!-- <iconify-icon icon="fa-solid:link"></iconify-icon> -->
                            <iconify-icon icon="ph:link-bold"></iconify-icon>
                            <div 
                                role="tooltip" 
                                id="copy-{comment.id}" 
                                class="absolute hidden group-focus-visible:block group-hover:block 
                                left-full translate-x-1 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 
                                px-2 shadow dark:shadow-zinc-950 rounded text-zinc-600 dark:text-zinc-500 whitespace-nowrap text-sm"
                                class:copy-tooltip={true}
                            >
                                {copied ? "Link Copied!" : "Copy Link"}
                            </div>
                        </button>
                        <span class="whitespace-nowrap overflow-hidden text-ellipsis"><a href="/user/{comment.user}" class:text-blue-500={comment.user === item.user}>{comment.user}</a> <span>{comment.time_ago}</span></span>
                    </div>
                        
                    <div class="flex flex-wrap justify-end lefty:flex-row-reverse items-center gap-1 mb-1 text-sm">
                        <div class="flex items-center sm:hidden flex-1 h-[22px] border border-zinc-300 dark:border-zinc-700 rounded nothing lefty:hidden"></div>
                        <!-- <span class="flex-1 h-[1px] bg-zinc-800 min-w-0"></span> -->
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
                            class="prose text-inherit prose-a:dark:text-zinc-500  
                            prose-pre:dark:bg-zinc-900 prose-pre:bg-zinc-800 prose-pre:first:mt-0 
                            prose-pre:border prose-pre:border-zinc-700 prose-pre:text-sm
                            p-2 max-w-full break-words"
                        >
                            {@html comment.content}
                        </div>
                    </div>
                {/if}
                
                <div 
                    class="text-zinc-600 dark:text-zinc-500 text-sm flex items-center gap-2 mt-1" 
                >
                    <iconify-icon icon="cib:y-combinator" class="text-lg"></iconify-icon>
                    <a href="https://news.ycombinator.com/reply?id={comment.id}&goto=item?id={item.id}#{comment.id}">Reply</a>
                    <a href="https://news.ycombinator.com/item?id={item.id}#{comment.id}">View</a>
                    <span class="hidden" class:lefty:max-sm:block={!visible}>|</span>
                    <span
                        class="ml-auto whitespace-nowrap overflow-hidden text-ellipsis"
                        class:lefty:ml-0={!visible}
                    >
                        {#if comment.visibile_comment_count > 0}
                            {comment.visibile_comment_count} {comment.visibile_comment_count === 1 ? "reply" : "replies"}
                        {:else}
                            No replies
                        {/if}
                    </span>
                </div>
            </div>
        </div>

        {#if comment.comments.length > 0}
            <ul class:hidden={!visible}>
                {#each comment.comments as child, index}
                    <li>
                        <svelte:self 
                            comment={{ ...child, parent: comment}} 
                            {index} 
                            group={comment.comments}
                            {item}
                        />
                    </li>
                {/each}
            </ul>
        {/if}
    </article>
{/if}


<style lang="postcss">
    .comment-outline {
        @apply rounded-sm outline outline-transparent outline-offset-[12px];
        transition: 
            outline ease 200ms, 
            outline-offset ease 200ms, 
            border-radius ease 200ms, 
            outline-color ease 200ms;
    }

    .highlighted {
        @apply outline outline-offset-8 outline-black dark:outline-white rounded-sm;
    }

    .minimized {
        @apply outline-1 outline-offset-8 outline-zinc-300 dark:outline-zinc-700 rounded-sm;
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
            rgb(24 24 27),
            rgb(24 24 27) 3px,
            black 3px,
            black 7px
        );
    }

</style>