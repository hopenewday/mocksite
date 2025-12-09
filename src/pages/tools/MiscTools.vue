<template>
  <div class="min-h-screen bg-brutal-white dark:bg-brutal-black">
    <header
      v-if="$route.name === 'misc-tools'"
      class="bg-brutal-gray border-b-4 border-black shadow-brutal p-6"
    >
      <div class="max-w-7xl mx-auto">
        <h1 class="font-black text-4xl uppercase text-white">
          Miscellaneous Tools
        </h1>
        <p class="text-white mt-2 text-lg opacity-80">
          Various utility tools and calculators
        </p>
      </div>
    </header>
    
    <div
      v-if="$route.name === 'misc-tools'"
      class="max-w-7xl mx-auto p-6"
    >
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard 
          icon="🔐" 
          title="Password Generator" 
          description="Generate secure passwords"
          link="/tools/misc/password-generator"
          button-text="Generate"
        />
        
        <ToolCard 
          icon="📊" 
          title="Base64 Encoder" 
          description="Encode/decode Base64"
          link="/tools/misc/base64-encoder"
          button-text="Convert"
        />

        <ToolCard 
          icon="🔗" 
          title="URL Encoder" 
          description="Encode or decode URLs"
          link="/tools/misc/url-encoder"
          button-text="Encode"
        />

        <ToolCard 
          icon="🔢" 
          title="Random Number" 
          description="Generate random numbers"
          link="/tools/misc/random-number"
          button-text="Generate"
        />

        <ToolCard 
          icon="#️⃣" 
          title="Hash Generator" 
          description="Compute SHA hashes"
          link="/tools/misc/hash-generator"
          button-text="Generate"
        />

        <ToolCard 
          icon="🆔" 
          title="UUID Generator" 
          description="Generate UUID v4"
          link="/tools/misc/uuid-generator"
          button-text="Generate"
        />

        <ToolCard 
          icon="🎵" 
          title="Morse Code" 
          description="Translate text and play audio"
          link="/tools/misc/morse-code"
          button-text="Translate"
        />

        <ToolCard 
          icon="🧩" 
          title="CSS Minifier" 
          description="Minify or beautify CSS"
          link="/tools/misc/css-minifier"
          button-text="Minify"
        />

        <ToolCard 
          icon="🧱" 
          title="HTML Minifier" 
          description="Minify or beautify HTML"
          link="/tools/misc/html-minifier"
          button-text="Minify"
        />

        <ToolCard 
          icon="📸" 
          title="Instagram Caption" 
          description="Generate engaging captions"
          link="/tools/misc/instagram-caption"
          button-text="Generate"
        />

        <ToolCard 
          icon="🐦" 
          title="Twitter Thread" 
          description="Format text into threads"
          link="/tools/misc/twitter-thread"
          button-text="Format"
        />
      </div>
      
      <!-- Tool Preview Section -->
    </div>
    <RouterView
      v-else
      v-slot="{ Component }"
    >
      <Transition
        name="route-fade"
        mode="out-in"
      >
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import ToolCard from '@/components/common/ToolCard.vue'
import { useHead } from '@vueuse/head'

useHead({
  meta: [
    { name: 'description', content: 'Password generator and Base64 encoder.' },
    { property: 'og:title', content: 'Misc Tools' },
    { property: 'og:description', content: 'Handy utilities: Password generator, Base64 encoder.' }
  ]
})
</script>
