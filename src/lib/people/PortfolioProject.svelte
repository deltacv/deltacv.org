<script lang="ts">
    import PortfolioCard from "./PortfolioCard.svelte";
    import ProjectModal from "./ProjectModal.svelte";

    let {
        title = "Project Title",
        description = "A short description of the project.",
        image = "", 
        hoverImage = "", 
        tags = [],
        imageFit = "cover" as "cover" | "contain" | "pan",
        children
    } = $props();

    // Local state for handling the modal
    let isOpen = $state(false);

    function openModal() {
        isOpen = true;
    }

    function closeModal() {
        isOpen = false;
    }
</script>

<!-- The Card (rendered in the grid) -->
<PortfolioCard
    {title}
    {description}
    staticSrc={image}
    hoverSrc={hoverImage}
    {tags}
    {imageFit}
    onclick={openModal}
/>

<!-- The Modal (rendered absolutely when open is true) -->
<ProjectModal
    open={isOpen}
    {title}
    {image}
    {imageFit}
    onclose={closeModal}
>
    <!-- Render the snippet passed dynamically from page -->
    {@render children?.()}
</ProjectModal>
