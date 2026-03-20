<script>
  /**
   * @type {Array<{id: string, text: string, tagName: string}>}
   */
  export let headings = [];
  export let activeHeadingId = "";
</script>

<nav class="toc">
  <h4>On this page</h4>
  <ul>
    {#each headings as heading}
      <li class={heading.tagName}>
        <!-- use Svelte interpolation correctly -->
        <a
          href={"#" + heading.id}
          class:active={heading.id === activeHeadingId}
        >
          {heading.text}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .toc { width: 100%; }

  h4 {
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #a0a0a0;
    margin: 0 0 0.5rem 0;
  }

  ul {
    list-style: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  li {
    margin-bottom: 0.5rem;
    padding: 0 !important;
  }

  a {
    color: #adadad;
    text-decoration: none;
    font-size: 0.95rem;
    transition: max-height 0.4s ease, color 0.2s ease;
    line-height: 1.4;
    display: block;
    max-height: 1.4em;
    overflow: hidden;
    max-width: 100%;
  }

  a:hover,
  a.active {
    color: #ffffff;
    font-weight: 500;
  }

  a:hover {
    max-height: 10em;
  }

  li.h2 {
    padding-left: 1rem !important;
  }

  li.h2 a {
    font-size: 0.9rem;
    color: #9e9e9e;
  }

  li.h2 a:hover,
  li.h2 a.active {
    color: #ffffff;
  }

  @media (max-width: 1200px) {
    a {
      max-height: none !important;
      overflow: visible !important;
      white-space: normal !important;
    }
  }
</style>
