# Tools Implementation Specification for AI Code Generation

## Purpose
This document provides detailed specifications for implementing 47 high-traffic, client-side tools optimized for AI code generation. Each tool includes complete feature requirements, technical implementation details, and deliverables.

**Tool Categories**:
- General Tools (27 tools) - Text, Color, Calculator, DateTime, Misc, Image, Social
- Student/Academic Tools (20 tools) - GPA, Grade, Study, Math, Citation, etc.

---

## Design System Requirements

### Global Standards (Apply to ALL Tools)

**UI Framework**: Vue 3 Composition API with TypeScript
**Styling**: Tailwind CSS with Brutal Design System
**State Management**: Vue Composition API (ref, computed, watch)
**Routing**: Vue Router (lazy-loaded components)

**Required Composables**:
- `useCopyFeedback()` - Copy to clipboard with visual feedback
- `useMilestones()` - First-use celebration tracking
- `useCountUp()` - Animated number counting
- `useHead()` - SEO meta tags

**Design Tokens**:
- Colors: brutal-yellow, brutal-cyan, brutal-pink, brutal-lime, brutal-white, brutal-black
- Borders: 4px solid black
- Shadows: shadow-brutal, shadow-brutal-lg
- Fonts: font-brutal (bold), font-black (extra bold)
- Animations: animate-copy-bounce, animate-brutal-bounce

**Component Structure**:
```vue
<template>
  <div class="card card-brutal-[color] p-8">
    <h2 class="subheading-brutal mb-6">[Tool Name]</h2>
    <!-- Tool content -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useCopyFeedback } from '@/composables/useCopyFeedback'
import { useMilestones } from '@/composables/useMilestones'

// SEO
useHead({
  title: '[Tool Name]',
  meta: [
    { name: 'description', content: '[Tool description]' },
    { property: 'og:title', content: '[Tool Name]' },
    { property: 'og:description', content: '[Tool description]' }
  ]
})

// Composables
const { copyWithFeedback, isCopying } = useCopyFeedback()
const { celebrateFirstUse } = useMilestones()

// Tool logic here
</script>
```

---


## Tool Specifications

### 1. Lorem Ipsum Generator

**File**: `src/components/tools/text/LoremIpsumGenerator.vue`

**Features**:
- Generate lorem ipsum text by paragraphs, sentences, or words
- Input field for quantity (number of paragraphs/sentences/words)
- Radio buttons or tabs to select generation mode
- "Generate" button with success morph animation
- Output textarea with generated text
- "Copy" button with bounce animation and feedback
- "Clear" button to reset
- Display character count and word count using count-up animation
- Option to start with "Lorem ipsum dolor sit amet..."

**Implementation Details**:
- Store lorem ipsum text in a constant array (5-10 paragraphs)
- Random selection algorithm for variety
- Sentence generation: split paragraphs into sentences
- Word generation: split sentences into words
- Character/word counting with `useCountUp` composable
- First-use milestone celebration

**Deliverables**:
- Vue component with TypeScript
- Copy feedback integration
- Milestone tracking
- SEO meta tags
- Responsive design
- Dark mode support

---


### 2. JSON Formatter/Validator

**File**: `src/components/tools/text/JSONFormatter.vue`

**Features**:
- Input textarea for JSON input
- "Format" button to beautify JSON
- "Minify" button to compress JSON
- "Validate" button to check syntax
- Output textarea with formatted/minified JSON
- Syntax highlighting for JSON
- Error display with line numbers
- Indentation control (2 spaces, 4 spaces, tabs)
- "Copy" button for output
- Character count for input/output

**Implementation Details**:
- Use `JSON.parse()` for validation
- Try-catch for error handling with helpful messages
- Custom formatter with configurable indentation
- Syntax highlighting using Prism.js or similar
- Line number display for errors
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- JSON validation logic
- Syntax highlighting
- Error handling UI
- Copy feedback
- Milestone tracking
- SEO optimization

---


### 3. CSV to JSON Converter

**File**: `src/components/tools/text/CSVToJSON.vue`

**Features**:
- Bidirectional conversion (CSV ↔ JSON)
- Tab/radio toggle for conversion direction
- Input textarea for CSV or JSON
- Custom delimiter selection (comma, semicolon, tab, pipe)
- "First row is header" checkbox
- "Convert" button with success animation
- Output textarea with converted data
- Preview table view of data
- "Copy" and "Download" buttons
- Row/column count display

**Implementation Details**:
- Use PapaParse library for CSV parsing
- JSON.parse() for JSON input
- Custom CSV generation from JSON
- Table preview component
- File download functionality
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- PapaParse integration
- Table preview component
- Download functionality
- Copy feedback
- Milestone tracking
- SEO optimization

---


### 4. Markdown to HTML Converter

**File**: `src/components/tools/text/MarkdownConverter.vue`

**Features**:
- Split-pane layout (markdown input | HTML preview)
- Live preview as user types
- Syntax highlighting for markdown
- "Copy HTML" button for generated HTML
- "Download HTML" button
- Support for common markdown: headers, bold, italic, links, images, code blocks, lists
- Preview styling with GitHub-like CSS
- Toggle preview/code view on mobile

**Implementation Details**:
- Use marked.js library for markdown parsing
- Syntax highlighting with Prism.js for code blocks
- Debounced live preview (300ms delay)
- HTML sanitization for security
- Copy feedback integration
- Download as .html file
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Marked.js integration
- Live preview functionality
- Syntax highlighting
- Download functionality
- Copy feedback
- Milestone tracking
- Responsive split-pane

---


### 5. Text to Speech (TTS)

**File**: `src/components/tools/text/TextToSpeech.vue`

**Features**:
- Textarea for text input
- Voice selection dropdown (browser voices)
- Speed slider (0.5x - 2x)
- Pitch slider (0.5 - 2)
- Volume slider (0 - 100%)
- Play/Pause/Stop buttons
- Progress indicator
- Character count
- "Paste" button for quick input

**Implementation Details**:
- Web Speech API (window.speechSynthesis)
- Load available voices on mount
- SpeechSynthesisUtterance for speech
- Event listeners for speech events (start, end, pause)
- Progress tracking
- Error handling for unsupported browsers
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Web Speech API integration
- Voice/speed/pitch controls
- Progress indicator
- Browser compatibility check
- Milestone tracking
- Accessibility features

---


### 6. Text Cleaner/Formatter

**File**: `src/components/tools/text/TextCleaner.vue`

**Features**:
- Input textarea for text
- Multiple cleaning options (checkboxes):
  - Remove extra spaces
  - Remove line breaks
  - Trim whitespace
  - Remove special characters
  - Remove numbers
  - Remove punctuation
  - Convert to lowercase/uppercase
