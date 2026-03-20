<script>
  import Footer from "$lib/footer/Footer.svelte";
  import Navbar from "$lib/header/Navbar.svelte";
</script>

<div class="container">
  <Navbar visible={true} />

  <main class="content">
    <slot />
  </main>

  <Footer />
</div>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    width: 100%;
    min-width: 100%;
    background-color: #000;
    font-family: Inter, sans-serif;
    color: #c9d1d9;
    min-height: 100%;
    box-sizing: border-box;
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

  .content {
    flex: 1 0 auto;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  :global(footer) {
    width: 100%;
    background-color: #0d1117;
    padding: 1rem 0;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    /* No padding here, each page handles it */
  }
</style>
