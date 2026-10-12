<script>
    import PortfolioProject from "$lib/people/PortfolioProject.svelte";
    import AuthorBlogPosts from "$lib/people/AuthorBlogPosts.svelte";
    import Tabbed from "$lib/ui/Tabbed.svelte";
    import Tab from "$lib/ui/Tab.svelte";
    import InfoBadge from "$lib/ui/InfoBadge.svelte";
    import SocialBadge from "$lib/ui/SocialBadge.svelte";
    import LocalTimeBadge from "$lib/ui/LocalTimeBadge.svelte";
    import {
        GraduationCap,
        MapPin,
        Mail,
        Briefcase,
        Users,
        Bot,
    } from "lucide-svelte";
    import GithubIcon from "$lib/icons/GithubIcon.svelte";
    import XIcon from "$lib/icons/XIcon.svelte";
    import LinkedinIcon from "$lib/icons/LinkedinIcon.svelte";
    import Timeline from "$lib/ui/Timeline.svelte";
    import TimelineItem from "$lib/ui/TimelineItem.svelte";

    import { m } from "$lib/media";
</script>

<svelte:head>
    <title>Sebastian Erives - deltacv</title>
    <meta
        name="description"
        content="Sebastian Erives is a software developer and founder of deltacv, building computer vision tools, Android apps, and Kotlin/Java developer experiences."
    />
    <link rel="canonical" href="https://deltacv.org/people/serivesmejia" />
</svelte:head>

