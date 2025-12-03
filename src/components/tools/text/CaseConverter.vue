<template>
  <div class="card card-brutal-pink p-8">
    <h2 class="subheading-brutal mb-6">
      Case Converter
    </h2>
    
    <div class="grid md:grid-cols-2 gap-6 mb-8">
      <!-- Input Section -->
      <div class="bg-brutal-white border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Input Text
        </h3>
        
        <textarea 
          v-model="inputText"
          placeholder="Enter your text here..."
          class="input w-full h-64 resize-none mb-4"
        />
        
        <div class="flex gap-2 mb-4">
          <button
            class="btn-primary btn-primary-pink"
            @click="clearText"
          >
            Clear
          </button>
          
          <button
            class="btn-primary btn-primary-cyan"
            @click="pasteText"
          >
            Paste
          </button>
          
          <button
            class="btn-primary btn-primary-lime"
            :class="{ 'animate-copy-bounce': copyingInput }"
            :data-state="copyingInput ? 'success' : null"
            @click="copyInput"
          >
            <span v-if="copyingInput">Copied!</span>
            <span v-else>Copy Input</span>
          </button>
        </div>
        
        <div class="text-sm font-bold text-brutal-gray">
          Characters: {{ characterCountDisplay }} | Words: {{ wordCountDisplay }} | Lines: {{ lineCountDisplay }}
        </div>
      </div>
      
      <!-- Output Section -->
      <div class="bg-brutal-cyan border-4 border-black p-6">
        <h3 class="font-black text-lg mb-4">
          Converted Text
        </h3>
        
        <textarea 
          :value="convertedText"
          readonly
          placeholder="Converted text will appear here..."
          class="input w-full h-64 resize-none mb-4 bg-brutal-gray"
        />
        
        <div class="flex gap-2 mb-4">
          <button 
            :disabled="!convertedText"
            class="btn-primary btn-primary-lime disabled:opacity-50"
            :class="{ 'animate-copy-bounce': copyingOutput }"
            :data-state="copyingOutput ? 'success' : null"
            @click="copyOutput"
          >
            <span v-if="copyingOutput">Copied!</span>
            <span v-else>Copy Result</span>
          </button>
          
          <button 
            :disabled="!convertedText"
            class="btn-primary btn-primary-yellow disabled:opacity-50"
            :data-state="justDownloaded ? 'success' : null"
            @click="downloadText"
          >
            <span v-if="justDownloaded">Downloaded!</span>
            <span v-else>Download</span>
          </button>
        </div>
        
        <div class="text-sm font-bold text-brutal-gray">
          Characters: {{ convertedCharacterCountDisplay }} | Words: {{ convertedWordCountDisplay }}
        </div>
      </div>
    </div>
    
    <!-- Conversion Options -->
    <div class="bg-brutal-yellow border-4 border-black p-6 mb-8">
      <h3 class="font-black text-lg mb-4">
        Conversion Options
      </h3>
      
      <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        <button 
          :class="['p-4 border-2 border-black transform transition-all duration-200',
                   currentConversion === 'uppercase' ? 'bg-brutal-lime rotate-[-1deg] scale-105' : 'bg-brutal-white hover:rotate-[1deg]']"
          @click="convertCase('uppercase')"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              🔠
            </div>
            <h4 class="font-black">
              UPPERCASE
            </h4>
            <p class="text-xs font-bold text-brutal-gray">
              Convert to all caps
            </p>
          </div>
        </button>
        
        <button 
          :class="['p-4 border-2 border-black transform transition-all duration-200',
                   currentConversion === 'lowercase' ? 'bg-brutal-lime rotate-[-1deg] scale-105' : 'bg-brutal-white hover:rotate-[1deg]']"
          @click="convertCase('lowercase')"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              🔡
            </div>
            <h4 class="font-black">
              lowercase
            </h4>
            <p class="text-xs font-bold text-brutal-gray">
              Convert to all small
            </p>
          </div>
        </button>
        
        <button 
          :class="['p-4 border-2 border-black transform transition-all duration-200',
                   currentConversion === 'titlecase' ? 'bg-brutal-lime rotate-[-1deg] scale-105' : 'bg-brutal-white hover:rotate-[1deg]']"
          @click="convertCase('titlecase')"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              🔤
            </div>
            <h4 class="font-black">
              Title Case
            </h4>
            <p class="text-xs font-bold text-brutal-gray">
              Capitalize Each Word
            </p>
          </div>
        </button>
        
        <button 
          :class="['p-4 border-2 border-black transform transition-all duration-200',
                   currentConversion === 'sentencecase' ? 'bg-brutal-lime rotate-[-1deg] scale-105' : 'bg-brutal-white hover:rotate-[1deg]']"
          @click="convertCase('sentencecase')"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              📝
            </div>
            <h4 class="font-black">
              Sentence case
            </h4>
            <p class="text-xs font-bold text-brutal-gray">
              Capitalize sentences
            </p>
          </div>
        </button>
        
        <button 
          :class="['p-4 border-2 border-black transform transition-all duration-200',
                   currentConversion === 'alternating' ? 'bg-brutal-lime rotate-[-1deg] scale-105' : 'bg-brutal-white hover:rotate-[1deg]']"
          @click="convertCase('alternating')"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              🔄
            </div>
            <h4 class="font-black">
              aLtErNaTiNg
            </h4>
            <p class="text-xs font-bold text-brutal-gray">
              Alternate case
            </p>
          </div>
        </button>
        
        <button 
          :class="['p-4 border-2 border-black transform transition-all duration-200',
                   currentConversion === 'inverse' ? 'bg-brutal-lime rotate-[-1deg] scale-105' : 'bg-brutal-white hover:rotate-[1deg]']"
          @click="convertCase('inverse')"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              🔃
            </div>
            <h4 class="font-black">
              Invert Case
            </h4>
            <p class="text-xs font-bold text-brutal-gray">
              Swap upper/lower
            </p>
          </div>
        </button>
        
        <button 
          :class="['p-4 border-2 border-black transform transition-all duration-200',
                   currentConversion === 'camelcase' ? 'bg-brutal-lime rotate-[-1deg] scale-105' : 'bg-brutal-white hover:rotate-[1deg]']"
          @click="convertCase('camelcase')"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              🐪
            </div>
            <h4 class="font-black">
              camelCase
            </h4>
            <p class="text-xs font-bold text-brutal-gray">
              camelCase text
            </p>
          </div>
        </button>
        
        <button 
          :class="['p-4 border-2 border-black transform transition-all duration-200',
                   currentConversion === 'snakecase' ? 'bg-brutal-lime rotate-[-1deg] scale-105' : 'bg-brutal-white hover:rotate-[1deg]']"
          @click="convertCase('snakecase')"
        >
          <div class="text-center">
            <div class="text-2xl mb-2">
              🐍
            </div>
            <h4 class="font-black">
              snake_case
            </h4>
            <p class="text-xs font-bold text-brutal-gray">
              snake_case text
            </p>
          </div>
        </button>
      </div>
    </div>
    
    <!-- Advanced Options -->
    <div class="bg-brutal-lime border-4 border-black p-6">
      <h3 class="font-black text-lg mb-4">
        Advanced Options
      </h3>
      
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2">
            <input
              v-model="options.preserveNumbers"
              type="checkbox"
              class="w-4 h-4"
            >
            <span class="font-black">Preserve Numbers</span>
          </label>
          
          <label class="flex items-center gap-2">
            <input
              v-model="options.preservePunctuation"
              type="checkbox"
              class="w-4 h-4"
            >
            <span class="font-black">Preserve Punctuation</span>
          </label>
          
          <label class="flex items-center gap-2">
            <input
              v-model="options.preserveSpaces"
              type="checkbox"
              class="w-4 h-4"
            >
            <span class="font-black">Preserve Spaces</span>
          </label>
        </div>
        
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2">
            <input
              v-model="options.removeExtraSpaces"
              type="checkbox"
              class="w-4 h-4"
            >
            <span class="font-black">Remove Extra Spaces</span>
          </label>
          
          <label class="flex items-center gap-2">
            <input
              v-model="options.trimLines"
              type="checkbox"
              class="w-4 h-4"
            >
            <span class="font-black">Trim Lines</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useHead } from '@vueuse/head'
