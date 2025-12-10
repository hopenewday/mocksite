<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 font-sans pb-16">
    <!-- Header Section -->
    <header
      v-if="$route.name === 'tools'"
      class="bg-white dark:bg-gray-800 border-b-4 border-black dark:border-white p-8 text-center"
    >
      <div class="max-w-7xl mx-auto">
        <h1 class="text-6xl md:text-7xl font-black uppercase tracking-tighter mb-2 text-black dark:text-white">
          Tools Suite
        </h1>

        <!-- Search Bar -->
        <div class="max-w-xl mx-auto mt-8 relative">
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 border-4 border-black dark:border-white text-xl font-bold uppercase placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-brutal-yellow dark:focus:ring-brutal-yellow transition-all text-black dark:text-white"
            placeholder="Search Tools..."
          >
        </div>
      </div>
    </header>

    <!-- Tools Grid -->
    <main
      v-if="$route.name === 'tools'"
      class="max-w-screen-2xl mx-auto p-4 md:p-8"
    >
      <div
        v-if="filteredCategories.length === 0"
        class="text-center py-12"
      >
        <p class="text-2xl font-bold text-gray-500 dark:text-gray-400">
          No tools found matching "{{ searchQuery }}"
        </p>
      </div>

      <div class="flex flex-wrap justify-center gap-8">
        <div
          v-for="category in filteredCategories"
          :key="category.path"
          class="w-full max-w-sm bg-white dark:bg-gray-800 border-4 border-black dark:border-white shadow-[8px_8px_0px_#000] dark:shadow-[8px_8px_0px_#fff] flex flex-col"
        >
          <!-- Header with dynamic color -->
          <div :class="['border-b-4 border-black dark:border-white p-3 flex items-center gap-3', category.colorClass]">
            <Icon
              :icon="category.icon || 'mdi:hammer-wrench'"
              class="text-3xl text-black"
            />
            <h2 class="text-xl font-black uppercase tracking-tighter text-black">
              {{ category.title }}
            </h2>
          </div>

          <!-- Content Grid -->
          <div class="p-4 grid grid-cols-3 gap-4 flex-grow">
            <router-link
              v-for="tool in category.children.slice(0, 6)"
              :key="tool.path"
              :to="`${category.path}/${tool.path}`"
              class="flex flex-col items-center text-center group"
            >
              <div :class="['w-full aspect-square border-4 border-black dark:border-white flex items-center justify-center transition-all rounded-lg group-hover:shadow-[4px_4px_0px_#000] dark:group-hover:shadow-[4px_4px_0px_#fff] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5', category.colorClass]">
                <Icon
                  :icon="tool.meta?.icon || 'mdi:hammer-wrench'"
                  class="text-4xl text-black"
                />
              </div>
              <span class="mt-2 text-xs font-bold leading-tight uppercase text-black dark:text-white line-clamp-2">{{ tool.meta?.title }}</span>
            </router-link>
          </div>

          <!-- Footer Button -->
          <div class="p-3 border-t-4 border-black dark:border-white mt-auto">
            <router-link
              :to="category.path"
              class="block w-full bg-black text-white border-4 border-black dark:border-white text-center py-3 font-black uppercase text-sm transition-all hover:bg-gray-700 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] dark:hover:shadow-[8px_8px_0px_#fff]"
            >
              VIEW ALL {{ category.children.length }} TOOLS
            </router-link>
          </div>
        </div>
      </div>
    </main>

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

interface CategoryStyle {
  colorClass: string;
}

const colorMap: Record<string, CategoryStyle> = {
  'pdf': { colorClass: 'bg-brutal-lime' },
  'text': { colorClass: 'bg-brutal-cyan' },
  'font': { colorClass: 'bg-brutal-cyan' },
  'document': { colorClass: 'bg-brutal-yellow' },
  'image': { colorClass: 'bg-brutal-pink' },
  'calculator': { colorClass: 'bg-brutal-yellow' },
  'datetime': { colorClass: 'bg-brutal-pink' },
  'qr': { colorClass: 'bg-brutal-blue' },
  'color': { colorClass: 'bg-brutal-purple' },
  'academic': { colorClass: 'bg-brutal-lime' },
  'misc': { colorClass: 'bg-brutal-gray' },
};


const getToolsData = () => {
  const toolsRoute = router.options.routes.find(r => r.name === 'tools')
  if (!toolsRoute || !toolsRoute.children) return []

  return toolsRoute.children.map(child => {
    const categoryKey = child.path
    const styling = colorMap[categoryKey] || { colorClass: 'bg-brutal-gray text-white' };

    return {
      path: `/tools/${child.path}`,
      name: child.name,
      title: (child.meta as any)?.title || categoryKey,
      icon: (child.meta as any)?.icon || 'mdi:hammer-wrench',
      colorClass: styling.colorClass,
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
