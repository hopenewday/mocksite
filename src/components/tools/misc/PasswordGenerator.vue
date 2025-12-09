<template>
  <div class="card card-brutal-cyan p-8">
    <h2 class="subheading-brutal mb-6">
      Password Generator
    </h2>

    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Password Options -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Password Options
        </h3>

        <div class="space-y-4">
          <div>
            <label class="font-black mb-2 block">Password Length</label>
            <div class="flex gap-2">
              <input
                v-model.number="passwordLength"
                type="range"
                min="4"
                max="128"
                class="flex-1"
              >
              <input
                v-model.number="passwordLength"
                type="number"
                min="4"
                max="128"
                class="input w-20"
              >
            </div>
            <div class="text-center text-sm font-bold">
              {{ passwordLength }} characters
            </div>
          </div>

          <div>
            <label class="font-black mb-2 block">Character Types</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input
                  v-model="includeUppercase"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="text-sm">Uppercase Letters (A-Z)</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  v-model="includeLowercase"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="text-sm">Lowercase Letters (a-z)</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  v-model="includeNumbers"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="text-sm">Numbers (0-9)</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  v-model="includeSymbols"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="text-sm">Symbols (!@#$%^&*)</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  v-model="includeAmbiguous"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="text-sm">Ambiguous Characters (il1Lo0O)</span>
              </label>
            </div>
          </div>

          <div>
            <label class="font-black mb-2 block">Advanced Options</label>
            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input
                  v-model="excludeSimilar"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="text-sm">Exclude Similar Characters</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  v-model="excludeDuplicates"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="text-sm">Exclude Duplicate Characters</span>
              </label>
              <label class="flex items-center gap-2">
                <input
                  v-model="beginWithLetter"
                  type="checkbox"
                  class="w-4 h-4"
                >
                <span class="text-sm">Begin with Letter</span>
              </label>
            </div>
          </div>

          <div>
            <label class="font-black mb-2 block">Quantity</label>
            <select
              v-model="passwordCount"
              class="select"
            >
              <option value="1">
                1 Password
              </option>
              <option value="5">
                5 Passwords
              </option>
              <option value="10">
                10 Passwords
              </option>
              <option value="20">
                20 Passwords
              </option>
            </select>
          </div>

          <button
            class="btn-primary btn-primary-lime w-full"
            @click="generatePasswords"
          >
            Generate Passwords
          </button>
        </div>
      </div>

      <!-- Generated Passwords -->
      <div class="bg-brutal-yellow border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Generated Passwords
        </h3>

        <div
          v-if="generatedPasswords.length > 0"
          class="space-y-3"
        >
          <div
            v-for="(password, index) in generatedPasswords"
            :key="index"
            class="flex items-center gap-2 p-3 bg-brutal-white border-2 border-black"
          >
            <div class="flex-1">
              <div class="font-mono text-sm break-all">
                {{ password }}
              </div>
              <div class="text-xs font-bold text-brutal-gray mt-1">
                Strength: {{ getPasswordStrength(password) }}
              </div>
            </div>

            <button
              class="btn-primary btn-primary-cyan px-3 py-1 text-xs"
              :class="{ 'animate-copy-bounce': copyingPassword }"
              :data-state="copyingPassword ? 'success' : null"
              @click="copyPassword(password)"
            >
              <span v-if="copyingPassword">✓</span>
              <span v-else>Copy</span>
            </button>
          </div>
        </div>

        <div
          v-else
          class="text-center py-8"
        >
          <p class="font-black text-brutal-gray">
            Generated passwords will appear here
          </p>
        </div>
      </div>
    </div>

    <!-- Password Strength Analysis -->
    <div
      v-if="generatedPasswords.length > 0"
      class="bg-brutal-lime border-4 border-black p-6 mb-8"
    >
      <h3 class="font-black text-lg mb-4">
        Password Strength Analysis
      </h3>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="text-center bg-brutal-white border-2 border-black p-4">
          <div class="text-2xl font-black mb-2">
            {{ strengthAnalysis.veryWeak }}
          </div>
          <div class="text-sm font-bold">
            Very Weak
          </div>
        </div>

        <div class="text-center bg-brutal-white border-2 border-black p-4">
          <div class="text-2xl font-black mb-2">
            {{ strengthAnalysis.weak }}
          </div>
          <div class="text-sm font-bold">
            Weak
          </div>
        </div>

        <div class="text-center bg-brutal-white border-2 border-black p-4">
          <div class="text-2xl font-black mb-2">
            {{ strengthAnalysis.medium }}
          </div>
          <div class="text-sm font-bold">
            Medium
          </div>
        </div>

        <div class="text-center bg-brutal-white border-2 border-black p-4">
          <div class="text-2xl font-black mb-2">
            {{ strengthAnalysis.strong }}
          </div>
          <div class="text-sm font-bold">
            Strong
          </div>
        </div>
      </div>
    </div>

    <!-- Password Templates -->
    <div class="bg-brutal-pink border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Quick Templates
      </h3>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="applyTemplate('simple')"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              🔐
            </div>
            <h4 class="font-black text-sm">
              Simple
            </h4>
            <p class="text-xs font-bold text-brutal-gray">
              8 chars, letters + numbers
            </p>
          </div>
        </button>

        <button
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="applyTemplate('standard')"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              🔒
            </div>
            <h4 class="font-black text-sm">
              Standard
            </h4>
            <p class="text-xs font-bold text-brutal-gray">
              12 chars, all types
            </p>
          </div>
        </button>

        <button
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="applyTemplate('strong')"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              🛡️
            </div>
            <h4 class="font-black text-sm">
              Strong
            </h4>
            <p class="text-xs font-bold text-brutal-gray">
              16 chars, all types
            </p>
          </div>
        </button>

        <button
          class="p-4 bg-brutal-white border-2 border-black transform transition-all duration-200 hover:rotate-[-1deg]"
          @click="applyTemplate('paranoid')"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              🔑
            </div>
            <h4 class="font-black text-sm">
              Paranoid
            </h4>
            <p class="text-xs font-bold text-brutal-gray">
              32 chars, max security
            </p>
          </div>
        </button>
      </div>
    </div>

    <!-- Password Checker -->
    <div class="bg-brutal-cyan border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        Check Password Strength
      </h3>

      <div class="space-y-4">
        <div>
          <label class="font-black mb-2 block">Enter Password to Check</label>
          <input
            v-model="passwordToCheck"
            type="password"
            placeholder="Enter password to analyze..."
            class="input w-full"
          >
        </div>

        <div
          v-if="passwordToCheck"
          class="space-y-3"
        >
          <div class="bg-brutal-white border-2 border-black p-4">
            <div class="flex justify-between items-center mb-2">
              <span class="font-black">Strength Score</span>
              <span class="font-black">{{ passwordCheckScore }}/100</span>
            </div>
            <div class="w-full bg-brutal-gray border-2 border-black h-4">
              <div
                class="h-full transition-all duration-300"
                :style="{
                  width: passwordCheckScore + '%',
                  backgroundColor: getStrengthColor(passwordCheckScore)
                }"
              />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-bold mb-2">
                Criteria
              </h4>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="font-black">Length (8+ chars):</span>
                  <span :class="passwordToCheck.length >= 8 ? 'text-green-600' : 'text-red-600'">
                    {{ passwordToCheck.length >= 8 ? '✓' : '✗' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="font-black">Uppercase:</span>
                  <span :class="hasUppercase ? 'text-green-600' : 'text-red-600'">
                    {{ hasUppercase ? '✓' : '✗' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="font-black">Lowercase:</span>
                  <span :class="hasLowercase ? 'text-green-600' : 'text-red-600'">
                    {{ hasLowercase ? '✓' : '✗' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="font-black">Numbers:</span>
                  <span :class="hasNumbers ? 'text-green-600' : 'text-red-600'">
                    {{ hasNumbers ? '✓' : '✗' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="font-black">Symbols:</span>
                  <span :class="hasSymbols ? 'text-green-600' : 'text-red-600'">
                    {{ hasSymbols ? '✓' : '✗' }}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 class="font-bold mb-2">
                Feedback
              </h4>
              <div class="text-sm font-black">
                <p
                  v-for="(feedback, index) in passwordFeedback"
                  :key="index"
                  class="mb-1"
                >
                  {{ feedback }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCopyFeedback } from '../../../composables/useCopyFeedback'

const passwordLength = ref(16)
const includeUppercase = ref(true)
const includeLowercase = ref(true)
const includeNumbers = ref(true)
const includeSymbols = ref(true)
const includeAmbiguous = ref(false)
const excludeSimilar = ref(false)
const excludeDuplicates = ref(false)
const beginWithLetter = ref(false)
const passwordCount = ref(5)

const generatedPasswords = ref<string[]>([])
const passwordToCheck = ref('')

// Copy feedback
const { isCopying: copyingPassword, copyWithFeedback: copyPasswordFeedback } = useCopyFeedback()

const templates = {
  simple: { length: 8, uppercase: true, lowercase: true, numbers: true, symbols: false },
  standard: { length: 12, uppercase: true, lowercase: true, numbers: true, symbols: true },
  strong: { length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true },
  paranoid: { length: 32, uppercase: true, lowercase: true, numbers: true, symbols: true }
}

const hasUppercase = computed(() => /[A-Z]/.test(passwordToCheck.value))
const hasLowercase = computed(() => /[a-z]/.test(passwordToCheck.value))
const hasNumbers = computed(() => /\d/.test(passwordToCheck.value))
const hasSymbols = computed(() => new RegExp('[!@#$%^&*()_+\\-=[\\\\]{};\':"\\\\|,.<>/?]').test(passwordToCheck.value))

const passwordCheckScore = computed(() => {
  let score = 0
  const password = passwordToCheck.value

  if (password.length >= 8) score += 20
  if (password.length >= 12) score += 10
  if (password.length >= 16) score += 10
  if (hasUppercase.value) score += 15
  if (hasLowercase.value) score += 15
  if (hasNumbers.value) score += 15
  if (hasSymbols.value) score += 15

  return Math.min(100, score)
})

const passwordFeedback = computed(() => {
  const feedback = []
  const password = passwordToCheck.value

  if (password.length < 8) feedback.push('Password should be at least 8 characters long')
  if (!hasUppercase.value) feedback.push('Add uppercase letters for better security')
  if (!hasLowercase.value) feedback.push('Add lowercase letters for better security')
  if (!hasNumbers.value) feedback.push('Add numbers for better security')
  if (!hasSymbols.value) feedback.push('Add symbols for maximum security')

  if (feedback.length === 0) {
    feedback.push('Excellent password strength!')
  }

  return feedback
})

const strengthAnalysis = computed(() => {
  const analysis = { veryWeak: 0, weak: 0, medium: 0, strong: 0 }

  generatedPasswords.value.forEach(password => {
    const strength = getPasswordStrength(password)
    if (strength === 'Very Weak') analysis.veryWeak++
    else if (strength === 'Weak') analysis.weak++
    else if (strength === 'Medium') analysis.medium++
    else if (strength === 'Strong') analysis.strong++
  })

  return analysis
})

const generatePasswords = () => {
  const passwords = []

  for (let i = 0; i < passwordCount.value; i++) {
    passwords.push(generateSinglePassword())
  }

  generatedPasswords.value = passwords
}

const generateSinglePassword = (): string => {
  let charset = ''

  if (includeUppercase.value) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (includeLowercase.value) charset += 'abcdefghijklmnopqrstuvwxyz'
  if (includeNumbers.value) charset += '0123456789'
  if (includeSymbols.value) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

  if (excludeSimilar.value) {
    charset = charset.replace(/[il1Lo0O]/g, '')
  }

  if (charset === '') {
    alert('Please select at least one character type')
    return ''
  }

  let password = ''
  const usedChars = new Set()

  for (let i = 0; i < passwordLength.value; i++) {
    let char
    do {
      char = charset.charAt(Math.floor(Math.random() * charset.length))
    } while (excludeDuplicates.value && usedChars.has(char) && usedChars.size < charset.length)

    if (excludeDuplicates.value) usedChars.add(char)
    password += char
  }

  if (beginWithLetter.value && /[a-zA-Z]/.test(password[0]) === false) {
    const letters = charset.replace(/[^a-zA-Z]/g, '')
    if (letters) {
      password = letters.charAt(Math.floor(Math.random() * letters.length)) + password.slice(1)
    }
  }

  return password
}

const getPasswordStrength = (password: string): string => {
  let score = 0

  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (new RegExp('[!@#$%^&*()_+\\-=[\\\\]{};\':"\\\\|,.<>/?]').test(password)) score++

  if (score <= 2) return 'Very Weak'
  if (score <= 4) return 'Weak'
  if (score <= 6) return 'Medium'
  return 'Strong'
}

const getStrengthColor = (score: number): string => {
  if (score < 30) return '#ef4444'
  if (score < 50) return '#f59e0b'
  if (score < 70) return '#eab308'
  if (score < 90) return '#22c55e'
  return '#16a34a'
}

const copyPassword = async (password: string) => {
  await copyPasswordFeedback(password, 'Copied!')
}

const applyTemplate = (templateName: keyof typeof templates) => {
  const template = templates[templateName]
  passwordLength.value = template.length
  includeUppercase.value = template.uppercase
  includeLowercase.value = template.lowercase
  includeNumbers.value = template.numbers
  includeSymbols.value = template.symbols

  generatePasswords()
}
</script>
