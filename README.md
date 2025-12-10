# Mock Test Vue3 + Supabase

A comprehensive educational tools platform built with Vue 3, TypeScript, and Supabase. This application provides a wide range of tools for students, educators, and professionals including academic tools, text utilities, image processing, and more.

## Features

### Academic Tools
- GPA Calculator
- Grade Calculator
- Attendance Calculator
- Fraction Calculator
- Math Solver
- Study Planner
- Flashcard Maker
- Citation Generator
- Exam Countdown
- Assignment Tracker
- Reading Speed Test
- Typing Speed Test
- Timetable Generator

### Text Tools
- JSON Formatter
- CSV to JSON Converter
- Markdown Converter
- Text to Speech
- HTML Minifier
- CSS Minifier

### Image Tools
- Image Compressor
- Image to Base64 Converter
- Favicon Generator

### Other Tools
- QR Code Reader/Generator
- Color Gradient Generator
- World Clock
- Date Calculator
- Morse Code Translator
- Social Media Tools (Twitter Thread Formatter, Instagram Caption Generator)

## Tech Stack

- **Frontend**: Vue 3 with Composition API
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **Build Tool**: Vite
- **Testing**: Vitest
- **Icons**: FontAwesome + Iconify

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mock-test-vue3-supabase
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Create a `.env` file in the root directory with your Supabase configuration:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
pnpm build
```

### Run Tests

```bash
npm run test
# or
pnpm test
```

### Lint Code

```bash
npm run lint
# or
pnpm lint
```

## Project Structure

```
src/
├── components/           # Reusable Vue components
│   ├── common/          # Common components (buttons, loaders, etc.)
│   ├── seo/            # SEO-related components
│   ├── tests/          # Test-related components
│   └── tools/          # Tool components organized by category
├── composables/        # Vue composables
├── config/             # Configuration files
├── i18n/              # Internationalization
├── lib/               # Utility libraries
├── pages/             # Page components
├── plugins/           # Vue plugins
├── router/            # Vue Router configuration
├── stores/            # Pinia stores
├── supabase/          # Supabase configuration
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── views/             # View components
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with Vue 3 and Supabase
- Icons provided by FontAwesome and Iconify
- UI components styled with Tailwind CSS
