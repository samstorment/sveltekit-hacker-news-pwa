<script lang="ts">
	import { page } from "$app/stores";
	import { slide } from "svelte/transition";


    type Comment = {
        deleted?: boolean;
        user: string;
        time_ago: string;
        content: string;
        comments: Comment[];
        level: number;
        parent?: Comment;
        id: string;
    }

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
        let prev: Comment | undefined;
        let prevIndex = index;

        do {
            if (--prevIndex < 0) return undefined;
            prev = group[prevIndex];
        } while (prev.deleted)

        return prev;
    }

    function getNext() {
        let next: Comment | undefined;
        let nextIndex = index;

        do { 
            if (++nextIndex >= group.length) return undefined;
            next = group[nextIndex];
        } while(next.deleted);

        return next;
    }

    function scrollTo(comment: Comment | undefined) {
        if (!comment) return;

        document.getElementById(comment.id)?.scrollIntoView({
            behavior: 'smooth'
        });
    }


    async function copyLink() {
        
        console.log($page.url);

        const commentUrl = `${$page.url.origin}${$page.url.pathname}#${comment.id}`;
        
        await navigator.clipboard.writeText(commentUrl);
        
        copied = true;
    }
</script>


{#if !comment.deleted}
    <article id="{comment.id}">
        <div 
            class="mb-6 {highlighted ? "outline outline-offset-8 outline-black dark:outline-white rounded-sm" : ""}"
            style={comment.level > 0 ? `margin-left: ${comment.level*1}rem;` : ""}
        >
            <div class="text-zinc-500 flex justify-between max-sm:flex-col">
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
                            left-full translate-x-1 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-800 
                            px-2 shadow dark:shadow-zinc-950 rounded text-zinc-500 whitespace-nowrap text-sm"
                            class:copy-tooltip={true}
                        >
                            {copied ? "Link Copied!" : "Copy Link"}
                        </div>
                    </button>
                    <span class="whitespace-nowrap overflow-hidden text-ellipsis"><a href="/user/{comment.user}" class:text-blue-500={comment.user === item.user}>{comment.user}</a> <span>{comment.time_ago}</span></span>
                </div>
                    
                <div class="flex flex-wrap justify-end items-center gap-1 mb-1 text-sm">
                    <span class="sm:hidden flex-1 h-[22px] border border-zinc-300 dark:border-zinc-800 rounded min-w-0 nothing"></span>
                    <!-- <span class="flex-1 h-[1px] bg-zinc-800 min-w-0"></span> -->
                    {#if root && comment.level > 1}
                        <button 
                            type="button" 
                            class="flex items-center px-2 border border-zinc-300 dark:border-zinc-800 rounded" 
                            on:click={() => scrollTo(root)}
                        >
                            Root
                        </button>
                    {/if}
                    {#if comment.parent}
                        <button 
                            type="button" 
                            class="flex items-center px-2 border border-zinc-300 dark:border-zinc-800 rounded" 
                            on:click={() => scrollTo(comment.parent)}
                        >
                            Parent
                        </button>
                    {/if}
                    {#if prev}
                        <button 
                            type="button" 
                            class="flex items-center px-2 border border-zinc-300 dark:border-zinc-800 rounded" 
                            on:click={() => scrollTo(prev)}
                        >
                            Prev
                        </button>
                    {/if}
                    {#if next}
                        <button 
                            type="button" 
                            class="flex items-center px-2 border border-zinc-300 dark:border-zinc-800 rounded" 
                            on:click={() => scrollTo(next)}
                        >
                            Next
                        </button>
                    {/if}

                    <button
                        type="button" 
                        class="flex items-center px-2 border border-zinc-300 dark:border-zinc-800 rounded font-mono" 
                        aria-expanded="{visible}"
                        aria-controls="content-{comment.id}"
                        on:click={() => visible = !visible}
                    >
                        {visible ? "-" : "+"}
                    </button>
                </div>
            </div>

            {#if visible}
                <div id="content-{comment.id}">
                    <div 
                        transition:slide
                        class="prose text-inherit prose-a:text-zinc-500 prose-pre:bg-zinc-900 rounded border border-zinc-300 dark:border-zinc-800 p-2 max-w-full break-words"
                    >
                        {@html comment.content}
                    </div>

                    <div class="text-zinc-500 text-sm flex items-center gap-2 mt-1" transition:slide>
                        <iconify-icon icon="cib:y-combinator" class="text-lg"></iconify-icon>
                        <a href="https://news.ycombinator.com/reply?id={comment.id}&goto=item?id={item.id}#{comment.id}">Reply</a>
                        <a href="https://news.ycombinator.com/item?id={item.id}#{comment.id}">View</a>
                    </div>
                </div>
            {/if}
        </div>

        {#if visible}
            {#if comment.comments.length > 0}
                <ul>
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
        {/if}
    </article>
{/if}


<style lang="postcss">
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