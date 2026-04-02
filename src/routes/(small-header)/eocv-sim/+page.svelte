<script lang="ts">
    import ProjectHero from "$lib/projects/ProjectHero.svelte";
    import Feature from "$lib/projects/Feature.svelte";

    import { Splide, SplideSlide } from "@splidejs/svelte-splide";

    import "@splidejs/svelte-splide/css";

    // 3. IMPORTAMOS LOS ICONOS
    import {
        Eye,
        Code2,
        Zap,
        Tag,
        SlidersHorizontal,
        Video,
        Download,
        Apple,
        Terminal,
        Monitor,
    } from "lucide-svelte";
    import { m } from "$lib/media";
    import MediaElement from "$lib/ui/MediaElement.svelte";

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

        // Sync with video duration
        if (splideRef?.splide) {
            splideRef.splide.on('active', (slide: any) => {
                const video = slide.slide.querySelector('video');
                const autoplay = splideRef.splide.Components.Autoplay;
                
                if (video) {
                    autoplay.pause();
                    video.onended = () => {
                        splideRef.splide.go('>');
                        autoplay.play();
                    };
                } else {
                    autoplay.play();
                }
            });
        }

        return {
            destroy() {
                observer.disconnect();
            },
        };
    }
</script>

<svelte:head>
    <title>EOCV-Sim - deltacv</title>
    <meta
        name="description"
        content="EOCV-Sim is a desktop simulator for EasyOpenCV — develop, test, and tune your FTC robotics vision pipelines directly on your computer without touching the robot."
    />
</svelte:head>