import { useCountUp } from '../../../composables/useCountUp'
import { useCopyFeedback } from '../../../composables/useCopyFeedback'
import { useMilestones } from '../../../composables/useMilestones'

useHead({
  title: 'Case Converter',
  meta: [
    { name: 'description', content: 'Convert text to uppercase, lowercase, title case and more.' },
    { property: 'og:title', content: 'Case Converter' },
    { property: 'og:description', content: 'Convert text to uppercase, lowercase, title case and more.' }
  ]
})

const inputText = ref('')
const convertedText = ref('')
const currentConversion = ref('')

// Count-up animations
const characterCountAnimation = useCountUp(0, { duration: 600 })
const wordCountAnimation = useCountUp(0, { duration: 600 })
const lineCountAnimation = useCountUp(0, { duration: 600 })
const convertedCharacterCountAnimation = useCountUp(0, { duration: 600 })
const convertedWordCountAnimation = useCountUp(0, { duration: 600 })

// Copy feedback
const { isCopying: copyingInput, copyWithFeedback: copyInputFeedback } = useCopyFeedback()
const { isCopying: copyingOutput, copyWithFeedback: copyOutputFeedback } = useCopyFeedback()
const justDownloaded = ref(false)

// Milestones
const { celebrateFirstUse } = useMilestones()

