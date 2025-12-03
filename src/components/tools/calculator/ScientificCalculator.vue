<template>
  <div class="card card-brutal-cyan p-8">
    <h2 class="subheading-brutal mb-6">
      Scientific Calculator
    </h2>
    
    <div class="bg-brutal-white border-4 border-black p-6 mb-6">
      <div class="text-right mb-4">
        <div class="text-2xl font-black text-brutal-gray mb-2">
          {{ history }}
        </div>
        <div class="text-4xl font-black">
          {{ display }}
        </div>
      </div>
      
      <!-- Scientific Functions Row -->
      <div class="grid grid-cols-5 gap-2 mb-2">
        <button
          class="btn-primary btn-primary-purple"
          @click="appendFunction('sin')"
        >
          sin
        </button>
        <button
          class="btn-primary btn-primary-purple"
          @click="appendFunction('cos')"
        >
          cos
        </button>
        <button
          class="btn-primary btn-primary-purple"
          @click="appendFunction('tan')"
        >
          tan
        </button>
        <button
          class="btn-primary btn-primary-purple"
          @click="appendFunction('log')"
        >
          log
        </button>
        <button
          class="btn-primary btn-primary-purple"
          @click="appendFunction('ln')"
        >
          ln
        </button>
      </div>
      
      <!-- More Scientific Functions -->
      <div class="grid grid-cols-5 gap-2 mb-2">
        <button
          class="btn-primary btn-primary-purple"
          @click="appendFunction('sqrt')"
        >
          √
        </button>
        <button
          class="btn-primary btn-primary-purple"
          @click="appendOperator('^')"
        >
          x^y
        </button>
        <button
          class="btn-primary btn-primary-purple"
          @click="appendFunction('pi')"
        >
          π
        </button>
        <button
          class="btn-primary btn-primary-purple"
          @click="appendFunction('e')"
        >
          e
        </button>
        <button
          class="btn-primary btn-primary-purple"
          @click="appendOperator('!')"
        >
          x!
        </button>
      </div>
      
      <!-- Memory Functions -->
      <div class="grid grid-cols-5 gap-2 mb-2">
        <button
          class="btn-primary btn-primary-pink"
          @click="memoryRecall"
        >
          MR
        </button>
        <button
          class="btn-primary btn-primary-pink"
          @click="memoryAdd"
        >
          M+
        </button>
        <button
          class="btn-primary btn-primary-pink"
          @click="memorySubtract"
        >
          M-
        </button>
        <button
          class="btn-primary btn-primary-pink"
          @click="memoryClear"
        >
          MC
        </button>
        <button
          class="btn-primary btn-primary-pink"
          @click="clear"
        >
          C
        </button>
      </div>
      
      <!-- Numbers and Basic Operations -->
      <div class="grid grid-cols-5 gap-2 mb-2">
        <button
          class="btn-primary btn-primary-cyan"
          @click="appendNumber('7')"
        >
          7
        </button>
        <button
          class="btn-primary btn-primary-cyan"
          @click="appendNumber('8')"
        >
          8
        </button>
        <button
          class="btn-primary btn-primary-cyan"
          @click="appendNumber('9')"
        >
          9
        </button>
        <button
          class="btn-primary btn-primary-yellow"
          @click="appendOperator('/')"
        >
          ÷
        </button>
        <button
          class="btn-primary btn-primary-pink"
          @click="backspace"
        >
          ←
        </button>
      </div>
      
      <div class="grid grid-cols-5 gap-2 mb-2">
        <button
          class="btn-primary btn-primary-cyan"
          @click="appendNumber('4')"
        >
          4
        </button>
        <button
          class="btn-primary btn-primary-cyan"
          @click="appendNumber('5')"
        >
          5
        </button>
        <button
          class="btn-primary btn-primary-cyan"
          @click="appendNumber('6')"
        >
          6
        </button>
        <button
          class="btn-primary btn-primary-yellow"
          @click="appendOperator('*')"
        >
          ×
        </button>
        <button
          class="btn-primary btn-primary-purple"
          @click="appendOperator('(')"
        >
          (
        </button>
      </div>
      
      <div class="grid grid-cols-5 gap-2 mb-2">
        <button
          class="btn-primary btn-primary-cyan"
          @click="appendNumber('1')"
        >
          1
        </button>
        <button
          class="btn-primary btn-primary-cyan"
          @click="appendNumber('2')"
        >
          2
        </button>
        <button
          class="btn-primary btn-primary-cyan"
          @click="appendNumber('3')"
        >
          3
        </button>
        <button
          class="btn-primary btn-primary-yellow"
          @click="appendOperator('-')"
        >
          −
        </button>
        <button
          class="btn-primary btn-primary-purple"
          @click="appendOperator(')')"
        >
          )
        </button>
      </div>
      
      <div class="grid grid-cols-5 gap-2">
        <button
          class="btn-primary btn-primary-cyan"
          @click="toggleSign"
        >
          +/−
        </button>
        <button
          class="btn-primary btn-primary-cyan"
          @click="appendNumber('0')"
        >
          0
        </button>
        <button
          class="btn-primary btn-primary-cyan"
          @click="appendDecimal"
        >
          .
        </button>
        <button
          class="btn-primary btn-primary-yellow"
          @click="appendOperator('+')"
        >
          +
        </button>
        <button
          class="btn-primary btn-primary-lime"
          @click="calculate"
        >
          =
        </button>
      </div>
    </div>
    
    <!-- History Panel -->
    <div class="bg-brutal-yellow border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        Calculation History
      </h3>
      
      <div class="space-y-2 max-h-48 overflow-y-auto">
        <div 
          v-for="(item, index) in calculationHistory" 
          :key="index"
          class="flex justify-between items-center p-2 bg-brutal-white border-2 border-black"
        >
          <span class="font-black text-sm">{{ item.expression }}</span>
          <span class="font-black text-sm">{{ item.result }}</span>
        </div>
      </div>
      
      <button
        class="btn-primary btn-primary-pink w-full mt-4"
        @click="clearHistory"
      >
        Clear History
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface HistoryItem {
  expression: string
  result: string
}

