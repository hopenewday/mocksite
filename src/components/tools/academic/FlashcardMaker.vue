<template>
  <div class="card card-brutal-yellow p-8">
    <h2 class="subheading-brutal mb-6">Flashcard Maker</h2>
    
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <!-- Controls -->
      <div class="bg-brutal-white border-4 border-black p-6 space-y-4">
        <div v-if="!studying">
          <h3 class="font-black mb-2">Add Card</h3>
          <textarea
            v-model="newCard.front"
            placeholder="Front (question)"
            class="input w-full h-20 text-sm resize-none mb-2"
          ></textarea>
          <textarea
            v-model="newCard.back"
            placeholder="Back (answer)"
            class="input w-full h-20 text-sm resize-none mb-2"
          ></textarea>
          <button class="btn-primary btn-primary-lime w-full" @click="addCard">+ Add Card</button>
        </div>

        <div v-else>
          <div class="text-center">
            <div class="text-4xl font-black">{{ currentCardIdx + 1 }}/{{ cards.length }}</div>
            <div class="text-sm font-bold text-brutal-gray mt-2">Cards Learned: {{ cardsLearned }}</div>
          </div>
          <button class="btn-primary btn-primary-cyan w-full" @click="markLearned">✓ Mark as Known</button>
          <button class="btn-primary btn-primary-pink w-full" @click="skipCard">→ Next</button>
        </div>

        <button v-if="!studying && cards.length > 0" class="btn-primary btn-primary-cyan w-full" @click="startStudy">
          📚 Start Study Mode
        </button>

        <button v-if="studying" class="btn-primary btn-primary-yellow w-full" @click="studying = false">
          ✕ Exit Study Mode
        </button>

        <button v-if="!studying && cards.length > 0" class="btn-primary btn-primary-lime w-full" @click="shuffle">
          🔀 Shuffle
        </button>

        <div class="grid grid-cols-2 gap-2 mt-4">
          <button class="btn-primary btn-primary-cyan text-xs" :class="{ 'animate-copy-bounce': copying }" @click="copyCards">
            {{ copying ? 'Copied!' : 'Copy' }}
          </button>
          <button class="btn-primary btn-primary-pink text-xs" @click="clearAll">Clear</button>
        </div>
      </div>

      <!-- Card Display / List -->
      <div class="md:col-span-2">
        <div v-if="studying && cards.length > 0" class="h-96">
          <div
            class="w-full h-full bg-brutal-cyan border-4 border-black p-8 cursor-pointer flex items-center justify-center"
            @click="cardFlipped = !cardFlipped"
            style="perspective: 1000px;"
          >
            <div
              :style="{
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d',
                transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }"
            >
              <div :style="{ backfaceVisibility: 'hidden' }" class="text-center">
                <div class="text-sm font-bold text-brutal-gray mb-4">Question</div>
                <div class="text-2xl font-black break-words">{{ currentCard?.front }}</div>
                <div class="text-xs text-brutal-gray mt-4">(Click to reveal answer)</div>
              </div>
              <div v-if="cardFlipped" :style="{ backfaceVisibility: 'hidden' }" class="text-center">
                <div class="text-sm font-bold text-brutal-gray mb-4">Answer</div>
                <div class="text-2xl font-black break-words">{{ currentCard?.back }}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="space-y-2 max-h-96 overflow-y-auto">
          <div v-for="(card, idx) in cards" :key="idx" class="bg-brutal-white border-4 border-black p-4">
            <div class="font-black mb-2">{{ card.front }}</div>
            <div class="text-sm font-bold text-brutal-gray mb-3">{{ card.back }}</div>
            <button class="btn-small btn-primary-pink text-xs" @click="removeCard(idx)">Remove</button>
          </div>
          <div v-if="cards.length === 0" class="text-center py-8 font-bold text-brutal-gray">
            No cards yet. Add one to get started!
          </div>
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
  title: 'Flashcard Maker',
  meta: [
    { name: 'description', content: 'Create and study flashcards with flip animation.' },
    { property: 'og:title', content: 'Flashcard Maker' },
    { property: 'og:description', content: 'Create and study flashcards with flip animation.' }
  ]
})

const { copyWithFeedback, isCopying: copying } = useCopyFeedback()

interface Card {
  front: string
  back: string
  learned?: boolean
}

const cards = ref<Card[]>([
  { front: 'What is the capital of France?', back: 'Paris', learned: false },
  { front: 'What is 2 + 2?', back: '4', learned: false }
])

const newCard = ref({ front: '', back: '' })
const studying = ref(false)
const cardFlipped = ref(false)
const currentCardIdx = ref(0)
const cardsLearned = ref(0)

const currentCard = computed(() => cards.value[currentCardIdx.value])

function addCard() {
  if (newCard.value.front && newCard.value.back) {
    cards.value.push({ ...newCard.value, learned: false })
    newCard.value = { front: '', back: '' }
  }
}

function removeCard(idx: number) {
  cards.value.splice(idx, 1)
}

function clearAll() {
  cards.value = []
  newCard.value = { front: '', back: '' }
}

function startStudy() {
  studying.value = true
  currentCardIdx.value = 0
  cardFlipped.value = false
  cardsLearned.value = 0
}

function markLearned() {
  if (currentCard.value) {
    currentCard.value.learned = true
    cardsLearned.value++
  }
  skipCard()
}

function skipCard() {
  cardFlipped.value = false
  currentCardIdx.value = (currentCardIdx.value + 1) % cards.value.length
}

function shuffle() {
  for (let i = cards.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards.value[i], cards.value[j]] = [cards.value[j], cards.value[i]]
  }
}

function copyCards() {
  const text = cards.value.map(c => `${c.front} → ${c.back}`).join('\n')
  copyWithFeedback(text)
}
</script>
