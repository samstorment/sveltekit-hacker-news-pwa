<script lang="ts">
    import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { hand, showImagePreviews, highlightLastPost } from '$lib/settings.js';
	import { images } from '$lib/stores.js';
    import { points, type ItemBasic, comments } from '$lib/util.js';

    export let data;
    let highlight: string | undefined;

    $: showImages = $showImagePreviews && data.category !== "ask";

    // this feels stinky - should just use redis, but redis is stinky too
    async function getImage(item: ItemBasic) {

        if ($images[item.id] === 'missing') return { url: undefined };
        if ($images[item.id]) return { url: $images[item.id] };

        if (item.url.startsWith("item")) return { url: undefined };

        const res = await fetch(`/api/og?url=${item.url}`);
        const data: { url: string | undefined } = await res.json();

        $images[item.id] = data.url ?? 'missing';

        return data;
    }

    $: items = data.items.map(item => {
        return {
            ...item,
            image: showImages ? getImage(item) : undefined
        };
    });

    afterNavigate(({ from }) => {
        if (from?.route.id === '/item/[id=int]') {
            highlight = from.params?.id;
            return;
        }

        highlight = undefined;
    });

    beforeNavigate(({ willUnload, to }) => {

        if (!willUnload) return;
        
        const item = items.find(i => i.url === to?.url.href);

        if (!item) return;

        highlight = item.id.toString();
    });


</script>

<svelte:head>
    <title>{data.categoryLabel.charAt(0).toUpperCase() + data.categoryLabel.slice(1)} | Hacker News</title>
</svelte:head>