- "Clean" button
- Output textarea with cleaned text
- Before/after character count comparison
- "Copy" button
- "Reset" button

**Implementation Details**:
- Regex-based text cleaning
- Multiple cleaning functions
- Before/after statistics
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Text cleaning algorithms
- Statistics display
- Copy feedback
- Milestone tracking

---


### 7. Duplicate Line Remover

**File**: `src/components/tools/text/DuplicateRemover.vue`

**Features**:
- Input textarea for text with multiple lines
- "Remove Duplicates" button
- "Sort Lines" button (alphabetically)
- "Case sensitive" checkbox
- Output textarea with unique lines
- Statistics: total lines, unique lines, duplicates removed
- "Copy" button
- "Clear" button

**Implementation Details**:
- Set-based deduplication
- Array.sort() for sorting
- Case-sensitive/insensitive comparison
- Line counting with useCountUp
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Deduplication logic
- Sorting functionality
- Statistics with animations
- Copy feedback
- Milestone tracking

---


### 8. Line Counter

**File**: `src/components/tools/text/LineCounter.vue`

**Features**:
- Textarea for text input
- Real-time statistics display:
  - Total lines
  - Non-empty lines
  - Empty lines
  - Unique lines
  - Total characters
  - Characters without spaces
- "Sort Lines" button
- "Copy Text" button
- Animated count-up for all statistics

**Implementation Details**:
- String splitting and counting
- Set for unique line counting
- Real-time updates with watch
- useCountUp for all statistics
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Real-time counting logic
- Animated statistics
- Copy feedback
- Milestone tracking

---


### 9. Gradient Generator

**File**: `src/components/tools/color/GradientGenerator.vue`

**Features**:
- Large gradient preview box
- Gradient type selector (linear, radial)
- Angle slider for linear gradients (0-360°)
- Add/remove color stops
- Color picker for each stop
- Position slider for each stop (0-100%)
- Preset gradients gallery (10-15 popular gradients)
- "Copy CSS" button
- Generated CSS code display
- "Random Gradient" button

**Implementation Details**:
- Dynamic gradient CSS generation
- Color stop management (add/remove/reorder)
- Color picker component integration
- CSS linear-gradient() and radial-gradient() syntax
- Preset gradient library
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Color picker integration
- Gradient preview
- CSS code generation
- Preset library
- Copy feedback
- Milestone tracking

---


### 10. Color Palette Generator

**File**: `src/components/tools/color/PaletteGenerator.vue`

**Features**:
- Base color picker
- Color scheme selector:
  - Complementary
  - Analogous
  - Triadic
  - Tetradic
  - Monochromatic
  - Split-complementary
- Display 5-6 colors in palette
- Each color shows: hex, RGB, HSL
- "Copy" button for each color
- "Copy All as CSS" button
- "Copy All as JSON" button
- "Random Palette" button
- "Lock colors" feature (lock specific colors while regenerating)

**Implementation Details**:
- HSL color manipulation for schemes
- Color theory algorithms
- Multiple export formats (CSS variables, JSON, array)
- Color conversion functions (hex ↔ RGB ↔ HSL)
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Color theory algorithms
- Multiple export formats
- Color locking feature
- Copy feedback
- Milestone tracking

---


### 11. Hex to RGB Converter

**File**: `src/components/tools/color/ColorConverter.vue`

