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

    let prevIndex = index - 1;
    let nextIndex = index + 1;
    
    let origPrev = prevIndex >= 0 ? group[prevIndex] : undefined;
    let origNext = nextIndex < group.length ? group[nextIndex] : undefined;

    let prev = getPrevious();
    let next = getNext();

    function getRoot() {
        let root = comment.parent;

        while (root?.parent) {
            root = root.parent;
        }

        return root;
    }

    function getPrevious() {
        let prev: Comment | undefined;

        do {
            if (--prevIndex < 0) return undefined;
            prev = group[prevIndex];
        } while (prev.deleted)

        return prev;
    }

    function getNext() {
        let next: Comment | undefined;

        do { 
            if (++nextIndex >= group.length) return undefined;
            next = group[nextIndex];
        } while(next.deleted);

        return next;
    }
    
    let root = getRoot();
</script>


{#if !comment.deleted}
    <article id="comment-{comment.id}" class="scroll-pt-4">
        <div 
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
                        <a href="#comment-{root.id}" class="flex items-center px-3 border border-zinc-800 rounded bg-black">Root</a>
                    {/if}
                    {#if comment.parent}
                        <a href="#comment-{comment.parent.id}" class="flex items-center px-3 border border-zinc-800 rounded bg-black">Parent</a>
                    {/if}
                    {#if prev}
                        <a 
                            href="#comment-{prev.id}" 
                            class="flex items-center px-3 border border-zinc-800 rounded bg-black"
                            class:outline={origPrev.deleted}
                            class:outline-red-500={origPrev.deleted}
                        >
                            Prev
                        </a>
                    {/if}
                    {#if next}
                        <a 
                            href="#comment-{next.id}"
                            class="flex items-center px-3 border border-zinc-800 rounded bg-black"
                            class:outline={origNext.deleted}
                            class:outline-red-500={origNext.deleted}
                        >
                            Next
                        </a>
                    {/if}
                </div>
            </div>

            <div class="prose text-inherit prose-a:text-zinc-500 prose-pre:bg-zinc-900 rounded border border-zinc-300 dark:border-zinc-800 p-2 max-w-full mb-4 break-words">
                {@html comment.content}
            </div>
        </div>

        {#if comment.comments.length > 0}
            <ul>
                {#each comment.comments as child, index}
					<li><svelte:self comment={{ ...child, parent: comment}} {index} group={comment.comments} /></li>
				{/each}
            </ul>
        {/if}
    </article>
{/if}