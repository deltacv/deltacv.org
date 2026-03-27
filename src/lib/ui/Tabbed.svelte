<script lang="ts">
    import { setContext } from "svelte";
    import { ArrowLeft, ArrowRight } from "lucide-svelte";

    let { children } = $props();

    let tabs = $state<{ id: string; title: string }[]>([]);
    let activeTabId = $state<string | null>(null);

    // Provide context for child Tab components
    const tabsContext = {
        get activeTabId() {
            return activeTabId;
        },
        register: (tab: { id: string; title: string }) => {
            if (!tabs.find((t) => t.id === tab.id)) {
                tabs = [...tabs, tab];
                // Default to first registered tab
                if (!activeTabId) activeTabId = tab.id;
            }
        },
    };

    setContext("tabs-context", tabsContext);

    let currentIndex = $derived(tabs.findIndex((t) => t.id === activeTabId));
    let prevTab = $derived(currentIndex > 0 ? tabs[currentIndex - 1] : null);
    let nextTab = $derived(
        currentIndex < tabs.length - 1 ? tabs[currentIndex + 1] : null,
    );

    let tabsContainer = $state<HTMLElement | null>(null);
    function scrollToTabs() {
        if (tabsContainer) {
            tabsContainer.scrollIntoView({ behavior: "smooth" });
        }
    }
</script>

<div class="tabs-wrapper">
    <!-- Tabs Navigation -->
    <div class="tabs-container" bind:this={tabsContainer}>
        {#each tabs as tab}
            <button
                class="px-8 py-4 font-bold text-[1.1rem] transition-colors duration-200 border-b-[3px] {activeTabId ===
                tab.id
                    ? 'border-[#58a6ff] text-[#c9d1d9]'
                    : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:border-[#484f58]'}"
                onclick={() => (activeTabId = tab.id)}
            >
                {tab.title}
            </button>
        {/each}
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
        {@render children?.()}
    </div>

    <!-- Bottom Tab Navigation -->
    {#if tabs.length > 1}
        <div class="tab-bottom-nav">
            {#if prevTab}
                <button
                    class="nav-btn prev"
                    onclick={() => {
                        activeTabId = prevTab.id;
                        scrollToTabs();
                    }}
                >
                    <ArrowLeft size={20} />
                    <div class="nav-content">
                        <span class="nav-label">Previous</span>
                        <span class="nav-title">{prevTab.title}</span>
                    </div>
                </button>
            {:else}
                <div class="spacer"></div>
            {/if}

            {#if nextTab}
                <button
                    class="nav-btn next"
                    onclick={() => {
                        activeTabId = nextTab.id;
                        scrollToTabs();
                    }}
                >
                    <div class="nav-content">
                        <span class="nav-label">Next</span>
                        <span class="nav-title">{nextTab.title}</span>
                    </div>
                    <ArrowRight size={20} />
                </button>
            {/if}
        </div>
    {/if}
</div>

<style>
    .tabs-wrapper {
        width: 100%;
    }

    .tabs-container {
        display: flex;
        justify-content: center;
        margin-bottom: 2.5rem;
        border-bottom: 1px solid #21262d;
    }

    .tabs-container button {
        cursor: pointer;
        background: transparent;
    }

    .tab-content {
        min-height: 200px;
    }

    /* Tab Bottom Navigation */
    .tab-bottom-nav {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        margin-top: 4rem;
        padding-top: 2rem;
        border-top: 1px solid #21262d;
    }

    .nav-btn {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 1.5rem;
        background: transparent;
        border: 1px solid #30363d;
        border-radius: 12px;
        color: #8b949e;
        cursor: pointer;
        transition: all 0.2s ease;
        flex: 1;
        max-width: 300px;
        text-align: left;
    }

    .nav-btn:hover {
        border-color: #58a6ff;
        color: #c9d1d9;
        background: rgba(88, 166, 255, 0.05);
        transform: translateY(-2px);
    }

    .nav-btn.next {
        text-align: right;
        justify-content: flex-end;
    }

    .nav-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .nav-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
        opacity: 0.7;
    }

    .nav-title {
        font-size: 1.1rem;
        font-weight: 700;
    }

    .spacer {
        flex: 1;
        max-width: 300px;
    }

    @media (max-width: 600px) {
        .tab-bottom-nav {
            flex-direction: column;
            gap: 12px;
        }

        .nav-btn,
        .spacer {
            max-width: 100%;
        }

        .spacer {
            display: none;
        }
    }
</style>
