<script lang="ts">

    type Comment = {
        deleted?: boolean;
        user: string;
        time_ago: string;
        content: string;
        comments: Comment[];
        level: number;
    }

    export let comment: Comment;
</script>


{#if !comment.deleted}
    <article>

        <div 
            style={comment.level > 0 ? `margin-left: ${comment.level*1}rem;` : ""}
        >
            <div class="text-zinc-500 mb-2 flex items-center gap-2 round">
                <p 
                    class="h-2 w-2 flex items-center justify-center font-mono rounded-full"
                    class:bg-red-700={comment.level % 7 === 0}
                    class:bg-orange-700={comment.level % 7 === 1}
                    class:bg-yellow-700={comment.level % 7 === 2}
                    class:bg-green-700={comment.level % 7 === 3}
                    class:bg-blue-700={comment.level % 7 === 4}
                    class:bg-indigo-700={comment.level % 7 === 5}
                    class:bg-violet-700={comment.level % 7 === 6}
                >
                    
                </p>
                <a href="/user/{comment.user}">{comment.user}</a> {comment.time_ago}
            </div>

            <div class="prose text-inherit prose-a:text-zinc-500 border border-zinc-300 dark:border-zinc-900 p-2 rounded max-w-full mb-4">
                {@html comment.content}
            </div>
        </div>

        {#if comment.comments.length > 0}
            <ul>
                {#each comment.comments as child}
					<li><svelte:self comment={child} /></li>
				{/each}
            </ul>
        {/if}
    </article>
{/if}