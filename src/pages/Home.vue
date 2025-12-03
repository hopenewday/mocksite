<template>
  <main class="min-h-screen bg-[radial-gradient(circle_at_top,_#fdfdfd,_#e5e5e5)] text-black">
    <section class="max-w-6xl mx-auto px-4 py-10 md:py-14 lg:py-16">
      <!-- TOP NAV STRIP -->
      <nav
        class="mb-10 md:mb-12 bg-brutal-yellow border-4 border-black shadow-brutal px-4 md:px-8 py-3 md:py-4 flex flex-wrap items-center justify-between gap-3"
      >
        <div class="flex flex-wrap gap-3 md:gap-6 text-sm md:text-base font-black tracking-wide">
          <router-link
            to="/"
            class="px-3 py-1 bg-white border-2 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:translate-x-1 transition-transform"
          >
            HOME
          </router-link>
          <router-link
            to="/tests"
            class="px-3 py-1 hover:bg-brutal-lime border-2 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:translate-x-1 transition-transform"
          >
            MOCK TESTS
          </router-link>
          <router-link
            to="/dashboard"
            class="px-3 py-1 hover:bg-brutal-cyan border-2 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:translate-x-1 transition-transform"
          >
            ANALYTICS
          </router-link>
          <router-link
            to="/tools"
            class="px-3 py-1 hover:bg-brutal-pink border-2 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:translate-x-1 transition-transform"
          >
            TOOLS
          </router-link>
          <router-link
            to="/dashboard"
            class="px-3 py-1 hover:bg-brutal-yellow border-2 border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:translate-x-1 transition-transform"
          >
            DASHBOARD
          </router-link>
        </div>

        <router-link
          to="/admin/login"
          class="px-4 py-2 bg-brutal-cyan border-2 border-black shadow-[5px_5px_0_0_#000] font-black tracking-wide text-sm md:text-base hover:-translate-y-1 hover:translate-x-1 transition-transform"
        >
          LOGIN / SIGNUP
        </router-link>
      </nav>

      <!-- MAIN GRID -->
      <div class="grid lg:grid-cols-[minmax(0,_7fr)_minmax(0,_4fr)] gap-6 lg:gap-8 mb-8 md:mb-10">
        <!-- HERO COPY -->
        <section class="space-y-4 md:space-y-6">
          <div class="bg-brutal-pink border-4 border-black shadow-brutal px-5 md:px-8 py-6 md:py-8">
            <h1 class="heading-brutal text-3xl md:text-4xl lg:text-5xl leading-tight md:leading-tight">
              MOCK TESTS +<br>
              PRODUCTIVITY TOOLS<br>
              IN ONE PLATFORM.
            </h1>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <router-link
              to="/onboarding"
              class="flex-1 bg-brutal-cyan border-4 border-black shadow-[6px_6px_0_0_#000] px-5 py-3 md:px-7 md:py-4 text-center font-black text-lg md:text-xl tracking-wide hover:-translate-y-1 hover:translate-x-1 transition-transform"
            >
              START LEARNING
            </router-link>

            <router-link
              to="/tools"
              class="flex-1 bg-brutal-yellow border-4 border-black shadow-[6px_6px_0_0_#000] px-5 py-3 md:px-7 md:py-4 text-center font-black text-lg md:text-xl tracking-wide hover:-translate-y-1 hover:translate-x-1 transition-transform"
            >
              EXPLORE TOOLS
            </router-link>
          </div>
        </section>

        <!-- SIDE ILLUSTRATION / SCORE BLOCK -->
        <aside
          class="bg-brutal-cyan border-4 border-black shadow-brutal px-6 md:px-8 py-6 md:py-8 flex flex-col justify-between gap-6"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-black uppercase tracking-[0.18em] mb-2">
                LEARNING IMPACT
              </p>
              <p class="text-base md:text-lg font-bold max-w-xs">
                Track your progress with visual analytics, streaks, and mastery levels.
              </p>
            </div>
            <div
              class="w-24 h-24 md:w-28 md:h-28 bg-brutal-yellow border-4 border-black shadow-[6px_6px_0_0_#000] flex items-center justify-center"
            >
              <span class="text-4xl md:text-5xl">📈</span>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 text-center text-xs md:text-sm font-black">
            <div class="bg-brutal-yellow border-2 border-black py-3">
              <div class="text-xl md:text-2xl">
                50K+
              </div>
              <div class="uppercase tracking-wide">
                Students
              </div>
            </div>
            <div class="bg-brutal-pink border-2 border-black py-3">
              <div class="text-xl md:text-2xl">
                100+
              </div>
              <div class="uppercase tracking-wide">
                Tests
              </div>
            </div>
            <div class="bg-brutal-lime border-2 border-black py-3">
              <div class="text-xl md:text-2xl">
                95%
              </div>
              <div class="uppercase tracking-wide">
                Success
              </div>
            </div>
          </div>
        </aside>
      </div>

      <!-- LOWER FEATURE STRIP -->
      <section class="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <!-- FEATURED MOCK TESTS -->
        <div class="bg-brutal-yellow border-4 border-black shadow-brutal px-5 md:px-6 py-5 md:py-6 flex flex-col gap-3">
          <header>
            <p class="text-xs font-black uppercase tracking-[0.18em] mb-1">
              FEATURED MOCK TESTS
            </p>
            <p class="text-sm md:text-base font-bold">
              Master your subjects with exam‑style practice.
            </p>
          </header>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="tag in mockTestTags"
              :key="tag"
              class="px-3 py-1 bg-white border-2 border-black text-xs md:text-sm font-black tracking-wide"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- PRODUCTIVITY TOOLS -->
        <div class="bg-brutal-cyan border-4 border-black shadow-brutal px-5 md:px-6 py-5 md:py-6 flex flex-col gap-3">
          <header>
            <p class="text-xs font-black uppercase tracking-[0.18em] mb-1">
              PRODUCTIVITY TOOLS
            </p>
            <p class="text-sm md:text-base font-bold">
              Boost your workflow between study sessions.
            </p>
          </header>
          <div class="grid grid-cols-2 gap-2 mt-2 text-xs md:text-sm font-black">
            <router-link
              v-for="tool in productivityTools"
              :key="tool.label"
              :to="tool.to"
              class="flex items-center gap-2 px-2.5 py-2 bg-white border-2 border-black hover:-translate-y-1 hover:translate-x-1 transition-transform"
            >
              <span class="text-lg">{{ tool.icon }}</span>
              <span>{{ tool.label }}</span>
            </router-link>
          </div>
        </div>

        <!-- USER FEEDBACK -->
        <div class="bg-brutal-pink border-4 border-black shadow-brutal px-5 md:px-6 py-5 md:py-6 flex flex-col justify-between">
          <header class="mb-3">
            <p class="text-xs font-black uppercase tracking-[0.18em] mb-1">
              USER FEEDBACK
            </p>
          </header>
          <blockquote class="text-sm md:text-base font-bold leading-relaxed">
            “This platform changed how I learn. No fluff, just results.”
          </blockquote>
          <p class="mt-3 text-xs md:text-sm font-black">
            — Alex P.
          </p>
        </div>
      </section>

      <!-- FOOTER STRIP -->
      <footer class="mt-10 md:mt-12 bg-black text-white text-[10px] md:text-xs tracking-[0.25em] text-center py-4 font-black uppercase">
        © 2024 Neo‑Brutalist EdTech. All Rights Reserved. Raw. Functional. Powerful.
      </footer>
    </section>
  </main>
</template>

<script setup lang="ts">
const mockTestTags = [
  'AI & Machine Learning',
  'Data Science Fundamentals',
  'Full‑Stack Development',
  'Quant & Reasoning',
  'English Language',
  'Banking Awareness',
]

const productivityTools = [
  { label: 'Timeboxing Scheduler', icon: '⏱️', to: '/tools' },
  { label: 'Focus Timer', icon: '🎯', to: '/tools' },
  { label: 'Task Kanban Board', icon: '🧩', to: '/tools' },
  { label: 'Habit Tracker', icon: '📊', to: '/tools' },
]
</script>