<div class="max-w-screen-md mx-auto">
    
    <h1 class="text-3xl p-4 sr-only">Page {data.page} of {data.categoryLabel}</h1>

    <!-- <pre>{JSON.stringify(images, null, 4)}</pre> -->

    <ul>
        {#each items as item, i (item.id)}
            {@const highlighted = 
                $highlightLastPost 
                && highlight === item.id.toString()
            }

            {#key highlight}
                <li
                    class:highlighted
                    class="border-b border-zinc-300 dark:border-zinc-700 items-center last:border-none"
                >
                    <article 
                        class:highlighted 
                        class="bg-white dark:bg-zinc-950"
                    >
                        <div class="flex lefty:flex-row-reverse">
                            <div 
                                class="px-4 my-4 flex-1 min-w-0 self-center"
                            >
                                <hgroup class="break-words">
                                    <h2 class="inline"> 
                                        <a href="{item.url}">{item.title}</a>
                                    </h2>
                                    {#if item.domain}
                                        <a href="https://news.ycombinator.com/from?site={item.domain}" class="text-zinc-600 dark:text-zinc-400 text-sm break-words">({item.domain})</a>
                                    {/if}
                                </hgroup>

                                <p 
                                    class="text-zinc-600 dark:text-zinc-400"
                                    class:max-xs:hidden={showImages}
                                >
                                    <span>
                                        {#if item.points}
                                            {points(item)}
                                        {/if}
                                        {#if item.user}
                                            by <a href="/user/{item.user}">{item.user}</a> 
                                        {/if}
                                        {item.time_ago}
                                        {#if item.type !== "job"}
                                            <span>|</span>
                                        {/if}
                                    </span>
                                    {#if item.type !== "job"}
                                        <a href="/item/{item.id}" class="inline-block">
                                            {comments(item)}
                                        </a>
                                    {/if}
                                </p>

                            </div>

                        
                            {#if !showImages}
                                <div class="ml-auto flex flex-col md:hidden w-[56px] shrink-0">
                                    <a 
                                        href="{item.url}" 
                                        class="flex-1 flex items-center justify-center text-2xl px-4 hover:bg-zinc-200 dark:hover:bg-zinc-900"
                                        class:rounded-bl-lg={$hand === "righty" && ((data.category !== "ask" && data.category !== "jobs") || i === data.items.length - 1)}
                                        class:rounded-tl-lg={$hand === "righty" && i === 0}
                                        class:rounded-br-lg={$hand === "lefty" && ((data.category !== "ask" && data.category !== "jobs") || i === data.items.length - 1)}
                                        class:rounded-tr-lg={$hand === "lefty" && i === 0}
                                    >
                                        <iconify-icon icon="eva:diagonal-arrow-right-up-fill"></iconify-icon>
                                        <span class="sr-only">Open External Post Link</span>
                                    </a>
                                    {#if data.category !== "ask" && data.category !== "jobs"}
                                        <a 
                                            href="/item/{item.id}" 
                                            class="flex-1 flex items-center justify-center text-2xl px-4 hover:bg-zinc-200 dark:hover:bg-zinc-900"
                                            class:rounded-bl-lg={$hand === "righty" && i === data.items.length - 1}
                                            class:rounded-tl-lg={$hand === "righty"}
                                            class:rounded-br-lg={$hand === "lefty" && i === data.items.length - 1}
                                            class:rounded-tr-lg={$hand === "lefty"}
                                        >
                                            <iconify-icon icon="octicon:comment-24"></iconify-icon>
                                            <span class="sr-only">Open Post Comments</span>
                                        </a>
                                    {/if}
                                </div>
                            {:else}
                                <a 
                                    href={item.url} 
                                    class="preview-image group flex items-center justify-center self-start 
                                    w-[128px] h-[72px] max-sm:w-[100px] max-sm:h-[56px] max-2xs:hidden
                                    lefty:mr-0 lefty:ml-4 mr-4 my-4 hover:no-underline hocus:outline-none"
                                >
                                    {#await item.image}
                                        <iconify-icon icon="line-md:loading-loop" class="text-2xl"></iconify-icon>
                                    {:then src} 
                                        {#if src?.url}
                                            <img 
                                                src={src.url} 
                                                alt="View Post" 
                                                class="thumbnail object-cover object-center rounded flex items-center justify-center 
                                                        max-h-full max-sm:max-w-[100px] w-full text-3xl shadow
                                                        outline outline-transparent outline-0
                                                        group-hocus:outline-4 group-hocus:outline-zinc-900
                                                        group-hocus:outline-offset-4 group-hocus:dark:outline-zinc-200"
                                                on:error={_ => {
                                                    $images[item.id] = 'missing';
                                                    src.url = undefined;
                                                }}
                                            />
                                        {:else}
                                            <div
                                                class="dumbnail h-full w-full bg-zinc-200 dark:bg-zinc-900 rounded 
                                                flex items-center justify-center text-4xl max-sm:text-3xl text-zinc-400
                                                outline outline-transparent outline-0
                                                group-hocus:outline-4 group-hocus:outline-zinc-900 
                                                group-hocus:outline-offset-4 group-hocus:dark:outline-zinc-200"
                                            >
                                                <iconify-icon icon="eva:diagonal-arrow-right-up-fill"></iconify-icon>
                                                <span class="sr-only">Open External Post Link</span>
                                            </div>
                                        {/if}
                                    {/await}
                                </a>
                            {/if}
                        </div>

                        {#if showImages && data.category !== "ask" && data.category !== "jobs"}
                            <div 
                                class="flex gap-2 px-4 items-center pb-4 -mt-2 xs:hidden text-zinc-600 dark:text-zinc-400 text-sm lefty:flex-row-reverse lefty:justify-end"
                            >
                                <div class="flex gap-2 items-center min-w-0">
                                    {#if item.points}
                                        <p class="overflow-hidden text-ellipsis whitespace-nowrap">{points(item)}</p>
                                    {/if}
                                    {#if item.user}
                                        <a href="/user/{item.user}" class="overflow-hidden text-ellipsis whitespace-nowrap">by {item.user}</a>
                                    {/if}
                                    <p class="overflow-hidden text-ellipsis whitespace-nowrap">{item.time_ago}</p>
                                </div>
                                <a href="/item/{item.id}" class="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-900 whitespace-nowrap max-xs:ml-auto lefty:max-xs:ml-0 hover:no-underline">
                                    <iconify-icon icon="octicon:comment-24" inline></iconify-icon> <span class="leading-none">{item.comments_count}</span> 
                                    <span class="sr-only">Open Post Comments</span>
                                </a>
                            </div>
                        {/if}
                    </article>
                </li>
            {/key}
        {/each}
    </ul>

    <div class="flex gap-4 p-4">
        {#if data.page > 1}
            <a 
                href="?p={data.page - 1}" 
                class="px-4 py-4 border border-zinc-300 dark:border-zinc-700 flex-1 rounded hover:no-underline hover:shadow dark:hover:border-white flex justify-between items-center"
            >
                <iconify-icon icon="ph:arrow-left-bold" class="text-2xl"></iconify-icon>
                <span>Previous</span>
            </a>
        {/if}
        {#if data.page < data.pageLimit}
            <a 
                href="?p={data.page + 1}" 
                class="px-4 py-4 border border-zinc-300 dark:border-zinc-700 flex-1 rounded text-right hover:no-underline hover:shadow dark:hover:border-white flex justify-between items-center"
                class:solo-link={data.page <= 1}
            >
                <span>Next</span>
                <iconify-icon icon="ph:arrow-right-bold" class="text-2xl"></iconify-icon>
            </a>
        {/if}
    </div>
</div>

<style lang="postcss">
    li.highlighted {
        @apply bg-zinc-100 dark:bg-zinc-900 p-3;
    }

    article.highlighted {
        @apply rounded-lg overflow-hidden border border-zinc-400 dark:border-zinc-700 shadow-md shadow-zinc-400 dark:shadow-black;

    }

    .solo-link {
        margin-left: auto;
    }

    .thumbnail, .dumbnail {
        transition: 
            outline-offset 150ms ease-in-out,
            outline-width 150ms ease-in-out,
            outline-color 150ms ease-in-out;
    }
</style>



