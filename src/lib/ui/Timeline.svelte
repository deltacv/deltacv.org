<script lang="ts">
    import type { Snippet } from "svelte";

    let { 
        class: className = "",
        children 
    }: {
        class?: string;
        children?: Snippet;
    } = $props();
</script>

<div class="relative border-l border-[#30363d] ml-3 md:ml-4 py-2 space-y-6 sm:space-y-8 {className}">
    {@render children?.()}
</div>
