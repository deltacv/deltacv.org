<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Feature from "$lib/projects/Feature.svelte";

    import eocvsim_img from "$lib/assets/eocvsim.png";
    import eocvsim_1_img from "$lib/assets/eocvsim-tuner.gif";

    import { Splide, SplideSlide } from "@splidejs/svelte-splide";

    import "@splidejs/svelte-splide/css";

    // 3. IMPORTAMOS LOS ICONOS
    import {
        Eye,
        Code2,
        SlidersHorizontal,
        Zap,
        Tag,
        Video,
    } from "lucide-svelte";

    // 4. OPCIONES DEL CARRUSEL
    const splideOptions = {
        type: "loop",
        perPage: 1,
        autoplay: true,
        interval: 4000,
        pauseOnHover: true,
        gap: "1rem",
        arrows: false,
    };

    // --- Typing effect ---
    let typedText = "";
    const words = ["develop", "test", "tune"];
    let i = 0,
        j = 0,
        isDeleting = false;

    function type() {
        const currentWord = words[i];
        if (isDeleting) {
            typedText = currentWord.substring(0, j - 1);
            j--;
            if (j === 0) {
                isDeleting = false;
                i = (i + 1) % words.length;
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

    onMount(() => {
        type();
    });
</script>

<div class="project-page-wrapper">
    <main class="container mx-auto max-w-6xl px-6 pt-32 pb-16 text-gray-100" in:fade={{ duration: 300 }}>
        <section
            class="text-center min-h-[40vh] flex flex-col justify-center items-center"
        >
            <h1
                class="text-6xl md:text-8xl font-black hero-gradient-text tracking-tighter"
            >
                EOCV-Sim
            </h1>
            <p class="mt-6 text-xl md:text-2xl font-medium text-gray-300 max-w-2xl">
                A simple interface to
                <span class="font-bold text-white typing-cursor">{typedText}</span>
                your computer vision pipelines.
            </p>

            <div class="mt-8 flex justify-center gap-4">
                <a
                    href="https://docs.deltacv.org/eocv-sim"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-6 py-3 font-semibold text-white bg-cyan-600 rounded-lg shadow-lg shadow-cyan-700/30 hover:bg-cyan-500 transition-all transform hover:scale-105"
                >
                    Read the Docs
                </a>
                <a
                    href="https://github.com/deltacv/EOCV-Sim"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-6 py-3 font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-all transform hover:scale-105"
                >
                    View on GitHub
                </a>
            </div>
        </section>

        <section class="mt-16 mb-24">
            <div
                class="glass-card rounded-2xl p-8 md:p-12 shadow-2xl shadow-cyan-900/10 max-w-2xl mx-auto"
            >
                <h2 class="text-3xl font-bold text-white tracking-tight">
                    What is EOCV-Sim?
                </h2>
                <p class="mt-4 text-lg text-gray-300 leading-relaxed">
                    EOCV-Sim (EasyOpenCV Simulator) is a desktop tool built for
                    <span class="text-cyan-400 font-medium"
                        >FIRST Tech Challenge (FTC)</span
                    > teams. It mimics the EasyOpenCV library and FTC SDK, letting you
                    test and refine computer vision pipelines right on your computer.
                </p>
                <p class="mt-4 text-lg text-gray-300 leading-relaxed">
                    Stop wasting time on the slow build-and-deploy cycle. Perfect
                    your vision code, then simply
                    <span class="font-bold text-white">copy and paste it</span> directly
                    into your robot's Android Studio project. Test instantly, deploy
                    once.
                </p>
            </div>

            <div class="max-w-2xl w-full mx-auto mt-12">
                <Splide options={splideOptions} aria-label="EOCV-Sim Screenshots">
                    <SplideSlide class="flex items-center">
                        <figure>
                            <img
                                src={eocvsim_img}
                                alt="EOCV-Sim main user interface"
                                class="rounded-lg shadow-2xl shadow-cyan-900/20 border border-gray-700"
                            />
                            <figcaption class="mt-2 text-sm text-gray-400">
                                EOCV-Sim main user interface
                            </figcaption>
                        </figure>
                    </SplideSlide>

                    <SplideSlide class="flex items-center">
                        <figure>
                            <img
                                src={eocvsim_1_img}
                                alt="EOCV-Sim variable tuner"
                                class="rounded-lg shadow-2xl shadow-cyan-900/20 border border-gray-700"
                            />
                            <figcaption class="mt-2 text-sm text-gray-400">
                                Using the variable tuner to adjust thresholds
                            </figcaption>
                        </figure>
                    </SplideSlide>
                </Splide>
            </div>
        </section>

        <section class="my-24">
            <h2 class="text-center text-4xl font-bold tracking-tighter">
                Everything you need to code.
            </h2>
            <p class="text-center mt-3 text-lg text-gray-400">
                From live tuning to node-based editing.
            </p>

            <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Feature
                    icon={Eye}
                    title="Live Pipeline Testing"
                    desc="Run your pipelines in a simple UI with live feedback from a webcam, image, or video file."
                />
                <Feature
                    icon={Code2}
                    title="FTC SDK Simulation"
                    desc="Mimics the FTC SDK structure, allowing for easy copy-pasting of code to your robot project."
                />
                <Feature
                    icon={SlidersHorizontal}
                    title="Real-Time Variable Tuning"
                    desc="Adjust pipeline variables on the fly and see their effect instantly without recompiling."
                />
                <Feature
                    icon={Zap}
                    url="/papervision"
                    title="PaperVision Node Editor"
                    desc="Prototype algorithms visually with a built-in, user-friendly node editor."
                />
                <Feature
                    icon={Tag}
                    title="AprilTag Support"
                    desc="Includes full support for the modern `VisionPortal` API and AprilTag detection."
                />
                <Feature
                    icon={Video}
                    title="Multiple Input Sources"
                    desc="Test with webcams, static images, or pre-recorded video files to simulate any condition."
                />
            </div>
        </section>
    </main>
</div>

<style>
    .project-page-wrapper {
        min-height: 100vh;
        background-color: #05070a;
        background-image: 
            radial-gradient(circle at 20% 30%, rgba(34, 211, 238, 0.03), transparent 30%),
            radial-gradient(circle at 80% 70%, rgba(14, 165, 233, 0.02), transparent 30%),
            linear-gradient(rgba(48, 54, 61, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(48, 54, 61, 0.15) 1px, transparent 1px);
        background-size: 100% 100%, 100% 100%, 80px 80px, 80px 80px;
        background-attachment: fixed;
    }

    /* El H1 (sin cambios) */
    .hero-gradient-text {
        background: linear-gradient(to right, #22d3ee, #0ea5e9, #6366f1);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* ESTILOS DEL CARRUSEL */
    :global(.splide__pagination__page.is-active) {
        background: #22d3ee !important; /* Tu color cyan */
        transform: scale(1.2);
    }
    :global(.splide__pagination__page) {
        background: #4b5563; /* Gris */
        opacity: 0.7;
    }
    :global(.splide__track) {
        border-radius: 0.5rem;
    }

    /* Centra la paginación (círculos) */
    :global(.splide__pagination) {
        bottom: -1.5rem; /* Ajusta esto si quieres más o menos espacio */
    }

    /* ESTILOS ANTERIORES (sin cambios) */
    .glass-card {
        background: rgba(13, 17, 23, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(55, 65, 81, 0.3);
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
</style>
