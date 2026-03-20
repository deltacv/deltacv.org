<script lang="ts">
    export let currentPage: number = 1;
    export let totalPages: number = 1;
    export let onPageChange: (page: number) => void = () => {};

    function handlePageChange(newPage: number) {
        if (newPage >= 1 && newPage <= totalPages) {
            onPageChange(newPage);
        }
    }
</script>

{#if totalPages > 1}
    <div class="pagination">
        <button
            class="page-btn"
            disabled={currentPage === 1}
            on:click={() => handlePageChange(currentPage - 1)}
            aria-label="Previous page">← Prev</button
        >

        <span class="page-indicator">Page {currentPage} of {totalPages}</span>

        <button
            class="page-btn"
            disabled={currentPage === totalPages}
            on:click={() => handlePageChange(currentPage + 1)}
            aria-label="Next page">Next →</button
        >
    </div>
{/if}

<style>
    .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        margin-top: 3rem;
        padding-bottom: 2rem;
    }

    .page-btn {
        background: #161b22;
        border: 1px solid #30363d;
        color: #c9d1d9;
        font-size: 0.95rem;
        font-family: Arial, sans-serif;
        font-weight: 600;
        padding: 0.55rem 1.4rem;
        border-radius: 9999px;
        cursor: pointer;
        transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
    }

    .page-btn:hover:not(:disabled) {
        background: #21262d;
        border-color: #58a6ff;
        color: #58a6ff;
    }

    .page-btn:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }

    .page-indicator {
        color: #8b949e;
        font-size: 0.9rem;
        min-width: 100px;
        text-align: center;
    }
</style>
