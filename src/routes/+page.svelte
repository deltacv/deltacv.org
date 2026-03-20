<script>
  import AnimatedLogoText from "$lib/header/DeltaCVAnimatedLogoAndText.svelte";
  import Navbar from "$lib/header/Navbar.svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import Project from "$lib/projects/ProjectCard.svelte";
  import FeaturedProject from "$lib/projects/FeaturedProjectCard.svelte";
  import RecentBlogPosts from "$lib/blog/RecentBlogPosts.svelte";
  import eocvsim_img from "$lib/assets/eocvsim.png";
  import papervision_img from "$lib/assets/papervision.png";
  import papervision_gif from "$lib/assets/papervision.gif";
  import Footer from "$lib/footer/Footer.svelte";
  import { User } from "lucide-svelte";

  let ready = false;
  let imagesLoaded = 0;
  let scrollY = 0;
  const imageSources = [eocvsim_img, papervision_gif];
  function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === imageSources.length) ready = true;
  }
  onMount(() => {
    imageSources.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = checkImagesLoaded;
      img.onerror = checkImagesLoaded;
    });
  });
</script>

<svelte:window bind:scrollY />

<svelte:head>
  <title>deltacv - Computer Vision Tools for Java & Kotlin</title>
  <meta name="description" content="deltacv builds developer tools and visual programming interfaces for computer vision — including PaperVision, a node-based OpenCV pipeline editor, and EOCV-Sim for FTC robotics." />
</svelte:head>

{#if ready}
  <div class="container">
    <Navbar visible={scrollY > 250} />

    <header class="header">
      <div class="logo">
        <AnimatedLogoText massive={true} />
      </div>
    </header>

    <main class="content" in:fade={{ duration: 500 }}>
      <!-- Featured Project Full Width -->
      <div class="featured-section">
        <FeaturedProject
          title="PaperVision"
          description="Create your custom OpenCV algorithms using a user-friendly visual interface inspired by industry-leading node editors. Built from the ground up to solve the steep learning curve of Computer Vision in Java & Python."
          hoverSrc={papervision_img}
          staticSrc={papervision_gif}
          href="/papervision"
        />
      </div>

      <!-- Secondary Projects Grid -->
      <div class="secondary-grid">
        <Project
          title="EOCV-Sim"
          description="Develop, test, and tune your EasyOpenCV pipelines directly on your computer with a simple interface!"
          staticSrc={eocvsim_img}
          hoverSrc={eocvsim_img}
          href="/eocv-sim"
        />

        <!-- Meet the Developer Card -->
        <a href="/people/serivesmejia" class="developer-card">
          <div class="dev-icon">
            <User size={48} strokeWidth={1.5} color="#58a6ff" />
          </div>
          <h2>Meet the Developer</h2>
          <p>
            Hi, I'm Sebastian! See my freelancing portfolio, technical writing,
            and background.
          </p>
          <span class="read-more">View Profile &rarr;</span>
        </a>
      </div>

      <!-- Recent Writing Snippet -->
      <RecentBlogPosts />
    </main>
    <Footer />
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    width: 100%;
    min-width: 100%;
    background-color: #000;
    font-family: Arial, sans-serif;
    min-height: 100vh;
  }
  :global(*, *::before, *::after) {
    box-sizing: border-box;
  }

  .container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12vh 5vw;
    position: relative;
    z-index: 10;
    overflow: hidden;
    background-color: #05070a; /* Slightly darker than 0d1117 for depth */
    /* Composite mesh background - extremely subtle */
    background-image: radial-gradient(
        circle at 20% 30%,
        rgba(88, 166, 255, 0.02),
        transparent 30%
      ),
      radial-gradient(
        circle at 85% 70%,
        rgba(139, 148, 158, 0.015),
        transparent 30%
      ),
      linear-gradient(rgba(48, 54, 61, 0.28) 1px, transparent 1px),
      linear-gradient(90deg, rgba(48, 54, 61, 0.28) 1px, transparent 1px);
    background-size:
      100% 100%,
      100% 100%,
      80px 80px,
      80px 80px;
    background-position: center center;
  }

  .header::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 600px;
    height: 600px;
    background: radial-gradient(
      circle,
      rgba(88, 166, 255, 0.08) 0%,
      transparent 60%
    );
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: -1;
    filter: blur(100px);
  }

  .logo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 90%;
  }

  .content {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .featured-section {
    width: 100%;
    max-width: 1200px;
    padding: 2rem 5vw 3rem;
    margin: 0 auto;
  }

  .secondary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: stretch;
    gap: 32px;
    width: 100%;
    max-width: 950px;
    padding: 0 5vw 4rem;
    margin: 0 auto;
  }

  .developer-card {
    background-color: #161b22;
    border: 1px dashed #30363d;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: center;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .developer-card:hover {
    border-color: #58a6ff;
    border-style: solid;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    background-color: #1c2128;
  }

  .dev-icon {
    background: rgba(88, 166, 255, 0.1);
    padding: 1rem;
    border-radius: 50%;
    margin-bottom: 1rem;
  }

  .developer-card h2 {
    color: #c9d1d9;
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  .developer-card p {
    color: #8b949e;
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0 0 1.25rem 0;
  }

  .developer-card .read-more {
    color: #58a6ff;
    font-weight: 600;
    font-size: 0.95rem;
    margin-top: auto;
  }

  @media (max-width: 800px) {
    .secondary-grid {
      grid-template-columns: 1fr;
      max-width: 500px;
    }
  }
</style>
