# UI Design Specification & Component Guide
## Reference: "Slate" Educational Platform

This document outlines the design specifications derived from the "Slate" platform reference images. It serves as the single source of truth for implementing the UI/UX update.

---

## 1. Visual Design System

### 1.1 Color Palette

**Primary Colors (Brand Identity)**
- **Slate Indigo (Primary Background)**: `#5b5fc7` (Approximate from header/background)
  - *Usage*: Main application background, active tab gradients, primary brand elements.
- **Deep Violet**: `#6D28D9`
  - *Usage*: "Full Mock Test" button, "Previous" button, top navigation pills (active/hover).

**Secondary Colors (Functional)**
- **Emerald Green (Success/Action)**: `#22c55e`
  - *Usage*: "Start Quick Test" button, "Next" button, checkmark icons, progress bars.
- **Sky Blue (Info/Action)**: `#3B82F6`
  - *Usage*: "Take Today's Challenge" button, Question header text ("Question 2 of 20").
- **Sunset Orange (Highlight)**: `#F59E0B`
  - *Usage*: "Most Popular" badge, Fire icon.
- **Rose Red (Target)**: `#F43F5E`
  - *Usage*: Target icon.

**Neutral Colors**
- **White**: `#FFFFFF`
  - *Usage*: Content cards, text on dark backgrounds.
- **Off-White/Background**: `#F3F4F6`
  - *Usage*: Page background (if not Indigo), inactive tabs.
- **Gray-800 (Primary Text)**: `#1F2937`
  - *Usage*: Headings, question text.
- **Gray-500 (Secondary Text)**: `#6B7280`
  - *Usage*: Subtitles, metadata (time, question count).
- **Gray-200 (Borders)**: `#E5E7EB`
  - *Usage*: Card borders, dividers.

### 1.2 Typography

**Font Family**: `Inter` or `Roboto` (Clean, modern sans-serif).

- **Heading 1 (Card Titles)**:
  - Weight: 700 (Bold)
  - Size: 1.5rem (24px)
  - Color: Gray-800
- **Heading 2 (Section Headers)**:
  - Weight: 600 (Semi-Bold)
  - Size: 1.25rem (20px)
  - Color: White (in tabs) or Blue (in question card).
- **Body Text**:
  - Weight: 400 (Regular)
  - Size: 1rem (16px)
  - Color: Gray-800
- **Metadata/Labels**:
  - Weight: 500 (Medium)
  - Size: 0.875rem (14px)
  - Color: Gray-500

### 1.3 Iconography & Graphics
- **3D Icons**: Use colorful, slightly 3D rendered icons for main dashboard cards (Lightning, Fire, Target).
- **System Icons**: Simple outline or solid icons for checkmarks and navigation.
- **Checkmarks**: Green circle with white tick or simple green tick.

---

## 2. Layout Structure

### 2.1 Dashboard Layout
- **Grid**: 3-Column layout for desktop, stacking to 1-column on mobile.
- **Card Dimensions**:
  - Min-height: 400px
  - Padding: 2rem (32px)
  - Border Radius: `1.5rem` (24px) - *Distinctive feature*.
  - Shadow: Soft, diffused shadow (`shadow-xl`).

### 2.2 Test Runner Layout
- **Header**:
  - Full width.
  - Contains Logo (Left) and Pill Navigation (Right).
  - Background: White or Transparent on Indigo.
- **Subject Bar (Tabs)**:
  - Row of large rectangular cards/tabs.
  - State: Active (Indigo Gradient + White Text), Inactive (White/Translucent + Indigo Text).
  - Content: Title + Progress Bar + "X/Y Answered".
- **Question Area**:
  - **Palette Bar**: Horizontal scrollable or wrapped row of question numbers.
  - **Navigation Bar**: "Previous" (Large, Purple), "Next" (Large, Green) flanking the number grid.
  - **Question Card**:
    - Large white container with rounded corners (`rounded-xl`).
    - Header row: Question Number (Left), Marks (Right).
    - Content body: Question text and options.

---

## 3. Interactive Components

### 3.1 Buttons
- **Primary Action (Card Bottoms)**:
  - Full width.
  - Height: ~3rem (48px).
  - Border Radius: `0.5rem` (8px).
  - Text: Uppercase, Bold, White.
  - Effects: Subtle gradient or solid color, scale on hover.
- **Navigation Pills (Top Header)**:
  - Shape: Fully rounded (`rounded-full`).
  - Color: Purple (`bg-purple-600` text-white).
  - Shadow: Medium.
- **Question Numbers**:
  - Shape: Rounded rectangle (`rounded-md`).
  - Size: ~40px x 40px.
  - State: Active (Green/Blue), Answered (Green), Unanswered (White/Gray), Review (Purple/Yellow).

### 3.2 Progress Bars
- **Style**: Slim line (`h-1` or `h-1.5`).
- **Placement**: Inside Subject Tabs.
- **Color**: Green (Progress) on Gray-200 (Track).

### 3.3 Cards (Dashboard)
- **Container**: White background.
- **Border**: None or very subtle.
- **Shadow**: `box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1)`.
- **Badges**: "Most Popular" - Pill shape, absolute positioned at top right, Orange background.

---

## 4. Functional Requirements

### 4.1 Dashboard Interactions
- **Hover Effects**: Cards should lift slightly (`transform: translateY(-4px)`).
- **Responsive**: Cards stack vertically on screens < 768px.

### 4.2 Test Runner Flow
- **Navigation**:
  - Clicking a Subject Tab switches the section.
  - Clicking "Next" saves the answer and moves to the next question.
  - Clicking a Question Number jumps directly to that question.
- **Progress Tracking**:
  - "X/Y Answered" updates in real-time.
  - Progress bar fills visually.
- **Question Display**:
  - Clean, distraction-free reading area.
  - Clear distinction between Question text and Options.

### 4.3 Accessibility (WCAG 2.1 AA)
- **Contrast**: Ensure White text on Indigo/Purple meets 4.5:1 ratio.
- **Focus States**: Visible focus rings on all interactive elements (Buttons, Tabs, Inputs).
- **Screen Readers**: ARIA labels for "Question 1", "Progress", and status icons.
- **Keyboard Nav**: Full tab order through navigation -> tabs -> question -> options -> controls.

---

## 5. Implementation Roadmap

1.  **Global Styles**: Update `style.css` / Tailwind config with new colors (`slate-indigo`, `emerald-green`, etc.) and border-radius utilities.
2.  **Dashboard Components**: Create `DashboardCard.vue` with slots for icon, title, features, and action button.
3.  **Test Runner Layout**: Refactor `TestRunner.vue` to match the split layout (Header / Tabs / Question Area).
4.  **Navigation Components**: Create `SubjectTab.vue` and `QuestionPalette.vue`.
