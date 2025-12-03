<template>
  <svg
    :width="width"
    :height="height"
    role="img"
    aria-label="Performance chart"
  >
    <g
      v-for="(v,i) in values"
      :key="i"
      :transform="`translate(${i * barWidth}, 0)`"
    >
      <rect
        :x="gap/2"
        :y="height - v * height"
        :width="barWidth - gap"
        :height="v * height"
        class="fill-brand"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{ values: number[]; width?: number; height?: number }>()
const width = props.width ?? 300
const height = props.height ?? 120
const gap = 8
const barWidth = width / (props.values.length || 1)
</script>