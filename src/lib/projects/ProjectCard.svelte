<script>
    import { quintOut } from 'svelte/easing';
    
    export let title = "Card Title";
    export let description = "This is the description that appears on hover.";
    export let staticSrc = "/path/to/static-image.jpg"; 
    export let hoverSrc = "/path/to/your.gif"; 
    export let href = "#"; 

    let currentSrc = staticSrc;
    let isHovering = false;

    $: currentSrc = isHovering ? hoverSrc : staticSrc;
</script>

<a 
    href={href} 
    class="card" 
    on:mouseenter={() => isHovering = true}
    on:mouseleave={() => isHovering = false}
    aria-label={title}
>
    <div class="image-container">
        <img src={currentSrc} alt={title} loading="lazy" />
        
        <div class="overlay">
            <p>{description}</p>
        </div>
    </div>
    
    <div class="footer">
        <h2>{title}</h2>
    </div>
</a>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

    .card {
        font-family: 'Inter', sans-serif;
        position: relative;
        width: 100%;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        background-color: #161b22;
        border: 1px solid #30363d;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.2s ease;
        text-decoration: none;
    }

    .card:hover {
        transform: scale(1.02);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
        border-color: #484f58;
    }
    
    .image-container {
        position: relative;
        width: 100%;
        overflow: hidden;
    }

    .card img {
        display: block;
        width: 100%;
        height: auto;
        aspect-ratio: 16 / 9; 
        object-fit: cover;
        background-color: #21262d;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(13, 17, 23, 0.88);
        color: #c9d1d9;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.25rem;
        box-sizing: border-box;
        opacity: 0;
        transform: translateY(8px);
        transition: opacity 0.25s ease, transform 0.25s ease;
    }

    .card:hover .overlay {
        opacity: 1;
        transform: translateY(0);
    }

    .overlay p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.55;
        text-align: center;
        color: #8b949e;
    }

    .footer {
        width: 100%;
        background: #0d1117;
        padding: 1rem 1.25rem;
        box-sizing: border-box;
        min-height: 56px; 
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: 1px solid #21262d;
    }

    .footer h2 {
        color: #c9d1d9;
        margin: 0;
        font-size: 1.15rem;
        font-weight: 600;
        word-wrap: break-word;
        max-width: 100%;
        transition: color 0.2s ease;
    }

    .card:hover .footer h2 {
        color: #58a6ff;
    }
</style>