<script lang="ts">
    export let data;
</script>

<div class="max-w-screen-md mx-auto">
    <h1 class="text-3xl p-4">
        {data.id}
    </h1>

    <div class="px-4 py-2 border-y border-zinc-300 dark:border-zinc-700">
        <p class="text-zinc-600 dark:text-zinc-400 mb-1">Joined {data.created}</p>
        <p class="text-zinc-600 dark:text-zinc-400">{data.karma} Karma</p>
    </div>

    <div class="p-4 flex gap-4 flex-wrap">
        <a href="https://news.ycombinator.com/submitted?id={data.id}">Submissions</a>
        <a href="https://news.ycombinator.com/threads?id={data.id}">Comments</a>
        <a href="https://news.ycombinator.com/favorites?id={data.id}">Favorites</a>
    </div>
</div>