<script lang="ts">
    import { page } from "$app/stores";
</script>

<svelte:head>
    <title>{$page.status} - deltacv</title>
</svelte:head>

<div class="absolute inset-0 w-full h-full flex flex-col items-center justify-center px-6 text-center text-[#c9d1d9] font-['Inter'] font-sans bg-[#0d1117] overflow-hidden">
    <h1 class="text-7xl md:text-9xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-br from-[#58a6ff] to-[#a371f7] leading-none select-none">
        {$page.status}
    </h1>
    
    <h2 class="text-2xl md:text-4xl font-bold mb-4 text-white tracking-tight">
        {#if $page.status === 404}
            Looks like you're lost.
        {:else}
            System Failure
        {/if}
    </h2>
    
    <p class="text-[#8b949e] max-w-md mx-auto mb-10 text-base md:text-lg leading-relaxed">
        {#if $page.status === 404}
            The page you are looking for has either been moved, deleted, or never existed in the first place.
        {:else}
            {$page.error?.message || "Our servers are experiencing an issue right now. Please try again later."}
        {/if}
    </p>

    <a 
        href="/" 
        class="inline-block px-6 py-3 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] hover:border-[#8b949e] text-[#c9d1d9] hover:text-white rounded-xl font-semibold transition-all duration-200"
    >
        Return to Home
    </a>
</div>