const options = ref({
  preserveNumbers: true,
  preservePunctuation: true,
  preserveSpaces: true,
  removeExtraSpaces: false,
  trimLines: false
})

const wordCount = computed(() => {
  if (!inputText.value.trim()) return 0
  return inputText.value.trim().split(/\s+/).length
})

const lineCount = computed(() => {
  if (!inputText.value) return 0
  return inputText.value.split('\n').length
})

const outputWordCount = computed(() => {
  if (!convertedText.value.trim()) return 0
  return convertedText.value.trim().split(/\s+/).length
})

// Update count-up animations when values change
watch(() => inputText.value.length, (newValue) => characterCountAnimation.setValue(newValue))
watch(wordCount, (newValue) => wordCountAnimation.setValue(newValue))
watch(lineCount, (newValue) => lineCountAnimation.setValue(newValue))
watch(() => convertedText.value.length, (newValue) => convertedCharacterCountAnimation.setValue(newValue))
watch(outputWordCount, (newValue) => convertedWordCountAnimation.setValue(newValue))

// Display values for template
const characterCountDisplay = computed(() => characterCountAnimation.displayValue.value)
const wordCountDisplay = computed(() => wordCountAnimation.displayValue.value)
const lineCountDisplay = computed(() => lineCountAnimation.displayValue.value)
const convertedCharacterCountDisplay = computed(() => convertedCharacterCountAnimation.displayValue.value)
const convertedWordCountDisplay = computed(() => convertedWordCountAnimation.displayValue.value)

const convertCase = (type: string) => {
  if (!inputText.value) return
  
  // Celebrate first use
  celebrateFirstUse('case-converter')
  
  currentConversion.value = type
  let result = inputText.value
  
  // Apply preprocessing options
  if (options.value.removeExtraSpaces) {
    result = result.replace(/\s+/g, ' ')
  }
  
  if (options.value.trimLines) {
    result = result.split('\n').map(line => line.trim()).join('\n')
  }
  
  // Apply case conversion
  switch (type) {
    case 'uppercase':
      result = result.toUpperCase()
      break
    case 'lowercase':
      result = result.toLowerCase()
      break
    case 'titlecase':
      result = toTitleCase(result)
      break
    case 'sentencecase':
      result = toSentenceCase(result)
      break
    case 'alternating':
      result = toAlternatingCase(result)
      break
    case 'inverse':
      result = toInverseCase(result)
      break
    case 'camelcase':
      result = toCamelCase(result)
      break
    case 'snakecase':
      result = toSnakeCase(result)
      break
  }
  
  convertedText.value = result
}

const toTitleCase = (text: string): string => {
  return text.replace(/\w\S*/g, (txt) => {
    if (options.value.preserveNumbers && /\d/.test(txt)) return txt
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

const toSentenceCase = (text: string): string => {
  return text.replace(/(^\w|\.\s+\w)/g, (txt) => {
    return txt.toUpperCase()
  })
}

const toAlternatingCase = (text: string): string => {
  return text.split('').map((char, index) => {
    if (options.value.preserveNumbers && /\d/.test(char)) return char
    if (options.value.preservePunctuation && /[^\w]/.test(char)) return char
    return index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
  }).join('')
}

const toInverseCase = (text: string): string => {
  return text.split('').map(char => {
    if (options.value.preserveNumbers && /\d/.test(char)) return char
    if (options.value.preservePunctuation && /[^\w]/.test(char)) return char
    return char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
  }).join('')
}

const toCamelCase = (text: string): string => {
  return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
    if (options.value.preserveNumbers && /\d/.test(word)) return word
    return index === 0 ? word.toLowerCase() : word.toUpperCase()
  }).replace(/\s+/g, '')
}

const toSnakeCase = (text: string): string => {
  return text.replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_')
}

const clearText = () => {
  inputText.value = ''
  convertedText.value = ''
  currentConversion.value = ''
}

const pasteText = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
  } catch (error) {
    console.error('Failed to paste text:', error)
  }
}

const copyInput = async () => {
  await copyInputFeedback(inputText.value)
}

const copyOutput = async () => {
  await copyOutputFeedback(convertedText.value)
}

const downloadText = () => {
  if (!convertedText.value) return
  
  const blob = new Blob([convertedText.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `converted_text_${currentConversion.value}.txt`
  a.click()
  URL.revokeObjectURL(url)
  
  justDownloaded.value = true
  setTimeout(() => { justDownloaded.value = false }, 1200)
}
</script>
