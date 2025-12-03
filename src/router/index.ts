import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Tests from '@/pages/Tests.vue'
import Test from '@/pages/Test.vue'
import Results from '@/pages/Results.vue'
import AdminLogin from '@/pages/admin/Login.vue'
import AdminDashboard from '@/pages/admin/Dashboard.vue'
import AdminTests from '@/pages/admin/Tests.vue'
import Questions from '@/pages/admin/Questions.vue'
import BulkUpload from '@/pages/admin/BulkUpload.vue'
import Analytics from '@/pages/admin/Analytics.vue'
import { useAuthStore } from '@/stores/auth'
import MyAssessments from '@/pages/MyAssessments.vue'
import Jobs from '@/pages/Jobs.vue'
import Onboarding from '@/pages/Onboarding.vue'
import Dashboard from '@/pages/dashboard/Dashboard.vue'
import ToolsIndex from '@/pages/tools/ToolsIndex.vue'
import PDFTools from '@/pages/tools/PDFTools.vue'
import ImageTools from '@/pages/tools/ImageTools.vue'
import CalculatorSuite from '@/pages/tools/CalculatorSuite.vue'
import TextTools from '@/pages/tools/TextTools.vue'
import DateTimeTools from '@/pages/tools/DateTimeTools.vue'
import QRTools from '@/pages/tools/QRTools.vue'
import ColorTools from '@/pages/tools/ColorTools.vue'
import FontTools from '@/pages/tools/FontTools.vue'
import DocumentConverters from '@/pages/tools/DocumentConverters.vue'
import MiscTools from '@/pages/tools/MiscTools.vue'