<main>
    <div class="portfolio-container">
        <!-- Hero / Intro Section -->
        <header class="hero">
            <div class="hero-content">
                <div class="hello-nametag">Hi, I am</div>
                <h1 class="hero-title">Sebastian Erives</h1>
                <!-- <p class="subtitle">Software Developer</p> -->
                <div class="info-badges-container">
                    <InfoBadge title="Universidad Tecmilenio" color="#7d9ebf">
                        <GraduationCap
                            size={18}
                            strokeWidth={2}
                            class="shrink-0"
                        />
                        <div class="marquee-wrapper">
                            <div class="marquee-content">
                                <span
                                    >Software Engineer • Universidad Tecmilenio
                                    ('24&nbsp;-&nbsp;'28)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
                                >
                                <span
                                    class="marquee-duplicate"
                                    aria-hidden="true"
                                    >Software Engineer • Universidad Tecmilenio
                                    ('24&nbsp;-&nbsp;'28)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
                                >
                            </div>
                        </div>
                    </InfoBadge>
                    <div
                        class="flex flex-row flex-wrap justify-center gap-3.5 mt-1.5"
                    >
                        <InfoBadge title="Location">
                            <MapPin size={18} strokeWidth={2} />
                            <span>Chihuahua, CHH, Mexico</span>
                        </InfoBadge>
                        <LocalTimeBadge timeZone="America/Chihuahua" />
                    </div>
                </div>
                <p class="bio">
                    Building developer tools, applications and experiences with
                    Java and Kotlin, including computer vision workflows, to
                    simplify complex systems into visual programming interfaces.
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
                <div class="flex items-center gap-5 mt-4 social-links">
                    <span
                        class="text-[#8b949e] text-sm font-medium tracking-wide uppercase mr-1"
                        >Connect</span
                    >
                    <SocialBadge
                        href="https://github.com/serivesmejia"
                        ariaLabel="GitHub"
                        handle="serivesmejia"
                    >
                        <GithubIcon />
                    </SocialBadge>
                    <SocialBadge
                        href="https://x.com/serivesmejia"
                        ariaLabel="Twitter / X"
                        handle="@serivesmejia"
                    >
                        <XIcon />
                    </SocialBadge>
                    <SocialBadge
                        href="https://www.linkedin.com/in/sebastian-erives-mejia-08b032251/"
                        ariaLabel="LinkedIn"
                        handle="Sebastian Erives"
                        colorClass="hover:text-[#58a6ff]"
                    >
                        <LinkedinIcon />
                    </SocialBadge>
                    <SocialBadge
                        href="mailto:serivesmejia@deltacv.org"
                        ariaLabel="Email"
                        handle="serivesmejia@deltacv.org"
                        colorClass="hover:text-[#58a6ff]"
                    >
                        <Mail size={22} strokeWidth={2} />
                    </SocialBadge>
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
                            tags={["Minecraft", "Java", "PaperMC", "Fabric"]}
                            image={m("geoware-video.mp4")}
                        >
                            <h3>About the Project</h3>
                            <p>
                                GeoWare Odyssey was a three-day live Minecraft
                                event hosted by prominent Hispanic streamer Aldo
                                Geo, featuring well-known creators like Roier,
                                Juansguarnizo, and Arigameplays. As part of a
                                small team of developers, I was brought in to
                                build 10 of the event's minigames, working under
                                an extremely tight deadline with the event
                                airing live in front of tens of thousands of
                                viewers.
                            </p>
                            <p>
                                I designed and built my assigned minigames in <strong
                                    >Java</strong
                                >
                                on top of
                                <strong>PaperMC</strong>, with one of them
                                communicating with a custom
                                <strong>Fabric</strong> client-side mod via plugin
                                messaging channels to sync player input in real time.
                            </p>
                            <p>
                                Delivering this under a hard event deadline
                                meant prioritizing clear communication within
                                the team, making fast decisions under pressure,
                                and shipping working software on a schedule that
                                left no room for error — with thousands of
                                people watching live.
                            </p>

                            <div class="actions">
                                <a
                                    href="https://github.com/serivesmejia/HexaGeoWareOddysey"
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
                                Energy beacons — both <strong>iBeacon</strong>
                                and <strong>Eddystone</strong> — and forwards
                                their telemetry data to a configurable
                                <strong>MQTT</strong> broker in real time. Each beacon's
                                distance, signal strength, GPS coordinates, and battery
                                level are published as messages to a topic of the
                                user's choice.
                            </p>
                            <p>
                                The app runs as a persistent
                                <strong>foreground service</strong>
                                to keep scanning reliably in the background. To handle
                                connectivity gaps, I implemented a local queue that
                                retries failed messages automatically once the network
                                is restored. The UI is built entirely with
                                <strong>Jetpack Compose</strong>.
                            </p>
                        </PortfolioProject>
                    </div>
                </section>

                <!-- Main Projects Section -->
                <section class="projects-section" style="padding-top: 1rem;">
                    <h2 class="section-title">Open Source Projects</h2>

                    <!-- The Grid -->
                    <div class="projects-grid">
                        <!-- Project: VisionGraph -->
                        <PortfolioProject
                            title="VisionGraph"
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
                                I built VisionGraph from scratch to solve the
                                steep learning curve of OpenCV in Java. Over
                                three years, the project grew into a full
                                node-graph interface that translates visual
                                logic directly into reliable Java code.
                            </p>

                            <p>
                                The backend is written entirely in <strong
                                    >Kotlin</strong
                                >. To make adding new features easier, I
                                designed an internal code-generation API using
                                custom
                                <strong>Kotlin DSLs</strong>, which makes
                                creating new computer vision nodes a breeze.
                            </p>

                            <div class="actions">
                                <a
                                    href="https://github.com/deltacv/PaperVision"
                                    class="btn btn-primary">View on GitHub</a
                                >
                                <a href="/visiongraph" class="btn btn-secondary"
                                    >Learn More</a
                                >
                            </div>
                        </PortfolioProject>

                        <!-- Project: VisionBench -->
                        <PortfolioProject
                            title="VisionBench"
                            description="A standalone desktop simulator for testing FTC vision pipelines on PC. Scaled to support thousands of users."
                            image={m("eocvsim-hero.png")}
                            tags={["Java", "Swing", "Reflection", "OpenCV"]}
                        >
                            <h3>My Role & Technical Challenges</h3>
                            <p>
                                Started as a solo project when I was 14,
                                VisionBench was built to fix the painfully slow,
                                hardware-dependant deployment cycle of FTC
                                robotics. I created a simulated environment in <strong
                                    >Java</strong
                                > that runs the robot's vision APIs right on a PC.
                            </p>

                            <p>
                                As the project scaled, I added an embedded Java
                                compiler and a dynamic class-loading workspace.
                                I also built a live variable tuner using
                                Reflection and a FlatLaf Swing UI, alongside
                                packaging cross-platform OpenCV binaries so it
                                works easily across Windows, macOS, and Linux.
                            </p>

                            <div class="actions">
                                <a
                                    href="https://github.com/deltacv/EOCV-Sim"
                                    class="btn btn-primary">GitHub Repository</a
                                >
                                <a href="/visionbench" class="btn btn-secondary"
                                    >Learn More</a
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
                                ground up to serve as the landing page for all
                                deltacv projects. Wanting something better than
                                a generic template, I created a custom dark
                                theme built on <strong>SvelteKit</strong>
                                and <strong>TailwindCSS</strong>.
                            </p>

                            <p>
                                It uses server-side rendering (SSR) to stay
                                fast, alongside a custom markdown-driven blog
                                built with Svelte components. The whole site is
                                deployed via <strong>Cloudflare Pages</strong>.
                            </p>

                            <div class="actions">
                                <a
                                    href="https://github.com/deltacv/deltacv.org"
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

            <Tab title="Experience">
                <div
                    class="projects-section max-w-5xl mx-auto w-full pt-6 pb-12 px-2 md:px-6"
                >
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <!-- Employment Tree -->
                        <div class="flex flex-col">
                            <h2
                                class="text-sm font-bold mb-8 uppercase tracking-widest text-[#8b949e]"
                            >
                                Employment
                            </h2>
                            <Timeline>
                                <TimelineItem
                                    title="Software Intern"
                                    subtitle="AutoZone BTSSC"
                                    startDate="2026-07"
                                    endDate="Present"
                                    icon={Briefcase}
                                    iconColor="#58a6ff"
                                >
                                    <ul class="space-y-1.5 mt-1">
                                        <li>
                                            Leveraging Power Automate to
                                            streamline and provide improvements
                                            to internal business processes.
                                        </li>
                                        <li>
                                            Collaborating extensively across
                                            teams using Jira and rapid agile
                                            methodologies to deliver solutions.
                                        </li>
                                    </ul>
                                </TimelineItem>
                            </Timeline>
                        </div>

                        <!-- Academic Tree -->
                        <div class="flex flex-col">
                            <h2
                                class="text-sm font-bold mb-8 uppercase tracking-widest text-[#8b949e]"
                            >
                                Academic
                            </h2>
                            <Timeline>
                                <TimelineItem
                                    title="Software Engineering Degree"
                                    subtitle="Universidad Tecmilenio"
                                    startDate="2024"
                                    endDate="2028"
                                    icon={GraduationCap}
                                    iconColor="#3fb950"
                                >
                                    <p class="mt-1">
                                        Currently pursuing a degree in Software
                                        Engineering, focusing on algorithms,
                                        system architecture, and modern
                                        application development.
                                    </p>
                                </TimelineItem>

                                <TimelineItem
                                    title="Robotics Team Mentor"
                                    subtitle="Tecmilenio - FIRST Tech Challenge"
                                    startDate="2024"
                                    endDate="Present"
                                    icon={Users}
                                    iconColor="#d29922"
                                >
                                    <p class="mt-1">
                                        Mentoring high school students in
                                        robotics, teaching software engineering
                                        practices, control theory, and
                                        autonomous vision systems.
                                    </p>
                                </TimelineItem>

                                <TimelineItem
                                    title="Robotics Team Student"
                                    subtitle="FIRST Tech Challenge & FIRST Robotics Competition"
                                    startDate="2018"
                                    endDate="2024"
                                    icon={Bot}
                                    iconColor="#8b949e"
                                >
                                    <p class="mt-1">
                                        Competed in FIRST Robotics in various
                                        teams, developing foundational skills in
                                        mechanics, CAD, Java & Kotlin
                                        programming with applied control theory,
                                        computer vision, and collaborative
                                        software engineering.
                                    </p>
                                </TimelineItem>
                            </Timeline>
                        </div>
                    </div>
                </div>
            </Tab>

            <Tab title="Articles">
                <AuthorBlogPosts authorEmail="serivesmejia@deltacv.org" />
            </Tab>
        </Tabbed>
    </div>
