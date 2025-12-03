<template>
  <div class="card card-brutal-lime p-8">
    <h2 class="subheading-brutal mb-6">Math Equation Solver</h2>
    
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <!-- Equation Type -->
      <div class="bg-brutal-white border-4 border-black p-6 space-y-4">
        <h3 class="font-black mb-4">Equation Type</h3>
        
        <div class="space-y-2">
          <button :class="['btn-small w-full', equationType === 'linear' ? 'btn-primary-cyan' : 'btn-primary-gray']" @click="equationType = 'linear'">
            Linear: ax + b = c
          </button>
          <button :class="['btn-small w-full', equationType === 'quadratic' ? 'btn-primary-cyan' : 'btn-primary-gray']" @click="equationType = 'quadratic'">
            Quadratic: ax² + bx + c = 0
          </button>
          <button :class="['btn-small w-full', equationType === 'system' ? 'btn-primary-cyan' : 'btn-primary-gray']" @click="equationType = 'system'">
            System of Equations
          </button>
        </div>

        <button class="btn-primary btn-primary-lime w-full" @click="solve">Solve</button>

        <div class="grid grid-cols-2 gap-2">
          <button class="btn-primary btn-primary-cyan" :class="{ 'animate-copy-bounce': copying }" @click="copySolution">
            {{ copying ? 'Copied!' : 'Copy' }}
          </button>
          <button class="btn-primary btn-primary-pink" @click="reset">Clear</button>
        </div>
      </div>

      <!-- Coefficients -->
      <div class="md:col-span-2 bg-brutal-yellow border-4 border-black p-6">
        <h3 class="font-black mb-4">Enter Coefficients</h3>
        
        <div v-if="equationType === 'linear'" class="space-y-2">
          <input v-model.number="coeffs.a" type="number" placeholder="a" class="input w-full">
          <input v-model.number="coeffs.b" type="number" placeholder="b" class="input w-full">
          <input v-model.number="coeffs.c" type="number" placeholder="c" class="input w-full">
          <div class="text-xs font-bold text-brutal-gray">{{ coeffs.a }}x + {{ coeffs.b }} = {{ coeffs.c }}</div>
        </div>

        <div v-else-if="equationType === 'quadratic'" class="space-y-2">
          <input v-model.number="coeffs.a" type="number" placeholder="a" class="input w-full">
          <input v-model.number="coeffs.b" type="number" placeholder="b" class="input w-full">
          <input v-model.number="coeffs.c" type="number" placeholder="c" class="input w-full">
          <div class="text-xs font-bold text-brutal-gray">{{ coeffs.a }}x² + {{ coeffs.b }}x + {{ coeffs.c }} = 0</div>
        </div>

        <div v-else class="space-y-4">
          <div class="border-2 border-black p-3">
            <div class="text-xs font-bold mb-2">Equation 1: ax + by = c</div>
            <div class="grid grid-cols-3 gap-2">
              <input v-model.number="system.eq1.a" type="number" placeholder="a" class="input text-sm">
              <input v-model.number="system.eq1.b" type="number" placeholder="b" class="input text-sm">
              <input v-model.number="system.eq1.c" type="number" placeholder="c" class="input text-sm">
            </div>
          </div>
          <div class="border-2 border-black p-3">
            <div class="text-xs font-bold mb-2">Equation 2: dx + ey = f</div>
            <div class="grid grid-cols-3 gap-2">
              <input v-model.number="system.eq2.a" type="number" placeholder="d" class="input text-sm">
              <input v-model.number="system.eq2.b" type="number" placeholder="e" class="input text-sm">
              <input v-model.number="system.eq2.c" type="number" placeholder="f" class="input text-sm">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Solution -->
    <div v-if="solution" class="grid md:grid-cols-2 gap-6">
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <div class="text-sm font-bold text-brutal-gray mb-2">Solution</div>
        <div class="text-4xl font-black break-words">{{ solution }}</div>
      </div>

      <div v-if="steps.length > 0" class="bg-brutal-pink border-4 border-black p-6">
        <div class="text-sm font-bold text-brutal-gray mb-2">Steps</div>
        <div class="text-sm font-bold space-y-2">
          <div v-for="(step, idx) in steps" :key="idx" class="p-2 bg-brutal-white border-2 border-black">
            {{ idx + 1 }}. {{ step }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'

useHead({
  title: 'Math Equation Solver',
  meta: [
    { name: 'description', content: 'Solve linear, quadratic, and system of equations with step-by-step solutions.' },
    { property: 'og:title', content: 'Math Equation Solver' },
    { property: 'og:description', content: 'Solve linear, quadratic, and system of equations with step-by-step solutions.' }
  ]
})

const { copyWithFeedback, isCopying: copying } = useCopyFeedback()

const equationType = ref('linear')
const solution = ref('')
const steps = ref<string[]>([])

const coeffs = ref({ a: 2, b: 3, c: 7 })
const system = ref({
  eq1: { a: 2, b: 3, c: 7 },
  eq2: { a: 1, b: -1, c: 1 }
})

function solveLinear() {
  // ax + b = c => x = (c - b) / a
  if (coeffs.value.a === 0) {
    solution.value = 'No solution (a = 0)'
    return
  }
  const x = (coeffs.value.c - coeffs.value.b) / coeffs.value.a
  solution.value = `x = ${x.toFixed(4)}`
  steps.value = [
    `Start: ${coeffs.value.a}x + ${coeffs.value.b} = ${coeffs.value.c}`,
    `Subtract ${coeffs.value.b}: ${coeffs.value.a}x = ${coeffs.value.c - coeffs.value.b}`,
    `Divide by ${coeffs.value.a}: x = ${x.toFixed(4)}`
  ]
}

function solveQuadratic() {
  // ax² + bx + c = 0
  const a = coeffs.value.a
  const b = coeffs.value.b
  const c = coeffs.value.c
  
  const discriminant = b * b - 4 * a * c
  steps.value = [
    `Using quadratic formula: x = (-b ± √(b² - 4ac)) / 2a`,
    `Discriminant = ${b}² - 4(${a})(${c}) = ${discriminant}`
  ]

  if (discriminant < 0) {
    solution.value = 'No real solutions (discriminant < 0)'
    steps.value.push('Complex solutions exist but not shown')
  } else if (discriminant === 0) {
    const x = -b / (2 * a)
    solution.value = `x = ${x.toFixed(4)}`
    steps.value.push(`x = -${b} / (2 × ${a}) = ${x.toFixed(4)}`)
  } else {
    const sqrtDisc = Math.sqrt(discriminant)
    const x1 = (-b + sqrtDisc) / (2 * a)
    const x2 = (-b - sqrtDisc) / (2 * a)
    solution.value = `x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`
    steps.value.push(`√discriminant = ${sqrtDisc.toFixed(4)}`)
    steps.value.push(`x₁ = (${-b} + ${sqrtDisc.toFixed(4)}) / ${2 * a} = ${x1.toFixed(4)}`)
    steps.value.push(`x₂ = (${-b} - ${sqrtDisc.toFixed(4)}) / ${2 * a} = ${x2.toFixed(4)}`)
  }
}

function solveSystem() {
  // Using Cramer's rule for 2x2 system
  const a = system.value.eq1.a
  const b = system.value.eq1.b
  const c = system.value.eq1.c
  const d = system.value.eq2.a
  const e = system.value.eq2.b
  const f = system.value.eq2.c

  const det = a * e - b * d
  
  if (det === 0) {
    solution.value = 'No unique solution (dependent or inconsistent)'
    return
  }

  const x = (c * e - b * f) / det
  const y = (a * f - c * d) / det

  solution.value = `x = ${x.toFixed(4)}, y = ${y.toFixed(4)}`
  steps.value = [
    `Using Cramer's rule`,
    `Determinant = ${a}×${e} - ${b}×${d} = ${det}`,
    `x = (${c}×${e} - ${b}×${f}) / ${det} = ${x.toFixed(4)}`,
    `y = (${a}×${f} - ${c}×${d}) / ${det} = ${y.toFixed(4)}`
  ]
}

function solve() {
  if (equationType.value === 'linear') solveLinear()
  else if (equationType.value === 'quadratic') solveQuadratic()
  else solveSystem()
}

function reset() {
  coeffs.value = { a: 2, b: 3, c: 7 }
  system.value = { eq1: { a: 2, b: 3, c: 7 }, eq2: { a: 1, b: -1, c: 1 } }
  solution.value = ''
  steps.value = []
}

function copySolution() {
  if (solution.value) {
    copyWithFeedback(solution.value)
  }
}
</script>
