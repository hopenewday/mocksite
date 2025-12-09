<template>
  <div class="card card-brutal-yellow p-8">
    <h2 class="subheading-brutal mb-6">
      Fraction Calculator
    </h2>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <!-- Input -->
      <div class="bg-brutal-white dark:bg-brutal-black border-4 border-black dark:border-brutal-white p-6 space-y-6 md:col-span-1">
        <h3 class="font-black text-lg">
          Fraction 1
        </h3>
        <div class="flex gap-2 items-center">
          <input
            v-model.number="frac1.num"
            type="number"
            placeholder="Numerator"
            class="input flex-1"
          >
          <span class="font-black text-2xl">/</span>
          <input
            v-model.number="frac1.denom"
            type="number"
            placeholder="Denominator"
            class="input flex-1"
          >
        </div>

        <h3 class="font-black text-lg">
          Operation
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <button
            :class="['btn-small', operationIs('+')]"
            @click="operation = '+'"
          >
            +
          </button>
          <button
            :class="['btn-small', operationIs('-')]"
            @click="operation = '-'"
          >
            −
          </button>
          <button
            :class="['btn-small', operationIs('*')]"
            @click="operation = '*'"
          >
            ×
          </button>
          <button
            :class="['btn-small', operationIs('/')]"
            @click="operation = '/'"
          >
            ÷
          </button>
        </div>

        <h3 class="font-black text-lg">
          Fraction 2
        </h3>
        <div class="flex gap-2 items-center">
          <input
            v-model.number="frac2.num"
            type="number"
            placeholder="Numerator"
            class="input flex-1"
          >
          <span class="font-black text-2xl">/</span>
          <input
            v-model.number="frac2.denom"
            type="number"
            placeholder="Denominator"
            class="input flex-1"
          >
        </div>

        <button
          class="btn-primary btn-primary-lime w-full font-black"
          @click="calculate"
        >
          Calculate
        </button>

        <div class="grid grid-cols-2 gap-2">
          <button
            class="btn-primary btn-primary-cyan"
            :class="{ 'animate-copy-bounce': copying }"
            @click="copyResult"
          >
            {{ copying ? 'Copied!' : 'Copy' }}
          </button>
          <button
            class="btn-primary btn-primary-pink"
            @click="reset"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Results -->
      <div class="md:col-span-2 space-y-6">
        <div class="bg-brutal-cyan border-4 border-black p-6">
          <div class="text-sm font-bold text-brutal-gray mb-2">
            Result (Fraction)
          </div>
          <div class="text-5xl font-black">
            {{ resultFrac.num }} <span class="text-2xl">/</span> {{ resultFrac.denom }}
          </div>
          <div class="text-sm font-bold mt-2 text-brutal-gray">
            Simplified
          </div>
        </div>

        <div class="bg-brutal-pink border-4 border-black p-6">
          <div class="text-sm font-bold text-brutal-gray mb-2">
            Result (Decimal)
          </div>
          <div class="text-4xl font-black">
            {{ resultDecimal.toFixed(6) }}
          </div>
        </div>

        <div class="bg-brutal-yellow border-4 border-black p-6">
          <div class="text-sm font-bold text-brutal-gray mb-2">
            As Mixed Number
          </div>
          <div class="text-3xl font-black">
            {{ mixedWhole }}<span v-if="mixedNum"> {{ mixedNum }}/{{ mixedDenom }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Steps -->
    <div
      v-if="steps.length > 0"
      class="bg-brutal-white border-4 border-black p-6"
    >
      <h3 class="font-black mb-4">
        Solution Steps
      </h3>
      <div class="space-y-2 text-sm font-bold">
        <div
          v-for="(step, idx) in steps"
          :key="idx"
          class="flex gap-2"
        >
          <span class="font-black text-brutal-cyan min-w-8">{{ idx + 1 }}.</span>
          <span>{{ step }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'

useHead({
  title: 'Fraction Calculator',
  meta: [
    { name: 'description', content: 'Calculate fractions with step-by-step solutions.' },
    { property: 'og:title', content: 'Fraction Calculator' },
    { property: 'og:description', content: 'Calculate fractions with step-by-step solutions.' }
  ]
})

const { copyWithFeedback, isCopying: copying } = useCopyFeedback()

const frac1 = ref({ num: 3, denom: 4 })
const frac2 = ref({ num: 1, denom: 2 })
const operation = ref('+')

const resultFrac = ref({ num: 0, denom: 1 })
const steps = ref<string[]>([])

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

function simplify(num: number, denom: number) {
  const divisor = gcd(Math.abs(num), Math.abs(denom))
  return { num: num / divisor, denom: denom / divisor }
}

function calculate() {
  const n1 = frac1.value.num
  const d1 = frac1.value.denom
  const n2 = frac2.value.num
  const d2 = frac2.value.denom

  steps.value = [`Starting with ${n1}/${d1} ${operation.value} ${n2}/${d2}`]

  let result = { num: 0, denom: 1 }

  switch (operation.value) {
    case '+':
    case '-': {
      const lcm = (d1 * d2) / gcd(d1, d2)
      const m1 = lcm / d1
      const m2 = lcm / d2
      result.num = operation.value === '+' ? n1 * m1 + n2 * m2 : n1 * m1 - n2 * m2
      result.denom = lcm
      steps.value.push(`Common denominator: ${lcm}`)
      steps.value.push(`${n1 * m1}/${lcm} ${operation.value === '+' ? '+' : '-'} ${n2 * m2}/${lcm} = ${result.num}/${result.denom}`)
      break
    }
    case '*':
      result.num = n1 * n2
      result.denom = d1 * d2
      steps.value.push(`Multiply: (${n1} × ${n2})/(${d1} × ${d2}) = ${result.num}/${result.denom}`)
      break
    case '/':
      result.num = n1 * d2
      result.denom = d1 * n2
      steps.value.push(`Invert second fraction: ${n1}/${d1} × ${d2}/${n2}`)
      steps.value.push(`Multiply: (${n1} × ${d2})/(${d1} × ${n2}) = ${result.num}/${result.denom}`)
      break
  }

  const simplified = simplify(result.num, result.denom)
  resultFrac.value = simplified
  steps.value.push(`Simplified: ${simplified.num}/${simplified.denom}`)
}

const resultDecimal = computed(() => resultFrac.value.denom !== 0 ? resultFrac.value.num / resultFrac.value.denom : 0)

const mixedWhole = computed(() => Math.floor(Math.abs(resultDecimal.value)))
const mixedNum = computed(() => Math.abs(resultFrac.value.num) % Math.abs(resultFrac.value.denom))
const mixedDenom = computed(() => Math.abs(resultFrac.value.denom))

function reset() {
  frac1.value = { num: 3, denom: 4 }
  frac2.value = { num: 1, denom: 2 }
  operation.value = '+'
  resultFrac.value = { num: 0, denom: 1 }
  steps.value = []
}

function operationIs(op: string) {
  return operation.value === op ? 'btn-primary btn-primary-cyan' : 'btn-primary btn-primary-gray'
}

function copyResult() {
  copyWithFeedback(`${resultFrac.value.num}/${resultFrac.value.denom} = ${resultDecimal.value.toFixed(6)}`)
}
</script>
