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
        startTime: number;
        strength: number;
        duration: number;
        subwaveIntensity: number;
        type: 'click' | 'trail';
        maxRadius: number; // New: unique per ripple
        intensity: number; // New: unique per ripple
    }
    
    let lastRippleX = 0;
    let lastRippleY = 0;

    let isNear = false;
    let isMoving = false;
    let clickRipples: ClickRipple[] = [];
    let rippleIdCounter = 0;
    let moveTimeout: any;
    let rippleX = 0;
    let rippleY = 0;
    let frame: number;

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
        relLX: 0, relLY: 0, relTX: 0, relTY: 0,
        centerX: 0, centerY: 0
    };

    function updateLayout() {
        if (!container || !logoEl || !textEl) return;
        const rect = container.getBoundingClientRect();
        const logoRect = logoEl.getBoundingClientRect();
        const textRect = textEl.getBoundingClientRect();

        layout = {
            rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height, bottom: rect.bottom },
            relLX: (logoRect.left + logoRect.width / 2) - rect.left,
            relLY: (logoRect.top + logoRect.height / 2) - rect.top,
            relTX: (textRect.left + textRect.width / 2) - rect.left,
            relTY: (textRect.top + textRect.height / 2) - rect.top,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2
        };
    }

    $: if (massive && container) updateLayout();

    function getTargetDisplacement(elRelX: number, elRelY: number) {
        if (!layout.rect.width || !isActive) return { x: 0, y: 0 };

        let targetX = 0;
        let targetY = 0;

        // 1. Mouse-based displacement (Shared Component Center)
        if (lastMousePosition) {
            const dx = lastMousePosition.x - layout.centerX;
            const dy = lastMousePosition.y - layout.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Tighten to header area (120px buffer)
            const buffer = 120;
            isNear = lastMousePosition.y >= layout.rect.top - buffer && 
                     lastMousePosition.y <= layout.rect.bottom + buffer;

            if (isNear) {
                const threshold = 800; 
                const strength = massive ? 25 : 18; 
                const factor = Math.max(0, Math.pow(1 - distance / threshold, 1.2));
                
                const amplitude = isMoving ? 4 : 0.5;
                const waveOffset = Math.sin(Date.now() / 280 - distance / 40) * amplitude;
                
                targetX = (dx / distance) * (strength * factor + waveOffset) + (lerpVX * 0.45);
                targetY = (dy / distance) * (strength * factor + waveOffset) + (lerpVY * 0.45);
            } else {
                targetX = 0;
                targetY = 0;
            }
        }

        // 2. Click/Trail shockwave displacement (Clean, Forceful Engine)
        const now = Date.now();

        clickRipples.forEach(ripple => {
            const age = now - ripple.startTime;
            if (age > ripple.duration) return;

            const t = age / ripple.duration;
            const easedT = 1 - Math.pow(1 - t, 3.2); 
            const waveRadius = easedT * ripple.maxRadius;
            
            const dx = elRelX - ripple.x;
            const dy = elRelY - ripple.y;
            const rawDist = Math.sqrt(dx * dx + dy * dy);
            if (rawDist < 1) return;

            // Simple Ellipse transformation matching CSS
            const angleRad = -ripple.ra * (Math.PI / 180);
            const cosA = Math.cos(angleRad);
            const sinA = Math.sin(angleRad);
            const ldx = dx * cosA - dy * sinA;
            const ldy = dx * sinA + dy * cosA;
            
            // Dist matches the scaled circles in CSS (100x80 base)
            const dist = Math.sqrt(Math.pow(ldx / ripple.rs, 2) + Math.pow(ldy / 0.8, 2));
            const diff = dist - waveRadius;
            
            let pushFactor = 0;
            if (diff > 0 && diff < 150) {
                // Ahead: Subtle anticipation (Gentle lift)
                pushFactor = Math.pow(1 - diff / 150, 2) * 0.15;
            } else if (diff <= 0 && diff > -350) {
                // Peak: Strong forceful displacement
                pushFactor = Math.pow(1 - Math.abs(diff) / 350, 2);
                // Mini-ripples for texture (Click only)
                if (ripple.type === 'click') {
                    pushFactor += Math.sin(Math.abs(diff) / 35) * 0.12 * (1 - Math.abs(diff) / 350);
                }
            } else {
                return; // Far behind the wave
            }
            
            const decay = 1 - t; 
            const finalIntensity = ripple.intensity * ripple.strength;
            targetX += (dx / rawDist) * finalIntensity * pushFactor * decay;
            targetY += (dy / rawDist) * finalIntensity * pushFactor * decay;
        });

        return { x: targetX, y: targetY };
    }

    function spawnRipple(strength = 1.0, duration = 3500, subwaveIntensity = 0.15, type: 'click' | 'trail' = 'click', maxRadius = 1250, intensity = 90) {
        if (!isNear) return;
        
        const id = rippleIdCounter++;
        const rsVal = 1 + rippleSpeed / 80;
        const newRipple: ClickRipple = {
            id,
            x: rippleX,
            y: rippleY,
            ra: rippleAngle,
            rs: rsVal,
            startTime: Date.now(),
            strength,
            duration,
            subwaveIntensity,
            type,
            maxRadius,
            intensity
        };
        clickRipples = [...clickRipples, newRipple];
        setTimeout(() => {
            clickRipples = clickRipples.filter(r => r.id !== id);
        }, duration);
    }

    function triggerClickRipple() {
        scale.set(0.7);
        scale.set(1); 
        spawnRipple(1.0, 2800, 0.2, 'click', 1400, 120);
    }

    function updateMotion(e?: MouseEvent | Event) {
        if (e instanceof MouseEvent) {
            lastMousePosition = { x: e.clientX, y: e.clientY };
            
            if (lastX === 0 && lastY === 0) {
                lastX = e.clientX;
                lastY = e.clientY;
            }

            vx = e.clientX - lastX;
            vy = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;
            
            // Smooth orientation using lerped momentum vectors
            if (Math.sqrt(lerpVX * lerpVX + lerpVY * lerpVY) > 0.5) {
                rippleAngle = Math.atan2(lerpVY, lerpVX) * (180 / Math.PI);
            }
            
            rippleSpeed = Math.sqrt(vx * vx + vy * vy);

            isMoving = true;
            clearTimeout(moveTimeout);
            moveTimeout = setTimeout(() => {
                isMoving = false;
                vx = 0; vy = 0;
                rippleSpeed = 0;
            }, 500);

            if (layout.rect.width) {
                rippleX = e.clientX - layout.rect.left;
                rippleY = e.clientY - layout.rect.top;

                // Trail ripples: spawn less frequently (120px) to prevent lag
                const distSinceLast = Math.sqrt(Math.pow(rippleX - lastRippleX, 2) + Math.pow(rippleY - lastRippleY, 2));
                if (distSinceLast > 120 && isNear) {
                    spawnRipple(0.04, 600, 0, 'trail', 450, 35); 
                    lastRippleX = rippleX;
                    lastRippleY = rippleY;
                }
            }
        } else {
            // Decay
            vx *= 0.85;
            vy *= 0.85;
            rippleSpeed *= 0.85;
        }

        // Apply momentum lerping
        lerpVX += (vx - lerpVX) * 0.1;
        lerpVY += (vy - lerpVY) * 0.1;
        
        const scrollDelta = window.scrollY - lastScrollY;
        const scrollImpulse = Math.min(Math.max(scrollDelta * 0.08, -10), 10);
        lerpScroll += (scrollImpulse - lerpScroll) * 0.1;

        if (layout.rect.width) {
            // Calculate independent spatial displacement using cached layout
            const logoDisp = getTargetDisplacement(layout.relLX, layout.relLY);
            const textDisp = getTargetDisplacement(layout.relTX, layout.relTY);

            const finalLY = logoDisp.y + lerpScroll;
            const finalTY = textDisp.y + lerpScroll;

            // Apply to springs
            dispLogo.set({ x: logoDisp.x, y: finalLY });
            dispH1.set({ x: textDisp.x, y: finalTY });
            dispP.set({ x: textDisp.x, y: finalTY });

            lastAppliedTarget = { x: textDisp.x, y: finalTY };
        }
        
        lastScrollY = window.scrollY;
    }

    onMount(() => {
        const loop = () => {
            // Performance: only run logic if something is happening
            if (isActive && (isNear || rippleSpeed > 0.1 || Math.abs(window.scrollY - lastScrollY) > 1)) {
                updateMotion();
            }
            frame = requestAnimationFrame(loop);
        };

        const timer = setTimeout(() => {
            isActive = true;
            lastScrollY = window.scrollY;
            updateLayout(); 
            window.addEventListener("resize", updateLayout);
            window.addEventListener("mousemove", updateMotion);
            window.addEventListener("scroll", () => updateMotion());
            window.addEventListener("mousedown", triggerClickRipple);
            frame = requestAnimationFrame(loop);
        }, 3500);

        return () => {
            clearTimeout(timer);
            clearTimeout(moveTimeout);
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener("resize", updateLayout);
            window.removeEventListener("mousemove", updateMotion);
            window.removeEventListener("scroll", () => updateMotion());
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
    <!-- Mouse tracking ripples -->
    <div class="ripples" class:visible={isNear && isMoving}>
        <div class="ripple"></div>
        <div class="ripple" style="animation-delay: 0.8s;"></div>
        <div class="ripple" style="animation-delay: 1.6s;"></div>
    </div>

    <!-- Independent click ripples (fixes double translation) -->
    {#each clickRipples as ripple (ripple.id)}
        <div 
            class="ripple violent {ripple.type}" 
            style="left: {ripple.x}px; top: {ripple.y}px; --ra: {ripple.ra}deg; --rs: {ripple.rs}; --st: {ripple.strength}; --ms: {ripple.maxRadius / 50}; --dur: {ripple.duration}ms;"
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
    }

    .ripples {
        position: absolute;
        left: var(--rx);
        top: var(--ry);
        transform: translate(-50%, -50%) rotate(var(--ra)) scaleX(var(--rs));
        pointer-events: none;
        z-index: -1;
        opacity: 0;
        transition: opacity 0.8s ease, transform 0.4s ease-out; /* Faster exit when leaving header */
    }

    .ripples.visible {
        opacity: 0.15; /* Even subtler for global header interaction */
    }

    .ripple {
        position: absolute;
        width: 70px;
        height: 50px;
        border: 1.5px solid rgba(88, 166, 255, 0.6);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: pulse 2.2s infinite cubic-bezier(0.4, 0, 0.6, 1);
        filter: none;
    }

    @keyframes pulse {
        0% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 0;
            border-width: 4px;
        }
        20% {
            opacity: 0.8;
        }
        100% {
            transform: translate(-50%, -50%) scale(8);
            opacity: 0;
            border-width: 1px;
        }
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
    @keyframes pulse-violent {
        0% {
            transform: translate(-50%, -50%) rotate(var(--ra)) scaleX(var(--rs)) scale(0.1);
            opacity: 1;
            border-width: 5px;
        }
        100% {
            transform: translate(-50%, -50%) rotate(var(--ra)) scaleX(var(--rs)) scale(var(--ms));
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
        transform: translate(-50%, -50%) rotate(var(--ra)) scaleX(var(--rs)) scale(0.1);
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
        box-shadow: none; /* Keep trails extremely clean */
        border-color: rgba(121, 192, 255, calc(0.1 * var(--st)));
    }
</style>
