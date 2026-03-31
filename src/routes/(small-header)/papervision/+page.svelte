<script lang="ts">
    import ProjectHero from "$lib/projects/ProjectHero.svelte";
    import Feature from "$lib/projects/Feature.svelte";

    import { m } from "$lib/media";
    import MediaElement from "$lib/ui/MediaElement.svelte";

    // 2. IMPORTAMOS SVELTESPLIDE (El carrusel)
    import { Splide, SplideSlide } from "@splidejs/svelte-splide";

    // Importamos el tema por defecto (esto añade los círculos)
    import "@splidejs/svelte-splide/css";

    import {
        Eye,
        Code2,
        SlidersHorizontal,
        Zap,
        Tag,
        Video,
        MonitorPlay,
        Download,
    } from "lucide-svelte";

    // 4. OPCIONES DEL CARRUSEL
    const splideOptions = {
        type: "loop",
        perPage: 1,
        autoplay: "pause" as "pause",
        interval: 4000,
        pauseOnHover: true,
        gap: "1rem",
        arrows: false,
    };

    let splideRef: any = $state(null);

    function playWhenVisible(node: HTMLElement) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const autoplay = splideRef?.splide?.Components?.Autoplay;
                    if (!autoplay) return;

                    if (entry.isIntersecting) {
                        autoplay.play();
                    } else {
                        autoplay.pause();
                    }
                });
            },
            { threshold: 0.2 },
        );

        observer.observe(node);

        return {
            destroy() {
                observer.disconnect();
            },
        };
    }
</script>

<svelte:head>
    <title>PaperVision - deltacv</title>
    <meta
        name="description"
        content="PaperVision is a node-based visual editor for OpenCV pipelines. Prototype, tune, and export complex computer vision algorithms without writing a single line of code."
    />
</svelte:head>

