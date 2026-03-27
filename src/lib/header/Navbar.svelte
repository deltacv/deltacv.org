<script lang="ts">
  export let visible = true;
  
  import deltacv_logo from "$lib/icons/deltacv.svg";
  import { onMount } from "svelte";
  import { fade, slide, fly } from "svelte/transition";
  import { cubicOut, cubicIn } from "svelte/easing";
  import { page } from "$app/stores";

  let headerEl: any;
  let navbarWrapper: any;
  let menuOpen = false;
  let activeDropdown: string | null = null;
  let windowScrollY = 0;
  let lastScrollY = 0;

  function toggleDropdown(name: string, event: any) {
    event.stopPropagation();
    activeDropdown = activeDropdown === name ? null : name;
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
    if (menuOpen) {
      lastScrollY = windowScrollY;
    }
  }

  function setHeaderHeight(height) {
    document.documentElement.style.setProperty(
      "--header-height",
      `${height}px`,
    );
  }

  function handleClickOutside(event: any) {
    if (navbarWrapper && !navbarWrapper.contains(event.target)) {
      menuOpen = false;
      activeDropdown = null;
    }
  }

  function handleScroll() {
    if (menuOpen) {
      const scrollDiff = Math.abs(windowScrollY - lastScrollY);
      if (scrollDiff > 60) {
        menuOpen = false;
      }
    }
  }

  onMount(() => {
    if (headerEl) {
      const observer = new ResizeObserver((entries) => {
        setHeaderHeight(entries[0].contentRect.height);
      });
      observer.observe(headerEl);
      setHeaderHeight(headerEl.offsetHeight);
    }

    const media = window.matchMedia("(min-width: 1025px)");
    const handleResize = (e: any) => {
      if (e.matches) {
        menuOpen = false;
      }
    };
    media.addEventListener("change", handleResize);
    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      media.removeEventListener("change", handleResize);
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<svelte:window bind:scrollY={windowScrollY} />

<div class="navbar-wrapper" bind:this={navbarWrapper}>
  {#if visible}
    <div transition:fly={{ y: -100, duration: 400, easing: cubicOut }}>
      <header class="header" bind:this={headerEl}>
    <div class="header-inner">
      <a href="/" class="skip-link">
        <div class="logo"><img src={deltacv_logo} alt="deltacv logo" /></div>
        <h1 class="header-title">deltacv</h1>
      </a>

      <nav class="nav-buttons desktop">
        <a href="/" class="nav-button" class:active={$page.url.pathname === "/"}
          >Home</a
        >

        <div class="nav-dropdown" class:is-open={activeDropdown === 'projects'}>
          <button class="nav-button" on:click={(e) => toggleDropdown('projects', e)}>Projects ▾</button>
          <div class="dropdown-content">
            <a
              href="/eocv-sim"
              class="dropdown-item"
              class:active={$page.url.pathname === "/eocv-sim"}
              on:click={() => (activeDropdown = null)}
            >
              EOCV-Sim
            </a>

            <a
              href="/papervision"
              class="dropdown-item"
              class:active={$page.url.pathname === "/papervision"}
              on:click={() => (activeDropdown = null)}
            >
              PaperVision
            </a>
          </div>
        </div>

        <div class="nav-dropdown" class:is-open={activeDropdown === 'about'}>
          <button class="nav-button" on:click={(e) => toggleDropdown('about', e)}>About ▾</button>
          <div class="dropdown-content">
            <a
              href="/blog"
              class="dropdown-item"
              class:active={$page.url.pathname.startsWith("/blog")}
              on:click={() => (activeDropdown = null)}
            >
              Blog
            </a>
            <a
              href="/people"
              class="dropdown-item"
              class:active={$page.url.pathname.startsWith("/people")}
              on:click={() => (activeDropdown = null)}
            >
              People
            </a>
          </div>
        </div>
      </nav>

      <button class="hamburger" on:click={toggleMenu} aria-label="Toggle menu">
        <div class:open={menuOpen}></div>
      </button>
    </div>
  </header>

  {#if menuOpen}
    <nav
      class="mobile-menu"
      in:slide={{ duration: 200 }}
      out:fade={{ duration: 150 }}
    >
      <a
        href="/"
        class="mobile-link"
        class:active={$page.url.pathname === "/"}
        on:click={() => (menuOpen = false)}
      >
        Home
      </a>

      <details class="mobile-dropdown">
        <summary class="mobile-dropdown-summary">Projects</summary>

        <div class="mobile-dropdown-items">
          <a
            href="/eocv-sim"
            class="mobile-dropdown-link"
            class:active={$page.url.pathname === "/eocv-sim"}
            on:click={() => (menuOpen = false)}
          >
            EOCV-Sim
          </a>

          <a
            href="/papervision"
            class="mobile-dropdown-link"
            class:active={$page.url.pathname === "/papervision"}
            on:click={() => (menuOpen = false)}
          >
            PaperVision
          </a>
        </div>
      </details>

      <details class="mobile-dropdown">
        <summary class="mobile-dropdown-summary">About</summary>

        <div class="mobile-dropdown-items">
          <a
            href="/blog"
            class="mobile-dropdown-link"
            class:active={$page.url.pathname.startsWith("/blog")}
            on:click={() => (menuOpen = false)}
          >
            Blog
          </a>
          <a
            href="/people"
            class="mobile-dropdown-link"
            class:active={$page.url.pathname.startsWith("/people")}
            on:click={() => (menuOpen = false)}
          >
            People
          </a>
        </div>
      </details>
    </nav>
  {/if}
</div>
{/if}
</div>

<style>
  .navbar-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
  }

  .header {
    width: 100%;
    background: rgba(13, 17, 23, 0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(48, 54, 61, 0.5);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }

  .header-inner {
    max-width: 1400px;
    width: 90%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
  }

  .skip-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: inherit;
  }

  .logo {
    width: clamp(30px, 5vw, 45px);
    height: clamp(40px, 5vw, 45px);
  }

  .logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .header-title {
    font-family: "Noto Sans", sans-serif;
    font-weight: 700;
    font-size: clamp(1.3rem, 2.3vw, 1.9rem);
    margin: 5px;
    color: #c9d1d9;
  }

  .nav-buttons {
    display: flex;
    gap: 0.75rem;
  }

  .nav-button {
    padding: 0.5rem 1rem;
    background-color: #21262d;
    color: #c9d1d9;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
  }

  .nav-button:hover {
    background-color: #30363d;
  }

  .nav-dropdown {
    position: relative;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    left: auto;
    width: max-content;
    min-width: 100%;
    max-width: min(220px, calc(100vw - 2rem));
    padding: 0.35rem 0;
    background: #161b22;
    border: 1px solid #30363d;
    border-top: none;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    z-index: 20;
  }

  .nav-dropdown:hover .dropdown-content,
  .nav-dropdown.is-open .dropdown-content {
    display: block;
  }

  .dropdown-item {
    display: block;
    padding: 0.5rem 1rem;
    color: #c9d1d9;
    text-decoration: none;
    font-weight: 500;
    white-space: nowrap;
  }

  .dropdown-item:hover {
    background-color: #21262d;
  }

  .dropdown-item:first-child {
    border-radius: 4px 4px 0 0;
  }

  .dropdown-item:last-child {
    border-radius: 0 0 4px 4px;
  }

  .hamburger {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 10px;
    min-width: 44px;
    min-height: 44px;
    position: relative;
    box-sizing: border-box;
  }

  .hamburger div {
    position: relative;
    width: 24px;
    height: 3px;
    flex-shrink: 0;
  }

  .hamburger div,
  .hamburger div::before,
  .hamburger div::after {
    content: "";
    position: absolute;
    width: 24px;
    height: 3px;
    left: 0;
    background-color: #c9d1d9;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .hamburger div::before {
    top: -8px;
  }

  .hamburger div::after {
    bottom: -8px;
  }

  .hamburger div.open {
    background-color: transparent;
  }

  .hamburger div.open::before {
    transform: rotate(45deg);
    top: 0;
  }

  .hamburger div.open::after {
    transform: rotate(-45deg);
    bottom: 0;
  }

  .mobile-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: #161b22;
    border-top: 1px solid #30363d;
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: 0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }

  .mobile-link,
  .mobile-dropdown-summary {
    display: block;
    padding: 0.75rem 1rem;
    color: #c9d1d9;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 8px;
    transition: background-color 0.15s ease;
  }

  .mobile-link:hover,
  .mobile-link:focus {
    background-color: #21262d;
  }

  .mobile-dropdown {
    margin: 0;
    padding: 0;
  }

  .mobile-dropdown-summary {
    list-style: none;
    cursor: pointer;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    font-family: inherit;
    position: relative;
    padding-right: 2.5rem;
  }

  .mobile-dropdown-summary::-webkit-details-marker,
  .mobile-dropdown-summary::marker {
    display: none;
  }

  .mobile-dropdown-summary::after {
    content: "▾";
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.85rem;
    color: #8b949e;
    transition: transform 0.2s ease;
  }

  .mobile-dropdown[open] .mobile-dropdown-summary::after {
    transform: translateY(-50%) rotate(180deg);
  }

  .mobile-dropdown-summary:hover,
  .mobile-dropdown[open] .mobile-dropdown-summary {
    background-color: #21262d;
  }

  .mobile-dropdown-items {
    display: flex;
    flex-direction: column;
    padding: 0.25rem 0 0.25rem 0;
    margin-top: 0.25rem;
    border-left: 2px solid #30363d;
    margin-left: 1rem;
  }

  .mobile-dropdown-link {
    display: block;
    padding: 0.6rem 1rem 0.6rem 1.25rem;
    color: #8b949e;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    border-radius: 6px;
    margin-left: 0.25rem;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;
  }

  .mobile-dropdown-link:hover,
  .mobile-dropdown-link:focus {
    background-color: #21262d;
    color: #c9d1d9;
  }

  .nav-button.active {
    background-color: #30363d;
    color: #ffffff;
  }

  .dropdown-item.active {
    background-color: #21262d;
    color: #ffffff;
  }

  .mobile-link.active,
  .mobile-dropdown-link.active {
    background-color: #21262d;
    color: #ffffff;
  }

  @media (max-width: 1024px) {
    .desktop {
      display: none;
    }

    .hamburger {
      display: flex;
    }
  }
</style>
