<script lang="ts">
    import { lazyVideo } from "$lib/actions/lazyVideo";
    import { progressiveImage } from "$lib/actions/progressiveImage";
    import { progressiveVideo } from "$lib/actions/progressiveVideo";

    let {
        src = "",
        alt = "",
        class: className = "",
        lazyVideoConfig = undefined,
        ...rest
    } = $props();

    let isVideo = $derived(/\.(mp4|webm|ogg|mov)$/i.test(src));
</script>

{#if src}
    {#if isVideo}
        <video
            {src}
            class={className}
            use:lazyVideo={lazyVideoConfig}
            use:progressiveVideo
            loop
            muted
            playsinline
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noplaybackrate noplaylist"
            preload="none"
            aria-label={alt}
            {...rest}
        ></video>
    {:else}
        <img 
            use:progressiveImage 
            {src} 
            class={className}
            {alt} 
            loading="lazy"
            {...rest}
        />
    {/if}
{/if}
