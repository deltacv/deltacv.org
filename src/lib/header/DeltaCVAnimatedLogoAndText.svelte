<script lang="ts">
    import { onMount } from "svelte";
    import { spring } from "svelte/motion";
    import AnimatedLogo from "./DeltaCVAnimatedLogo.svelte";
    import AnimatedPresentText from "./DeltaCVAnimatedText.svelte";

    export let massive = false;

    let container: HTMLElement;
    const dispLogo = spring({ x: 0, y: 0 }, { stiffness: 0.02, damping: 0.45 });
    const dispH1 = spring({ x: 0, y: 0 }, { stiffness: 0.015, damping: 0.35 });
    const dispP = spring({ x: 0, y: 0 }, { stiffness: 0.012, damping: 0.3 });
    const scale = spring(1, { stiffness: 0.12, damping: 0.25 });

    let lastScrollY = 0;
    let lastMousePosition: { x: number; y: number } | null = null;
    let isActive = false;

    interface ClickRipple {
        id: number;
        x: number;
        y: number;
        ra: number;
        rs: number;
        cosA: number;  // cached: Math.cos(-ra * PI/180)
        sinA: number;  // cached: Math.sin(-ra * PI/180)
        startTime: number;
        strength: number;
        duration: number;
        subwaveIntensity: number;
        type: "click" | "trail";
        maxRadius: number;
        intensity: number;
    }

    let lastRippleX = 0;
    let lastRippleY = 0;

    let isNear = false;
    let isMoving = false;
    let clickRipples: ClickRipple[] = [];
    let rippleIdCounter = 0;
    let moveTimeout: any;
    let lastClickTime = 0;    // Rate-limit: min 800ms between click waves
    let lastMotionTime = 0;   // Throttle: skip mousemove events faster than 16ms
    let rippleX = 0;
    let rippleY = 0;
    let frame: number;
    let loopRunning = false;  // Idle-pause: track if RAF loop is active
    let startLoop = () => {}; // Will be assigned in onMount

    let lerpVX = 0;
    let lerpVY = 0;
    let lerpScroll = 0;
    let lastAppliedTarget = { x: 0, y: 0 };
    let vx = 0;
    let vy = 0;
    let lastX = 0;
    let lastY = 0;
    let rippleAngle = 0;
    let rippleSpeed = 0;

    let logoEl: HTMLElement;
    let textEl: HTMLElement;

    let layout = {
        rect: { left: 0, top: 0, width: 0, height: 0, bottom: 0 },
        relLX: 0,
        relLY: 0,
        relTX: 0,
        relTY: 0,
        centerX: 0,
        centerY: 0,
    };

    function updateLayout() {
        if (!container || !logoEl || !textEl) return;
        const rect = container.getBoundingClientRect();
        const logoRect = logoEl.getBoundingClientRect();
        const textRect = textEl.getBoundingClientRect();
        const sx = window.scrollX, sy = window.scrollY;

        layout = {
            rect: {
                left: rect.left + sx,
                top: rect.top + sy,
                width: rect.width,
                height: rect.height,
                bottom: rect.bottom + sy,
            },
            relLX: logoRect.left + logoRect.width / 2 - rect.left,
            relLY: logoRect.top + logoRect.height / 2 - rect.top,
            relTX: textRect.left + textRect.width / 2 - rect.left,
            relTY: textRect.top + textRect.height / 2 - rect.top,
            centerX: rect.left + sx + rect.width / 2,
            centerY: rect.top + sy + rect.height / 2,
        };
    }

    $: if (massive && container) updateLayout();

    // Single-pass dual-element displacement (replaces two separate calls to getTargetDisplacement)
    function computeDisplacements(now: number) {
        let lx = 0, ly = 0, tx = 0, ty = 0;

        // 1. Mouse-based displacement (shared math, applied to both elements)
        if (isNear && lastMousePosition) {
            const mdx = lastMousePosition.x - layout.centerX;
            const mdy = lastMousePosition.y - layout.centerY;
            const distance = Math.sqrt(mdx * mdx + mdy * mdy);
            const invDist = distance > 0 ? 1 / distance : 0;
            const norm = 1 - distance / 800;
            const factor = norm > 0 ? norm * norm * Math.sqrt(norm) : 0;
            const amplitude = isMoving ? 4 : 0.5;
            const waveOffset = Math.sin(now / 280 - distance / 40) * amplitude;
            const strength = massive ? 25 : 18;
            const base = strength * factor + waveOffset;
            lx = tx = mdx * invDist * base + lerpVX * 0.45;
            ly = ty = mdy * invDist * base + lerpVY * 0.45;
        }

        // 2. Ripple shockwave — single loop, update both elements
        for (let i = 0; i < clickRipples.length; i++) {
            const ripple = clickRipples[i];
            const age = now - ripple.startTime;
            if (age > ripple.duration) continue;

            const t = age / ripple.duration;
            const it = 1 - t;
            const waveRadius = (1 - it * it * it) * ripple.maxRadius;
            const precomp = ripple.intensity * ripple.strength * it;

            // Logo element
            const ldxL = layout.relLX - ripple.x;
            const ldyL = layout.relLY - ripple.y;
            const lRawSq = ldxL * ldxL + ldyL * ldyL;
            if (lRawSq >= 1) {
                const lRaw = Math.sqrt(lRawSq);
                const lRotX = (ldxL * ripple.cosA - ldyL * ripple.sinA) / ripple.rs;
                const lRotY = (ldxL * ripple.sinA + ldyL * ripple.cosA) * 1.25;
                const lDist = Math.sqrt(lRotX * lRotX + lRotY * lRotY);
                const lDiff = lDist - waveRadius;
                let pL = 0;
                if (lDiff > 0 && lDiff < 150) {
                    const f = 1 - lDiff / 150; pL = f * f * 0.15;
                } else if (lDiff <= 0 && lDiff > -350) {
                    const a = -lDiff, f = 1 - a / 350;
                    pL = f * f + (ripple.type === 'click' ? Math.sin(a / 35) * 0.12 * f : 0);
                }
                if (pL > 0) { const inv = precomp * pL / lRaw; lx += ldxL * inv; ly += ldyL * inv; }
            }

            // Text element
            const tdxT = layout.relTX - ripple.x;
            const tdyT = layout.relTY - ripple.y;
            const tRawSq = tdxT * tdxT + tdyT * tdyT;
            if (tRawSq >= 1) {
                const tRaw = Math.sqrt(tRawSq);
                const tRotX = (tdxT * ripple.cosA - tdyT * ripple.sinA) / ripple.rs;
                const tRotY = (tdxT * ripple.sinA + tdyT * ripple.cosA) * 1.25;
                const tDist = Math.sqrt(tRotX * tRotX + tRotY * tRotY);
                const tDiff = tDist - waveRadius;
                let pT = 0;
                if (tDiff > 0 && tDiff < 150) {
                    const f = 1 - tDiff / 150; pT = f * f * 0.15;
                } else if (tDiff <= 0 && tDiff > -350) {
                    const a = -tDiff, f = 1 - a / 350;
                    pT = f * f + (ripple.type === 'click' ? Math.sin(a / 35) * 0.12 * f : 0);
                }
                if (pT > 0) { const inv = precomp * pT / tRaw; tx += tdxT * inv; ty += tdyT * inv; }
            }
        }

        return { lx, ly, tx, ty };
    }

    function spawnRipple(
        strength = 1.0,
        duration = 3500,
        subwaveIntensity = 0.15,
        type: "click" | "trail" = "click",
        maxRadius = 1250,
        intensity = 90,
    ) {
        if (!isNear) return;

        const id = rippleIdCounter++;
        const angleRad = -rippleAngle * (Math.PI / 180);
        clickRipples.push({
            id,
            x: rippleX,
            y: rippleY,
            ra: rippleAngle,
            rs: 1 + rippleSpeed / 80,
            cosA: Math.cos(angleRad),  // cache trig at spawn, not every frame
            sinA: Math.sin(angleRad),
            startTime: Date.now(),
            strength,
            duration,
            subwaveIntensity,
            type,
            maxRadius,
            intensity,
        });
        clickRipples = clickRipples;
        startLoop(); // Ensure loop is running when a ripple is spawned
        setTimeout(() => {
            const idx = clickRipples.findIndex((r) => r.id === id);
            if (idx !== -1) clickRipples.splice(idx, 1);
            clickRipples = clickRipples;
        }, duration);
    }

    function triggerClickRipple() {
        const now = Date.now();
        if (now - lastClickTime < 800) return; // Rate-limit: max 1 click wave per 800ms
        lastClickTime = now;
        scale.set(0.7);
        scale.set(1);
        spawnRipple(1.0, 2800, 0.2, "click", 1400, 120);
    }

    function updateMotion(e?: MouseEvent | Event) {
        if (e instanceof MouseEvent) {
            // Throttle: skip events faster than ~60fps to save CPU
            const now = Date.now();
            if (now - lastMotionTime < 16) return;
            lastMotionTime = now;

            const mx = e.pageX;
            const my = e.pageY;
            lastMousePosition = { x: mx, y: my };

            const buffer = 120;
            const wasNear = isNear;
            isNear = my >= layout.rect.top - buffer && my <= layout.rect.bottom + buffer;
            if (isNear && !wasNear) startLoop(); // Resume RAF when mouse enters header

            if (lastX === 0 && lastY === 0) { lastX = mx; lastY = my; }
            vx = mx - lastX; vy = my - lastY;
            lastX = mx; lastY = my;

            if (Math.sqrt(lerpVX * lerpVX + lerpVY * lerpVY) > 0.5) {
                rippleAngle = Math.atan2(lerpVY, lerpVX) * (180 / Math.PI);
            }
            rippleSpeed = Math.sqrt(vx * vx + vy * vy);

            isMoving = true;
            clearTimeout(moveTimeout);
            moveTimeout = setTimeout(() => { isMoving = false; vx = 0; vy = 0; rippleSpeed = 0; }, 500);

            if (layout.rect.width) {
                rippleX = mx - layout.rect.left;
                rippleY = my - layout.rect.top;
                const ddx = rippleX - lastRippleX;
                const ddy = rippleY - lastRippleY;
                if (ddx * ddx + ddy * ddy > 48400 && isNear) { // 220² = 48400
                    spawnRipple(0.5, 1400, 0, "trail", 450, 50);
                    lastRippleX = rippleX;
                    lastRippleY = rippleY;
                }
            }
        } else {
            vx *= 0.85; vy *= 0.85; rippleSpeed *= 0.85;
        }

        lerpVX += (vx - lerpVX) * 0.1;
        lerpVY += (vy - lerpVY) * 0.1;

        const scrollDelta = window.scrollY - lastScrollY;
        lerpScroll += (Math.min(Math.max(scrollDelta * 0.08, -10), 10) - lerpScroll) * 0.1;

        if (layout.rect.width) {
            const now = Date.now();
            if (!isNear && clickRipples.length === 0) {
                dispLogo.set({ x: 0, y: lerpScroll });
                dispH1.set({ x: 0, y: lerpScroll });
                dispP.set({ x: 0, y: lerpScroll });
            } else {
                const { lx, ly, tx, ty } = computeDisplacements(now);
                dispLogo.set({ x: lx, y: ly + lerpScroll });
                dispH1.set({ x: tx, y: ty + lerpScroll });
                dispP.set({ x: tx, y: ty + lerpScroll });
            }
        }

        lastScrollY = window.scrollY;
    }

    onMount(() => {
        // Idle-pause: only run RAF loop when there's something to animate
        function loop() {
            if (!isActive) { loopRunning = false; return; }
            const active = isNear || rippleSpeed > 0.1 || clickRipples.length > 0 || Math.abs(window.scrollY - lastScrollY) > 1;
            if (active) {
                updateMotion();
                frame = requestAnimationFrame(loop);
            } else {
                // Nothing to animate — pause until next mouse/scroll/click
                loopRunning = false;
            }
        }

        // Assign the real startLoop implementation (module var, accessible to spawnRipple/updateMotion)
        startLoop = function() {
            if (!loopRunning && isActive) {
                loopRunning = true;
                frame = requestAnimationFrame(loop);
            }
        };

        function onScroll() { startLoop(); updateMotion(); }

        const timer = setTimeout(() => {
            isActive = true;
            lastScrollY = window.scrollY;
            updateLayout();
            window.addEventListener("resize", updateLayout);
            // passive:true: browser won't wait before scrolling
            window.addEventListener("mousemove", updateMotion, { passive: true });
            window.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("mousedown", triggerClickRipple);
            startLoop();
        }, 3500);

        return () => {
            clearTimeout(timer);
            clearTimeout(moveTimeout);
            if (frame) cancelAnimationFrame(frame);
            isActive = false;
            loopRunning = false;
            startLoop = () => {}; // Reset to noop on cleanup
            window.removeEventListener("resize", updateLayout);
            window.removeEventListener("mousemove", updateMotion);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("mousedown", triggerClickRipple);
        };
    });
