<template>
  <div class="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] bg-brutal-white dark:bg-brutal-black font-sans pb-16">
    <!-- Header Section -->
    <header
      v-if="$route.name === 'tools'"
      class="bg-white dark:bg-gray-900 border-b-4 border-black dark:border-white p-8 text-center"
    >
      <div class="max-w-7xl mx-auto">
        <h1 class="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-2 text-black dark:text-white">
          TOOLS SUITE
        </h1>

        <!-- Search Bar -->
        <div class="max-w-xl mx-auto mt-8 relative">
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full py-3 px-4 bg-gray-200 dark:bg-gray-800 border-4 border-black dark:border-white text-xl font-bold uppercase placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-gray-700 transition-colors text-black dark:text-white"
            placeholder="SEARCH TOOLS..."
          >
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">
            🔍
          </div>
        </div>
      </div>
    </header>

    <!-- Tools Grid -->
    <div
      v-if="$route.name === 'tools'"
      class="max-w-7xl mx-auto p-4 md:p-8"
    >
      <div
        v-if="filteredCategories.length === 0"
        class="text-center py-12"
      >
        <p class="text-2xl font-bold text-gray-500 dark:text-gray-400">
          No tools found matching "{{ searchQuery }}"
        </p>
      </div>

      <!-- True Masonry Layout using CSS Columns -->
      <div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-0">
        <div
          v-for="category in filteredCategories"
          :key="category.path"
          :class="[
            'bg-white dark:bg-gray-900 border-4 border-black dark:border-white shadow-[8px_8px_0px_#000] dark:shadow-[8px_8px_0px_#fff] flex flex-col break-inside-avoid mb-6',
            category.stripeClass
          ]"
        >
          <!-- Header with dynamic color stripe -->
          <div :class="['border-b-4 border-black dark:border-white p-3 md:p-4 flex items-center gap-2 md:gap-3', category.colorClass]">
            <Icon
              :icon="category.icon || 'mdi:hammer-wrench'"
              class="text-2xl md:text-3xl text-black"
            />
            <h2 class="text-lg md:text-xl font-black uppercase leading-none tracking-tighter text-black">
              {{ category.title }}
            </h2>
          </div>

          <!-- Content Grid (Mini Icons) - COLORED BACKGROUNDS like reference -->
          <div :class="['p-3 md:p-4 grid gap-2 md:gap-3', category.gridClass]">
            <template
              v-for="tool in category.children.slice(0, category.showCount)"
              :key="tool.path"
            >
              <router-link
                :to="`${category.path}/${tool.path}`"
                class="flex flex-col items-center text-center group"
              >
                <div :class="['w-12 h-12 md:w-14 md:h-14 border-2 border-black dark:border-white flex items-center justify-center mb-1 transition-all rounded-lg group-hover:shadow-[3px_3px_0px_#000] dark:group-hover:shadow-[3px_3px_0px_#fff]', category.iconColorClass]">
                  <Icon
                    :icon="tool.meta?.icon || 'mdi:hammer-wrench'"
                    class="text-xl md:text-2xl text-black"
                  />
                </div>
                <span class="text-[9px] md:text-[10px] font-bold leading-tight uppercase text-black dark:text-white line-clamp-2">{{ tool.meta?.title }}</span>
              </router-link>
            </template>
          </div>

          <!-- Footer Button - BLACK like reference -->
          <div class="p-3 md:p-4 pt-0 mt-auto">
            <router-link
              :to="category.path"
              class="block w-full bg-gray-800 dark:bg-gray-700 text-white border-4 border-black dark:border-white text-center py-1.5 md:py-2 font-black uppercase text-xs md:text-sm transition-all hover:bg-gray-700 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000] dark:hover:shadow-[4px_4px_0px_#fff]"
            >
              VIEW ALL {{ category.children.length }} TOOLS
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <RouterView
      v-else
      v-slot="{ Component }"
    >
      <Transition
        name="route-fade"
        mode="out-in"
      >
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { Icon } from '@iconify/vue'

useHead({
  title: 'Tools Suite - All Tools',
  meta: [
    { name: 'description', content: 'Explore our comprehensive suite of online tools.' }
  ]
})

const router = useRouter()
const searchQuery = ref('')

// Color & Size Mapping for Neo-Brutalist Theme
// Large cards: PDF, Text, Misc, Academic (more tools shown)
// Small cards: Image, Calculator, DateTime, QR, Color, Font, Document (fewer tools)
interface CategoryStyle {
  header: string
  icon: string
  iconColor: string  // Background color for tool icons
  stripe: string
  button: string
  size: 'large' | 'small'
  grid: string
  showCount: number
}

