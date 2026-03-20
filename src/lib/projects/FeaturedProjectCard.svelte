<script>
    export let title = "Featured Title";
    export let description = "This is a detailed description of the featured project.";
    export let staticSrc = ""; 
    export let hoverSrc = ""; 
    export let href = "#"; 

    let currentSrc = staticSrc;
    let isHovering = false;
    $: currentSrc = isHovering ? hoverSrc : staticSrc;
</script>

<a  href={href} 
    class="featured-card" 
    on:mouseenter={() => isHovering = true}
    on:mouseleave={() => isHovering = false}
    aria-label={title}
>
    <!-- Left: Image -->
    <div class="image-container">
        <img src={currentSrc} alt={title} loading="lazy" />
        <div class="image-overlay">
            <span class="view-btn">View Project</span>
        </div>
    </div>
    
    <!-- Right: Content -->
    <div class="content-container">
        <div class="badge">Featured Open Source</div>
        <h2>{title}</h2>
        <p>{description}</p>
        <div class="card-footer">
            <span class="read-more">Learn More &rarr;</span>
        </div>
    </div>
</a>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    .featured-card {
        font-family: 'Inter', sans-serif;
        display: flex;
        flex-direction: row;
        width: 100%;
        max-width: 850px;
        margin: 0 auto;
        background-color: #161b22;
        border: 1px solid #30363d;
        border-radius: 16px;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        text-decoration: none;
        align-items: stretch;
    }

    .featured-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
        border-color: #58a6ff;
    }

    .image-container {
        position: relative;
        flex: 1.25;
        min-width: 0;
        overflow: hidden;
        background-color: #0d1117;
    }

    .image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.5s ease;
    }

    .featured-card:hover .image-container img {
        transform: scale(1.03);
    }

    .image-overlay {
        position: absolute;
        inset: 0;
        background: rgba(13, 17, 23, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .featured-card:hover .image-overlay {
        opacity: 1;
    }

    .view-btn {
        background: rgba(88, 166, 255, 0.9);
        color: #fff;
        font-weight: 600;
        padding: 0.5rem 1.25rem;
        border-radius: 9999px;
        font-size: 0.95rem;
        transform: translateY(10px);
        transition: transform 0.3s ease;
    }

    .featured-card:hover .view-btn {
        transform: translateY(0);
    }

    .content-container {
        flex: 1;
        padding: 1.75rem 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: #0d1117;
        border-left: 1px solid #21262d;
    }

    .badge {
        display: inline-block;
        color: #58a6ff;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
    }

    .content-container h2 {
        color: #c9d1d9;
        font-size: 1.8rem;
        font-weight: 800;
        margin: 0 0 0.75rem 0;
        letter-spacing: -0.02em;
        transition: color 0.2s ease;
    }

    .featured-card:hover .content-container h2 {
        color: #58a6ff;
    }

    .content-container p {
        color: #8b949e;
        font-size: 1rem;
        line-height: 1.5;
        margin: 0 0 1.5rem 0;
    }

    .card-footer {
        margin-top: auto;
    }

    .read-more {
        color: #8b949e;
        font-weight: 600;
        font-size: 1rem;
        transition: color 0.2s ease;
    }

    .featured-card:hover .read-more {
        color: #c9d1d9;
    }

    @media (max-width: 900px) {
        .featured-card {
            flex-direction: column;
        }
        .content-container {
            border-left: none;
            border-top: 1px solid #21262d;
            padding: 2rem;
        }
        .image-container img {
            aspect-ratio: 16 / 9;
        }
    }
</style>