let __routeProgressTimeout: number | null = null
const __getRouteProgressBar = () => {
  let el = document.getElementById('route-progress') as HTMLDivElement | null
  if (!el) {
    el = document.createElement('div')
    el.id = 'route-progress'
    document.body.appendChild(el)
  }
  return el
}
const __startRouteProgress = () => {
  const el = __getRouteProgressBar()
  el.classList.add('route-progress-active')
  el.style.width = '0%'
  requestAnimationFrame(() => { el.style.width = '80%' })
}
const __finishRouteProgress = () => {
  const el = __getRouteProgressBar()
  el.style.width = '100%'
  if (__routeProgressTimeout) clearTimeout(__routeProgressTimeout)
  __routeProgressTimeout = window.setTimeout(() => {
    el.classList.remove('route-progress-active')
    el.style.width = '0%'
  }, 300)
}

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: Home, meta: { title: 'Mock Test Pro' } },
    { path: '/jobs', name: 'jobs', component: Jobs, meta: { title: 'Job Alerts' } },
    { path: '/onboarding', name: 'onboarding', component: Onboarding, meta: { title: 'Get Started' } },
    { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { title: 'Dashboard' } },
    { 
      path: '/tools', 
      name: 'tools', 
      component: ToolsIndex,
      meta: { title: 'Tools Suite' },
      children: [
        { 
          path: 'pdf', 
          name: 'pdf-tools', 
          component: PDFTools,
          meta: { title: 'PDF Tools' },
          children: [
            { path: 'merge', name: 'pdf-merge', component: () => import('@/components/tools/pdf/PDFMerger.vue'), meta: { title: 'Merge PDFs', description: 'Merge multiple PDF files into a single PDF online.' } },
            { path: 'split', name: 'pdf-split', component: () => import('@/components/tools/pdf/PDFSplitter.vue'), meta: { title: 'Split PDF', description: 'Split a PDF into individual pages or custom page ranges.' } },
            { path: 'rotate', name: 'pdf-rotate', component: () => import('@/components/tools/pdf/PDFRotator.vue'), meta: { title: 'Rotate PDF', description: 'Rotate PDF pages clockwise or counter-clockwise.' } },
            { path: 'compress', name: 'pdf-compress', component: () => import('@/components/tools/pdf/PDFCompressor.vue'), meta: { title: 'Compress PDF', description: 'Reduce PDF file size with smart compression.' } },
            { path: 'convert', name: 'pdf-convert', component: () => import('@/components/tools/pdf/PDFConverter.vue'), meta: { title: 'Convert to PDF', description: 'Convert images and documents to PDF.' } },
            { path: 'to-images', name: 'pdf-to-images', component: () => import('@/components/tools/pdf/PDFToImages.vue'), meta: { title: 'PDF to Images', description: 'Convert PDF pages to PNG, JPEG, or WebP images.' } }
          ]
        },
        { 
          path: 'image', 
          name: 'image-tools', 
          component: ImageTools,
          meta: { title: 'Image Tools' },
          children: [
            { path: 'converter', name: 'image-converter', component: () => import('@/components/tools/image/ImageConverter.vue'), meta: { title: 'Image Converter', description: 'Convert images between PNG, JPG, WebP, and GIF formats.' } },
            { path: 'cropper', name: 'image-cropper', component: () => import('@/components/tools/image/ImageCropper.vue'), meta: { title: 'Image Cropper', description: 'Crop images to exact dimensions and aspect ratios.' } },
            { path: 'resizer', name: 'image-resizer', component: () => import('@/components/tools/image/ImageResizer.vue'), meta: { title: 'Image Resizer', description: 'Resize images to custom sizes with optional aspect ratio.' } },
            { path: 'compress', name: 'image-compressor', component: () => import('@/components/tools/image/ImageCompressor.vue'), meta: { title: 'Image Compressor', description: 'Compress images to reduce file size without major quality loss.' } },
            { path: 'favicon-generator', name: 'favicon-generator', component: () => import('@/components/tools/image/FaviconGenerator.vue'), meta: { title: 'Favicon Generator', description: 'Generate favicon and app icons in multiple sizes.' } }
          ]
        },
        { 
          path: 'calculator', 
          name: 'calculator-suite', 
          component: CalculatorSuite,
          meta: { title: 'Calculator Suite' },
          children: [
            { path: 'percentage', name: 'percentage-calculator', component: () => import('@/components/tools/calculator/PercentageCalculator.vue'), meta: { title: 'Percentage Calculator', description: 'Compute percentages and percentage change quickly.' } },
            { path: 'scientific', name: 'scientific-calculator', component: () => import('@/components/tools/calculator/ScientificCalculator.vue'), meta: { title: 'Scientific Calculator', description: 'Scientific calculator with trig, logs, factorials and more.' } },
            { path: 'bmi', name: 'bmi-calculator', component: () => import('@/components/tools/calculator/BMICalculator.vue'), meta: { title: 'BMI Calculator', description: 'Calculate your Body Mass Index (BMI) and category.' } },
            { path: 'age', name: 'age-calculator', component: () => import('@/components/tools/calculator/AgeCalculator.vue'), meta: { title: 'Age Calculator', description: 'Find age in years, months, days from date of birth.' } }
          ]
        },
        { 
          path: 'text', 
          name: 'text-tools', 
          component: TextTools,
          meta: { title: 'Text Tools' },
          children: [
            { path: 'word-counter', name: 'word-counter', component: () => import('@/components/tools/text/WordCounter.vue'), meta: { title: 'Word Counter', description: 'Count words, characters, sentences, and paragraphs.' } },
            { path: 'case-converter', name: 'case-converter', component: () => import('@/components/tools/text/CaseConverter.vue'), meta: { title: 'Case Converter', description: 'Convert text to uppercase, lowercase, title case and more.' } },
            { path: 'diff-tool', name: 'diff-tool', component: () => import('@/components/tools/text/DiffTool.vue'), meta: { title: 'Text Diff Tool', description: 'Compare two blocks of text and highlight differences.' } },
            { path: 'csv-to-json', name: 'csv-to-json', component: () => import('@/components/tools/text/CSVToJSON.vue'), meta: { title: 'CSV to JSON Converter', description: 'Convert CSV to JSON and JSON to CSV with custom delimiter, headers, preview, and download.' } },
            { path: 'lorem-ipsum', name: 'lorem-ipsum', component: () => import('@/components/tools/text/LoremIpsumGenerator.vue'), meta: { title: 'Lorem Ipsum Generator', description: 'Generate placeholder text by words, sentences, or paragraphs.' } },
            { path: 'json-formatter', name: 'json-formatter', component: () => import('@/components/tools/text/JSONFormatter.vue'), meta: { title: 'JSON Formatter', description: 'Format, validate, and minify JSON with error detection and highlighting.' } },
            { path: 'markdown-converter', name: 'markdown-converter', component: () => import('@/components/tools/text/MarkdownConverter.vue'), meta: { title: 'Markdown to HTML', description: 'Convert Markdown to HTML with live preview and highlighting.' } },
            { path: 'text-cleaner', name: 'text-cleaner', component: () => import('@/components/tools/text/TextCleaner.vue'), meta: { title: 'Text Cleaner', description: 'Clean whitespace, remove extra spaces, lines, and special characters.' } },
            { path: 'duplicate-remover', name: 'duplicate-remover', component: () => import('@/components/tools/text/DuplicateRemover.vue'), meta: { title: 'Duplicate Line Remover', description: 'Remove duplicate lines and sort text quickly.' } },
            { path: 'line-counter', name: 'line-counter', component: () => import('@/components/tools/text/LineCounter.vue'), meta: { title: 'Line Counter', description: 'Count lines, unique lines, and sort or deduplicate.' } },
            { path: 'text-to-speech', name: 'text-to-speech', component: () => import('@/components/tools/text/TextToSpeech.vue'), meta: { title: 'Text to Speech', description: 'Speak text with selectable voice, rate, and pitch.' } }
          ]
        },
        { 
          path: 'datetime', 
          name: 'datetime-tools', 
          component: DateTimeTools,
          meta: { title: 'Date & Time Tools' },
          children: [
            { path: 'age-calculator', name: 'datetime-age', component: () => import('@/components/tools/datetime/AgeCalculator.vue'), meta: { title: 'Age Calculator', description: 'Calculate exact age between two dates with breakdowns.' } },
            { path: 'date-difference', name: 'date-difference', component: () => import('@/components/tools/datetime/DateDifference.vue'), meta: { title: 'Date Difference', description: 'Calculate the number of days, weeks, months between dates.' } },
            { path: 'date-calculator', name: 'date-calculator', component: () => import('@/components/tools/datetime/DateCalculator.vue'), meta: { title: 'Date Calculator', description: 'Add/subtract days, find differences, and compute business days.' } },
            { path: 'world-clock', name: 'world-clock', component: () => import('@/components/tools/datetime/WorldClock.vue'), meta: { title: 'World Clock', description: 'View current time across multiple time zones.' } }
          ]
        },
        { 
          path: 'qr', 
          name: 'qr-tools', 
          component: QRTools,
          meta: { title: 'QR Tools' },
          children: [
            { path: 'generator', name: 'qr-generator', component: () => import('@/components/tools/qr/QRGenerator.vue'), meta: { title: 'QR Code Generator', description: 'Generate QR codes for text, URLs, WiFi, email, phone and more.' } },
            { path: 'reader', name: 'qr-reader', component: () => import('@/components/tools/qr/QRReader.vue'), meta: { title: 'QR Code Reader', description: 'Scan QR codes via camera or upload an image to decode.' } }
          ]
        },
        { 
          path: 'color', 
          name: 'color-tools', 
          component: ColorTools,
          meta: { title: 'Color Tools' },
          children: [
            { path: 'picker', name: 'color-picker', component: () => import('@/components/tools/color/ColorPicker.vue'), meta: { title: 'Color Picker', description: 'Pick colors and get HEX, RGB, HSL values with variations.' } },
            { path: 'palette', name: 'color-palette', component: () => import('@/components/tools/color/ColorPalette.vue'), meta: { title: 'Color Palette', description: 'Generate color palettes: mono, analogous, complementary, triadic, more.' } },
            { path: 'converter', name: 'color-converter', component: () => import('@/components/tools/color/ColorConverter.vue'), meta: { title: 'Color Converter', description: 'Convert colors between HEX, RGB, RGBA, HSL and HSLA.' } },
            { path: 'gradient', name: 'gradient-generator', component: () => import('@/components/tools/color/GradientGenerator.vue'), meta: { title: 'Gradient Generator', description: 'Create CSS linear or radial gradients with color stops.' } }
          ]
        },
        { 
          path: 'font', 
          name: 'font-tools', 
          component: FontTools,
          meta: { title: 'Font Tools' },
          children: [
            { path: 'preview', name: 'font-preview', component: () => import('@/components/tools/font/FontPreview.vue'), meta: { title: 'Font Preview', description: 'Preview text in various fonts and get ready CSS snippet.' } },
            { path: 'identifier', name: 'font-identifier', component: () => import('@/components/tools/font/FontIdentifier.vue'), meta: { title: 'Font Identifier', description: 'Identify fonts from images using OCR and heuristics.' } },
            { path: 'converter', name: 'font-converter', component: () => import('@/components/tools/font/FontConverter.vue'), meta: { title: 'Font Converter', description: 'Convert fonts between TTF, OTF, WOFF, and WOFF2 formats.' } }
          ]
        },
        { 
          path: 'document', 
          name: 'document-converters', 
          component: DocumentConverters,
          meta: { title: 'Document Converters' },
          children: [
            { path: 'word-to-pdf', name: 'word-to-pdf', component: () => import('@/components/tools/document/WordToPDF.vue'), meta: { title: 'Word to PDF', description: 'Convert DOC or DOCX documents to PDF in the browser.' } },
            { path: 'excel-to-pdf', name: 'excel-to-pdf', component: () => import('@/components/tools/document/ExcelToPDF.vue'), meta: { title: 'Excel to PDF', description: 'Convert CSV/Excel spreadsheets to PDF tables.' } },
            { path: 'pdf-to-word', name: 'pdf-to-word', component: () => import('@/components/tools/document/PDFToWord.vue'), meta: { title: 'PDF to Text', description: 'Extract text from PDF into TXT, RTF, or HTML.' } }
          ]
        },
        { 
          path: 'misc', 
          name: 'misc-tools', 
          component: MiscTools,
          meta: { title: 'Misc Tools' },
          children: [
            { path: 'password-generator', name: 'password-generator', component: () => import('@/components/tools/misc/PasswordGenerator.vue'), meta: { title: 'Password Generator', description: 'Generate secure, random passwords with custom rules.' } },
            { path: 'base64-encoder', name: 'base64-encoder', component: () => import('@/components/tools/misc/Base64Encoder.vue'), meta: { title: 'Base64 Encoder', description: 'Encode and decode Base64 strings and files.' } },
            { path: 'hash-generator', name: 'hash-generator', component: () => import('@/components/tools/misc/HashGenerator.vue'), meta: { title: 'Hash Generator', description: 'Generate SHA-1, SHA-256, SHA-512 hashes from text or files.' } },
            { path: 'uuid-generator', name: 'uuid-generator', component: () => import('@/components/tools/misc/UUIDGenerator.vue'), meta: { title: 'UUID Generator', description: 'Generate random UUID v4 identifiers instantly.' } },
            { path: 'url-encoder', name: 'url-encoder', component: () => import('@/components/tools/misc/URLEncoder.vue'), meta: { title: 'URL Encoder/Decoder', description: 'Encode or decode URLs easily.' } },
            { path: 'random-number', name: 'random-number', component: () => import('@/components/tools/misc/RandomNumberGenerator.vue'), meta: { title: 'Random Number Generator', description: 'Generate random numbers within a range.' } },
            { path: 'css-minifier', name: 'css-minifier', component: () => import('@/components/tools/misc/CSSMinifier.vue'), meta: { title: 'CSS Minifier', description: 'Minify or beautify CSS and view size savings.' } },
            { path: 'html-minifier', name: 'html-minifier', component: () => import('@/components/tools/misc/HTMLMinifier.vue'), meta: { title: 'HTML Minifier', description: 'Minify or beautify HTML and view size savings.' } },
            { path: 'morse-code', name: 'morse-code', component: () => import('@/components/tools/misc/MorseCodeTranslator.vue'), meta: { title: 'Morse Code Translator', description: 'Convert text ⇄ Morse code with audio playback.' } },
            { path: 'image-to-base64', name: 'image-to-base64', component: () => import('@/components/tools/image/ImageToBase64.vue'), meta: { title: 'Image to Base64', description: 'Convert images to Base64, Data URLs, and CSS snippets.' } },
            { path: 'instagram-caption', name: 'instagram-caption', component: () => import('@/components/tools/social/InstagramCaptionGenerator.vue'), meta: { title: 'Instagram Caption Generator', description: 'Generate engaging Instagram captions with styles and emojis.' } },
            { path: 'twitter-thread', name: 'twitter-thread', component: () => import('@/components/tools/social/TwitterThreadFormatter.vue'), meta: { title: 'Twitter Thread Formatter', description: 'Format long text into a threaded Twitter/X post series.' } }
          ]
        },
        { 
          path: 'academic', 
          name: 'academic-tools', 
          component: () => import('@/pages/tools/AcademicTools.vue'),
          meta: { title: 'Academic Tools' },
          children: [
            { path: 'gpa-calculator', name: 'gpa-calculator', component: () => import('@/components/tools/academic/GPACalculator.vue'), meta: { title: 'GPA Calculator', description: 'Calculate semester and cumulative GPA with multiple grade scales.' } },
            { path: 'grade-calculator', name: 'grade-calculator', component: () => import('@/components/tools/academic/GradeCalculator.vue'), meta: { title: 'Grade Calculator', description: 'Calculate current grade and predict final grade based on assignments.' } },
            { path: 'attendance-calculator', name: 'attendance-calculator', component: () => import('@/components/tools/academic/AttendanceCalculator.vue'), meta: { title: 'Attendance Calculator', description: 'Track attendance percentage and calculate classes you can miss.' } },
            { path: 'fraction-calculator', name: 'fraction-calculator', component: () => import('@/components/tools/academic/FractionCalculator.vue'), meta: { title: 'Fraction Calculator', description: 'Calculate fractions with step-by-step solutions.' } },
            { path: 'assignment-tracker', name: 'assignment-tracker', component: () => import('@/components/tools/academic/AssignmentTracker.vue'), meta: { title: 'Assignment Tracker', description: 'Track assignments, due dates, and priorities.' } },
            { path: 'exam-countdown', name: 'exam-countdown', component: () => import('@/components/tools/academic/ExamCountdown.vue'), meta: { title: 'Exam Countdown', description: 'Countdown to exams and track progress.' } },
            { path: 'flashcard-maker', name: 'flashcard-maker', component: () => import('@/components/tools/academic/FlashcardMaker.vue'), meta: { title: 'Flashcard Maker', description: 'Create and study flashcards with flip animation.' } },
            { path: 'citation-generator', name: 'citation-generator', component: () => import('@/components/tools/academic/CitationGenerator.vue'), meta: { title: 'Citation Generator', description: 'Generate citations in APA, MLA, Chicago, and Harvard styles.' } },
            { path: 'math-solver', name: 'math-solver', component: () => import('@/components/tools/academic/MathSolver.vue'), meta: { title: 'Math Equation Solver', description: 'Solve linear, quadratic, and system of equations.' } },
            { path: 'study-planner', name: 'study-planner', component: () => import('@/components/tools/academic/StudyPlanner.vue'), meta: { title: 'Study Planner', description: 'Plan your weekly study schedule by subject and time.' } },
            { path: 'timetable-generator', name: 'timetable-generator', component: () => import('@/components/tools/academic/TimetableGenerator.vue'), meta: { title: 'Timetable Generator', description: 'Create and organize your school timetable visually.' } },
            { path: 'reading-speed-test', name: 'reading-speed-test', component: () => import('@/components/tools/academic/ReadingSpeedTest.vue'), meta: { title: 'Reading Speed Test', description: 'Test your reading speed and comprehension.' } },
            { path: 'typing-speed-test', name: 'typing-speed-test', component: () => import('@/components/tools/academic/TypingSpeedTest.vue'), meta: { title: 'Typing Speed Test', description: 'Test your typing speed and accuracy.' } }
          ]
        }
      ]
    },
    { path: '/tests', name: 'tests', component: Tests },
    { path: '/test/:id', name: 'test', component: Test, props: true },
    { path: '/results/:attemptId', name: 'results', component: Results, props: true },
    { path: '/my/assessments', name: 'my-assessments', component: MyAssessments, meta: { requiresAuth: true } },
    { path: '/admin/login', name: 'admin-login', component: AdminLogin },
    { path: '/admin', name: 'admin', component: AdminDashboard, meta: { requiresAuth: true } },
    { path: '/admin/tests', name: 'admin-tests', component: AdminTests, meta: { requiresAuth: true } },
    { path: '/admin/questions', name: 'admin-questions', component: Questions, meta: { requiresAuth: true } },
    { path: '/admin/upload', name: 'admin-upload', component: BulkUpload, meta: { requiresAuth: true } },
    { path: '/admin/analytics', name: 'admin-analytics', component: Analytics, meta: { requiresAuth: true } }
  ]
})

router.beforeEach(async (to) => {
  __startRouteProgress()
  const auth = useAuthStore()
  if (to.meta?.requiresAuth && !auth.session) {
    await auth.init()
    if (!auth.session) return { name: 'admin-login', query: { redirect: to.fullPath } }
  }
})

router.afterEach((to) => {
  const nearestWithTitle = [...to.matched].reverse().find(r => r.meta && (r.meta as any).title)
  const nearestWithDesc = [...to.matched].reverse().find(r => r.meta && (r.meta as any).description)

  if (nearestWithTitle) {
    document.title = String((nearestWithTitle.meta as any).title)
  } else if (to.meta && (to.meta as any).title) {
    document.title = String((to.meta as any).title)
  }

  const description = nearestWithDesc ? (nearestWithDesc.meta as any).description : (to.meta as any)?.description
  if (description) {
    let tag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', String(description))
  }
  __finishRouteProgress()
})

router.onError(() => {
  __finishRouteProgress()
})

export default router