const display = ref('0')
const history = ref('')
const memory = ref(0)
const calculationHistory = ref<HistoryItem[]>([])

const appendNumber = (num: string) => {
  if (display.value === '0') {
    display.value = num
  } else {
    display.value += num
  }
}

const appendOperator = (op: string) => {
  if (display.value !== '' && !isOperator(display.value[display.value.length - 1])) {
    display.value += op
  }
}

const appendFunction = (func: string) => {
  if (func === 'pi') {
    display.value += Math.PI.toString()
  } else if (func === 'e') {
    display.value += Math.E.toString()
  } else {
    display.value += func + '('
  }
}

const appendDecimal = () => {
  if (!display.value.includes('.')) {
    display.value += '.'
  }
}

const clear = () => {
  display.value = '0'
  history.value = ''
}

const backspace = () => {
  if (display.value.length > 1) {
    display.value = display.value.slice(0, -1)
  } else {
    display.value = '0'
  }
}

const toggleSign = () => {
  if (display.value !== '0') {
    if (display.value[0] === '-') {
      display.value = display.value.slice(1)
    } else {
      display.value = '-' + display.value
    }
  }
}

const calculate = () => {
  try {
    const expression = display.value
    const result = evaluateExpression(expression)
    
    history.value = expression
    display.value = result.toString()
    
    // Add to history
    calculationHistory.value.unshift({
      expression,
      result: result.toString()
    })
    
    // Keep only last 10 calculations
    if (calculationHistory.value.length > 10) {
      calculationHistory.value = calculationHistory.value.slice(0, 10)
    }
  } catch (error) {
    display.value = 'Error'
  }
}

const evaluateExpression = (expr: string): number => {
  // Replace mathematical functions and constants
  let processedExpr = expr
    .replace(/sin/g, 'Math.sin')
    .replace(/cos/g, 'Math.cos')
    .replace(/tan/g, 'Math.tan')
    .replace(/log/g, 'Math.log10')
    .replace(/ln/g, 'Math.log')
    .replace(/sqrt/g, 'Math.sqrt')
    .replace(/\^/g, '**')
    .replace(/π/g, Math.PI.toString())
    .replace(/e/g, Math.E.toString())
    .replace(/!/g, '')
  
  // Handle factorial
  const factorialMatch = processedExpr.match(/(\d+(?:\.\d+)?)\s*(!)/g)
  if (factorialMatch) {
    for (const match of factorialMatch) {
      const num = parseFloat(match.replace('!', ''))
      const factorial = calculateFactorial(num)
      processedExpr = processedExpr.replace(match, factorial.toString())
    }
  }
  
  // Evaluate the expression
  return Function('"use strict"; return (' + processedExpr + ')')()
}

const calculateFactorial = (n: number): number => {
  if (n < 0) return NaN
  if (n === 0 || n === 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return result
}

const isOperator = (char: string): boolean => {
  return ['+', '-', '*', '/', '^', '(', ')'].includes(char)
}

// Memory functions
const memoryRecall = () => {
  display.value = memory.value.toString()
}

const memoryAdd = () => {
  try {
    const current = parseFloat(display.value)
    if (!isNaN(current)) {
      memory.value += current
    }
  } catch (error) {
    // Handle error
  }
}

const memorySubtract = () => {
  try {
    const current = parseFloat(display.value)
    if (!isNaN(current)) {
      memory.value -= current
    }
  } catch (error) {
    // Handle error
  }
}

const memoryClear = () => {
  memory.value = 0
}

const clearHistory = () => {
  calculationHistory.value = []
}
</script>
