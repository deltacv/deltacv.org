<script>
    import AnimatedLogo from "./DeltaCVAnimatedLogo.svelte";
    import AnimatedPresentText from "./DeltaCVAnimatedText.svelte";
</script>

<div class="wrapper">
    <div class="icon">
        <AnimatedLogo />
    </div>
    <div class="text">
        <AnimatedPresentText />
    </div>
</div>

<style>
    .wrapper {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: clamp(1.25rem, 2.5vw, 2.25rem);
    }

    .icon {
        width: 2.4em;
        height: 2.4em;
        min-width: 72px;
        min-height: 72px;
        max-width: 120px;
        max-height: 120px;
        flex-shrink: 0;
    }

    @media (min-width: 900px) {
        .wrapper {
            font-size: clamp(1.6rem, 2vw, 2.4rem);
        }
        .icon {
            width: 2.4em;
            height: 2.4em;
            min-width: 110px;
            min-height: 110px;
            max-width: 160px;
            max-height: 160px;
        }
    }

    .icon :global(svg),
    .icon :global(*) {
        width: 100%;
        height: 100%;
        display: block;
    }

    .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        align-self: stretch;
    }
</style>