const colorMap: Record<string, CategoryStyle> = {
  'pdf': {
    header: 'bg-brutal-lime',
    icon: 'group-hover:bg-brutal-lime',
    iconColor: 'bg-brutal-lime',
    stripe: 'border-l-[6px] border-l-brutal-lime',
    button: 'bg-brutal-lime',
    size: 'large',
    grid: 'grid-cols-3',
    showCount: 6
  },
  'image': {
    header: 'bg-brutal-cyan',
    icon: 'group-hover:bg-brutal-cyan',
    iconColor: 'bg-brutal-cyan',
    stripe: 'border-l-[6px] border-l-brutal-cyan',
    button: 'bg-brutal-cyan',
    size: 'small',
    grid: 'grid-cols-3',
    showCount: 5
  },
  'calculator': {
    header: 'bg-brutal-yellow',
    icon: 'group-hover:bg-brutal-yellow',
    iconColor: 'bg-brutal-yellow',
    stripe: 'border-l-[6px] border-l-brutal-yellow',
    button: 'bg-brutal-yellow',
    size: 'small',
    grid: 'grid-cols-2',
    showCount: 4
  },
  'text': {
    header: 'bg-brutal-cyan',
    icon: 'group-hover:bg-brutal-cyan',
    iconColor: 'bg-brutal-cyan',
    stripe: 'border-l-[6px] border-l-brutal-cyan',
    button: 'bg-brutal-cyan',
    size: 'large',
    grid: 'grid-cols-3',
    showCount: 6
  },
  'datetime': {
    header: 'bg-brutal-yellow',
    icon: 'group-hover:bg-brutal-yellow',
    iconColor: 'bg-brutal-yellow',
    stripe: 'border-l-[6px] border-l-brutal-yellow',
    button: 'bg-brutal-yellow',
    size: 'small',
    grid: 'grid-cols-2',
    showCount: 4
  },
  'qr': {
    header: 'bg-brutal-pink',
    icon: 'group-hover:bg-brutal-pink',
    iconColor: 'bg-brutal-pink',
    stripe: 'border-l-[6px] border-l-brutal-pink',
    button: 'bg-brutal-pink',
    size: 'small',
    grid: 'grid-cols-2',
    showCount: 2
  },
  'color': {
    header: 'bg-brutal-pink',
    icon: 'group-hover:bg-brutal-pink',
    iconColor: 'bg-brutal-pink',
    stripe: 'border-l-[6px] border-l-brutal-pink',
    button: 'bg-brutal-pink',
    size: 'small',
    grid: 'grid-cols-2',
    showCount: 4
  },
  'font': {
    header: 'bg-brutal-cyan',
    icon: 'group-hover:bg-brutal-cyan',
    iconColor: 'bg-brutal-cyan',
    stripe: 'border-l-[6px] border-l-brutal-cyan',
    button: 'bg-brutal-cyan',
    size: 'small',
    grid: 'grid-cols-3',
    showCount: 3
  },
  'document': {
    header: 'bg-brutal-yellow',
    icon: 'group-hover:bg-brutal-yellow',
    iconColor: 'bg-brutal-yellow',
    stripe: 'border-l-[6px] border-l-brutal-yellow',
    button: 'bg-brutal-yellow',
    size: 'small',
    grid: 'grid-cols-3',
    showCount: 3
  },
  'academic': {
    header: 'bg-brutal-lime',
    icon: 'group-hover:bg-brutal-lime',
    iconColor: 'bg-brutal-lime',
    stripe: 'border-l-[6px] border-l-brutal-lime',
    button: 'bg-brutal-lime',
    size: 'large',
    grid: 'grid-cols-3',
    showCount: 6
  },
  'misc': {
    header: 'bg-gray-300 dark:bg-gray-600',
    icon: 'group-hover:bg-gray-300 dark:group-hover:bg-gray-600',
    iconColor: 'bg-gray-200 dark:bg-gray-700',
    stripe: 'border-l-[6px] border-l-gray-400',
    button: 'bg-gray-700 text-white',
    size: 'large',
    grid: 'grid-cols-3',
    showCount: 6
  }
}

const getToolsData = () => {
  const toolsRoute = router.options.routes.find(r => r.name === 'tools')
  if (!toolsRoute || !toolsRoute.children) return []

  return toolsRoute.children.map(child => {
    const categoryKey = child.path
    const styling = colorMap[categoryKey] || {
      header: 'bg-white',
      icon: 'group-hover:bg-gray-100',
      iconColor: 'bg-gray-100',
      stripe: 'border-l-[6px] border-l-gray-400',
      button: 'bg-gray-700 text-white',
      size: 'small' as const,
      grid: 'grid-cols-3',
      showCount: 6
    }

    // Size class for masonry - large cards span 2 rows on desktop
    const sizeClass = styling.size === 'large' ? 'lg:row-span-1' : ''

    return {
      path: `/tools/${child.path}`,
      name: child.name,
      title: (child.meta as any)?.title || categoryKey,
      description: (child.meta as any)?.description || '',
      icon: (child.meta as any)?.icon || 'mdi:hammer-wrench',
      colorClass: styling.header,
      iconBgClass: styling.icon,
      iconColorClass: styling.iconColor,  // Colored background for tool icons
      stripeClass: styling.stripe,
      buttonClass: styling.button,
      sizeClass: sizeClass,
      gridClass: styling.grid,
      showCount: styling.showCount,
      children: child.children ? child.children.map(c => ({
          ...c,
          meta: {
              ...c.meta,
              icon: (c.meta as any)?.icon || 'mdi:hammer-wrench'
          }
      })) : []
    }
  })
}

const allCategories = getToolsData()

const filteredCategories = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return allCategories

  return allCategories.map(cat => {
    const categoryMatches = cat.title.toLowerCase().includes(query)
    const matchingChildren = cat.children.filter(tool => {
       const toolTitle = (tool.meta as any)?.title?.toLowerCase() || ''
       return toolTitle.includes(query)
    })

    if (categoryMatches) return cat
    if (matchingChildren.length > 0) return { ...cat, children: matchingChildren }
    return null
  }).filter(Boolean) as typeof allCategories
})
</script>
