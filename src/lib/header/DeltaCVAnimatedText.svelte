<script>
    import { fade, fly } from 'svelte/transition';
</script>

<div class="logo-text" in:fly={{ x: -50, delay: 1000, duration: 2300 }} out:fade={{ duration: 1200 }}>
    <h1>deltacv</h1>
    <p in:fly={{ y: -50, delay: 1200, duration: 2500 }}>
        Making computer vision approachable to everyone.
    </p>
</div>

<style>
    .logo-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
        max-width: 90%;
        margin-left: 2vw;
    }

    h1, p {
        font-family: "Noto Sans", sans-serif;
        margin: 0;
        padding: 0;
        color: #c9d1d9;
        transition: transform 0.1s ease-out; /* Match spring responsiveness */
    }

    h1 {
        font-size: clamp(1.8rem, 3vw, 2.6rem);
        font-weight: 800;
        transform: translate(var(--hx), var(--hy)) scale(var(--s));
    }

    p {
        color: #8b949e;
        font-size: clamp(1rem, 2.3vw, 1.7rem);
        font-weight: 400;
        line-height: 1.3;
        margin-top: 0.4rem;
        white-space: nowrap; /* keeps it one line by default */
        overflow: hidden;
        text-overflow: ellipsis;
        transform: translate(var(--px), var(--py)) scale(var(--s));
    }

    /* allow wrapping only when absolutely necessary */
    @media (max-width: 480px) {
        .logo-text p {
            white-space: normal;
            text-overflow: unset;
        }
    }
</style>
