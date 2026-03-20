<script>
    import AnimatedLogo from "./DeltaCVAnimatedLogo.svelte";
    import AnimatedPresentText from "./DeltaCVAnimatedText.svelte";

    export let massive = false;
</script>

<div class="wrapper" class:massive>
    <div class="icon" class:massive>
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

    .wrapper.massive {
        font-size: clamp(2.5rem, 6vw, 4rem);
        gap: 1.5rem;
    }

    .icon.massive {
        width: 1.6em;
        height: 1.6em;
        min-width: 90px;
        min-height: 90px;
        max-width: 120px;
        max-height: 120px;
    }

    @media (min-width: 900px) {
        .wrapper {
            font-size: clamp(1.6rem, 2vw, 2.4rem);
        }
        .wrapper.massive {
            font-size: clamp(3.5rem, 7vw, 5.5rem);
            gap: 2.5rem;
        }
        .icon {
            width: 2.4em;
            height: 2.4em;
            min-width: 110px;
            min-height: 110px;
            max-width: 160px;
            max-height: 160px;
        }
        .icon.massive {
            width: 1.6em;
            height: 1.6em;
            min-width: 120px;
            min-height: 120px;
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
