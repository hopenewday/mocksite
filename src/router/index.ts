import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Tests from '@/pages/Tests.vue'
import Test from '@/pages/Test.vue'
import Results from '@/pages/Results.vue'
import AdminLogin from '@/pages/admin/Login.vue'
import AdminDashboard from '@/pages/admin/Dashboard.vue'
import AdminTests from '@/pages/admin/Tests.vue'
import Questions from '@/pages/admin/Questions.vue'
import BulkUpload from '@/pages/admin/BulkUpload.vue'
import Analytics from '@/pages/admin/Analytics.vue'
import Users from '@/pages/admin/Users.vue'
import Activity from '@/pages/admin/Activity.vue'
import Config from '@/pages/admin/Config.vue'
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
import AcademicTools from '@/pages/tools/AcademicTools.vue'

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
    { path: '/login', name: 'login', component: Login, meta: { title: 'Login' } },
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
          meta: { title: 'PDF Tools', icon: 'mdi:file-pdf-box' },
          children: [
            { path: 'merge', name: 'pdf-merge', component: () => import('@/components/tools/pdf/PDFMerger.vue'), meta: { title: 'Merge PDFs', description: 'Merge multiple PDF files into a single PDF online.', icon: 'mdi:file-document-multiple' } },
            { path: 'split', name: 'pdf-split', component: () => import('@/components/tools/pdf/PDFSplitter.vue'), meta: { title: 'Split PDF', description: 'Split a PDF into individual pages or custom page ranges.', icon: 'mdi:file-document-arrow-right' } },
            { path: 'rotate', name: 'pdf-rotate', component: () => import('@/components/tools/pdf/PDFRotator.vue'), meta: { title: 'Rotate PDF', description: 'Rotate PDF pages clockwise or counter-clockwise.', icon: 'mdi:rotate-right' } },
            { path: 'compress', name: 'pdf-compress', component: () => import('@/components/tools/pdf/PDFCompressor.vue'), meta: { title: 'Compress PDF', description: 'Reduce PDF file size with smart compression.', icon: 'mdi:file-download' } },
            { path: 'convert', name: 'pdf-convert', component: () => import('@/components/tools/pdf/PDFConverter.vue'), meta: { title: 'Convert to PDF', description: 'Convert images and documents to PDF.', icon: 'mdi:file-replace' } },
            { path: 'to-images', name: 'pdf-to-images', component: () => import('@/components/tools/pdf/PDFToImages.vue'), meta: { title: 'PDF to Images', description: 'Convert PDF pages to PNG, JPEG, or WebP images.', icon: 'mdi:image-multiple' } }
          ]
        },
        {
          path: 'image',
          name: 'image-tools',
          component: ImageTools,
          meta: { title: 'Image Tools', icon: 'mdi:image' },
          children: [
            { path: 'converter', name: 'image-converter', component: () => import('@/components/tools/image/ImageConverter.vue'), meta: { title: 'Image Converter', description: 'Convert images between PNG, JPG, WebP, and GIF formats.', icon: 'mdi:image-sync' } },
            { path: 'cropper', name: 'image-cropper', component: () => import('@/components/tools/image/ImageCropper.vue'), meta: { title: 'Image Cropper', description: 'Crop images to exact dimensions and aspect ratios.', icon: 'mdi:crop' } },
            { path: 'resizer', name: 'image-resizer', component: () => import('@/components/tools/image/ImageResizer.vue'), meta: { title: 'Image Resizer', description: 'Resize images to custom sizes with optional aspect ratio.', icon: 'mdi:resize' } },
            { path: 'compress', name: 'image-compressor', component: () => import('@/components/tools/image/ImageCompressor.vue'), meta: { title: 'Image Compressor', description: 'Compress images to reduce file size without major quality loss.', icon: 'mdi:file-image-minus' } },
            { path: 'favicon-generator', name: 'favicon-generator', component: () => import('@/components/tools/image/FaviconGenerator.vue'), meta: { title: 'Favicon Generator', description: 'Generate favicon and app icons in multiple sizes.', icon: 'mdi:web' } }
          ]
        },
        {
          path: 'calculator',
          name: 'calculator-suite',
          component: CalculatorSuite,
          meta: { title: 'Calculator Suite', icon: 'mdi:calculator' },
          children: [
            { path: 'percentage', name: 'percentage-calculator', component: () => import('@/components/tools/calculator/PercentageCalculator.vue'), meta: { title: 'Percentage Calculator', description: 'Compute percentages and percentage change quickly.', icon: 'mdi:percent' } },
            { path: 'scientific', name: 'scientific-calculator', component: () => import('@/components/tools/calculator/ScientificCalculator.vue'), meta: { title: 'Scientific Calculator', description: 'Scientific calculator with trig, logs, factorials and more.', icon: 'mdi:calculator-variant' } },
            { path: 'bmi', name: 'bmi-calculator', component: () => import('@/components/tools/calculator/BMICalculator.vue'), meta: { title: 'BMI Calculator', description: 'Calculate your Body Mass Index (BMI) and category.', icon: 'mdi:human' } },
            { path: 'age', name: 'age-calculator', component: () => import('@/components/tools/calculator/AgeCalculator.vue'), meta: { title: 'Age Calculator', description: 'Find age in years, months, days from date of birth.', icon: 'mdi:cake-variant' } }
          ]
        },
        {
          path: 'text',
          name: 'text-tools',
          component: TextTools,
          meta: { title: 'Text Tools', icon: 'mdi:format-text' },
          children: [
            { path: 'word-counter', name: 'word-counter', component: () => import('@/components/tools/text/WordCounter.vue'), meta: { title: 'Word Counter', description: 'Count words, characters, sentences, and paragraphs.', icon: 'mdi:counter' } },
            { path: 'case-converter', name: 'case-converter', component: () => import('@/components/tools/text/CaseConverter.vue'), meta: { title: 'Case Converter', description: 'Convert text to uppercase, lowercase, title case and more.', icon: 'mdi:format-letter-case' } },
            { path: 'diff-tool', name: 'diff-tool', component: () => import('@/components/tools/text/DiffTool.vue'), meta: { title: 'Text Diff Tool', description: 'Compare two blocks of text and highlight differences.', icon: 'mdi:file-compare' } },
            { path: 'csv-to-json', name: 'csv-to-json', component: () => import('@/components/tools/text/CSVToJSON.vue'), meta: { title: 'CSV to JSON Converter', description: 'Convert CSV to JSON and JSON to CSV with custom delimiter, headers, preview, and download.', icon: 'mdi:code-json' } },
            { path: 'lorem-ipsum', name: 'lorem-ipsum', component: () => import('@/components/tools/text/LoremIpsumGenerator.vue'), meta: { title: 'Lorem Ipsum Generator', description: 'Generate placeholder text by words, sentences, or paragraphs.', icon: 'mdi:text-box' } },
            { path: 'json-formatter', name: 'json-formatter', component: () => import('@/components/tools/text/JSONFormatter.vue'), meta: { title: 'JSON Formatter', description: 'Format, validate, and minify JSON with error detection and highlighting.', icon: 'mdi:code-braces' } },
            { path: 'markdown-converter', name: 'markdown-converter', component: () => import('@/components/tools/text/MarkdownConverter.vue'), meta: { title: 'Markdown to HTML', description: 'Convert Markdown to HTML with live preview and highlighting.', icon: 'mdi:language-markdown' } },
            { path: 'text-cleaner', name: 'text-cleaner', component: () => import('@/components/tools/text/TextCleaner.vue'), meta: { title: 'Text Cleaner', description: 'Clean whitespace, remove extra spaces, lines, and special characters.', icon: 'mdi:broom' } },
            { path: 'duplicate-remover', name: 'duplicate-remover', component: () => import('@/components/tools/text/DuplicateRemover.vue'), meta: { title: 'Duplicate Line Remover', description: 'Remove duplicate lines and sort text quickly.', icon: 'mdi:content-duplicate' } },
            { path: 'line-counter', name: 'line-counter', component: () => import('@/components/tools/text/LineCounter.vue'), meta: { title: 'Line Counter', description: 'Count lines, unique lines, and sort or deduplicate.', icon: 'mdi:format-list-numbered' } },
            { path: 'text-to-speech', name: 'text-to-speech', component: () => import('@/components/tools/text/TextToSpeech.vue'), meta: { title: 'Text to Speech', description: 'Speak text with selectable voice, rate, and pitch.', icon: 'mdi:text-to-speech' } }
          ]
        },
        {
          path: 'datetime',
          name: 'datetime-tools',
          component: DateTimeTools,
          meta: { title: 'Date & Time Tools', icon: 'mdi:calendar-clock' },
          children: [
            { path: 'age-calculator', name: 'datetime-age', component: () => import('@/components/tools/datetime/AgeCalculator.vue'), meta: { title: 'Age Calculator', description: 'Calculate exact age between two dates with breakdowns.', icon: 'mdi:cake' } },
            { path: 'date-difference', name: 'date-difference', component: () => import('@/components/tools/datetime/DateDifference.vue'), meta: { title: 'Date Difference', description: 'Calculate the number of days, weeks, months between dates.', icon: 'mdi:calendar-range' } },
            { path: 'date-calculator', name: 'date-calculator', component: () => import('@/components/tools/datetime/DateCalculator.vue'), meta: { title: 'Date Calculator', description: 'Add/subtract days, find differences, and compute business days.', icon: 'mdi:calendar-plus' } },
            { path: 'world-clock', name: 'world-clock', component: () => import('@/components/tools/datetime/WorldClock.vue'), meta: { title: 'World Clock', description: 'View current time across multiple time zones.', icon: 'mdi:earth' } }
          ]
        },
        {
          path: 'qr',
          name: 'qr-tools',
          component: QRTools,
          meta: { title: 'QR Tools', icon: 'mdi:qrcode' },
          children: [
            { path: 'generator', name: 'qr-generator', component: () => import('@/components/tools/qr/QRGenerator.vue'), meta: { title: 'QR Code Generator', description: 'Generate QR codes for text, URLs, WiFi, email, phone and more.', icon: 'mdi:qrcode-plus' } },
            { path: 'reader', name: 'qr-reader', component: () => import('@/components/tools/qr/QRReader.vue'), meta: { title: 'QR Code Reader', description: 'Scan QR codes via camera or upload an image to decode.', icon: 'mdi:qrcode-scan' } }
          ]
        },
        {
          path: 'color',
          name: 'color-tools',
          component: ColorTools,
          meta: { title: 'Color Tools', icon: 'mdi:palette' },
          children: [
            { path: 'picker', name: 'color-picker', component: () => import('@/components/tools/color/ColorPicker.vue'), meta: { title: 'Color Picker', description: 'Pick colors and get HEX, RGB, HSL values with variations.', icon: 'mdi:eyedropper' } },
            { path: 'palette', name: 'color-palette', component: () => import('@/components/tools/color/ColorPalette.vue'), meta: { title: 'Color Palette', description: 'Generate color palettes: mono, analogous, complementary, triadic, more.', icon: 'mdi:palette-swatch' } },
            { path: 'converter', name: 'color-converter', component: () => import('@/components/tools/color/ColorConverter.vue'), meta: { title: 'Color Converter', description: 'Convert colors between HEX, RGB, RGBA, HSL and HSLA.', icon: 'mdi:swap-horizontal' } },
            { path: 'gradient', name: 'gradient-generator', component: () => import('@/components/tools/color/GradientGenerator.vue'), meta: { title: 'Gradient Generator', description: 'Create CSS linear or radial gradients with color stops.', icon: 'mdi:gradient-horizontal' } }
          ]
        },
        {
          path: 'font',
          name: 'font-tools',
          component: FontTools,
          meta: { title: 'Font Tools', icon: 'mdi:format-font' },
          children: [
            { path: 'preview', name: 'font-preview', component: () => import('@/components/tools/font/FontPreview.vue'), meta: { title: 'Font Preview', description: 'Preview text in various fonts and get ready CSS snippet.', icon: 'mdi:format-text-variant' } },
            { path: 'identifier', name: 'font-identifier', component: () => import('@/components/tools/font/FontIdentifier.vue'), meta: { title: 'Font Identifier', description: 'Identify fonts from images using OCR and heuristics.', icon: 'mdi:magnify' } },
            { path: 'converter', name: 'font-converter', component: () => import('@/components/tools/font/FontConverter.vue'), meta: { title: 'Font Converter', description: 'Convert fonts between TTF, OTF, WOFF, and WOFF2 formats.', icon: 'mdi:swap-horizontal-bold' } }
          ]
        },
        {
          path: 'document',
          name: 'document-converters',
          component: DocumentConverters,
          meta: { title: 'Document Converters', icon: 'mdi:file-document-edit' },
          children: [
            { path: 'word-to-pdf', name: 'word-to-pdf', component: () => import('@/components/tools/document/WordToPDF.vue'), meta: { title: 'Word to PDF', description: 'Convert DOC or DOCX documents to PDF in the browser.', icon: 'mdi:file-word' } },
            { path: 'excel-to-pdf', name: 'excel-to-pdf', component: () => import('@/components/tools/document/ExcelToPDF.vue'), meta: { title: 'Excel to PDF', description: 'Convert CSV/Excel spreadsheets to PDF tables.', icon: 'mdi:file-excel' } },
            { path: 'pdf-to-word', name: 'pdf-to-word', component: () => import('@/components/tools/document/PDFToWord.vue'), meta: { title: 'PDF to Text', description: 'Extract text from PDF into TXT, RTF, or HTML.', icon: 'mdi:file-document-arrow-right' } }
          ]
        },
        {
          path: 'misc',
          name: 'misc-tools',
          component: MiscTools,
          meta: { title: 'Misc Tools', icon: 'mdi:toolbox' },
          children: [
            { path: 'password-generator', name: 'password-generator', component: () => import('@/components/tools/misc/PasswordGenerator.vue'), meta: { title: 'Password Generator', description: 'Generate secure, random passwords with custom rules.', icon: 'mdi:lock' } },
            { path: 'base64-encoder', name: 'base64-encoder', component: () => import('@/components/tools/misc/Base64Encoder.vue'), meta: { title: 'Base64 Encoder', description: 'Encode and decode Base64 strings and files.', icon: 'mdi:code-string' } },
            { path: 'hash-generator', name: 'hash-generator', component: () => import('@/components/tools/misc/HashGenerator.vue'), meta: { title: 'Hash Generator', description: 'Generate SHA-1, SHA-256, SHA-512 hashes from text or files.', icon: 'mdi:pound' } },
            { path: 'uuid-generator', name: 'uuid-generator', component: () => import('@/components/tools/misc/UUIDGenerator.vue'), meta: { title: 'UUID Generator', description: 'Generate random UUID v4 identifiers instantly.', icon: 'mdi:identifier' } },
            { path: 'url-encoder', name: 'url-encoder', component: () => import('@/components/tools/misc/URLEncoder.vue'), meta: { title: 'URL Encoder/Decoder', description: 'Encode or decode URLs easily.', icon: 'mdi:link' } },
            { path: 'random-number', name: 'random-number', component: () => import('@/components/tools/misc/RandomNumberGenerator.vue'), meta: { title: 'Random Number Generator', description: 'Generate random numbers within a range.', icon: 'mdi:dice-multiple' } },
            { path: 'css-minifier', name: 'css-minifier', component: () => import('@/components/tools/misc/CSSMinifier.vue'), meta: { title: 'CSS Minifier', description: 'Minify or beautify CSS and view size savings.', icon: 'mdi:language-css3' } },
            { path: 'html-minifier', name: 'html-minifier', component: () => import('@/components/tools/misc/HTMLMinifier.vue'), meta: { title: 'HTML Minifier', description: 'Minify or beautify HTML and view size savings.', icon: 'mdi:language-html5' } },
            { path: 'morse-code', name: 'morse-code', component: () => import('@/components/tools/misc/MorseCodeTranslator.vue'), meta: { title: 'Morse Code Translator', description: 'Convert text ⇄ Morse code with audio playback.', icon: 'mdi:radio-tower' } },
            { path: 'image-to-base64', name: 'image-to-base64', component: () => import('@/components/tools/image/ImageToBase64.vue'), meta: { title: 'Image to Base64', description: 'Convert images to Base64, Data URLs, and CSS snippets.', icon: 'mdi:image-text' } },
            { path: 'instagram-caption', name: 'instagram-caption', component: () => import('@/components/tools/social/InstagramCaptionGenerator.vue'), meta: { title: 'Instagram Caption Generator', description: 'Generate engaging Instagram captions with styles and emojis.', icon: 'mdi:instagram' } },
            { path: 'twitter-thread', name: 'twitter-thread', component: () => import('@/components/tools/social/TwitterThreadFormatter.vue'), meta: { title: 'Twitter Thread Formatter', description: 'Format long text into a threaded Twitter/X post series.', icon: 'mdi:twitter' } }
          ]
        },
        {
          path: 'academic',
          name: 'academic-tools',
          component: AcademicTools,
          meta: { title: 'Academic Tools', icon: 'mdi:school' },
          children: [
            { path: 'gpa-calculator', name: 'gpa-calculator', component: () => import('@/components/tools/academic/GPACalculator.vue'), meta: { title: 'GPA Calculator', description: 'Calculate semester and cumulative GPA with multiple grade scales.', icon: 'mdi:chart-line' } },
            { path: 'grade-calculator', name: 'grade-calculator', component: () => import('@/components/tools/academic/GradeCalculator.vue'), meta: { title: 'Grade Calculator', description: 'Calculate current grade and predict final grade based on assignments.', icon: 'mdi:chart-bar' } },
            { path: 'attendance-calculator', name: 'attendance-calculator', component: () => import('@/components/tools/academic/AttendanceCalculator.vue'), meta: { title: 'Attendance Calculator', description: 'Track attendance percentage and calculate classes you can miss.', icon: 'mdi:calendar-check' } },
            { path: 'fraction-calculator', name: 'fraction-calculator', component: () => import('@/components/tools/academic/FractionCalculator.vue'), meta: { title: 'Fraction Calculator', description: 'Calculate fractions with step-by-step solutions.', icon: 'mdi:slash-forward' } },
            { path: 'assignment-tracker', name: 'assignment-tracker', component: () => import('@/components/tools/academic/AssignmentTracker.vue'), meta: { title: 'Assignment Tracker', description: 'Track assignments, due dates, and priorities.', icon: 'mdi:clipboard-list' } },
            { path: 'exam-countdown', name: 'exam-countdown', component: () => import('@/components/tools/academic/ExamCountdown.vue'), meta: { title: 'Exam Countdown', description: 'Countdown to exams and track progress.', icon: 'mdi:timer-sand' } },
            { path: 'flashcard-maker', name: 'flashcard-maker', component: () => import('@/components/tools/academic/FlashcardMaker.vue'), meta: { title: 'Flashcard Maker', description: 'Create and study flashcards with flip animation.', icon: 'mdi:cards' } },
            { path: 'citation-generator', name: 'citation-generator', component: () => import('@/components/tools/academic/CitationGenerator.vue'), meta: { title: 'Citation Generator', description: 'Generate citations in APA, MLA, Chicago, and Harvard styles.', icon: 'mdi:format-quote-close' } },
            { path: 'math-solver', name: 'math-solver', component: () => import('@/components/tools/academic/MathSolver.vue'), meta: { title: 'Math Equation Solver', description: 'Solve linear, quadratic, and system of equations.', icon: 'mdi:function' } },
            { path: 'study-planner', name: 'study-planner', component: () => import('@/components/tools/academic/StudyPlanner.vue'), meta: { title: 'Study Planner', description: 'Plan your weekly study schedule by subject and time.', icon: 'mdi:notebook' } },
            { path: 'timetable-generator', name: 'timetable-generator', component: () => import('@/components/tools/academic/TimetableGenerator.vue'), meta: { title: 'Timetable Generator', description: 'Create and organize your school timetable visually.', icon: 'mdi:table' } },
            { path: 'reading-speed-test', name: 'reading-speed-test', component: () => import('@/components/tools/academic/ReadingSpeedTest.vue'), meta: { title: 'Reading Speed Test', description: 'Test your reading speed and comprehension.', icon: 'mdi:book-open-page-variant' } },
            { path: 'typing-speed-test', name: 'typing-speed-test', component: () => import('@/components/tools/academic/TypingSpeedTest.vue'), meta: { title: 'Typing Speed Test', description: 'Test your typing speed and accuracy.', icon: 'mdi:keyboard' } },
            { path: 'vocabulary-builder', name: 'vocabulary-builder', component: () => import('@/components/tools/language/VocabularyBuilder.vue'), meta: { title: 'Vocabulary Builder', description: 'Expand your vocabulary with flashcards and quizzes.', icon: 'mdi:alphabetical' } }
          ]
        }
      ]
    },
    { path: '/tests', name: 'tests', component: Tests },
    { path: '/test/:id', name: 'test', component: Test, props: true },
    { path: '/results/:attemptId', name: 'results', component: Results, props: true },
    { path: '/my/assessments', name: 'my-assessments', component: MyAssessments, meta: { requiresAuth: true } },
    { path: '/admin/login', name: 'admin-login', component: AdminLogin },
    { path: '/admin', name: 'admin', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/admin/users', name: 'admin-users', component: Users, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/admin/activity', name: 'admin-activity', component: Activity, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/admin/config', name: 'admin-config', component: Config, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/admin/tests', name: 'admin-tests', component: AdminTests, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/admin/questions', name: 'admin-questions', component: Questions, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/admin/upload', name: 'admin-upload', component: BulkUpload, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/admin/analytics', name: 'admin-analytics', component: Analytics, meta: { requiresAuth: true, requiresAdmin: true } }
  ]
})

router.beforeEach(async (to) => {
  __startRouteProgress()
  const auth = useAuthStore()
  if (to.meta?.requiresAuth && !auth.session) {
    await auth.init()
    if (!auth.session) return { name: 'admin-login', query: { redirect: to.fullPath } }
  }
  if ((to.meta as any)?.requiresAdmin) {
    await auth.init()
    if (!auth.isAdmin) return { name: 'home' }
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
