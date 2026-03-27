<script lang="ts">
    import { getContext } from "svelte";
    import { fade } from "svelte/transition";

    let { title, children } = $props();
    const id = title.toLowerCase().replace(/\s+/g, "-");

    const tabsContext = getContext<any>("tabs-context");

    // Register this tab with the parent Tabbed component
    tabsContext.register({ id, title });

    let activeTabId = $derived(tabsContext.activeTabId);
    let isActive = $derived(activeTabId === id);
</script>

{#if isActive}
    <div class="tab-pane" in:fade={{ duration: 300 }}>
        {@render children?.()}
    </div>
{/if}

<style>
    .tab-pane {
        width: 100%;
    }
</style>