<div class="project-page-wrapper">
    <ProjectHero
        title="PaperVision"
        titleGradient="linear-gradient(to right, #fbbf24, #f59e0b, #ea580c)"
        videoSrc={m("/papervision-hero.mp4")}
        typingWords={["create", "prototype", "tune", "export"]}
        introPreText="Visually"
        introPostText="your computer vision algorithms."
        scrollIndicatorColorClass="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
        videoFit="contain"
    >
        {#snippet actions()}
            <div class="flex flex-col gap-4 w-full sm:w-fit">
                <!-- Top Download Button -->
                <a
                    href="#integration"
                    onclick={(e) => {
                        e.preventDefault();
                        document
                            .getElementById("integration")
                            ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    class="w-full px-8 py-3.5 font-bold text-gray-900 bg-amber-500 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:bg-amber-400 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2.5"
                >
                    <Download size={20} />
                    Download
                </a>

                <!-- Bottom Buttons Row -->
                <div class="flex flex-col sm:flex-row gap-4 w-full">
                    <a
                        href="https://docs.deltacv.org/papervision/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex-1 px-8 py-3.5 font-semibold text-white bg-gray-800/80 backdrop-blur border border-gray-700/80 rounded-xl hover:bg-gray-700/80 hover:border-gray-500/50 transition-all transform hover:-translate-y-1 text-center shadow-lg whitespace-nowrap"
                    >
                        Read the Docs
                    </a>
                    <a
                        href="https://github.com/deltacv/PaperVision"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex-1 px-8 py-3.5 font-semibold text-white bg-gray-800/80 backdrop-blur border border-gray-700/80 rounded-xl hover:bg-gray-700/80 hover:border-gray-500/50 transition-all transform hover:-translate-y-1 text-center shadow-lg whitespace-nowrap"
                    >
                        View Source
                    </a>
                </div>
            </div>
        {/snippet}
    </ProjectHero>

    <main class="container mx-auto max-w-6xl px-6 py-24 text-gray-100">
        <section class="my-32 relative">
            <!-- Decorative Glow -->
            <div
                class="absolute inset-0 max-w-5xl mx-auto -z-10 bg-amber-600/10 blur-[100px] rounded-full"
            ></div>

            <div
                class="glass-card rounded-3xl p-8 md:p-14 shadow-2xl shadow-amber-900/20 max-w-5xl mx-auto relative overflow-hidden group"
            >
                <!-- Subtle internal shine effect -->
                <div
                    class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                ></div>

                <div
                    class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10"
                >
                    <div>
                        <div
                            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-6 border border-amber-500/20"
                        >
                            <span class="relative flex h-2 w-2">
                                <span
                                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"
                                ></span>
                                <span
                                    class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"
                                ></span>
                            </span>
                            OpenCV Node Editor
                        </div>
                        <h2
                            class="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight"
                        >
                            What is PaperVision?
                        </h2>
                        <p
                            class="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed"
                        >
                            PaperVision is a node-based pipeline editor built
                            for
                            <span
                                class="text-amber-400 font-semibold drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]"
                                >beginners and experts alike</span
                            >. It bridges the gap between conceptual design and
                            executed algorithms, letting you prototype complex
                            computer vision logic without writing endless lines
                            of boilerplate code.
                        </p>
                    </div>

                    <div class="flex flex-col gap-4">
                        <div
                            class="flex items-start gap-5 bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-md hover:border-amber-500/30 transition-colors"
                        >
                            <div
                                class="p-3 bg-amber-500/20 text-amber-400 rounded-xl shadow-inner shadow-amber-500/20"
                            >
                                <Zap size={24} />
                            </div>
                            <div>
                                <h4 class="text-lg text-white font-medium mb-1">
                                    Visual First Approach
                                </h4>
                                <p class="text-gray-400 leading-snug">
                                    Connect nodes, tweak parameters natively,
                                    and understand your pipeline's flow at a
                                    glance.
                                </p>
                            </div>
                        </div>
                        <div
                            class="flex items-start gap-5 bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-md hover:border-blue-500/30 transition-colors"
                        >
                            <div
                                class="p-3 bg-blue-500/20 text-blue-400 rounded-xl shadow-inner shadow-blue-500/20"
                            >
                                <Code2 size={24} />
                            </div>
                            <div>
                                <h4 class="text-lg text-white font-medium mb-1">
                                    Production Ready Export
                                </h4>
                                <p class="text-gray-400 leading-snug">
                                    When you're happy with the vision prototype,
                                    generate native Java & Python code
                                    instantly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section
            class="max-w-4xl w-full mx-auto mt-16 mb-24"
            use:playWhenVisible
        >
            <Splide
                bind:this={splideRef}
                options={splideOptions}
                aria-label="PaperVision Showcase"
            >
                <SplideSlide class="pb-12 text-center">
                    <figure
                        class="img-shimmer rounded-lg w-fit mx-auto inline-block"
                    >
                        <MediaElement
                            src={m("papervision-guidedtour.png")}
                            alt="PaperVision Guided Tour in the editor"
                            class="rounded-lg shadow-2xl shadow-amber-900/20 border border-gray-700 max-h-[450px] w-auto object-contain"
                        />
                    </figure>
                    <p class="mt-4 text-sm text-gray-400 max-w-lg mx-auto">
                        Learn about PaperVision in the integrated guided tour.
                    </p>
                </SplideSlide>

                <SplideSlide class="pb-12 text-center">
                    <figure
                        class="img-shimmer rounded-lg w-fit mx-auto inline-block"
                    >
                        <MediaElement
                            src={m("papervision-nodes.mp4")}
                            alt="PaperVision's variety of nodes"
                            class="rounded-lg shadow-2xl shadow-amber-900/20 border border-gray-700 max-h-[450px] w-auto object-contain"
                        />
                    </figure>
                    <p class="mt-4 text-sm text-gray-400 max-w-lg mx-auto">
                        A wide variety of nodes for image processing, computer
                        vision, and more.
                    </p>
                </SplideSlide>

                <SplideSlide class="pb-12 text-center">
                    <figure
                        class="img-shimmer rounded-lg w-fit mx-auto inline-block"
                    >
                        <MediaElement
                            src={m("papervision-tuner.mp4")}
                            alt="PaperVision's editor being used for fine tuning a pipeline"
                            class="rounded-lg shadow-2xl shadow-amber-900/20 border border-gray-700 max-h-[450px] w-auto object-contain"
                        />
                    </figure>
                    <p class="mt-4 text-sm text-gray-400 max-w-lg mx-auto">
                        Seamlessly visualize and tune your pipeline.
                    </p>
                </SplideSlide>

                <SplideSlide class="pb-12 text-center">
                    <figure
                        class="img-shimmer rounded-lg w-fit mx-auto inline-block"
                    >
                        <MediaElement
                            src={m("papervision-code.png")}
                            alt="PaperVision's code generation feature"
                            class="rounded-lg shadow-2xl shadow-amber-900/20 border border-gray-700 max-h-[450px] w-auto object-contain"
                        />
                    </figure>
                    <p class="mt-4 text-sm text-gray-400 max-w-lg mx-auto">
                        Generate clean, corresponding Java pipeline code.
                    </p>
                </SplideSlide>

                <SplideSlide class="pb-12 text-center">
                    <figure
                        class="img-shimmer rounded-lg w-fit mx-auto inline-block"
                    >
                        <MediaElement
                            src={m("papervision-code-python.png")}
                            alt="PaperVision's code generation feature in Python"
                            class="rounded-lg shadow-2xl shadow-amber-900/20 border border-gray-700 max-h-[450px] w-auto object-contain"
                        />
                    </figure>
                    <p class="mt-4 text-sm text-gray-400 max-w-lg mx-auto">
                        And Python too!
                    </p>
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
                class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <!-- 1. Visual Node Editor (amber, 2-cols) -->
                <Feature
                    icon={Zap}
                    title="Node-Based Pipeline Editor"
                    desc="Drag, drop, and connect nodes to intuitively build complex algorithms without manual boilerplate."
                    color="amber"
                    class="md:col-span-2 lg:col-span-2 group/pv flex flex-col"
                >
                    <div
                        class="mt-6 flex-1 min-h-[140px] border border-amber-500/20 bg-[#121016] rounded-xl overflow-hidden relative shadow-inner shadow-amber-900/20"
                    >
                        <div
                            class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]"
                        ></div>
                        <svg
                            class="absolute inset-0 w-full h-full z-0 pointer-events-none"
                        >
                            <path
                                d="M 180 50 C 220 50, 220 90, 260 90"
                                fill="none"
                                stroke="#f59e0b"
                                stroke-width="2.5"
                                stroke-dasharray="4"
                                class="opacity-40 group-hover/pv:opacity-100 transition-opacity duration-500 hidden md:block"
                            />
                        </svg>
                        <div
                            class="absolute inset-0 p-5 flex flex-col md:flex-row gap-6 md:gap-20 items-start z-10 w-full"
                        >
                            <div
                                class="bg-gray-800/90 border border-gray-700 p-3 rounded-xl min-w-[160px] shadow-2xl group-hover/pv:-translate-y-1 transition-transform duration-500 backdrop-blur-md relative z-10"
                            >
                                <div
                                    class="hidden md:block absolute right-[-6px] top-[16px] w-2.5 h-2.5 bg-amber-500 rounded-full border border-gray-800"
                                ></div>
                                <div
                                    class="bg-amber-500/20 text-amber-400 text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded inline-block mb-3"
                                >
                                    Color Threshold
                                </div>
                                <div
                                    class="h-1.5 bg-gray-700 rounded-full w-full mb-2"
                                ></div>
                                <div
                                    class="h-1.5 bg-gray-700/50 rounded-full w-2/3"
                                ></div>
                            </div>
                            <div
                                class="bg-gray-800/90 border border-gray-700 p-3 rounded-xl min-w-[160px] shadow-2xl group-hover/pv:-translate-y-1 transition-transform duration-500 delay-75 backdrop-blur-md relative z-10 ml-8 md:ml-0 md:mt-10"
                            >
                                <div
                                    class="hidden md:block absolute left-[-6px] top-[16px] w-2.5 h-2.5 bg-amber-500 rounded-full border border-gray-800 shadow-[0_0_8px_rgba(245,158,11,0.8)] opacity-50 group-hover/pv:opacity-100 transition-opacity"
                                ></div>
                                <div
                                    class="bg-emerald-500/20 text-emerald-400 text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded inline-block mb-3"
                                >
                                    Find Contours
                                </div>
                                <div
                                    class="h-1.5 bg-gray-700 rounded-full w-3/4 mb-2"
                                ></div>
                                <div
                                    class="h-1.5 bg-gray-700/50 rounded-full w-1/2"
                                ></div>
                            </div>
                        </div>
                    </div>
                </Feature>

                <!-- 2. Real-Time Node Previews (rose, 1-col) -->
                <Feature
                    icon={Eye}
                    title="Real-Time Previews"
                    desc="Instantly see the output of every single node in your pipeline to debug faster."
                    color="rose"
                    class="group/ui flex flex-col"
                >
                    <div class="mt-auto pt-6 flex justify-center">
                        <div
                            class="relative w-full max-w-[200px] bg-[linear-gradient(45deg,#1f2937_25%,transparent_25%,transparent_75%,#1f2937_75%,#1f2937),linear-gradient(45deg,#1f2937_25%,transparent_25%,transparent_75%,#1f2937_75%,#1f2937)] bg-[length:16px_16px] bg-[position:0_0,8px_8px] overflow-hidden rounded-xl border border-gray-700/50 shadow-inner h-32 flex items-center justify-center"
                        >
                            <div
                                class="relative w-16 h-16 border-2 border-rose-500 rounded-lg rotate-12 group-hover/ui:rotate-45 transition-transform duration-1000 shadow-[0_0_15px_rgba(244,63,94,0.3)] backdrop-blur-sm"
                            >
                                <div
                                    class="absolute inset-2 border border-blue-500/50 border-dashed rounded flex flex-col items-center justify-center bg-blue-500/10"
                                >
                                    <span
                                        class="text-blue-400 text-[8px] font-mono whitespace-nowrap group-hover/ui:scale-110 transition-transform"
                                        >Sides: 4</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </Feature>

                <!-- 3. Live Parameter Tuning (cyan, 1-col) -->
                <Feature
                    icon={SlidersHorizontal}
                    title="Live Parameter Tuning"
                    desc="Allows you to adjust pipeline parameters in real-time."
                    color="cyan"
                    class="group/tune flex flex-col hover:border-cyan-500/50"
                >
                    <div class="mt-auto pt-6">
                        <div
                            class="border border-cyan-500/20 bg-gray-900/50 rounded-xl p-3.5 shadow-inner shadow-cyan-900/20 flex flex-col gap-3"
                        >
                            <div class="flex flex-col gap-1.5">
                                <div
                                    class="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-gray-400"
                                >
                                    <span>blur_size</span>
                                    <span
                                        class="text-cyan-400 group-hover/tune:text-cyan-300 transition-colors w-8 text-right"
                                        >3.5</span
                                    >
                                </div>
                                <div
                                    class="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden"
                                >
                                    <div
                                        class="h-full bg-cyan-500/60 w-[35%] group-hover/tune:w-[75%] transition-all duration-1000 ease-out relative"
                                    >
                                        <div
                                            class="absolute right-0 top-0 bottom-0 w-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <div
                                    class="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-gray-400"
                                >
                                    <span>threshold</span>
                                    <span
                                        class="text-rose-400 group-hover/tune:text-rose-300 transition-colors w-8 text-right"
                                        >128</span
                                    >
                                </div>
                                <div
                                    class="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden"
                                >
                                    <div
                                        class="h-full bg-rose-500/60 w-[60%] group-hover/tune:w-[25%] transition-all duration-1000 ease-out relative"
                                    >
                                        <div
                                            class="absolute right-0 top-0 bottom-0 w-1.5 bg-rose-400 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Feature>

                <!-- 4. One-Click Code Generation (emerald, 2-cols) -->
                <Feature
                    icon={Code2}
                    title="One-Click Code Generation"
                    desc="Generates clean, corresponding Java & Python pipeline code for your project."
                    color="emerald"
                    class="md:col-span-2 lg:col-span-2 flex flex-col group/cg md:[&>div>p]:max-w-[45%] md:[&>div>h3]:max-w-[45%]"
                >
                    <div
                        class="hidden md:flex absolute right-0 bottom-0 w-[50%] max-w-sm h-full max-h-[145px] flex-col bg-gray-900 border-l border-t border-emerald-500/30 rounded-tl-xl rounded-br-[22px] shadow-2xl transition-all duration-500 group-hover/cg:-translate-x-3 group-hover/cg:-translate-y-3 group-hover/cg:border-emerald-400/50 z-0 overflow-hidden pointer-events-none"
                    >
                        <div
                            class="bg-gray-800/80 px-3 py-1.5 flex items-center border-b border-gray-700"
                        >
                            <span
                                class="text-[8px] text-gray-400 font-mono tracking-widest uppercase"
                                >MyPipeline.java</span
                            >
                        </div>
                        <div
                            class="p-4 text-[10px] font-mono leading-loose text-gray-300 opacity-70 group-hover/cg:opacity-100 transition-opacity"
                        >
                            <span class="text-rose-400">public class</span>
                            <span class="text-amber-300">MyPipeline</span>
                            <br />
                            &nbsp;&nbsp;<span class="text-rose-400"
                                >extends</span
                            >
                            <span class="text-emerald-300">OpenCvPipeline</span>
                            &#123;<br />
                            &nbsp;&nbsp;<span class="text-rose-400">public</span
                            >
                            Mat <span class="text-blue-300">process</span>(Mat
                            <span class="text-cyan-300">input</span>) &#123;<br
                            />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-gray-500"
                                >/* Generated code... */</span
                            ><br />
                            &nbsp;&nbsp;&#125;<br />
                            &#125;
                        </div>
                    </div>
                </Feature>

                <!-- 5. Custom Detections (purple, 1-col) -->
                <Feature
                    icon={Tag}
                    title="Custom Detections"
                    desc="Includes pre-built nodes for blob detectors, color thresholding, and more."
                    color="purple"
                    class="md:col-span-1 lg:col-span-1 flex flex-col"
                >
                    <div class="mt-auto pt-6 flex gap-2 flex-wrap">
                        <span
                            class="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono rounded shadow-sm"
                            >BlobDetector</span
                        >
                        <span
                            class="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono rounded shadow-sm"
                            >ColorSpace</span
                        >
                        <span
                            class="px-2.5 py-1 bg-gray-800 border border-gray-700 text-gray-400 text-[10px] font-mono rounded shadow-sm"
                            >ThresholdNode</span
                        >
                    </div>
                </Feature>

                <!-- 6. Supports All Input Sources (blue, 2-cols) -->
                <Feature
                    icon={Video}
                    title="Supports All Input Sources"
                    desc="View images, recorded videos, or stream from webcams seamlessly within the UI."
                    color="blue"
                    class="md:col-span-2 lg:col-span-2 flex flex-col group/ui md:[&>div>p]:max-w-[45%] md:[&>div>h3]:max-w-[45%]"
                >
                    <div
                        class="hidden md:flex absolute right-0 bottom-0 w-[50%] max-w-xs h-full max-h-[145px] flex-col bg-[#0b0e14] border-l border-t border-blue-500/30 rounded-tl-xl rounded-br-[22px] shadow-2xl transition-all duration-500 group-hover/ui:-translate-x-3 group-hover/ui:-translate-y-3 group-hover/ui:border-blue-400/50 z-0 overflow-hidden backdrop-blur-xl p-5 gap-3 justify-center"
                    >
                        <div
                            class="flex items-center gap-2 bg-blue-950/40 border border-blue-500/30 px-3 py-1.5 rounded-md text-blue-400 text-[9px] font-mono shadow-inner group-hover/ui:-translate-y-1 transition-transform duration-300"
                        >
                            <svg
                                class="w-3 h-3 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                /><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                /></svg
                            >
                            <span class="truncate">LIVE_WEBCAM</span>
                        </div>
                        <div
                            class="flex items-center gap-2 bg-purple-950/40 border border-purple-500/30 px-3 py-1.5 rounded-md text-purple-400 text-[9px] font-mono shadow-inner group-hover/ui:-translate-y-1 transition-transform duration-300 delay-75"
                        >
                            <svg
                                class="w-3 h-3 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                /></svg
                            >
                            <span class="truncate">VIDEO_TEST.MP4</span>
                        </div>
                        <div
                            class="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-md text-emerald-400 text-[9px] font-mono shadow-inner group-hover/ui:-translate-y-1 transition-transform duration-300 delay-150"
                        >
                            <svg
                                class="w-3 h-3 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                /></svg
                            >
                            <span class="truncate">IMAGE_01.JPG</span>
                        </div>
                    </div>
                </Feature>
            </div>
        </section>
    </main>

    <!-- Full-Width Integration Banner -->
    <section
        id="integration"
        class="w-full bg-gradient-to-b from-[#05070a] to-[#0a0f18] border-t border-gray-800/60 py-32 px-6 relative overflow-hidden"
    >
        <div
            class="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"
        ></div>
        <div
            class="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"
        ></div>
        <div
            class="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none"
        ></div>
        <div
            class="container mx-auto max-w-4xl relative z-10 text-center flex flex-col items-center"
        >
            <h2
                class="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-gray-400 tracking-tight mb-8"
            >
                Ready to build?
            </h2>
            <p
                class="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl text-center leading-relaxed"
            >
                PaperVision is built directly into <span
                    class="text-amber-400 font-bold drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                    >EOCV-Sim</span
                >. You don't need a separate download—simply launch the
                simulator and access the visual editor right from your
                workspace.
            </p>
            <a
                href="/eocv-sim"
                class="inline-flex items-center gap-3 px-10 py-5 font-bold text-gray-900 bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:shadow-[0_0_60px_rgba(245,158,11,0.6)] hover:-translate-y-1 transition-all w-fit text-lg"
            >
                Download EOCV-Sim
                <svg
                    class="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2.5"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                    /></svg
                >
            </a>
        </div>
    </section>
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

    /* ESTILOS DEL CARRUSEL */
    :global(.splide__pagination__page.is-active) {
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

    .glass-card {
        background: rgba(13, 17, 23, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(55, 65, 81, 0.3);
    }
</style>
