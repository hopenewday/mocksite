<template>
  <div class="card p-6">
    <h3 class="font-black text-lg mb-4">
      🎉 Celebration Settings
    </h3>
    
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <label class="font-bold block">Enable Confetti Animations</label>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Show confetti for milestones and achievements
          </p>
        </div>
        <button
          :class="[
            'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
            confettiEnabled ? 'bg-brutal-lime' : 'bg-gray-300'
          ]"
          class="border-2 border-black"
          @click="toggleConfettiHandler"
        >
          <span
            :class="[
              'inline-block h-6 w-6 transform rounded-full bg-white border-2 border-black transition-transform',
              confettiEnabled ? 'translate-x-7' : 'translate-x-1'
            ]"
          />
        </button>
      </div>
      
      <div class="border-t-2 border-black pt-4">
        <button
          class="btn-primary btn-primary-pink text-sm"
          @click="resetMilestones"
        >
          Reset All Milestones
        </button>
        <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">
          This will allow you to see first-use celebrations again
        </p>
      </div>
      
      <div class="bg-brutal-yellow/20 border-2 border-brutal-yellow p-4 rounded">
        <h4 class="font-black text-sm mb-2">
          Milestone Triggers:
        </h4>
        <ul class="text-sm space-y-1">
          <li>✨ First use of any tool</li>
          <li>📦 Processing 10+ files at once</li>
          <li>💾 Achieving 50%+ compression savings</li>
          <li>🎯 Scoring 90%+ on tests</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMilestones } from '../composables/useMilestones'

const { milestoneState, toggleConfetti, resetMilestones } = useMilestones()

const confettiEnabled = computed(() => milestoneState.value.confettiEnabled)

const toggleConfettiHandler = () => {
  toggleConfetti(!confettiEnabled.value)
}

// Expose method name correctly
const toggleConfettiSetting = toggleConfettiHandler
</script>
