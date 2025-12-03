<template>
  <section
    v-if="job"
    class="max-w-4xl mx-auto px-4 py-10"
  >
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-semibold">
        {{ job.title }}
      </h2>
      <TTSControls />
    </div>
    <div class="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
      {{ job.org }} • {{ job.location }} • {{ job.type }} • {{ job.experience }}
    </div>
    <div class="mb-6">
      <span class="text-sm text-neutral-500">Posted: {{ job.posted }}</span>
      <span class="text-sm text-neutral-500 ml-3">Deadline: {{ job.deadline }}</span>
    </div>
    <article class="card p-5 mb-6">
      <p>{{ job.description }}</p>
    </article>
    <div class="flex gap-3">
      <router-link
        to="/jobs"
        class="btn-secondary"
      >
        Back to Jobs
      </router-link>
      <button
        class="btn-primary"
        @click="speak"
      >
        Speak
      </button>
      <button
        class="btn-secondary"
        @click="pause"
      >
        Pause
      </button>
      <button
        class="btn-secondary"
        @click="resume"
      >
        Resume
      </button>
      <button
        class="btn-secondary"
        @click="stop"
      >
        Stop
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { demoJobs, type Job } from '@/lib/jobs'
import TTSControls from '@/components/TTSControls.vue'
import { useTTSStore } from '@/stores/tts'

const tts = useTTSStore()
const route = useRoute()
const job = ref<Job | null>(null)

onMounted(() => {
  const id = route.params.id as string
  job.value = demoJobs.find(j => j.id === id) || null
})

function speak() { if (job.value) { if (!tts.enabled) tts.toggle(); tts.speak(`${job.value.title}. ${job.value.org}. ${job.value.location}. ${job.value.description}`) } }
function pause() { tts.pause() }
function resume() { tts.resume() }
function stop() { tts.stop() }
</script>
