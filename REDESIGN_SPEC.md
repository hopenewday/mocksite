# UI/UX Redesign Specification: Neo-Brutalist Test Platform

This document serves as the comprehensive source of truth for the Neo-Brutalist design system implemented in the project. It is designed to guide AI agents and developers in generating consistent, error-free code that aligns with the visual identity.

## 1. Design System Foundation

The aesthetic is **Neo-Brutalism**: characterized by high contrast, bold colors, heavy black borders, hard shadows, and unrefined geometry.

### 1.1 Color Palette (Tailwind Config)
All colors must be referenced using the custom Tailwind configuration.

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-brutal-yellow` | `#facc15` | Warnings, Highlights, Premium, Calculator Tools |
| `bg-brutal-cyan` | `#22d3ee` | SSC Exams, Image Tools, Headers |
| `bg-brutal-pink` | `#f472b6` | Railway Exams, Call-to-Actions, Rank Cards |
| `bg-brutal-lime` | `#a3e635` | Banking Exams, Academic Tools, Success States |
| `bg-brutal-white` | `#ffffff` | Backgrounds, Cards (Light Mode) |
| `bg-brutal-black` | `#000000` | Text, Borders, Backgrounds (Dark Mode) |
| `bg-brutal-blue` | `#3b82f6` | Accents, Links |
| `bg-brutal-purple` | `#8b5cf6` | Accents |
| `bg-brutal-green` | `#22c55e` | Start Buttons, Achievements |
| `bg-brutal-gray` | `#6b7280` | Subtext, Disabled States |

**Dark Mode Strategy**:
- `bg-brutal-white` becomes `dark:bg-brutal-black`
- Text flips from Black to White.
- Borders remain White or Black depending on contrast needs (`border-black dark:border-white`).

### 1.2 Typography
- **Font Family**: `Inter`, sans-serif (`font-sans`).
- **Headings**: `font-black` (Weight 900), `uppercase`, `tracking-tighter`.
- **Body**: `font-bold` (Weight 700) or `font-medium`.
- **Size Scale**:
  - Page Titles: `text-6xl md:text-8xl`
  - Section Headers: `text-2xl md:text-4xl`
  - Card Titles: `text-xl`
  - Body Text: `text-sm` or `text-base`

### 1.3 Structural Elements (Borders & Shadows)
- **Borders**:
  - Standard: `border-2 border-black dark:border-white`
  - Heavy: `border-4 border-black dark:border-white`
- **Shadows** (Hard, no blur):
  - Small: `shadow-[2px_2px_0px_0px_#000]`
  - Standard: `shadow-brutal` (`4px 4px 0px 0px #000`)
  - Large: `shadow-brutal-lg` (`8px 8px 0px 0px #000`)
  - Hover Effect: `hover:translate-x-1 hover:translate-y-1 hover:shadow-none` or `hover:translate-y-1` depending on element.

### 1.4 Global CSS (`src/style.css`)
Refer to `src/style.css` for shared utility classes and animations:
- **Buttons**: `.btn-primary` (base), `.btn-primary-yellow`, `.btn-primary-cyan`, etc.
- **Cards**: `.card` (base), `.card-brutal-yellow` (colored variants).
- **Animations**: `animate-brutal-bounce`, `animate-brutal-shake`.

---

## 2. Layout Specifications

### 2.1 Mock Tests Page (`src/pages/Tests.vue`)

#### Header Section
- **Style**: Full width, heavy bottom border.
- **Content**: Huge "MOCK TESTS" title inside a boxed border.
- **Background**: Optional grid pattern overlay `bg-[radial-gradient(#000_1px,transparent_1px)]`.