</main>

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

    .hello-nametag {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        color: #58a6ff;
        font-family: "Noto Sans", Arial, sans-serif;
        font-size: 0.9rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 0;
    }

    .hello-nametag::before,
    .hello-nametag::after {
        content: "";
        display: block;
        width: 24px;
        height: 2px;
        background-color: #58a6ff;
        opacity: 0.4;
        border-radius: 2px;
    }

    .hero-title {
        font-family: "Noto Sans", Arial, sans-serif;
        font-size: clamp(2.5rem, 5vw, 4.5rem);
        font-weight: 700;
        line-height: 1.1;
        margin: 0.2rem 0 0.5rem 0;
        color: #c9d1d9;
        letter-spacing: -1px;
    }

    .info-badges-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        margin-bottom: 1.5rem;
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

    .hero .hello-nametag,
    .hero .hero-title,
    .hero .info-badges-container,
    .hero .bio,
    .hero .skill-tag,
    .hero .social-links {
        opacity: 0;
        will-change: transform, opacity;
        animation: heroFlyIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    .hero .hello-nametag {
        animation-delay: 0.05s;
    }
    .hero .hero-title {
        animation-delay: 0.15s;
    }
    .hero .info-badges-container {
        animation-delay: 0.25s;
    }
    .hero .bio {
        animation-delay: 0.4s;
    }
    .hero .skill-tag {
        animation-delay: var(--delay);
    }
    .hero .social-links {
        animation-delay: 0.9s;
    }

    /* Projects Section */
    .projects-section {
        padding: 4rem 0;
    }

    .section-title {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 2rem 0;
        color: #b1bac4;
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

    .marquee-wrapper {
        display: inline-block;
        white-space: nowrap;
    }

    .marquee-content {
        display: inline-flex;
        white-space: nowrap;
    }

    .marquee-duplicate {
        display: none;
    }

    .marquee-content span {
        white-space: nowrap !important;
        text-wrap: nowrap !important;
    }

    @media (max-width: 600px) {
        .marquee-content span {
            padding-left: 20px; /* Ensures the 'S' is clear of the left edge fade mask on load */
        }
        .marquee-wrapper {
            max-width: 65vw;
            overflow: hidden;
            -webkit-mask-image: linear-gradient(
                to right,
                transparent 0%,
                black 5%,
                black 95%,
                transparent 100%
            );
            mask-image: linear-gradient(
                to right,
                transparent 0%,
                black 5%,
                black 95%,
                transparent 100%
            );
        }
        .marquee-duplicate {
            display: inline-block;
        }
        .marquee-content {
            animation: marquee-loop 14s linear infinite;
            animation-delay: 1s;
        }
    }

    @keyframes marquee-loop {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-50%);
        }
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
