<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Feature from "$lib/projects/Feature.svelte";

    // 1. IMPORTAMOS IMÁGENES
    import papervision_nodes_img from "$lib/assets/papervision-1.gif";
    import papervision_nodes_1_img from "$lib/assets/papervision.gif";

    // 2. IMPORTAMOS SVELTESPLIDE (El carrusel)
    import { Splide, SplideSlide } from "@splidejs/svelte-splide";

    // Importamos el tema por defecto (esto añade los círculos)
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
    const words = ["create", "prototype", "tune", "export"];
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

<svelte:head>
    <title>PaperVision - deltacv</title>
    <meta name="description" content="PaperVision is a node-based visual editor for OpenCV pipelines. Prototype, tune, and export complex computer vision algorithms without writing a single line of code." />
</svelte:head>

<div class="project-page-wrapper">
    <main
        class="container mx-auto max-w-6xl px-6 pt-32 pb-16 text-gray-100"
        in:fade={{ duration: 300 }}
    >
        <section
            class="text-center min-h-[40vh] flex flex-col justify-center items-center"
        >
            <h1
                class="text-6xl md:text-8xl font-black hero-gradient-text tracking-tighter"
            >
                PaperVision
            </h1>

            <p
                class="mt-6 text-xl md:text-2xl font-medium text-gray-300 max-w-2xl"
            >
                Visually
                <span class="font-bold text-white typing-cursor"
                    >{typedText}</span
                >
                your computer vision algorithms.
            </p>

            <div class="mt-8 flex justify-center gap-4">
                <a
                    href="https://docs.deltacv.org/papervision/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-6 py-3 font-semibold text-white bg-amber-500 rounded-lg shadow-lg shadow-amber-600/30 hover:bg-amber-400 transition-all transform hover:scale-105"
                >
                    Read the Docs
                </a>
                <a
                    href="https://github.com/deltacv/PaperVision"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-6 py-3 font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-all transform hover:scale-105"
                >
                    View on GitHub
                </a>
            </div>
        </section>

        <section class="my-24">
            <div
                class="glass-card rounded-2xl p-8 md:p-12 shadow-2xl shadow-amber-900/10 max-w-2xl mx-auto"
            >
                <h2 class="text-3xl font-bold text-white tracking-tight">
                    What is PaperVision?
                </h2>
                <p class="mt-4 text-lg text-gray-300 leading-relaxed">
                    PaperVision is a node-based pipeline editor built for
                    <span class="text-amber-400 font-medium"
                        >beginners and experts alike</span
                    >. It lets you prototype complex vision algorithms without
                    writing lines of code.
                </p>
            </div>
        </section>

        <section class="max-w-2xl w-full mx-auto mt-16 mb-24">
            <Splide
                options={splideOptions}
                aria-label="PaperVision Screenshots"
            >
                <SplideSlide class="flex items-center">
                    <figure>
                        <img
                            src={papervision_nodes_1_img}
                            alt="PaperVision node-based editor"
                            class="rounded-lg shadow-2xl shadow-amber-900/20 border border-gray-700"
                        />
                        <figcaption class="mt-2 text-sm text-gray-400">
                            Build pipelines in the node editor
                        </figcaption>
                    </figure>
                </SplideSlide>

                <SplideSlide class="flex items-center">
                    <figure>
                        <img
                            src={papervision_nodes_img}
                            alt="GIF of PaperVision's node editor in action"
                            class="rounded-lg shadow-2xl shadow-amber-900/20 border border-gray-700"
                        />
                        <figcaption class="mt-2 text-sm text-gray-400">
                            Seamlessly visualize and tune your pipeline in the
                            editor
                        </figcaption>
                    </figure>
                </SplideSlide>
            </Splide>
        </section>

        <section class="my-24">
            <h2 class="text-center text-4xl font-bold tracking-tighter">
                A Modern Toolkit for CV
            </h2>
            <p class="text-center mt-3 text-lg text-gray-400">
                From visual editing to live simulation.
            </p>

            <div
                class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <Feature
                    icon={Zap}
                    title="Visual Node Editor"
                    desc="Drag, drop, and connect nodes to intuitively build complex algorithms."
                />
                <Feature
                    icon={Eye}
                    title="Real-Time Node Previews"
                    desc="Instantly see the output of every single node in your pipeline to debug faster."
                />
                <Feature
                    icon={SlidersHorizontal}
                    title="Live Parameter Tuning"
                    desc="Allows you to adjust pipeline parameters in real-time."
                />
                <Feature
                    icon={Code2}
                    title="One-Click Code Generation"
                    desc="Generates clean, corresponding Java pipeline code for your Android Studio project."
                />
                <Feature
                    icon={Tag}
                    title="Custom Detections"
                    desc="Includes pre-built nodes for blob detectors, color thresholding, and more."
                />
                <Feature
                    icon={Video}
                    title="Supports All Input Sources"
                    desc="Works seamlessly with all image sources, including webcams, images, and videos."
                />
            </div>
        </section>
    </main>
</div>

<style>
    .project-page-wrapper {
        min-height: 100vh;
        background-color: #05070a;
        background-image: radial-gradient(
                circle at 20% 30%,
                rgba(251, 191, 36, 0.035),
                transparent 30%
            ),
            radial-gradient(
                circle at 80% 70%,
                rgba(249, 115, 22, 0.02),
                transparent 30%
            ),
            linear-gradient(rgba(48, 54, 61, 0.15) 1px, transparent 2px),
            linear-gradient(90deg, rgba(48, 54, 61, 0.15) 1px, transparent 2px);
        background-size:
            100% 100%,
            100% 100%,
            80px 80px,
            80px 80px;
        background-attachment: fixed;
    }

    /* CAMBIO: Gradiente del H1 (Amarillo a Naranja) */
    .hero-gradient-text {
        background: linear-gradient(to right, #facc15, #f97316);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* ESTILOS DEL CARRUSEL */
    :global(.splide__pagination__page.is-active) {
        /* CAMBIO: Color de la paginación */
        background: #facc15 !important;
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
        bottom: -1.5rem;
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
