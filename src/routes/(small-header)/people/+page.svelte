<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import PortfolioCard from "$lib/people/PortfolioCard.svelte";

    // Dynamically import all author metadata files (relative path avoids glob group issues with (small-header))
    const authorModules = import.meta.glob("./*/author.ts", { eager: true });

    // Dynamically import all author profile images
    const authorImages = import.meta.glob(
        "/src/lib/assets/people/**/*.{jpg,png,jpeg,webp,gif}",
        { eager: true, query: "?url", import: "default" }
    );

    const authors = Object.entries(authorModules).map(([path, mod]: [string, any]) => {
        // Extract the author folder name (e.g., 'serivesmejia')
        const folder = path.split("/").slice(-2, -1)[0];
        
        // Find corresponding image: /src/lib/assets/people/[folder]/[folder].[ext]
        const imagePath = Object.keys(authorImages).find((img) =>
            img.includes(`${folder}/${folder}.`)
        ) || "";
        
        return {
            ...mod.author,
            href: `/people/${folder}`,
            imageSrc: authorImages[imagePath] || "",
        };
    });

    let mounted = $state(false);
    onMount(() => {
        mounted = true;
    });
</script>

<svelte:head>
    <title>People - deltacv</title>
    <meta name="description" content="Meet the open source developers behind deltacv — building computer vision tools, robotics software, and visual programming interfaces." />
</svelte:head>

{#if mounted}
    <main in:fade={{ duration: 600 }}>
        <div class="people-container">
            <!-- Hero / Intro Section -->
            <header class="hero">
                <h1 class="gradient-text">People @ deltacv</h1>
                <p class="subtitle">
                    Meet the open source developers behind the tools.
                </p>
            </header>

            <!-- Main Projects Section -->
            <section class="projects-section">
                <div class="projects-grid">
                    {#each authors as author}
                        <PortfolioCard
                            title={author.name}
                            description={author.description}
                            tags={author.tags}
                            href={author.href}
                            staticSrc={author.imageSrc}
                        />
                    {/each}

                    <!-- New authors added via author.ts will appear here automatically! -->
                </div>
            </section>
        </div>
    </main>
{/if}

<style>
    .people-container {
        font-family: "Inter", sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: calc(var(--header-height, 64px) + 2.5rem) 2rem 2rem;
        color: #c9d1d9;
    }

    /* Hero Section */
    .hero {
        padding: 2rem 0 4rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        border-bottom: 1px solid #21262d;
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

    .subtitle {
        font-size: clamp(1.1rem, 2vw, 1.5rem);
        color: #8b949e;
        font-weight: 500;
        margin: 0;
    }

    /* Projects Section */
    .projects-section {
        padding: 4rem 0;
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
