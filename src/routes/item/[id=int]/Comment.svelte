<script lang="ts">

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

    let visible = true;

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

        document.querySelector(`#comment-${comment.id}`)?.scrollIntoView({
            behavior: 'smooth'
        });
    }
</script>


{#if !comment.deleted}
    <article id="comment-{comment.id}">
        <div 
            class:mb-4={!visible}
            style={comment.level > 0 ? `margin-left: ${comment.level*1}rem;` : ""}
        >
            <div class="text-zinc-500 flex flex-wrap justify-between">
                <div class="mb-1 flex items-center gap-2 mr-2">
                    <span 
                        class="h-2 w-2 flex items-center justify-center font-mono rounded-full shrink-0"
                        class:bg-red-700={comment.level % 7 === 0}
                        class:bg-orange-600={comment.level % 7 === 1}
                        class:bg-yellow-400={comment.level % 7 === 2}
                        class:bg-green-500={comment.level % 7 === 3}
                        class:bg-blue-500={comment.level % 7 === 4}
                        class:bg-indigo-700={comment.level % 7 === 5}
                        class:bg-violet-600={comment.level % 7 === 6}
                    ></span>
                    <span><a href="/user/{comment.user}">{comment.user}</a> <span>{comment.time_ago}</span></span>
                </div>
                    
                <div class="flex gap-1 mb-1 text-sm">
                    {#if root && comment.level > 1}
                        <button 
                            type="button" 
                            class="flex items-center px-3 border border-zinc-300 dark:border-zinc-800 rounded" 
                            on:click={() => scrollTo(root)}
                        >
                            Root
                        </button>
                    {/if}
                    {#if comment.parent}
                        <button 
                            type="button" 
                            class="flex items-center px-3 border border-zinc-300 dark:border-zinc-800 rounded" 
                            on:click={() => scrollTo(comment.parent)}
                        >
                            Parent
                        </button>
                    {/if}
                    {#if prev}
                        <button 
                            type="button" 
                            class="flex items-center px-3 border border-zinc-300 dark:border-zinc-800 rounded" 
                            on:click={() => scrollTo(prev)}
                        >
                            Prev
                        </button>
                    {/if}
                    {#if next}
                        <button 
                            type="button" 
                            class="flex items-center px-3 border border-zinc-300 dark:border-zinc-800 rounded" 
                            on:click={() => scrollTo(next)}
                        >
                            Next
                        </button>
                    {/if}

                    <button
                        type="button" 
                        class="flex items-center px-2 border border-zinc-300 dark:border-zinc-800 rounded ml-auto font-mono" 
                        on:click={() => visible = !visible}
                    >
                        {visible ? "-" : "+"}
                    </button>
                </div>
            </div>

            {#if visible}
                <div class="prose text-inherit prose-a:text-zinc-500 prose-pre:bg-zinc-900 rounded border border-zinc-300 dark:border-zinc-800 p-2 max-w-full mb-4 break-words">
                    {@html comment.content}
                </div>
            {/if}
        </div>

        {#if visible}
            {#if comment.comments.length > 0}
                <ul>
                    {#each comment.comments as child, index}
                        <li><svelte:self comment={{ ...child, parent: comment}} {index} group={comment.comments} /></li>
                    {/each}
                </ul>
            {/if}
        {/if}
    </article>
{/if}