</script>

<div
    class="wrapper"
    class:massive
    bind:this={container}
    style="
        --lx: {$dispLogo.x}px; --ly: {$dispLogo.y}px; 
        --hx: {$dispH1.x}px; --hy: {$dispH1.y}px; 
        --px: {$dispP.x}px; --py: {$dispP.y}px; 
        --s: {$scale}; --rx: {rippleX}px; --ry: {rippleY}px; 
        --ra: {rippleAngle}deg; --rs: {1 + rippleSpeed / 80};"
>
    <!-- Ripples: click + trail (all spawn-based, fixed position & angle) -->
    {#each clickRipples as ripple (ripple.id)}
        <div
            class="ripple violent {ripple.type}"
            style="left: {ripple.x}px; top: {ripple.y}px; --ra: {ripple.ra}deg; --rs: {ripple.rs}; --st: {ripple.strength}; --ms: {ripple.maxRadius /
                50}; --dur: {ripple.duration}ms;"
        ></div>
    {/each}

    <div class="icon" class:massive bind:this={logoEl}>
        <AnimatedLogo />
    </div>
    <div class="text" bind:this={textEl}>
        <AnimatedPresentText />
    </div>
</div>

<style>
    .wrapper {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: clamp(1.25rem, 2.5vw, 2.25rem);
        position: relative;
        will-change: transform;
    }


    .icon {
        width: 2.4em;
        height: 2.4em;
        min-width: 72px;
        min-height: 72px;
        max-width: 120px;
        max-height: 120px;
        flex-shrink: 0;
        position: relative; /* For centered ripples */
        will-change: transform;
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
        will-change: transform;
    }
    @keyframes pulse-violent {
        0% {
            transform: translate(-50%, -50%) rotate(var(--ra)) scaleX(var(--rs))
                scale(0.1);
            opacity: 1;
            border-width: 5px;
        }
        100% {
            transform: translate(-50%, -50%) rotate(var(--ra)) scaleX(var(--rs))
                scale(var(--ms));
            opacity: 0;
            border-width: 1px;
        }
    }
    .ripple.violent {
        position: absolute;
        width: 100px;
        height: 80px;
        border: 1.5px solid rgba(121, 192, 255, calc(0.3 * var(--st)));
        border-radius: 50%;
        transform: translate(-50%, -50%) rotate(var(--ra)) scaleX(var(--rs))
            scale(0.1);
        animation: pulse-violent var(--dur) forwards cubic-bezier(0, 0, 0.2, 1);
        filter: none;
        pointer-events: none;
        z-index: -1;
    }
    .ripple.violent.click {
        /* Restore multi-ring effect ONLY for click waves */
        box-shadow:
            0 0 0 4px rgba(121, 192, 255, calc(0.2 * var(--st))),
            0 0 0 12px rgba(121, 192, 255, calc(0.1 * var(--st))),
            0 0 0 25px rgba(121, 192, 255, calc(0.05 * var(--st)));
    }
    .ripple.violent.trail {
        /* Directional oval — inherits pulse-violent; --ra/--rs frozen at spawn */
        border-color: rgba(121, 192, 255, 0.2);
        box-shadow: none;
    }
</style>
