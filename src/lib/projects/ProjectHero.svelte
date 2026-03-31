<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { ChevronDown } from "lucide-svelte";
    import { progressiveVideo } from "$lib/actions/progressiveVideo";

    let {
        title = "Project",
        titleGradient = "linear-gradient(to right, #22d3ee, #0ea5e9, #6366f1)",
        videoSrc,
        typingWords = [],
        introPreText = "",
        introPostText = "",
        scrollIndicatorColorClass = "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]",
        videoFit = "contain",
        actions,
    } = $props<{
        title: string;
        titleGradient?: string;
        videoSrc: string;
        typingWords: string[];
        introPreText: string;
        introPostText: string;
        scrollIndicatorColorClass?: string;
        videoFit?: "contain" | "cover";
        actions: Snippet;
    }>();

    // --- Typing effect ---
    let typedText = $state("");
    let i = $state(0),
        j = $state(0),
        isDeleting = $state(false);

    function type() {
        if (typingWords.length === 0) return;

        const currentWord = typingWords[i];
        if (isDeleting) {
            typedText = currentWord.substring(0, j - 1);
            j--;
            if (j === 0) {
                isDeleting = false;
                i = (i + 1) % typingWords.length;
            }
        } else {
            typedText = currentWord.substring(0, j + 1);
            j++;
            if (j === currentWord.length) {
                isDeleting = true;
                setTimeout(type, 1500);
                return;
            }
        }
        setTimeout(type, isDeleting ? 100 : 150);
    }

    let mounted = $state(false);

    onMount(() => {
        mounted = true;
        if (typingWords.length > 0) {
            type();
        }

        let isSnapping = false;
        let snapTimeout: ReturnType<typeof setTimeout>;
        let animationFrameId: number;

        function animateScrollTo(targetY: number, duration: number = 400) {
            isSnapping = true;
            const startY = window.scrollY || document.documentElement.scrollTop || 0;
            const distance = targetY - startY;
            let startTime: number | null = null;

            // easeOutCubic (snappier, faster to start, smooth to stop)
            function easeOutCubic(t: number, b: number, c: number, d: number) {
                t /= d;
                t--;
                return c * (t * t * t + 1) + b;
            }

            function step(currentTime: number) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                
                // Math.round fixes sub-pixel APZ stutter in Firefox
                const nextY = Math.round(easeOutCubic(timeElapsed, startY, distance, duration));
                
                window.scrollTo(0, nextY);

                if (timeElapsed < duration) {
                    animationFrameId = requestAnimationFrame(step);
                } else {
                    window.scrollTo(0, targetY);
                    clearTimeout(snapTimeout);
                    snapTimeout = setTimeout(() => { isSnapping = false; }, 100);
                }
            }
            
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(step);
        }

        const handleWheel = (e: WheelEvent) => {
            if (isSnapping) {
                e.preventDefault();
                // We DO NOT extend the lock here. 
                // Momentum events are swallowed only while the visual animation plays.
                return;
            }
            
            const scroll = window.scrollY || document.documentElement.scrollTop || 0;
            const vh = window.innerHeight;
            
            let dy = e.deltaY;
            if (e.deltaMode === 1) dy *= 20; 
            else if (e.deltaMode === 2) dy = vh; 

            // DOWNWARDS SNAP
            if (scroll < 50 && dy > 0) {
                e.preventDefault();
                animateScrollTo(vh);
            } 
            // UPWARDS SNAP
            else if (scroll > 20 && scroll <= vh + 50 && dy < 0) {
                e.preventDefault();
                animateScrollTo(0);
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            window.removeEventListener("wheel", handleWheel);
            clearTimeout(snapTimeout);
            cancelAnimationFrame(animationFrameId);
        };
    });
</script>

<section class="hero-full-viewport">
    {#if mounted}
        <div class="hero-video-background">
            <video
                src={videoSrc}
                use:progressiveVideo
                in:fade={{ duration: 1000 }}
                autoplay
                muted
                loop
                playsinline
                class="hero-video"
                style="--video-fit: {videoFit}"
            ></video>
            <div class="hero-video-overlay"></div>
        </div>
    {/if}

    <div class="hero-content">
        <h1
            class="text-6xl md:text-8xl font-black tracking-tighter"
            in:fly={{ y: 20, duration: 800, delay: 200 }}
            style="background: {titleGradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
        >
            {title}
        </h1>
        <p
            class="mt-6 text-xl md:text-2xl font-medium text-gray-300 max-w-2xl hero-intro-text"
            in:fly={{ y: 20, duration: 800, delay: 400 }}
        >
            {introPreText}
            {#if typingWords.length > 0}
                <span class="font-bold text-white typing-cursor"
                    >{typedText}</span
                >
            {/if}
            {introPostText}
        </p>

        <div
            class="mt-8 flex justify-center gap-4 hero-actions"
            in:fly={{ y: 20, duration: 800, delay: 600 }}
        >
            {@render actions()}
        </div>
    </div>

    <button
        class="scroll-indicator"
        in:fade={{ delay: 1000, duration: 800 }}
        onclick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        aria-label="Scroll to content"
    >
        <ChevronDown
            size={48}
            class="animate-bounce {scrollIndicatorColorClass}"
        />
    </button>
</section>

<style>
    .hero-full-viewport {
        position: relative;
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        overflow: hidden;
    }

    .hero-video-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        -webkit-mask-image: linear-gradient(
                to bottom,
                transparent,
                black 20%,
                black 80%,
                transparent
            ),
            linear-gradient(
                to right,
                transparent,
                black 15%,
                black 85%,
                transparent
            );
        mask-image: linear-gradient(
                to bottom,
                transparent,
                black 20%,
                black 80%,
                transparent
            ),
            linear-gradient(
                to right,
                transparent,
                black 15%,
                black 85%,
                transparent
            );
        -webkit-mask-composite: source-in;
        mask-composite: intersect;
    }

    .hero-video {
        width: 100%;
        height: 100%;
        object-fit: var(--video-fit, contain);
        opacity: 0.65;
        filter: brightness(0.85) contrast(1.1);
    }

    .hero-video-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
            ellipse at center,
            transparent 0%,
            rgba(5, 7, 10, 0.4) 100%
        );
    }

    .hero-content {
        position: relative;
        z-index: 10;
        padding: 0 1.5rem;
    }

    .scroll-indicator {
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        opacity: 0.8;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        outline: none;
        transition: opacity 0.3s ease;
    }

    .scroll-indicator:hover {
        opacity: 1;
    }

    .typing-cursor::after {
        content: "_";
        animation: blink 0.7s infinite;
    }

    @keyframes blink {
        50% {
            opacity: 0;
        }
    }

    .hero-intro-text,
    .hero-actions {
        position: relative;
        z-index: 1;
    }
</style>