#### Exam Categories (Grid)
- **Layout**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`.
- **Card Design**:
  - `h-40 relative overflow-hidden card border-4 border-black`.
  - Background colors specific to category (SSC=Cyan, Banking=Lime, Railway=Pink, UPSC=Yellow).
  - Large background icon (opacity-20) + Foreground Icon.
  - Interaction: `cursor-pointer hover:translate-y-1 transition-transform`.
  - Active State: `ring-4 ring-black ring-offset-2`.

#### Filters Bar
- **Container**: `flex flex-wrap gap-4 items-center bg-white border-4 border-black p-4 shadow-brutal`.
- **Inputs**: `<select>` elements with `border-2 border-black font-bold focus:ring-2`.
- **Action**: "CLEAR FILTERS" button in `bg-brutal-pink`.

#### Test List Items (Strips)
- **Layout**: Stacked vertical list `space-y-4`.
- **Item Design**:
  - `flex flex-col md:flex-row justify-between border-4 border-black p-4 shadow-brutal`.
  - Alternating Backgrounds: `v-for (index % 3)` -> Lime, Pink, Cyan.
  - **Left**: Title (Uppercase, Black), Description (Truncated), Tags (White bg, border-2).
  - **Right**: Stats (Attempts, Rating) + "START" Button.
  - **Start Button**: `bg-brutal-green border-4 border-black px-8 py-3 text-2xl font-black uppercase shadow-[4px_4px_0px_#000] hover:shadow-none hover:bg-white hover:text-black`.

---

### 2.2 Tools Suite Page (`src/pages/tools/ToolsIndex.vue`)

#### Header
- **Title**: "TOOLS SUITE" centered, huge.
- **Search**: Large input `border-4 border-black p-3 text-xl font-bold uppercase`.

#### Masonry Layout
- **Implementation**: CSS Columns `columns-1 md:columns-2 lg:columns-3 gap-6`.
- **Cards (Categories)**: `break-inside-avoid mb-6 border-4 border-black shadow-[8px_8px_0px_#000]`.

#### Category Card Structure
1.  **Header**: Colored background (varies by category), `border-b-4 border-black p-4`. Icon + Uppercase Title.
2.  **Tool Grid**: Inner grid `grid-cols-3 gap-3 p-4`.
    *   **Mini Tool Item**: `flex flex-col items-center`.
    *   **Icon Box**: `w-14 h-14 border-2 border-black rounded-lg flex items-center justify-center`. Background color matches category theme.
    *   **Label**: Tiny, uppercase, bold text.
3.  **Footer**: Full width "VIEW ALL" button. Dark background (`bg-gray-800 text-white`), `border-t-4 border-black`.

#### Category Themes
- **PDF**: Lime theme.
- **Image**: Cyan theme.
- **Calculator**: Yellow theme.
- **QR/Color**: Pink theme.

---

### 2.3 Dashboard (`src/pages/dashboard/Dashboard.vue`)

#### Top Stats Row
- **Grid**: `grid-cols-2 md:grid-cols-4 gap-4`.
- **Card**: White bg, `border-4 border-black`, `shadow-brutal-sm`.
- **Content**: Giant Number (`text-4xl font-black`) + Label (`text-xs uppercase`).

#### Main Layout Grid
- **Columns**: `lg:grid-cols-3 gap-6`.
- **Left Column (2/3)**: Analytics & Progress.
- **Right Column (1/3)**: Social & Leaderboard.

#### Widgets (Left Column)
1.  **Score by Subject**:
    *   List of subjects.
    *   Progress bars: Container `border-2 border-black bg-gray-200`, Fill `bg-brutal-pink h-4`.
2.  **Score Progress Chart**:
    *   Bar chart visualization using stylized `div` heights.
    *   Bars: `bg-brutal-cyan border-2 border-black`.
3.  **Rank Comparison**:
    *   Pink background card.
    *   Percentile visualizer.

#### Widgets (Right Column)
1.  **Leaderboard**:
    *   Yellow background container.
    *   **Podium**: Visual arrangement of Top 3 (Center highest).
    *   **List**: User rank strip at bottom (`bg-brutal-pink`).
2.  **Achievements**:
    *   Green container (`bg-brutal-green`).
    *   Badges: White cards inside, `border-2 border-black`. Locked state opacity.
3.  **Premium CTA**:
    *   Pink container.
    *   Price box: White, `border-2 border-black`.

---

## 3. Component Concepts for Code Generation

When generating new components, adhere to these "Brutal" patterns:

### The "Brutal Button"
```vue
<button class="bg-brutal-color border-2 border-black px-4 py-2 font-black uppercase shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
  <slot />
</button>
```

### The "Brutal Input"
```vue
<input class="w-full bg-white border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-brutal-yellow transition-all placeholder:text-gray-500" />
```

### The "Brutal Card"
```vue
<div class="bg-white border-4 border-black p-6 shadow-brutal">
  <h3 class="font-black text-xl uppercase mb-4"><slot name="title" /></h3>
  <slot />
</div>
```

### The "Progress Bar"
```vue
<div class="h-4 w-full bg-gray-200 border-2 border-black overflow-hidden">
  <div class="h-full bg-brutal-pink transition-all duration-500" :style="{ width: progress + '%' }"></div>
</div>
```

## 4. Error Prevention Checklist

1.  **Always** use `border-black` (or dark mode variant) on containers.
2.  **Always** use `font-black` and `uppercase` for headings to maintain identity.
3.  **Never** use soft shadows (`shadow-lg`, `shadow-xl`); always use custom `shadow-brutal`.
4.  **Always** check `dark:` variants for text colors (Black on White vs White on Black).
5.  **Ensure** grid layouts handle mobile responsive stacking (`grid-cols-1` -> `md:grid-cols-X`).