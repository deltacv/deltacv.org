<script>
    import { fade } from "svelte/transition";
    import PortfolioProject from "$lib/people/PortfolioProject.svelte";
    import AuthorBlogPosts from "$lib/people/AuthorBlogPosts.svelte";
    import Tabbed from "$lib/ui/Tabbed.svelte";
    import Tab from "$lib/ui/Tab.svelte";
    import { onMount } from "svelte";
    import { GraduationCap } from "lucide-svelte";
    import GithubIcon from "$lib/icons/GithubIcon.svelte";
    import XIcon from "$lib/icons/XIcon.svelte";
    import LinkedinIcon from "$lib/icons/LinkedinIcon.svelte";

    import { m } from "$lib/media";

    let mounted = $state(false);

    $effect(() => {
        mounted = true;
    });
</script>

<svelte:head>
    <title>Sebastian Erives - deltacv</title>
    <meta
        name="description"
        content="Sebastian Erives is a software developer and founder of deltacv, building computer vision tools, Android apps, and Kotlin/Java developer experiences."
    />
</svelte:head>

{#if mounted}
    <main>
        <div class="portfolio-container">
            <!-- Hero / Intro Section -->
            <header class="hero" class:visible={mounted}>
                <div class="hero-content">
                    <h1 class="gradient-text">
                        Sebastian Erives
                    </h1>
                    <!-- <p class="subtitle">Software Developer</p> -->
                    <div
                        class="education-badge"
                        title="Universidad Tecmilenio"
                    >
                        <GraduationCap size={16} strokeWidth={2.5} />
                        <span>
                            Software Engineer • Universidad Tecmilenio
                            ('24&nbsp;-&nbsp;'28)
                        </span>
                    </div>
                    <p class="bio">
                        Building developer tools, applications and experiences
                        with Java and Kotlin, including computer vision
                        workflows, to simplify complex systems into visual
                        programming interfaces.
                    </p>
                    <div
                        class="flex flex-wrap gap-2 justify-center mb-8 max-w-[600px] mx-auto"
                        aria-label="Tech Stack"
                    >
                        {#each ["Java", "Kotlin", "Compose", "Android", "SvelteKit", "Minecraft"] as skill, i}
                            <span
                                class="bg-[#161b22] text-[#8b949e] border border-[#30363d] px-3.5 py-1.5 rounded-full text-[0.85rem] font-medium transition-all duration-200 cursor-default hover:border-[#58a6ff] hover:text-[#c9d1d9] hover:bg-[#21262d] skill-tag"
                                style="--delay: {0.45 + i * 0.1}s"
                            >
                                {skill}
                            </span>
                        {/each}
                    </div>
                    <div
                        class="flex items-center gap-5 mt-4 social-links"
                    >
                        <span
                            class="text-[#8b949e] text-sm font-medium tracking-wide uppercase mr-1"
                            >Connect</span
                        >
                        <a
                            href="https://github.com/serivesmejia"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-[#8b949e] hover:text-[#c9d1d9] transition-colors duration-200"
                            aria-label="GitHub"
                        >
                            <GithubIcon />
                        </a>
                        <a
                            href="https://x.com/serivesmejia"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-[#8b949e] hover:text-[#c9d1d9] transition-colors duration-200"
                            aria-label="Twitter / X"
                        >
                            <XIcon />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/sebastian-erives-mejia-08b032251/"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-[#8b949e] hover:text-[#58a6ff] transition-colors duration-200"
                            aria-label="LinkedIn"
                        >
                            <LinkedinIcon />
                        </a>
                    </div>
                </div>
            </header>

            <!-- Tabs System -->
            <Tabbed>
                <Tab title="Portfolio">
                    <!-- Freelance Section -->
                    <section class="projects-section">
                        <h2 class="section-title">Freelancing Portfolio</h2>

                        <!-- The Grid -->
                        <div class="projects-grid">
                            <PortfolioProject
                                title="GeoWare Odyssey"
                                description="10 custom Minecraft minigames for a live Twitch event with tens of thousands of concurrent viewers, built with Java, PaperMC, and a custom Fabric client mod."
                                tags={[
                                    "Minecraft",
                                    "Java",
                                    "PaperMC",
                                    "Fabric",
                                ]}
                                image={m("geoware-video.mp4")}
                            >
                                <h3>About the Project</h3>
                                <p>
                                    GeoWare Odyssey was a three-day live
                                    Minecraft event hosted by prominent Hispanic
                                    streamer Aldo Geo, featuring well-known
                                    creators like Roier, Juansguarnizo, and
                                    Arigameplays. As part of a small team of
                                    developers, I was brought in to build 10 of
                                    the event's minigames, working under an
                                    extremely tight deadline with the event
                                    airing live in front of tens of thousands of
                                    viewers.
                                </p>
                                <p>
                                    I designed and built my assigned minigames
                                    in <strong>Java</strong> on top of
                                    <strong>PaperMC</strong>, with one of them
                                    communicating with a custom
                                    <strong>Fabric</strong> client-side mod via plugin
                                    messaging channels to sync player input in real
                                    time.
                                </p>
                                <p>
                                    Delivering this under a hard event deadline
                                    meant prioritizing clear communication
                                    within the team, making fast decisions under
                                    pressure, and shipping working software on a
                                    schedule that left no room for error — with
                                    thousands of people watching live.
                                </p>

                                <div class="actions">
                                    <a
                                        href="https://github.com/serivesmejia/HexaGeoWareOddysey"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="btn btn-primary"
                                        >View on GitHub (archive)</a
                                    >
                                </div>
                            </PortfolioProject>

                            <PortfolioProject
                                title="MQTT Beacons"
                                description="An Android app that scans for Bluetooth beacons and forwards their data to an MQTT broker in real time."
                                tags={[
                                    "Kotlin",
                                    "Android",
                                    "Compose",
                                    "BLE",
                                    "MQTT",
                                ]}
                                image={m("mqttbeacons-screenshot.png")}
                                imageFit="pan"
                            >
                                <h3>About the Project</h3>
                                <p>
                                    Built for a freelance client, this Android
                                    application scans for nearby Bluetooth Low
                                    Energy beacons — both <strong
                                        >iBeacon</strong
                                    >
                                    and <strong>Eddystone</strong> — and
                                    forwards their telemetry data to a
                                    configurable
                                    <strong>MQTT</strong> broker in real time. Each
                                    beacon's distance, signal strength, GPS coordinates,
                                    and battery level are published as messages to
                                    a topic of the user's choice.
                                </p>
                                <p>
                                    The app runs as a persistent <strong
                                        >foreground service</strong
                                    >
                                    to keep scanning reliably in the background.
                                    To handle connectivity gaps, I implemented a
                                    local queue that retries failed messages automatically
                                    once the network is restored. The UI is built
                                    entirely with
                                    <strong>Jetpack Compose</strong>.
                                </p>
                            </PortfolioProject>
                        </div>
                    </section>

                    <!-- Main Projects Section -->
                    <section
                        class="projects-section"
                        style="padding-top: 1rem;"
                    >
                        <h2 class="section-title">Open Source Projects</h2>

                        <!-- The Grid -->
                        <div class="projects-grid">
                            <!-- Project: PaperVision -->
                            <PortfolioProject
                                title="PaperVision"
                                description="A node-based visual programming environment for OpenCV. Solo developed over 3 years."
                                image={m("papervision-hero.png")}
                                tags={[
                                    "Kotlin",
                                    "Kotlin DSL",
                                    "imgui",
                                    "OpenCV",
                                    "Code Generation",
                                ]}
                            >
                                <h3>My Role & Architecture</h3>
                                <p>
                                    I built PaperVision from scratch to solve
                                    the steep learning curve of OpenCV in Java.
                                    Over three years, the project grew into a
                                    full node-graph interface that translates
                                    visual logic directly into reliable Java
                                    code.
                                </p>

                                <p>
                                    The backend is written entirely in <strong
                                        >Kotlin</strong
                                    >. To make adding new features easier, I
                                    designed an internal code-generation API
                                    using custom
                                    <strong>Kotlin DSLs</strong>, which makes
                                    creating new computer vision nodes a breeze.
                                </p>

                                <div class="actions">
                                    <a
                                        href="https://github.com/deltacv/PaperVision"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="btn btn-primary"
                                        >View on GitHub</a
                                    >
                                    <a
                                        href="/papervision"
                                        class="btn btn-secondary">Learn More</a
                                    >
                                </div>
                            </PortfolioProject>

                            <!-- Project: EOCV-Sim -->
                            <PortfolioProject
                                title="EOCV-Sim"
                                description="A standalone desktop simulator for testing FTC vision pipelines on PC. Scaled to support thousands of users."
                                image={m("eocvsim-hero.png")}
                                tags={["Java", "Swing", "Reflection", "OpenCV"]}
                            >
                                <h3>My Role & Technical Challenges</h3>
                                <p>
                                    Started as a solo project when I was 14,
                                    EOCV-Sim was built to fix the painfully
                                    slow, hardware-dependant deployment cycle of
                                    FTC robotics. I created a simulated
                                    environment in <strong>Java</strong> that runs
                                    the robot's vision APIs right on a PC.
                                </p>

                                <p>
                                    As the project scaled, I added an embedded
                                    Java compiler and a dynamic class-loading
                                    workspace. I also built a live variable
                                    tuner using Reflection and a FlatLaf Swing
                                    UI, alongside packaging cross-platform
                                    OpenCV binaries so it works easily across
                                    Windows, macOS, and Linux.
                                </p>

                                <div class="actions">
                                    <a
                                        href="https://github.com/deltacv/EOCV-Sim"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="btn btn-primary"
                                        >GitHub Repository</a
                                    >
                                    <a
                                        href="/eocv-sim"
                                        class="btn btn-secondary">Learn More</a
                                    >
                                </div>
                            </PortfolioProject>

                            <!-- Project: DeltaCV -->
                            <PortfolioProject
                                title="The 'deltacv' Website"
                                description="A custom developer portfolio and server-side rendered blog engine built from scratch."
                                image={m("deltacv-org-video.mp4")}
                                hoverImage={m("deltacv-page.png")}
                                tags={[
                                    "SvelteKit",
                                    "TailwindCSS",
                                    "Cloudflare Pages",
                                    "Frontend",
                                ]}
                            >
                                <h3>My Role & Implementation</h3>
                                <p>
                                    I designed and built this website from the
                                    ground up to serve as the landing page for
                                    all deltacv projects. Wanting something
                                    better than a generic template, I created a
                                    custom dark theme built on <strong
                                        >SvelteKit</strong
                                    >
                                    and <strong>TailwindCSS</strong>.
                                </p>

                                <p>
                                    It uses server-side rendering (SSR) to stay
                                    fast, alongside a custom markdown-driven
                                    blog built with Svelte components. The whole
                                    site is deployed via <strong
                                        >Cloudflare Pages</strong
                                    >.
                                </p>

                                <div class="actions">
                                    <a
                                        href="https://github.com/deltacv/deltacv.org"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="btn btn-primary">Source Code</a
                                    >
                                    <a href="/" class="btn btn-secondary"
                                        >Go to Home</a
                                    >
                                </div>
                            </PortfolioProject>

                            <!-- To add a new project, simply copy a <PortfolioProject> block above! -->
                        </div>
                    </section>
                </Tab>

                <Tab title="Articles">
                    <AuthorBlogPosts authorEmail="serivesmejia@deltacv.org" />
                </Tab>
            </Tabbed>
        </div>
    </main>
{/if}

<style>
    .portfolio-container {
        font-family: "Inter", sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: calc(var(--header-height, 64px) + 2.5rem) 2rem 2rem;
        color: #c9d1d9;
    }

    /* Hero Section */
    .hero {
        padding: 4rem 0 5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        border-bottom: 1px solid #21262d;
    }

    .hero-content {
        max-width: 800px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .gradient-text {
        font-size: clamp(2.5rem, 5vw, 4.5rem);
        font-weight: 800;
        margin: 0 0 0.5rem 0;
        background: -webkit-linear-gradient(45deg, #58a6ff, #a371f7);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -1px;
    }

    .education-badge {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        background: rgba(88, 166, 255, 0.1);
        color: #58a6ff;
        padding: 8px 16px;
        border-radius: 12px;
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        border: 1px solid rgba(88, 166, 255, 0.2);
        box-shadow: 0 2px 8px rgba(88, 166, 255, 0.1);
        text-align: left;
        max-width: 100%;
        line-height: 1.4;
    }

    .education-badge span {
        text-wrap: balance;
    }

    .education-badge :global(svg) {
        flex-shrink: 0;
    }

    .bio {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #c9d1d9;
        margin: 0 0 2rem 0;
    }

    /* Entrance Animations */
    @keyframes heroFlyIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .hero .gradient-text,
    .hero .education-badge,
    .hero .bio,
    .hero .skill-tag,
    .hero .social-links {
        opacity: 0;
        will-change: transform, opacity;
    }

    .hero.visible .gradient-text,
    .hero.visible .education-badge,
    .hero.visible .bio,
    .hero.visible .skill-tag,
    .hero.visible .social-links {
        animation: heroFlyIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    .hero .gradient-text { animation-delay: 0.1s; }
    .hero .education-badge { animation-delay: 0.25s; }
    .hero .bio { animation-delay: 0.4s; }
    .hero .skill-tag { animation-delay: var(--delay); }
    .hero .social-links { animation-delay: 0.9s; }

    /* Projects Section */
    .projects-section {
        padding: 4rem 0;
    }

    .section-title {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 2rem 0;
        color: #ffffff;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    /* CSS Grid */
    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        justify-items: center;
    }

    .projects-grid :global(.portfolio-card) {
        max-width: 420px;
        width: 100%;
    }

    @media (max-width: 768px) {
        .projects-grid {
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 16px;
        }
    }

    @media (max-width: 600px) {
        .projects-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .education-badge {
            text-align: center;
            padding: 10px 18px;
            gap: 14px;
        }

        .education-badge :global(svg) {
            transform: scale(1.15);
        }
    }

    @media (max-width: 480px) {
        .projects-grid {
            grid-template-columns: 1fr;
        }

        .projects-grid :global(.portfolio-card) {
            max-width: 320px;
        }
    }
</style>