<div class="project-page-wrapper">
    <ProjectHero
        title="EOCV-Sim"
        titleGradient="linear-gradient(to right, #22d3ee, #0ea5e9, #6366f1)"
        videoSrc={m("/eocvsim-tuner.mp4")}
        typingWords={["develop", "test", "tune"]}
        introPreText="A simple interface to"
        introPostText="your computer vision pipelines."
        scrollIndicatorColorClass="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
        videoFit="contain"
    >
        {#snippet actions()}
            <div class="flex flex-col gap-4 w-full sm:w-fit">
                <!-- Top Download Button -->
                <a
                    href="#download"
                    onclick={(e) => {
                        e.preventDefault();
                        document
                            .getElementById("download")
                            ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    class="w-full px-8 py-3.5 font-bold text-gray-900 bg-cyan-400 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:bg-cyan-300 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2.5"
                >
                    <Download size={20} />
                    Download EOCV-Sim
                </a>

                <!-- Bottom Buttons Row -->
                <div class="flex flex-col sm:flex-row gap-4 w-full">
                    <a
                        href="https://docs.deltacv.org/eocv-sim/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex-1 px-8 py-3.5 font-semibold text-white bg-gray-800/80 backdrop-blur border border-gray-700/80 rounded-xl hover:bg-gray-700/80 hover:border-gray-500/50 transition-all transform hover:-translate-y-1 text-center shadow-lg whitespace-nowrap"
                    >
                        Read the Docs
                    </a>
                    <a
                        href="https://github.com/deltacv/EOCV-Sim"
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
                class="absolute inset-0 max-w-5xl mx-auto -z-10 bg-cyan-600/10 blur-[100px] rounded-full"
            ></div>

            <div
                class="glass-card rounded-3xl p-8 md:p-14 shadow-2xl shadow-cyan-900/20 max-w-5xl mx-auto relative overflow-hidden group"
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
                            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-6 border border-cyan-500/20"
                        >
                            <span class="relative flex h-2 w-2">
                                <span
                                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"
                                ></span>
                                <span
                                    class="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"
                                ></span>
                            </span>
                            Desktop Computer Vision
                        </div>
                        <h2
                            class="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight"
                        >
                            What is EOCV-Sim?
                        </h2>
                        <p
                            class="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed"
                        >
                            EOCV-Sim is a desktop tool built for
                            <span
                                class="text-cyan-400 font-semibold drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                                >FIRST Tech Challenge (FTC)</span
                            > teams. It mimics the EasyOpenCV library and FTC SDK
                            structure, letting you test and refine computer vision
                            pipelines right on your computer.
                        </p>
                    </div>

                    <div class="flex flex-col gap-4">
                        <div
                            class="flex items-start gap-5 bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-md hover:border-cyan-500/30 transition-colors"
                        >
                            <div
                                class="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl shadow-inner shadow-cyan-500/20"
                            >
                                <Video size={24} />
                            </div>
                            <div>
                                <h4 class="text-lg text-white font-medium mb-1">
                                    Zero Hardware Required
                                </h4>
                                <p class="text-gray-400 leading-snug">
                                    Test with webcams, static images, or
                                    pre-recorded videos—no robot needed.
                                </p>
                            </div>
                        </div>
                        <div
                            class="flex items-start gap-5 bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-md hover:border-emerald-500/30 transition-colors"
                        >
                            <div
                                class="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl shadow-inner shadow-emerald-500/20"
                            >
                                <Zap size={24} />
                            </div>
                            <div>
                                <h4 class="text-lg text-white font-medium mb-1">
                                    Instant Feedback
                                </h4>
                                <p class="text-gray-400 leading-snug">
                                    Stop wasting time on the slow
                                    build-and-deploy cycle. Test instantly,
                                    deploy once.
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
                aria-label="EOCV-Sim Screenshots"
            >
                <SplideSlide class="pb-12 text-center">
                    <figure
                        class="img-shimmer rounded-lg w-fit mx-auto inline-block"
                    >
                        <MediaElement
                            src={m("eocvsim-apriltags.mp4")}
                            alt="EOCV-Sim AprilTag detection"
                            class="rounded-lg shadow-2xl shadow-cyan-900/20 border border-gray-700 max-h-[450px] w-auto object-contain"
                            loop={false}
                        />
                    </figure>
                    <p class="mt-4 text-sm text-gray-400 max-w-lg mx-auto">
                        Perform AprilTag detection with EOCV-Sim
                    </p>
                </SplideSlide>

                <SplideSlide class="pb-12 text-center">
                    <figure
                        class="img-shimmer rounded-lg w-fit mx-auto inline-block"
                    >
                        <MediaElement
                            src={m("eocvsim-livecoding.mp4")}
                            alt="EOCV-Sim live coding"
                            class="rounded-lg shadow-2xl shadow-cyan-900/20 border border-gray-700 max-h-[450px] w-auto object-contain"
                            loop={false}
                        />
                    </figure>
                    <p class="mt-4 text-sm text-gray-400 max-w-lg mx-auto">
                        See the results of your code changes in real-time
                    </p>
                </SplideSlide>
            </Splide>
        </section>

        <section class="my-24">
            <h2 class="text-center text-4xl font-bold tracking-tighter">
                Everything you need to code.
            </h2>
            <p class="text-center mt-3 text-lg text-gray-400">
                From live tuning to node-based editing.
            </p>

            <div
                class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <Feature
                    icon={Eye}
                    title="Live Pipeline Testing"
                    desc="Run your pipelines in a simple UI with live feedback from a webcam, image, or video file."
                    color="cyan"
                    class="md:col-span-2 lg:col-span-2 flex flex-col group/ui md:[&>div>p]:max-w-[45%] md:[&>div>h3]:max-w-[45%]"
                >
                    <div
                        class="hidden md:flex absolute right-0 bottom-0 w-[50%] max-w-sm h-full max-h-[155px] flex-col bg-[#0b0e14] border-l border-t border-cyan-500/30 rounded-tl-xl rounded-br-[22px] shadow-2xl transition-all duration-500 group-hover/ui:-translate-x-3 group-hover/ui:-translate-y-3 group-hover/ui:border-cyan-400/50 z-0 overflow-hidden"
                    >
                        <!-- Mac-style Window header -->
                        <div
                            class="bg-[#151b23] px-4 py-2 flex items-center gap-2 border-b border-gray-700/50"
                        >
                            <div
                                class="w-2.5 h-2.5 rounded-full bg-red-500/80"
                            ></div>
                            <div
                                class="w-2.5 h-2.5 rounded-full bg-amber-500/80"
                            ></div>
                            <div
                                class="w-2.5 h-2.5 rounded-full bg-green-500/80"
                            ></div>
                            <div
                                class="ml-auto text-[8px] text-gray-500 font-mono font-bold tracking-widest uppercase"
                            >
                                EOCV-Sim
                            </div>
                        </div>
                        <!-- Video Feed Area -->
                        <div
                            class="relative flex-1 flex items-center justify-center overflow-hidden"
                        >
                            <!-- Background Grid -->
                            <div
                                class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none"
                            ></div>

                            <!-- Fake computer vision tracking box -->
                            <div
                                class="absolute w-16 h-16 border-2 border-emerald-500 rounded-md top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 group-hover/ui:left-[60%] group-hover/ui:w-20 group-hover/ui:h-20 transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                            >
                                <span
                                    class="absolute -top-4 left-[-2px] text-[8px] bg-emerald-500 text-gray-900 px-1 font-bold rounded-sm shadow-sm backdrop-blur"
                                    >CONTOUR</span
                                >
                            </div>

                            <!-- Static Element Tracker -->
                            <div
                                class="absolute w-10 h-10 border-2 border-cyan-500/50 border-dashed rounded-md top-[20%] right-[15%] group-hover/ui:rotate-12 transition-transform duration-1000"
                            ></div>

                            <!-- Overlay Stats -->
                            <div class="absolute bottom-2 left-2 flex gap-1.5">
                                <span
                                    class="bg-black/80 border border-gray-800 shadow backdrop-blur-md text-cyan-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-medium"
                                    >30 FPS</span
                                >
                                <span
                                    class="bg-black/80 border border-gray-800 shadow backdrop-blur-md text-gray-300 text-[9px] px-1.5 py-0.5 rounded font-mono font-medium"
                                    >14ms</span
                                >
                            </div>
                        </div>
                    </div>
                </Feature>
                <Feature
                    icon={Code2}
                    title="FTC SDK Simulation"
                    desc="Mimics the FTC SDK structure, allowing for easy copy-pasting of code to your robot project."
                    color="amber"
                />
                <Feature
                    icon={SlidersHorizontal}
                    title="Real-Time Variable Tuning"
                    desc="Adjust pipeline variables on the fly and see their effect instantly without recompiling."
                    color="purple"
                    class="group/tune hover:border-purple-500/50"
                >
                    <div class="mt-auto pt-6">
                        <div
                            class="border border-purple-500/20 bg-gray-900/50 rounded-xl p-3.5 shadow-inner shadow-purple-900/20 flex flex-col gap-3"
                        >
                            <div class="flex flex-col gap-1.5">
                                <div
                                    class="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-gray-400"
                                >
                                    <span>blurRadius</span>
                                    <span
                                        class="text-purple-400 group-hover/tune:text-purple-300 transition-colors w-8 text-right"
                                        >3.5</span
                                    >
                                </div>
                                <div
                                    class="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden"
                                >
                                    <div
                                        class="h-full bg-purple-500/60 w-[35%] group-hover/tune:w-[75%] transition-all duration-1000 ease-out relative"
                                    >
                                        <div
                                            class="absolute right-0 top-0 bottom-0 w-1.5 bg-purple-400 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"
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
                                        class="text-emerald-400 group-hover/tune:text-emerald-300 transition-colors w-8 text-right"
                                        >128</span
                                    >
                                </div>
                                <div
                                    class="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden"
                                >
                                    <div
                                        class="h-full bg-emerald-500/60 w-[60%] group-hover/tune:w-[25%] transition-all duration-1000 ease-out relative"
                                    >
                                        <div
                                            class="absolute right-0 top-0 bottom-0 w-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Feature>
                <Feature
                    icon={Zap}
                    url="/papervision"
                    title="Integrated PaperVision Node Editor"
                    desc="Prototype algorithms visually with a node editor. Included in EOCV-Sim."
                    color="rose"
                    class="md:col-span-2 lg:col-span-2 group/pv flex flex-col"
                >
                    <div
                        class="mt-6 flex-1 min-h-[140px] border border-rose-500/20 bg-[#121016] rounded-xl overflow-hidden relative shadow-inner shadow-rose-900/20"
                    >
                        <!-- Node Editor Canvas Background -->
                        <div
                            class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]"
                        ></div>

                        <!-- Connection Wire (SVG) -->
                        <svg
                            class="absolute inset-0 w-full h-full z-0 pointer-events-none"
                        >
                            <path
                                d="M 180 50 C 220 50, 220 90, 260 90"
                                fill="none"
                                stroke="#f43f5e"
                                stroke-width="2.5"
                                stroke-dasharray="4"
                                class="opacity-40 group-hover/pv:opacity-100 transition-opacity duration-500 hidden md:block"
                            />
                        </svg>

                        <!-- Mock Nodes Canvas container -->
                        <div
                            class="absolute inset-0 p-5 flex flex-col md:flex-row gap-6 md:gap-20 items-start z-10 w-full"
                        >
                            <!-- Mock Node 1 -->
                            <div
                                class="bg-gray-800/90 border border-gray-700 p-3 rounded-xl min-w-[160px] shadow-2xl group-hover/pv:-translate-y-1 transition-transform duration-500 backdrop-blur-md relative z-10"
                            >
                                <div
                                    class="hidden md:block absolute right-[-6px] top-[16px] w-2.5 h-2.5 bg-rose-500 rounded-full border border-gray-800"
                                ></div>
                                <div
                                    class="bg-rose-500/20 text-rose-400 text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded inline-block mb-3"
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

                            <!-- Mock Node 2 -->
                            <div
                                class="bg-gray-800/90 border border-gray-700 p-3 rounded-xl min-w-[160px] shadow-2xl group-hover/pv:-translate-y-1 transition-transform duration-500 delay-75 backdrop-blur-md relative z-10 ml-8 md:ml-0 md:mt-10"
                            >
                                <div
                                    class="hidden md:block absolute left-[-6px] top-[16px] w-2.5 h-2.5 bg-rose-500 rounded-full border border-gray-800 shadow-[0_0_8px_rgba(244,63,94,0.8)] opacity-50 group-hover/pv:opacity-100 transition-opacity"
                                ></div>
                                <div
                                    class="bg-blue-500/20 text-blue-400 text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded inline-block mb-3"
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
                <Feature
                    icon={Video}
                    title="Multiple Input Sources"
                    desc="Test with webcams, static images, or pre-recorded video files to simulate any condition."
                    color="blue"
                    class="md:col-span-1 lg:col-span-1"
                />
                <Feature
                    icon={Tag}
                    title="AprilTag Support"
                    desc="Includes full support for the modern `VisionPortal` API and AprilTag detection."
                    color="emerald"
                    class="md:col-span-1 lg:col-span-2 flex flex-col"
                >
                    <div class="mt-auto pt-6 flex gap-3 flex-wrap">
                        <span
                            class="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono rounded-lg shadow-sm"
                            >AprilTagProcessor</span
                        >
                        <span
                            class="px-3 py-1.5 bg-gray-800 border border-gray-700 text-gray-400 group-hover:text-gray-300 text-xs font-mono rounded-lg shadow-sm"
                            >VisionPortal.Builder</span
                        >
                        <span
                            class="px-3 py-1.5 bg-gray-800 border border-gray-700 text-gray-400 group-hover:text-gray-300 text-xs font-mono rounded-lg shadow-sm"
                            >Detection</span
                        >
                    </div>
                </Feature>
            </div>
        </section>
    </main>

    <!-- Full-Width Download & Platforms Section -->
    <section
        id="download"
        class="w-full bg-gradient-to-b from-[#05070a] to-[#0a1120] border-t border-gray-800/60 py-32 px-6 relative overflow-hidden"
    >
        <div
            class="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"
        ></div>
        <div
            class="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"
        ></div>
        <div
            class="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"
        ></div>

        <div
            class="container mx-auto max-w-5xl relative z-10 flex flex-col items-center"
        >
            <div class="text-center flex flex-col items-center mb-16">
                <div
                    class="p-4 bg-cyan-500/10 text-cyan-500 rounded-2xl shadow-[0_0_15px_rgba(34,211,238,0.2)] mb-8 border border-cyan-500/20"
                >
                    <Download size={48} strokeWidth={1.5} />
                </div>
                <h2
                    class="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-gray-400 tracking-tight mb-8"
                >
                    Get EOCV-Sim
                </h2>
                <p
                    class="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl text-center leading-relaxed"
                >
                    EOCV-Sim relies on OpenCV's native libraries, making it
                    highly performant but platform-specific. Check below to
                    ensure your system is supported.
                </p>

                <a
                    href="https://docs.deltacv.org/eocv-sim/downloading-eocv-sim"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-3 px-10 py-5 font-bold text-gray-900 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:shadow-[0_0_60px_rgba(34,211,238,0.6)] hover:-translate-y-1 transition-all w-fit text-lg"
                >
                    Download Instructions
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

            <!-- Supported Platforms Bento Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                <!-- Windows -->
                <div
                    class="bg-gray-900/40 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex flex-col group hover:border-blue-500/30 transition-colors"
                >
                    <div class="flex items-center gap-4 mb-4">
                        <div
                            class="p-3 bg-blue-500/10 text-blue-400 rounded-xl"
                        >
                            <Monitor size={24} strokeWidth={2} />
                        </div>
                        <h3 class="text-xl font-bold text-white">Windows</h3>
                    </div>
                    <ul class="flex flex-col gap-3 flex-1 justify-center">
                        <li
                            class="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
                        >
                            <span class="text-sm font-medium text-gray-300"
                                >Intel & AMD (64-bit)</span
                            >
                            <span
                                class="text-[10px] font-bold tracking-wider px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                                >TESTED</span
                            >
                        </li>
                        <li
                            class="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
                        >
                            <span class="text-sm font-medium text-gray-300"
                                >Older PCs (32-bit)</span
                            >
                            <span
                                class="text-[10px] font-bold tracking-wider px-2 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/20"
                                >UNTESTED</span
                            >
                        </li>
                    </ul>
                </div>

                <!-- macOS -->
                <div
                    class="bg-gray-900/40 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex flex-col group hover:border-gray-400/30 transition-colors"
                >
                    <div class="flex items-center gap-4 mb-4">
                        <div
                            class="p-3 bg-gray-500/10 text-gray-300 rounded-xl"
                        >
                            <Apple size={24} strokeWidth={2} />
                        </div>
                        <h3 class="text-xl font-bold text-white">macOS</h3>
                    </div>
                    <ul class="flex flex-col gap-3 flex-1 justify-center">
                        <li
                            class="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
                        >
                            <span class="text-sm font-medium text-gray-300"
                                >Intel Macs</span
                            >
                            <span
                                class="text-[10px] font-bold tracking-wider px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                                >TESTED</span
                            >
                        </li>
                        <li
                            class="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
                            title="Not officially tested, but known to work"
                        >
                            <span class="text-sm font-medium text-gray-300"
                                >Apple Silicon <span class="whitespace-nowrap"
                                    >(M-Series)</span
                                ></span
                            >
                            <span
                                class="text-[10px] font-bold tracking-wider px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/20 cursor-help"
                                >UNOFFICIAL*</span
                            >
                        </li>
                    </ul>
                </div>

                <!-- Linux -->
                <div
                    class="bg-gray-900/40 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex flex-col group hover:border-indigo-500/30 transition-colors"
                >
                    <div class="flex items-center gap-4 mb-4">
                        <div
                            class="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl"
                        >
                            <Terminal size={24} strokeWidth={2} />
                        </div>
                        <h3 class="text-xl font-bold text-white">Linux</h3>
                    </div>
                    <ul class="flex flex-col gap-3 flex-1 justify-center">
                        <li
                            class="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
                        >
                            <span class="text-sm font-medium text-gray-300"
                                >Intel & AMD (64-bit)</span
                            >
                            <span
                                class="text-[10px] font-bold tracking-wider px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                                >TESTED</span
                            >
                        </li>
                        <li
                            class="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
                            title="Not officially tested, but known to work"
                        >
                            <span class="text-sm font-medium text-gray-300"
                                >Raspberry Pi & ARM</span
                            >
                            <span
                                class="text-[10px] font-bold tracking-wider px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/20 cursor-help"
                                >UNOFFICIAL*</span
                            >
                        </li>
                    </ul>
                </div>
            </div>
            <p class="mt-6 text-sm text-gray-500 max-w-2xl text-center">
                *Both Apple Silicon (macOS) and Linux ARM (Raspberry Pi) are not
                actively tested when new features are developed; however, they
                are known to work correctly.
            </p>
        </div>
    </section>
</div>

<style>
    .project-page-wrapper {
        min-height: 100vh;
        background-color: #05070a;
        background-image: radial-gradient(
                circle at 20% 30%,
                rgba(34, 211, 238, 0.03),
                transparent 30%
            ),
            radial-gradient(
                circle at 80% 70%,
                rgba(14, 165, 233, 0.02),
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

    /* ESTILOS ANTERIORES */
    .glass-card {
        background: rgba(13, 17, 23, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(55, 65, 81, 0.3);
    }
</style>
