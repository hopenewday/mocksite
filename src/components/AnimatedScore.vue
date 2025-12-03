<template>
  <div
    class="relative inline-block"
    :aria-label="ariaLabel"
    role="img"
  >
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
    >
      <circle
        :cx="size/2"
        :cy="size/2"
        :r="radius"
        class="fill-none stroke-neutral-200 dark:stroke-neutral-800"
        :stroke-width="stroke"
      />
      <circle
        ref="fg"
        :cx="size/2"
        :cy="size/2"
        :r="radius"
        class="fill-none stroke-brand"
        :stroke-width="stroke"
        :stroke-linecap="'round'"
        :style="{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashoffset"
      />
    </svg>
    <div class="absolute inset-0 flex items-center justify-center font-semibold">
      {{ value }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps<{ value: number; size?: number; stroke?: number; ariaLabel?: string }>()
const size = computed(() => props.size ?? 120)
const stroke = computed(() => props.stroke ?? 10)
const radius = computed(() => (size.value - stroke.value) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashoffset = ref(circumference.value)
const fg = ref<SVGCircleElement | null>(null)

function animate(val: number) {
  const target = circumference.value * (1 - Math.max(0, Math.min(100, val)) / 100)
  gsap.to(dashoffset, { value: target, duration: 0.8, ease: 'power2.out', onUpdate: () => { dashoffset.value = dashoffset.value as unknown as number } })
}

onMounted(() => animate(props.value))
watch(() => props.value, (v) => animate(v))
</script>