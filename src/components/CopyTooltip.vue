<template>
  <div
    v-if="show"
    class="copy-tooltip"
    :class="{ 'copy-tooltip-visible': show }"
  >
    {{ text }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  text: string
}>()
</script>

<style scoped>
.copy-tooltip {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  transition: all 200ms ease;
}

.copy-tooltip-visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .copy-tooltip {
    transition: none;
  }
}
</style>
