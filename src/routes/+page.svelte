<script>
  import AnimatedLogoText from "$lib/header/DeltaCVAnimatedLogoAndText.svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import Project from "$lib/projects/ProjectCard.svelte";
  import eocvsim_img from "$lib/assets/eocvsim.png";
  import papervision_img from "$lib/assets/papervision.png";
  import papervision_gif from "$lib/assets/papervision.gif";
  import Footer from "$lib/footer/Footer.svelte";
  import BlogLinkCard from "$lib/projects/BlogLinkCard.svelte";
  let ready = false;
  let imagesLoaded = 0;
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
{#if ready}
  <div class="container">
    <header class="header">
      <div class="logo">
        <AnimatedLogoText />
      </div>
    </header>
    <main class="content" in:fade={{ duration: 500 }}>
      <Project
        title="EOCV-Sim"
        description="Develop, test, and tune your EasyOpenCV pipelines directly on your computer with a simple interface!"
        staticSrc={eocvsim_img}
        hoverSrc={eocvsim_img}
        href="./eocv-sim"
      />
      <Project
        title="PaperVision"
        description="Create your custom OpenCV algorithms using a user-friendly node editor interface inspired by Blender and Unreal Engine blueprints."
        hoverSrc={papervision_img}
        staticSrc={papervision_gif}
        href="./papervision"
      />
      <BlogLinkCard />
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
    background-color: #0d1117;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8vh 5vw;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 90%;
  }
  
  .content {
    flex: 1 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: 30px;
    padding: 5vh 5vw;
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
  }
  
  .content :global(> *) {
    flex: 0 0 auto;
    width: calc(33.333% - 20px);
  }
  
  @media (max-width: 900px) {
    .content :global(> *) {
      width: calc(50% - 15px);
    }
  }
  
  /* Mobile: two columns so cards aren't too big */
  @media (max-width: 600px) {
    .content {
      gap: 16px;
      padding: 4vh 4vw;
    }
    .content :global(> *) {
      width: calc(50% - 8px);
    }
  }
  
  /* Very small screens: single column, cards not full-bleed */
  @media (max-width: 420px) {
    .content :global(> *) {
      width: 100%;
      max-width: 280px;
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>