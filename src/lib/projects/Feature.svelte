<script lang="ts">
  import type { SvelteComponent } from 'svelte';

  export let icon: typeof SvelteComponent;
  export let title: string;
  export let desc: string;
  export let url: string | undefined = undefined; 
  export let color: 'cyan' | 'amber' | 'emerald' | 'purple' | 'rose' | 'blue' = 'cyan';
  
  let className: string = '';
  export { className as class };

  const tag = url ? 'a' : 'div';
  const linkProps = url ? { href: url } : {};

  // Tailwind safe-listed dictionaries
  const colorMap = {
    cyan: {
      hoverBorder: 'hover:border-cyan-500/50',
      hoverShadow: 'hover:shadow-cyan-900/30',
      iconBoxBg: 'bg-cyan-500/10',
      iconText: 'text-cyan-400',
      iconBorder: 'border-cyan-500/20',
      gradient: 'group-hover:from-cyan-500/5'
    },
    amber: {
      hoverBorder: 'hover:border-amber-500/50',
      hoverShadow: 'hover:shadow-amber-900/30',
      iconBoxBg: 'bg-amber-500/10',
      iconText: 'text-amber-400',
      iconBorder: 'border-amber-500/20',
      gradient: 'group-hover:from-amber-500/5'
    },
    emerald: {
      hoverBorder: 'hover:border-emerald-500/50',
      hoverShadow: 'hover:shadow-emerald-900/30',
      iconBoxBg: 'bg-emerald-500/10',
      iconText: 'text-emerald-400',
      iconBorder: 'border-emerald-500/20',
      gradient: 'group-hover:from-emerald-500/5'
    },
    purple: {
      hoverBorder: 'hover:border-purple-500/50',
      hoverShadow: 'hover:shadow-purple-900/30',
      iconBoxBg: 'bg-purple-500/10',
      iconText: 'text-purple-400',
      iconBorder: 'border-purple-500/20',
      gradient: 'group-hover:from-purple-500/5'
    },
    rose: {
      hoverBorder: 'hover:border-rose-500/50',
      hoverShadow: 'hover:shadow-rose-900/30',
      iconBoxBg: 'bg-rose-500/10',
      iconText: 'text-rose-400',
      iconBorder: 'border-rose-500/20',
      gradient: 'group-hover:from-rose-500/5'
    },
    blue: {
      hoverBorder: 'hover:border-blue-500/50',
      hoverShadow: 'hover:shadow-blue-900/30',
      iconBoxBg: 'bg-blue-500/10',
      iconText: 'text-blue-400',
      iconBorder: 'border-blue-500/20',
      gradient: 'group-hover:from-blue-500/5'
    }
  };

  $: theme = colorMap[color] || colorMap.cyan;
</script>

<svelte:element
  this={tag}
  class="group relative overflow-hidden bg-gray-900/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-800/80 transition-all duration-300 {theme.hoverBorder} hover:shadow-2xl {theme.hoverShadow} hover:-translate-y-1 block {className}"
  {...linkProps}
>
  <!-- Interactive Gradient Glow effect on hover -->
  <div class="absolute inset-0 bg-gradient-to-br {theme.gradient} to-transparent opacity-0 transition-opacity duration-700 pointer-events-none"></div>

  <div class="p-8 relative z-10 flex flex-col h-full w-full bg-gray-900/80 rounded-[22px] border border-gray-700/50 backdrop-blur-xl overflow-hidden">
    <div class="inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br {theme.iconBoxBg} {theme.iconBorder} shadow-lg mb-6 w-fit transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
      <svelte:component this={icon} class="w-7 h-7" />
    </div>
    
    <h3 class="text-xl font-bold text-gray-100 group-hover:text-white transition-colors">{title}</h3>
    <p class="mt-3 text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors text-sm md:text-base">{desc}</p>

    <!-- Optional rich media/graphic content injected into the card -->
    <slot />
  </div>
</svelte:element>