<script lang="ts">
    import type { Snippet } from "svelte";

    let { 
        title, 
        subtitle = "", 
        date = "", 
        startDate = "",
        endDate = "",
        icon = null,
        iconColor = "#58a6ff",
        children
    }: {
        title: string;
        subtitle?: string;
        date?: string;
        startDate?: string;
        endDate?: string;
        icon?: any;
        iconColor?: string;
        children?: Snippet;
    } = $props();

    function parseDate(d: string): { date: Date, hasMonth: boolean } | null {
        if (!d) return null;
        if (d.toLowerCase() === 'present') return { date: new Date(), hasMonth: true };
        
        // YYYY-MM
        if (/^\d{4}-\d{2}$/.test(d)) {
            const [year, month] = d.split('-');
            return { date: new Date(parseInt(year), parseInt(month) - 1), hasMonth: true };
        }
        // YYYY
        if (/^\d{4}$/.test(d)) {
            return { date: new Date(parseInt(d), 0), hasMonth: false };
        }
        // Fallback
        const parsed = new Date(d);
        if (!isNaN(parsed.getTime())) {
            return { date: parsed, hasMonth: !/^\d{4}$/.test(d.trim()) };
        }
        return null;
    }

    function formatMonthYear(d: string): string {
        if (!d) return '';
        if (d.toLowerCase() === 'present') return 'Present';
        const parsed = parseDate(d);
        if (!parsed) return d;
        
        if (!parsed.hasMonth) {
            return parsed.date.getFullYear().toString();
        }
        return parsed.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    function calculateDuration(start: string, end: string): string {
        const sParsed = parseDate(start);
        const eParsed = parseDate(end);
        if (!sParsed || !eParsed) return '';

        const s = sParsed.date;
        const e = eParsed.date;

        if (!sParsed.hasMonth || !eParsed.hasMonth) {
            let yrs = e.getFullYear() - s.getFullYear();
            if (yrs <= 0) return '';
            return `${yrs} yr${yrs !== 1 ? 's' : ''}`;
        }

        let months = (e.getFullYear() - s.getFullYear()) * 12;
        months -= s.getMonth();
        months += e.getMonth();
        
        // If start and end are the same month, count as 1 month
        if (months === 0) {
            months = 1;
        }

        if (months < 0) return '';

        const yrs = Math.floor(months / 12);
        const mos = months % 12;

        let result = [];
        if (yrs > 0) result.push(`${yrs} yr${yrs !== 1 ? 's' : ''}`);
        if (mos > 0) result.push(`${mos} mo${mos !== 1 ? 's' : ''}`);
        
        return result.join(' ');
    }

    const isCurrent = $derived(
        (endDate && endDate.toLowerCase() === 'present') || 
        (date && date.toLowerCase() === 'present')
    );

    const formattedStart = $derived(startDate ? formatMonthYear(startDate) : '');
    const formattedEnd = $derived(endDate ? formatMonthYear(endDate) : '');
    const duration = $derived(startDate && endDate ? calculateDuration(startDate, endDate) : '');
</script>

<div 
    class="relative pl-7 md:pl-9 group"
    style="--accent-color: {iconColor}; --accent-glow: {iconColor}24; --accent-glow-hover: {iconColor}38;"
>
    <!-- Icon Node on Timeline Spine -->
    <div 
        class="absolute -left-[17px] top-4 sm:top-5 w-8 h-8 rounded-full bg-[#161b22] border-2 border-[#30363d] flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:border-[var(--accent-color)] group-hover:shadow-[0_0_12px_var(--accent-glow-hover)] z-10"
        style="color: {iconColor};"
    >
        {#if icon}
            {@const Icon = icon}
            <Icon size={14} strokeWidth={2.3} />
        {:else}
            <div class="w-2.5 h-2.5 rounded-full bg-current"></div>
        {/if}
    </div>

    <!-- Bento Card Container -->
    <div 
        class="timeline-card relative rounded-xl bg-[#161b22] p-4.5 sm:p-5 transition-all duration-300"
        class:is-active-card={isCurrent}
        class:is-past-card={!isCurrent}
    >
        <!-- Header: Title, Subtitle, Date & Duration -->
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-4">
            <div class="min-w-0">
                <h3 class="text-base sm:text-lg font-bold text-[#f0f6fc] tracking-tight group-hover:text-white transition-colors">
                    {title}
                </h3>
                {#if subtitle}
                    <h4 class="text-sm font-medium text-[#8b949e] mt-0.5">
                        {subtitle}
                    </h4>
                {/if}
            </div>

            <!-- Date & Duration -->
            {#if (formattedStart && formattedEnd) || date}
                <div class="flex items-center gap-2 text-xs font-mono shrink-0 sm:self-start">
                    <span class="text-[#8b949e]">
                        {#if formattedStart && formattedEnd}
                            {formattedStart} &mdash; {formattedEnd}
                        {:else}
                            {date}
                        {/if}
                    </span>
                    {#if duration}
                        <span class="text-[#484f58] select-none">·</span>
                        <span class="text-[#c9d1d9] bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d] text-[11px] font-medium tracking-wide">
                            {duration}
                        </span>
                    {/if}
                </div>
            {/if}
        </div>

        <!-- Card Body -->
        {#if children}
            <div class="timeline-body text-[#8b949e] text-[0.925rem] leading-relaxed pt-3 border-t border-[#30363d]/60 mt-3.5 space-y-2">
                {@render children()}
            </div>
        {/if}
    </div>
</div>

<style>
    /* Past or concluded experiences */
    .is-past-card {
        border: 1px solid #30363d;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .is-past-card:hover {
        border-color: #484f58;
        background-color: #181f2a;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }

    @keyframes ambient-breathe {
        0%, 100% {
            border-color: color-mix(in srgb, var(--accent-color) 35%, #30363d);
            box-shadow: 0 0 16px -3px var(--accent-glow), 0 4px 12px rgba(0, 0, 0, 0.25);
        }
        50% {
            border-color: color-mix(in srgb, var(--accent-color) 65%, #30363d);
            box-shadow: 0 0 28px 1px var(--accent-glow-hover), 0 4px 14px rgba(0, 0, 0, 0.3);
        }
    }

    /* Active / Present experiences: gentle breathing ambient aura */
    .is-active-card {
        border: 1px solid color-mix(in srgb, var(--accent-color) 35%, #30363d);
        box-shadow: 0 0 16px -3px var(--accent-glow), 0 4px 12px rgba(0, 0, 0, 0.25);
        animation: ambient-breathe 4.5s ease-in-out infinite;
    }

    .is-active-card:hover {
        animation-play-state: paused;
        border-color: color-mix(in srgb, var(--accent-color) 75%, #30363d);
        box-shadow: 0 0 30px 2px var(--accent-glow-hover), 0 6px 18px rgba(0, 0, 0, 0.35);
        background-color: #181f2a;
    }

    @media (prefers-reduced-motion: reduce) {
        .is-active-card {
            animation: none;
        }
    }

    .timeline-body :global(ul) {
        list-style: none;
        padding-left: 0;
        margin: 0;
    }

    .timeline-body :global(li) {
        position: relative;
        padding-left: 1.25rem;
        margin-bottom: 0.5rem;
    }

    .timeline-body :global(li:last-child) {
        margin-bottom: 0;
    }

    .timeline-body :global(li::before) {
        content: "▹";
        position: absolute;
        left: 0;
        top: 0;
        color: var(--accent-color, #58a6ff);
        font-weight: 700;
        font-size: 0.9rem;
    }

    .timeline-body :global(p) {
        margin: 0;
    }
</style>