**Features**:
- Input field for any color format
- Auto-detect input format
- Display all formats simultaneously:
  - HEX (#RRGGBB)
  - RGB (r, g, b)
  - HSL (h, s%, l%)
  - CMYK (c%, m%, y%, k%)
- Large color preview box
- "Copy" button for each format
- Color picker for visual selection
- Named colors support (red, blue, etc.)

**Implementation Details**:
- Color conversion algorithms
- Format detection regex
- Real-time conversion on input
- Color preview with border
- Copy feedback for each format
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Color conversion functions
- Format detection
- Color preview
- Copy feedback
- Milestone tracking

---


### 12. Percentage Calculator

**File**: `src/components/tools/calculator/PercentageCalculator.vue`

**Features**:
- Multiple calculation modes (tabs or sections):
  1. **What is X% of Y?**
     - Input: percentage, number
     - Output: result
  2. **X is what % of Y?**
     - Input: part, whole
     - Output: percentage
  3. **Percentage Increase/Decrease**
     - Input: original value, new value
     - Output: percentage change
  4. **Tip Calculator**
     - Input: bill amount, tip percentage
     - Output: tip amount, total
- "Calculate" button for each mode
- Clear result display with animations
- "Copy Result" button
- Example calculations shown

**Implementation Details**:
- Simple percentage formulas
- Multiple calculation modes
- Input validation
- Result formatting
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Multiple calculator modes
- Input validation
- Animated results
- Copy feedback
- Milestone tracking

---


### 13. Age Calculator

**File**: `src/components/tools/calculator/AgeCalculator.vue`

**Features**:
- Date picker for birthdate
- "Calculate" button
- Display results:
  - Age in years, months, days
  - Total days lived
  - Total hours lived
  - Total minutes lived
  - Days until next birthday
  - Day of week born
  - Zodiac sign
- "Copy Age" button
- Current date display

**Implementation Details**:
- Date manipulation with JavaScript Date
- Age calculation logic
- Days until birthday calculation
- Zodiac sign determination
- Day of week calculation
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Date calculation logic
- Zodiac sign mapping
- Animated statistics
- Copy feedback
- Milestone tracking

---


### 14. BMI Calculator

**File**: `src/components/tools/calculator/BMICalculator.vue`

**Features**:
- Unit toggle (Metric/Imperial)
- Metric inputs: weight (kg), height (cm)
- Imperial inputs: weight (lbs), height (ft, in)
- "Calculate BMI" button
- Display results:
  - BMI value (large, prominent)
  - BMI category (underweight, normal, overweight, obese)
  - Category color-coded
  - Ideal weight range
- Visual BMI chart with indicator
- Health tips based on category
- "Copy BMI" button

**Implementation Details**:
- BMI formula: weight(kg) / (height(m))²
- Unit conversion functions
- Category classification
- Ideal weight range calculation
- Visual chart component
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- BMI calculation logic
- Unit conversion
- Visual chart
- Category classification
- Copy feedback
- Milestone tracking

---


### 15. URL Encoder/Decoder

**File**: `src/components/tools/misc/URLEncoder.vue`

**Features**:
- Tab/toggle for Encode/Decode mode
- Input textarea for URL or encoded text
- "Encode" or "Decode" button
- Output textarea with result
- "Copy" button
- "Swap" button (move output to input)
- Query string parser (show key-value pairs)
- Examples shown

**Implementation Details**:
- encodeURIComponent() for encoding
- decodeURIComponent() for decoding
- Query string parsing
- Error handling for invalid input
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Encode/decode logic
- Query string parser
- Error handling
- Copy feedback
- Milestone tracking

---


### 16. CSS Minifier

**File**: `src/components/tools/misc/CSSMinifier.vue`

**Features**:
- Tab/toggle for Minify/Beautify mode
- Input textarea for CSS code
- "Minify" or "Beautify" button
- Output textarea with processed CSS
- Statistics: original size, minified size, savings %
- "Copy" button
- "Download" button (.css file)
- Syntax highlighting

**Implementation Details**:
- Regex-based minification (remove whitespace, comments)
- CSS beautification with proper indentation
- File size calculation
- Savings percentage with milestone celebration (50%+)
- Syntax highlighting with Prism.js
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Minification/beautification logic
- Syntax highlighting
- File download
- Savings celebration
- Copy feedback
- Milestone tracking

---


### 17. HTML Minifier

**File**: `src/components/tools/misc/HTMLMinifier.vue`

**Features**:
- Tab/toggle for Minify/Beautify mode
- Input textarea for HTML code
- Options checkboxes:
  - Remove comments
  - Remove whitespace
  - Collapse boolean attributes
  - Remove optional tags
- "Minify" or "Beautify" button
- Output textarea with processed HTML
- Statistics: original size, minified size, savings %
- "Copy" button
- "Download" button (.html file)
- Syntax highlighting

**Implementation Details**:
- HTML parsing and minification
- Configurable minification options
- HTML beautification with proper indentation
- File size calculation
- Savings percentage with milestone celebration (50%+)
- Syntax highlighting with Prism.js
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- HTML minification logic
- Configurable options
- Syntax highlighting
- File download
- Savings celebration
- Copy feedback
- Milestone tracking

---


### 18. Date Calculator

**File**: `src/components/tools/datetime/DateCalculator.vue`

**Features**:
- Multiple calculation modes (tabs):
  1. **Add/Subtract Days**
     - Start date picker
     - Number input (days to add/subtract)
     - Add/Subtract toggle
     - Result date display
  2. **Date Difference**
     - Start date picker
     - End date picker
     - Display: years, months, days, total days
  3. **Business Days Calculator**
     - Start date, end date
     - Exclude weekends checkbox
     - Result: business days between dates
- "Calculate" button
- "Copy Result" button
- Current date quick-select button

**Implementation Details**:
- Date manipulation with JavaScript Date
- Add/subtract days logic
- Date difference calculation
- Business days calculation (exclude weekends)
- Date formatting
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Multiple calculator modes
- Date manipulation logic
- Business days calculation
- Copy feedback
- Milestone tracking

---


### 19. World Clock

**File**: `src/components/tools/datetime/WorldClock.vue`

**Features**:
- Display current time in multiple timezones
- Default cities: New York, London, Tokyo, Sydney, Dubai, Los Angeles
- "Add Timezone" button with searchable dropdown
- Each timezone card shows:
  - City name
  - Current time (updating every second)
  - Date
  - UTC offset
  - Remove button
- 12/24 hour format toggle
- Search/filter timezones
- "Copy All Times" button

**Implementation Details**:
- JavaScript Date with timezone offsets
- Timezone database (Intl.DateTimeFormat)
- Real-time clock updates (setInterval)
- Timezone search/filter
- Local storage for saved timezones
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Timezone management
- Real-time updates
- Search functionality
- Local storage persistence
- Copy feedback
- Milestone tracking

---


### 20. Hash Generator

**File**: `src/components/tools/misc/HashGenerator.vue`

**Features**:
- Input textarea for text
- File upload option
- Hash algorithm selector (checkboxes):
  - MD5
  - SHA-1
  - SHA-256
  - SHA-512
- "Generate Hashes" button
- Display all selected hashes
- "Copy" button for each hash
- "Copy All" button
- Uppercase/lowercase toggle

**Implementation Details**:
- Web Crypto API for hashing
- SubtleCrypto.digest() for SHA algorithms
- MD5 implementation (library or custom)
- File reading with FileReader API
- ArrayBuffer to hex conversion
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Web Crypto API integration
- File upload support
- Multiple hash algorithms
- Copy feedback
- Milestone tracking

---


### 21. UUID/GUID Generator

**File**: `src/components/tools/misc/UUIDGenerator.vue`

**Features**:
- "Generate UUID" button
- Display generated UUID (large, prominent)
- "Generate Bulk" option with quantity input (1-100)
- Display list of generated UUIDs
- "Copy" button for single UUID
- "Copy All" button for bulk
- Uppercase/lowercase toggle
- Hyphens toggle (with/without)
- UUID version selector (v4 default)
- Statistics: total generated in session

**Implementation Details**:
- UUID v4 generation algorithm
- Crypto.randomUUID() or custom implementation
- Bulk generation with loop
- Format options (case, hyphens)
- Copy feedback integration
- Session statistics with useCountUp
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- UUID generation logic
- Bulk generation
- Format options
- Copy feedback
- Milestone tracking

---


### 22. Morse Code Translator

**File**: `src/components/tools/misc/MorseCodeTranslator.vue`

**Features**:
- Tab/toggle for Text→Morse or Morse→Text
- Input textarea
- "Translate" button
- Output textarea with translation
- "Play Audio" button (morse code beeps)
- Speed control for audio
- "Copy" button
- Morse code reference chart
- Support for letters, numbers, basic punctuation

**Implementation Details**:
- Morse code dictionary (object mapping)
- Bidirectional translation
- Web Audio API for beep sounds
- Timing: dot (1 unit), dash (3 units), space (7 units)
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Morse code dictionary
- Translation logic
- Audio playback
- Reference chart
- Copy feedback
- Milestone tracking

---


### 23. Random Number Generator

**File**: `src/components/tools/misc/RandomNumberGenerator.vue`

**Features**:
- Min value input
- Max value input
- Quantity input (how many numbers to generate)
- "Allow decimals" checkbox
- Decimal places input (if decimals allowed)
- "No duplicates" checkbox
- "Generate" button
- Display generated numbers (list or grid)
- "Copy" button for each number
- "Copy All" button
- "Generate Again" button
- Statistics: min, max, average, sum

**Implementation Details**:
- Math.random() with range
- Decimal generation
- Duplicate checking with Set
- Statistics calculation
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Random generation logic
- Duplicate prevention
- Statistics calculation
- Copy feedback
- Milestone tracking

---


### 24. Image to Base64

**File**: `src/components/tools/image/ImageToBase64.vue`

**Features**:
- Drag & drop upload area
- "Browse" button for file selection
- Image preview
- Display base64 string in textarea
- "Copy Base64" button
- "Copy as Data URL" button (with MIME type)
- "Copy as CSS Background" button
- File info: name, size, dimensions
- Support for: JPG, PNG, GIF, SVG, WebP

**Implementation Details**:
- FileReader API for file reading
- readAsDataURL() for base64 conversion
- Image preview with URL.createObjectURL()
- MIME type detection
- Multiple copy formats
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- File upload handling
- Base64 conversion
- Multiple export formats
- Image preview
- Copy feedback
- Milestone tracking

---


### 25. Favicon Generator

**File**: `src/components/tools/image/FaviconGenerator.vue`

**Features**:
- Image upload (drag & drop or browse)
- Preview of uploaded image
- Generate multiple sizes:
  - 16x16 (favicon.ico)
  - 32x32
  - 48x48
  - 64x64
  - 128x128
  - 180x180 (Apple touch icon)
  - 192x192 (Android)
  - 512x512 (Android)
- "Generate All" button
- Preview grid of all sizes
- "Download All" button (ZIP file)
- "Download Individual" buttons
- HTML code snippet for favicon links

**Implementation Details**:
- Canvas-based image resizing
- Multiple size generation
- ICO format generation (library)
- JSZip for ZIP creation
- HTML snippet generation
- Copy feedback for HTML code
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Canvas resizing logic
- ICO format support
- ZIP generation
- HTML snippet
- Copy feedback
- Milestone tracking

---


### 26. Instagram Caption Generator

**File**: `src/components/tools/social/InstagramCaptionGenerator.vue`

**Features**:
- Textarea for caption text
- Character counter (2,200 limit)
- Hashtag suggestions based on keywords
- Trending hashtags section
- Emoji picker button
- "Add Hashtags" button
- Preview of caption with hashtags
- "Copy Caption" button
- Hashtag categories: travel, food, fashion, fitness, etc.
- "Generate Random Caption" button (templates)

**Implementation Details**:
- Hashtag database by category
- Character counting
- Emoji picker component
- Caption templates
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Hashtag database
- Emoji picker
- Caption templates
- Character counter
- Copy feedback
- Milestone tracking

---


### 27. Twitter Thread Formatter

**File**: `src/components/tools/social/TwitterThreadFormatter.vue`

**Features**:
- Textarea for long text input
- Character limit: 280 per tweet
- "Split into Thread" button
- Display numbered tweets (1/n format)
- Character count for each tweet
- "Add Tweet" button (manual)
- "Remove Tweet" button
- Drag to reorder tweets
- "Copy Tweet" button for each
- "Copy All Tweets" button
- "Copy as Thread" button (with numbers)
- Preview mode

**Implementation Details**:
- Text splitting algorithm (respect word boundaries)
- Tweet numbering (1/n format)
- Character counting per tweet
- Drag and drop reordering
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Text splitting logic
- Tweet management
- Drag and drop
- Copy feedback
- Milestone tracking

---


## Router Configuration

Add routes for all tools in `src/router/index.ts`:

```typescript
// Text Tools
{ path: 'lorem-ipsum', component: () => import('@/components/tools/text/LoremIpsumGenerator.vue'), meta: { title: 'Lorem Ipsum Generator' } },
{ path: 'json-formatter', component: () => import('@/components/tools/text/JSONFormatter.vue'), meta: { title: 'JSON Formatter' } },
{ path: 'csv-to-json', component: () => import('@/components/tools/text/CSVToJSON.vue'), meta: { title: 'CSV to JSON' } },
{ path: 'markdown-converter', component: () => import('@/components/tools/text/MarkdownConverter.vue'), meta: { title: 'Markdown Converter' } },
{ path: 'text-to-speech', component: () => import('@/components/tools/text/TextToSpeech.vue'), meta: { title: 'Text to Speech' } },
{ path: 'text-cleaner', component: () => import('@/components/tools/text/TextCleaner.vue'), meta: { title: 'Text Cleaner' } },
{ path: 'duplicate-remover', component: () => import('@/components/tools/text/DuplicateRemover.vue'), meta: { title: 'Duplicate Remover' } },
{ path: 'line-counter', component: () => import('@/components/tools/text/LineCounter.vue'), meta: { title: 'Line Counter' } },

// Color Tools
{ path: 'gradient-generator', component: () => import('@/components/tools/color/GradientGenerator.vue'), meta: { title: 'Gradient Generator' } },
{ path: 'palette-generator', component: () => import('@/components/tools/color/PaletteGenerator.vue'), meta: { title: 'Color Palette Generator' } },
{ path: 'color-converter', component: () => import('@/components/tools/color/ColorConverter.vue'), meta: { title: 'Color Converter' } },

// Calculator Tools
{ path: 'percentage-calculator', component: () => import('@/components/tools/calculator/PercentageCalculator.vue'), meta: { title: 'Percentage Calculator' } },
{ path: 'age-calculator', component: () => import('@/components/tools/calculator/AgeCalculator.vue'), meta: { title: 'Age Calculator' } },
{ path: 'bmi-calculator', component: () => import('@/components/tools/calculator/BMICalculator.vue'), meta: { title: 'BMI Calculator' } },

// DateTime Tools
{ path: 'date-calculator', component: () => import('@/components/tools/datetime/DateCalculator.vue'), meta: { title: 'Date Calculator' } },
{ path: 'world-clock', component: () => import('@/components/tools/datetime/WorldClock.vue'), meta: { title: 'World Clock' } },

// Misc Tools
{ path: 'url-encoder', component: () => import('@/components/tools/misc/URLEncoder.vue'), meta: { title: 'URL Encoder' } },
{ path: 'css-minifier', component: () => import('@/components/tools/misc/CSSMinifier.vue'), meta: { title: 'CSS Minifier' } },
{ path: 'html-minifier', component: () => import('@/components/tools/misc/HTMLMinifier.vue'), meta: { title: 'HTML Minifier' } },
{ path: 'hash-generator', component: () => import('@/components/tools/misc/HashGenerator.vue'), meta: { title: 'Hash Generator' } },
{ path: 'uuid-generator', component: () => import('@/components/tools/misc/UUIDGenerator.vue'), meta: { title: 'UUID Generator' } },
{ path: 'morse-code', component: () => import('@/components/tools/misc/MorseCodeTranslator.vue'), meta: { title: 'Morse Code Translator' } },
{ path: 'random-number', component: () => import('@/components/tools/misc/RandomNumberGenerator.vue'), meta: { title: 'Random Number Generator' } },

// Image Tools
{ path: 'image-to-base64', component: () => import('@/components/tools/image/ImageToBase64.vue'), meta: { title: 'Image to Base64' } },
{ path: 'favicon-generator', component: () => import('@/components/tools/image/FaviconGenerator.vue'), meta: { title: 'Favicon Generator' } },

// Social Tools
{ path: 'instagram-caption', component: () => import('@/components/tools/social/InstagramCaptionGenerator.vue'), meta: { title: 'Instagram Caption Generator' } },
{ path: 'twitter-thread', component: () => import('@/components/tools/social/TwitterThreadFormatter.vue'), meta: { title: 'Twitter Thread Formatter' } },
```

---


## Sitemap Updates

Add entries to `public/sitemap.xml`:

```xml
<!-- Text Tools -->
<url><loc>https://your-domain.com/tools/text/lorem-ipsum</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://your-domain.com/tools/text/json-formatter</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://your-domain.com/tools/text/csv-to-json</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://your-domain.com/tools/text/markdown-converter</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://your-domain.com/tools/text/text-to-speech</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://your-domain.com/tools/text/text-cleaner</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
<url><loc>https://your-domain.com/tools/text/duplicate-remover</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
<url><loc>https://your-domain.com/tools/text/line-counter</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>

<!-- Color Tools -->
<url><loc>https://your-domain.com/tools/color/gradient-generator</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://your-domain.com/tools/color/palette-generator</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://your-domain.com/tools/color/color-converter</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>

<!-- Calculator Tools -->
<url><loc>https://your-domain.com/tools/calculator/percentage-calculator</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
<url><loc>https://your-domain.com/tools/calculator/age-calculator</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://your-domain.com/tools/calculator/bmi-calculator</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>

<!-- DateTime Tools -->
<url><loc>https://your-domain.com/tools/datetime/date-calculator</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://your-domain.com/tools/datetime/world-clock</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>

<!-- Misc Tools -->
<url><loc>https://your-domain.com/tools/misc/url-encoder</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://your-domain.com/tools/misc/css-minifier</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
<url><loc>https://your-domain.com/tools/misc/html-minifier</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
<url><loc>https://your-domain.com/tools/misc/hash-generator</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://your-domain.com/tools/misc/uuid-generator</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://your-domain.com/tools/misc/morse-code</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
<url><loc>https://your-domain.com/tools/misc/random-number</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>

<!-- Image Tools -->
<url><loc>https://your-domain.com/tools/image/image-to-base64</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://your-domain.com/tools/image/favicon-generator</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>

<!-- Social Tools -->
<url><loc>https://your-domain.com/tools/social/instagram-caption</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
<url><loc>https://your-domain.com/tools/social/twitter-thread</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
```

---


## Tool Category Pages

Create category landing pages with tool cards:

### Text Tools Page
**File**: `src/pages/tools/TextTools.vue`
- Grid of text tool cards
- Each card: icon, title, description, link
- Tools: Lorem Ipsum, JSON Formatter, CSV to JSON, Markdown, TTS, Text Cleaner, Duplicate Remover, Line Counter

### Color Tools Page
**File**: `src/pages/tools/ColorTools.vue`
- Grid of color tool cards
- Tools: Gradient Generator, Palette Generator, Color Converter

### Calculator Tools Page
**File**: `src/pages/tools/CalculatorTools.vue`
- Grid of calculator tool cards
- Tools: Percentage Calculator, Age Calculator, BMI Calculator

### DateTime Tools Page
**File**: `src/pages/tools/DateTimeTools.vue`
- Grid of datetime tool cards
- Tools: Date Calculator, World Clock

### Social Tools Page
**File**: `src/pages/tools/SocialTools.vue`
- Grid of social media tool cards
- Tools: Instagram Caption, Twitter Thread

---


## Common Utilities

Create shared utilities for common functionality:

### `src/utils/colorConversion.ts`
```typescript
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null
export function rgbToHex(r: number, g: number, b: number): string
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number }
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number }
export function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number }
```

### `src/utils/textProcessing.ts`
```typescript
export function removeExtraSpaces(text: string): string
export function removeLineBreaks(text: string): string
export function trimWhitespace(text: string): string
export function removeSpecialChars(text: string): string
export function countWords(text: string): number
export function countLines(text: string): number
```

### `src/utils/dateHelpers.ts`
```typescript
export function addDays(date: Date, days: number): Date
export function subtractDays(date: Date, days: number): Date
export function dateDifference(start: Date, end: Date): { years: number; months: number; days: number }
export function businessDaysBetween(start: Date, end: Date): number
export function getZodiacSign(date: Date): string
```

### `src/utils/formatters.ts`
```typescript
export function formatFileSize(bytes: number): string
export function formatNumber(num: number): string
export function formatPercentage(num: number): string
export function formatDate(date: Date, format: string): string
```

---


## Testing Requirements

Each tool should include:

### Unit Tests
- Test core functionality
- Test edge cases
- Test error handling
- Test input validation

### Example Test Structure
```typescript
// LoremIpsumGenerator.test.ts
describe('LoremIpsumGenerator', () => {
  it('generates correct number of paragraphs', () => {
    // Test logic
  })
  
  it('generates correct number of sentences', () => {
    // Test logic
  })
  
  it('handles invalid input gracefully', () => {
    // Test logic
  })
})
```

---

## Performance Requirements

- **Initial Load**: < 3 seconds
- **Tool Interaction**: < 100ms response time
- **Large File Processing**: Show progress indicator
- **Memory Usage**: Efficient cleanup of large data
- **Bundle Size**: Lazy load tools (code splitting)

---

## Accessibility Requirements

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **ARIA Labels**: Proper labels for screen readers
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG AA compliance
- **Error Messages**: Clear, helpful error messages
- **Loading States**: Announce loading to screen readers

---


## SEO Requirements

Each tool page must include:

### Meta Tags
```vue
useHead({
  title: '[Tool Name] - Free Online Tool',
  meta: [
    { name: 'description', content: '[Tool description with keywords]' },
    { name: 'keywords', content: '[primary keyword], [secondary keyword], [tertiary keyword]' },
    { property: 'og:title', content: '[Tool Name]' },
    { property: 'og:description', content: '[Tool description]' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '[Tool preview image]' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: '[Tool Name]' },
    { name: 'twitter:description', content: '[Tool description]' }
  ]
})
```

### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "[Tool Name]",
  "description": "[Tool description]",
  "url": "[Tool URL]",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### Content Requirements
- H1 heading with primary keyword
- Brief description (100-150 words)
- How to use section
- FAQ section (optional, for high-traffic tools)
- Internal links to related tools

---


## Implementation Checklist

For each tool, ensure:

### Code Quality
- [ ] TypeScript types defined
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Code follows Vue 3 Composition API best practices
- [ ] Proper error handling
- [ ] Input validation

### UI/UX
- [ ] Brutal design system applied
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark mode support
- [ ] Loading states
- [ ] Success states
- [ ] Error states
- [ ] Empty states

### Functionality
- [ ] Core feature works correctly
- [ ] Copy feedback integrated
- [ ] Milestone tracking integrated
- [ ] Count-up animations (where applicable)
- [ ] Input validation
- [ ] Error handling

### SEO
- [ ] Meta tags configured
- [ ] Structured data added
- [ ] Sitemap entry added
- [ ] Router entry added
- [ ] Tool card added to category page

### Testing
- [ ] Manual testing completed
- [ ] Edge cases tested
- [ ] Error scenarios tested
- [ ] Mobile testing completed
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

### Performance
- [ ] Lazy loaded
- [ ] No memory leaks
- [ ] Efficient algorithms
- [ ] Large file handling (if applicable)

### Accessibility
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Color contrast sufficient

---


## Deliverables Summary

### Per Tool Deliverables
1. **Vue Component** - Fully functional tool component
2. **TypeScript Types** - Type definitions for tool data
3. **Router Entry** - Route configuration
4. **Sitemap Entry** - SEO sitemap entry
5. **Tool Card** - Card component for category page
6. **Meta Tags** - SEO meta tags
7. **Structured Data** - JSON-LD schema
8. **Tests** - Unit tests for core functionality
9. **Documentation** - Inline code comments

### Global Deliverables
1. **Utility Functions** - Shared helper functions
2. **Category Pages** - Landing pages for tool categories
3. **Updated Navigation** - Links to new tool categories
4. **Analytics Integration** - Track tool usage
5. **Performance Monitoring** - Monitor tool performance

---

## Success Metrics

### Traffic Goals
- **Month 1**: 10,000+ tool page views
- **Month 3**: 50,000+ tool page views
- **Month 6**: 100,000+ tool page views

### Engagement Metrics
- Average session duration: 2+ minutes
- Bounce rate: <50%
- Tool usage per session: 1.5+
- Return visitor rate: 20%+

### SEO Metrics
- Organic search traffic: 60%+ of total
- Featured snippets: 5+ tools
- Top 10 rankings: 15+ keywords
- Backlinks: 50+ referring domains

---

## Priority Implementation Order

### Phase 1: Quick Wins (High Traffic, Low Complexity)
1. Lorem Ipsum Generator
2. Percentage Calculator
3. Age Calculator
4. BMI Calculator
5. Hash Generator
6. UUID Generator
7. Hex to RGB Converter
8. URL Encoder/Decoder
9. Random Number Generator
10. Text Cleaner

### Phase 2: High-Value Tools (High Traffic, Medium Complexity)
1. JSON Formatter/Validator
2. Gradient Generator
3. CSV to JSON Converter
4. Markdown to HTML
5. Color Palette Generator
6. Text to Speech
7. Date Calculator
8. Image to Base64

### Phase 3: Advanced Tools (Medium Traffic, Higher Complexity)
1. World Clock
2. Favicon Generator
3. Instagram Caption Generator
4. Twitter Thread Formatter
5. Morse Code Translator
6. CSS Minifier
7. HTML Minifier
8. Duplicate Line Remover
9. Line Counter

---

## Final Notes

This specification provides complete implementation details for 27 high-traffic, client-side tools. Each tool is designed to:

- **Generate organic traffic** through SEO optimization
- **Provide real value** to users with practical functionality
- **Maintain consistency** with the existing brutal design system
- **Ensure accessibility** for all users
- **Perform efficiently** with minimal resource usage
- **Track engagement** through milestones and analytics

All tools are 100% client-side, requiring no backend infrastructure, making them easy to deploy and maintain.

**Total Tools**: 27
**Total Categories**: 6 (Text, Color, Calculator, DateTime, Misc, Image, Social)
**Expected Traffic Increase**: 5-10x current tool traffic
**Implementation Ready**: Yes ✅

---

## STUDENT & ACADEMIC TOOLS

### 28. GPA Calculator

**File**: `src/components/tools/academic/GPACalculator.vue`

**Features**:
- Input fields for courses (course name, grade, credits)
- Add/remove course rows
- Grade scale selector (4.0, 5.0, 10.0)
- Letter grade to GPA conversion
- Calculate semester GPA
- Calculate cumulative GPA (with previous GPA input)
- Weighted/unweighted toggle
- Display results: GPA (large, prominent), total credits
- "What GPA do I need?" calculator
- "Copy GPA" button
- Save courses to local storage

**Implementation Details**:
- GPA calculation: (grade points × credits) / total credits
- Grade conversion tables (A=4.0, B=3.0, etc.)
- Cumulative GPA: (previous GPA × previous credits + new grade points) / total credits
- Local storage for course persistence
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- GPA calculation logic
- Grade conversion tables
- Local storage persistence
- Copy feedback
- Milestone tracking

---

### 29. Grade Calculator

**File**: `src/components/tools/academic/GradeCalculator.vue`

**Features**:
- Input fields for assignments (name, score, max score, weight %)
- Add/remove assignment rows
- Category grouping (tests, homework, projects, final exam)
- Calculate current grade
- "What do I need on final?" calculator
- Grade prediction based on remaining work
- Display: current grade %, letter grade, points needed
- Visual progress bar
- "Copy Grade" button
- Save to local storage

**Implementation Details**:
- Weighted average calculation
- Grade prediction algorithm
- Letter grade conversion
- Progress visualization
- Local storage persistence
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Grade calculation logic
- Prediction algorithm
- Visual progress bars
- Copy feedback
- Milestone tracking

---

### 30. Flashcard Maker

**File**: `src/components/tools/academic/FlashcardMaker.vue`

**Features**:
- Create flashcards (front/back text)
- Add/edit/delete cards
- Study mode with flip animation
- Shuffle cards
- Mark as "known" or "review"
- Progress tracking (cards studied, cards remaining)
- Export/import JSON
- Categories/tags for cards
- Search/filter cards
- "Copy All" button (export format)
- Local storage persistence

**Implementation Details**:
- Card flip animation (CSS transform)
- Shuffle algorithm (Fisher-Yates)
- Study session tracking
- JSON export/import
- Local storage for cards
- Copy feedback integration
- First-use milestone
- Celebration for completing deck

**Deliverables**:
- Vue component with TypeScript
- Card management system
- Flip animation
- Study mode logic
- Export/import functionality
- Copy feedback
- Milestone tracking

---

### 31. Citation Generator

**File**: `src/components/tools/academic/CitationGenerator.vue`

**Features**:
- Citation style selector (APA, MLA, Chicago, Harvard)
- Source type selector (book, website, journal, video, etc.)
- Dynamic form fields based on source type
- Required fields: author, title, year, URL, etc.
- "Generate Citation" button
- Display formatted citation
- "Copy Citation" button
- "Add to Bibliography" button
- Bibliography list with all citations
- "Copy All Citations" button
- Alphabetical sorting
- Save citations to local storage

**Implementation Details**:
- Citation formatting templates for each style
- Dynamic form generation
- Citation validation
- Alphabetical sorting
- Local storage persistence
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Citation formatting logic
- Multiple citation styles
- Dynamic forms
- Bibliography management
- Copy feedback
- Milestone tracking

---

### 32. Math Equation Solver

**File**: `src/components/tools/academic/MathSolver.vue`

**Features**:
- Equation type selector:
  - Linear equations (ax + b = c)
  - Quadratic equations (ax² + bx + c = 0)
  - System of equations (2x2, 3x3)
  - Percentage problems
- Input fields for coefficients
- "Solve" button
- Display solution with steps
- Show work/explanation
- Graph visualization (for quadratic)
- "Copy Solution" button
- Example problems

**Implementation Details**:
- Linear equation solver
- Quadratic formula implementation
- System of equations (Gaussian elimination)
- Step-by-step solution generation
- Canvas-based graphing
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Equation solving algorithms
- Step-by-step explanations
- Graph visualization
- Copy feedback
- Milestone tracking

---

### 33. Scientific Calculator

**File**: `src/components/tools/academic/ScientificCalculator.vue`

**Features**:
- Basic operations (+, -, ×, ÷)
- Scientific functions:
  - Trigonometry (sin, cos, tan, asin, acos, atan)
  - Logarithms (log, ln)
  - Exponentials (x², x³, xʸ, eˣ)
  - Roots (√, ∛)
  - Constants (π, e)
- Memory functions (M+, M-, MR, MC)
- Degree/radian toggle
- Calculation history
- "Copy Result" button
- Keyboard support

**Implementation Details**:
- Math.js library or native Math functions
- Expression parser
- History tracking
- Memory storage
- Keyboard event handling
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Calculator logic
- Expression parser
- History management
- Keyboard support
- Copy feedback
- Milestone tracking

---

### 34. Fraction Calculator

**File**: `src/components/tools/academic/FractionCalculator.vue`

**Features**:
- Input fields for two fractions (numerator/denominator)
- Operation selector (+, -, ×, ÷)
- "Calculate" button
- Display result as fraction and decimal
- Simplify fraction automatically
- Show step-by-step solution
- "Copy Result" button
- Mixed number support
- Improper fraction converter

**Implementation Details**:
- Fraction arithmetic algorithms
- GCD calculation for simplification
- Mixed number conversion
- Step-by-step solution generation
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Fraction calculation logic
- Simplification algorithm
- Step-by-step explanations
- Copy feedback
- Milestone tracking

---

### 35. Attendance Calculator

**File**: `src/components/tools/academic/AttendanceCalculator.vue`

**Features**:
- Input: total classes, classes attended
- Calculate attendance percentage
- Required attendance input (e.g., 75%)
- "How many classes can I miss?" calculator
- "How many classes to attend?" calculator
- Visual progress bar
- Color-coded status (good, warning, danger)
- "Copy Attendance" button
- Save to local storage

**Implementation Details**:
- Percentage calculation
- Reverse calculation (classes needed)
- Visual indicators
- Local storage persistence
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Attendance calculation logic
- Visual progress indicators
- Copy feedback
- Milestone tracking

---

### 36. Assignment Tracker

**File**: `src/components/tools/academic/AssignmentTracker.vue`

**Features**:
- Add assignments (title, subject, due date, priority)
- Mark as complete/incomplete
- Sort by: due date, priority, subject
- Filter by: subject, status
- Due date countdown
- Overdue indicator
- Priority levels (high, medium, low)
- Color-coded by subject
- "Export List" button
- Local storage persistence
- Statistics: total, completed, pending, overdue

**Implementation Details**:
- Assignment CRUD operations
- Date calculations for countdown
- Sorting and filtering logic
- Local storage persistence
- Statistics with useCountUp
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Assignment management system
- Sorting/filtering logic
- Date countdown
- Statistics display
- Copy feedback
- Milestone tracking

---

### 37. Study Planner

**File**: `src/components/tools/academic/StudyPlanner.vue`

**Features**:
- Weekly schedule grid (7 days × time slots)
- Add study sessions (subject, time, duration)
- Color-coded by subject
- Drag to resize/move sessions
- Total study hours per day/week
- Subject distribution chart
- "Export as Image" button
- "Copy Schedule" button
- Save to local storage
- Templates (morning person, night owl, balanced)

**Implementation Details**:
- Grid-based schedule layout
- Drag and drop functionality
- Time slot management
- Chart visualization
- HTML to canvas for image export
- Local storage persistence
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Schedule management system
- Drag and drop
- Chart visualization
- Image export
- Copy feedback
- Milestone tracking

---

### 38. Exam Countdown

**File**: `src/components/tools/academic/ExamCountdown.vue`

**Features**:
- Add exams (name, subject, date, time)
- Display countdown (days, hours, minutes)
- Multiple exam tracking
- Sort by date
- Visual progress bars
- Motivational messages
- Color-coded urgency (green, yellow, red)
- "Copy Exam List" button
- Notifications (optional, browser API)
- Save to local storage

**Implementation Details**:
- Date/time calculations
- Real-time countdown updates
- Multiple exam management
- Visual indicators
- Local storage persistence
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Countdown logic
- Exam management
- Visual indicators
- Copy feedback
- Milestone tracking

---

### 39. Timetable Generator

**File**: `src/components/tools/academic/TimetableGenerator.vue`

**Features**:
- Grid layout (days × periods)
- Add classes (subject, teacher, room, time)
- Color-coded by subject
- Edit/delete classes
- Print-friendly view
- "Export as Image" button
- "Copy Timetable" button
- Templates (5-day, 6-day week)
- Save to local storage

**Implementation Details**:
- Grid-based layout
- Class management
- Color coding system
- HTML to canvas for image export
- Print CSS styles
- Local storage persistence
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Timetable management
- Image export
- Print styles
- Copy feedback
- Milestone tracking

---

### 40. Reading Speed Test

**File**: `src/components/tools/academic/ReadingSpeedTest.vue`

**Features**:
- Display text passage
- "Start" button (timer begins)
- "Finish" button (timer stops)
- Calculate WPM (words per minute)
- Comprehension questions (3-5 questions)
- Score display (speed + comprehension)
- Multiple difficulty levels
- History tracking
- "Copy Results" button
- Leaderboard (local)

**Implementation Details**:
- Timer functionality
- WPM calculation
- Question/answer system
- Score calculation
- History tracking with useCountUp
- Local storage for history
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Timer logic
- WPM calculation
- Quiz system
- History tracking
- Copy feedback
- Milestone tracking

---

### 41. Typing Speed Test

**File**: `src/components/tools/academic/TypingSpeedTest.vue`

**Features**:
- Display text to type
- Real-time typing input
- Timer (60 seconds default)
- Calculate WPM and accuracy
- Highlight errors in real-time
- Multiple difficulty levels
- Practice mode vs test mode
- History tracking
- "Copy Results" button
- Leaderboard (local)

**Implementation Details**:
- Real-time input comparison
- WPM calculation
- Accuracy calculation
- Error highlighting
- Timer functionality
- History tracking with useCountUp
- Local storage for history
- Copy feedback integration
- First-use milestone

**Deliverables**:
- Vue component with TypeScript
- Typing test logic
- Real-time comparison
- Statistics calculation
- History tracking
- Copy feedback
- Milestone tracking

---

## Updated Router Configuration

Add academic tool routes:

```typescript
// Academic Tools
{ path: 'gpa-calculator', component: () => import('@/components/tools/academic/GPACalculator.vue'), meta: { title: 'GPA Calculator' } },
{ path: 'grade-calculator', component: () => import('@/components/tools/academic/GradeCalculator.vue'), meta: { title: 'Grade Calculator' } },
{ path: 'flashcard-maker', component: () => import('@/components/tools/academic/FlashcardMaker.vue'), meta: { title: 'Flashcard Maker' } },
{ path: 'citation-generator', component: () => import('@/components/tools/academic/CitationGenerator.vue'), meta: { title: 'Citation Generator' } },
{ path: 'math-solver', component: () => import('@/components/tools/academic/MathSolver.vue'), meta: { title: 'Math Equation Solver' } },
{ path: 'scientific-calculator', component: () => import('@/components/tools/academic/ScientificCalculator.vue'), meta: { title: 'Scientific Calculator' } },
{ path: 'fraction-calculator', component: () => import('@/components/tools/academic/FractionCalculator.vue'), meta: { title: 'Fraction Calculator' } },
{ path: 'attendance-calculator', component: () => import('@/components/tools/academic/AttendanceCalculator.vue'), meta: { title: 'Attendance Calculator' } },
{ path: 'assignment-tracker', component: () => import('@/components/tools/academic/AssignmentTracker.vue'), meta: { title: 'Assignment Tracker' } },
{ path: 'study-planner', component: () => import('@/components/tools/academic/StudyPlanner.vue'), meta: { title: 'Study Planner' } },
{ path: 'exam-countdown', component: () => import('@/components/tools/academic/ExamCountdown.vue'), meta: { title: 'Exam Countdown' } },
{ path: 'timetable-generator', component: () => import('@/components/tools/academic/TimetableGenerator.vue'), meta: { title: 'Timetable Generator' } },
{ path: 'reading-speed-test', component: () => import('@/components/tools/academic/ReadingSpeedTest.vue'), meta: { title: 'Reading Speed Test' } },
{ path: 'typing-speed-test', component: () => import('@/components/tools/academic/TypingSpeedTest.vue'), meta: { title: 'Typing Speed Test' } },
```

---

## Updated Sitemap Entries

```xml
<!-- Academic Tools -->
<url><loc>https://your-domain.com/tools/academic/gpa-calculator</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
<url><loc>https://your-domain.com/tools/academic/grade-calculator</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
<url><loc>https://your-domain.com/tools/academic/flashcard-maker</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://your-domain.com/tools/academic/citation-generator</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
<url><loc>https://your-domain.com/tools/academic/math-solver</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
<url><loc>https://your-domain.com/tools/academic/scientific-calculator</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://your-domain.com/tools/academic/fraction-calculator</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://your-domain.com/tools/academic/attendance-calculator</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://your-domain.com/tools/academic/assignment-tracker</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://your-domain.com/tools/academic/study-planner</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
<url><loc>https://your-domain.com/tools/academic/exam-countdown</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://your-domain.com/tools/academic/timetable-generator</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
<url><loc>https://your-domain.com/tools/academic/reading-speed-test</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
<url><loc>https://your-domain.com/tools/academic/typing-speed-test</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
```

---

## Academic Tools Category Page

**File**: `src/pages/tools/AcademicTools.vue`

Grid of academic tool cards with icons, titles, descriptions, and links to:
- GPA Calculator
- Grade Calculator
- Flashcard Maker
- Citation Generator
- Math Equation Solver
- Scientific Calculator
- Fraction Calculator
- Attendance Calculator
- Assignment Tracker
- Study Planner
- Exam Countdown
- Timetable Generator
- Reading Speed Test
- Typing Speed Test

---

## Updated Priority Implementation Order

### Phase 1: Student Quick Wins (High Priority for Your Niche)
1. GPA Calculator ⭐⭐⭐⭐⭐
2. Grade Calculator ⭐⭐⭐⭐⭐
3. Attendance Calculator ⭐⭐⭐⭐
4. Fraction Calculator ⭐⭐⭐⭐
5. Scientific Calculator ⭐⭐⭐⭐
6. Assignment Tracker ⭐⭐⭐⭐
7. Exam Countdown ⭐⭐⭐⭐

### Phase 2: High-Engagement Student Tools
1. Flashcard Maker ⭐⭐⭐⭐⭐
2. Citation Generator ⭐⭐⭐⭐⭐
3. Math Equation Solver ⭐⭐⭐⭐⭐
4. Study Planner ⭐⭐⭐⭐
5. Timetable Generator ⭐⭐⭐⭐

### Phase 3: Engagement & Gamification Tools
1. Reading Speed Test ⭐⭐⭐
2. Typing Speed Test ⭐⭐⭐⭐

---

## Updated Success Metrics

### Student Tool Specific Metrics
- **GPA Calculator**: 20,000+ monthly uses
- **Grade Calculator**: 15,000+ monthly uses
- **Flashcard Maker**: 10,000+ monthly uses, 5+ minutes avg session
- **Citation Generator**: 12,000+ monthly uses
- **Assignment Tracker**: 8,000+ monthly active users

### Engagement Goals
- Tools per student session: 2.5+
- Return rate for flashcards/trackers: 40%+
- Student referral rate: 25%+ (students share with classmates)

---

**Document Version**: 2.0
**Last Updated**: December 2, 2024
**Total Tools**: 41 (27 general + 14 academic)
**Status**: Ready for AI Code Generation
