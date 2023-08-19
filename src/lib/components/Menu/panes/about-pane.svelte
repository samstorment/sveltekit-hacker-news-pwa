
<div class="px-4 py-2 flex flex-col gap-4 text-zinc-600 dark:text-zinc-400">
    <p>
        Hacker News Progressive Web App powered by <a href="https://github.com/davideast/hnpwa-api" class="attribution">David East's Hacker News PWA API</a>.
    </p>

    <p>Built with <a href="https://kit.svelte.dev/" class="attribution">SvelteKit</a> and <a href="https://tailwindcss.com/" class="attribution">Tailwind CSS</a>.</p>

    
    <div>
        <h3 class="text-xl mb-2">GitHub Repo</h3>
        <a 
            class="flex items-center gap-2" 
            href=" https://github.com/samstorment/sveltekit-hacker-news-pwa"
        >
            <iconify-icon icon="mdi:github" class="text-xl"></iconify-icon>
            <span class="overflow-hidden text-ellipsis whitespace-nowrap">https://github.com/samstorment/sveltekit-hacker-news-pwa</span>
        </a>
    </div>
</div>


<style lang="postcss">
    :is(h2,h3,h4,h5,h6) {
        @apply text-zinc-900 dark:text-zinc-200;
    }

    .attribution {
        @apply text-blue-500 font-semibold;
    }
</style>