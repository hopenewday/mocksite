<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black text-black dark:text-brutal-white">
    <header class="sticky top-0 z-50 bg-brutal-white dark:bg-brutal-black border-b-4 border-black dark:border-brutal-white shadow-brutal-sm dark:shadow-[2px_2px_0px_0px_#fff]">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <router-link
            to="/"
            class="flex items-center gap-3 group"
          >
            <div class="w-12 h-12 bg-brutal-yellow border-4 border-black dark:border-white shadow-brutal dark:shadow-[4px_4px_0px_0px_#fff] flex items-center justify-center transform transition-all duration-200 group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-brutal-lg dark:group-hover:shadow-[8px_8px_0px_0px_#fff]">
              <span class="text-2xl font-black text-black">⚡</span>
            </div>
            <span class="heading-brutal text-2xl md:text-3xl">Mock Test Pro</span>
          </router-link>

          <nav class="flex items-center gap-4">
            <div class="hidden md:flex items-center gap-3">
              <LanguageSwitcher />
              <DarkModeToggle />
              <InstallPrompt />
            </div>

            <div class="flex items-center gap-1 md:gap-2 flex-wrap">
              <router-link
                to="/tests"
                class="btn-primary btn-primary-cyan text-sm px-3 py-2 md:px-4 md:py-3"
              >
                {{ t('nav.tests') }}
              </router-link>
              <router-link
                to="/tools"
                class="btn-primary btn-primary-pink text-sm px-3 py-2 md:px-4 md:py-3"
              >
                Tools
              </router-link>
              <router-link
                to="/dashboard"
                class="btn-primary btn-primary-yellow text-sm px-3 py-2 md:px-4 md:py-3 hidden sm:inline-block"
              >
                Dashboard
              </router-link>
              <router-link
                to="/jobs"
                class="btn-primary btn-primary-lime text-sm px-3 py-2 md:px-4 md:py-3 hidden lg:inline-block"
              >
                Jobs
              </router-link>
              <router-link
                to="/my/assessments"
                class="btn-primary btn-primary-purple text-sm px-3 py-2 md:px-4 md:py-3 hidden xl:inline-block"
              >
                {{ t('nav.assessments') }}
              </router-link>
              <router-link
                to="/admin"
                class="btn-primary btn-primary-blue text-sm px-3 py-2 md:px-4 md:py-3 hidden 2xl:inline-block"
              >
                {{ t('nav.admin') }}
              </router-link>
            </div>

            <div class="md:hidden flex items-center gap-3">
              <LanguageSwitcher />
              <DarkModeToggle />
              <InstallPrompt />
            </div>
          </nav>
        </div>
      </div>
    </header>

    <main class="relative">
      <RouterView v-slot="{ Component }">
        <Transition
          name="route-fade"
          mode="out-in"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
  <div
    id="gsap-confetti"
    class="pointer-events-none fixed inset-0"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useSettingsStore } from './stores/settings'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import DarkModeToggle from './components/DarkModeToggle.vue'
import InstallPrompt from './components/InstallPrompt.vue'

const settings = useSettingsStore()
const dark = computed(() => settings.darkMode)
const { t } = useI18n()

// Canonical link per-route for SEO & Dark Mode class on HTML
const route = useRoute()
const canonicalUrl = computed(() => `${window.location.origin}${route.fullPath}`)
useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  htmlAttrs: {
    class: dark.value ? 'dark' : ''
  }
}))
</script>
