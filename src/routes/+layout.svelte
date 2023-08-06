<script lang="ts">
	import { page } from "$app/stores";
    import "../app.css";

    $: selected = $page.url.pathname.split('/')[1] || "top";
</script>

<header>
    <nav class="px-4 py-2 flex items-center gap-4 max-w-screen-md mx-auto">
        <a href="/" class="hover:no-underline">HN</a>
        <a href="/top" class="relative nav-item" class:selected={selected === "top"}>Top</a>
        <a href="/new" class="relative nav-item" class:selected={selected === "new"}>New</a>
        <a href="/show" class="relative nav-item" class:selected={selected === "show"}>Show</a>
        <a href="/ask" class="relative nav-item" class:selected={selected === "ask"}>Ask</a>
        <a href="/jobs" class="relative nav-item" class:selected={selected === "jobs"}>Jobs</a>
    </nav>
</header>

<slot />


<style lang="postcss">
    .nav-item {
        @apply no-underline;
    }


    .nav-item:hover::after,
    .selected::after {
        content: '';
        @apply absolute h-[2px] w-full bg-blue-500 dark:bg-white left-0 -bottom-1;
    }
</style>