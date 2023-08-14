<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="p-4 max-w-screen-md mx-auto">
    <hgroup>
        <h1 class="text-3xl">{$page.error?.message}</h1>
        <p class="text-zinc-600 dark:text-zinc-500 text-xl">
            <span class="sr-only">HTTP Status Code: </span>
            {$page.status}
        </p>
    </hgroup>

    <a 
        href="/" 
        class="flex items-center gap-2 mt-4 px-4 py-4 border border-zinc-300 dark:border-zinc-700 rounded hover:no-underline hover:shadow dark:hover:border-white"
    >
        <iconify-icon icon="ph:arrow-left-bold" class="text-2xl"></iconify-icon>
        <span>Go Home</span>
    </a>
</div>