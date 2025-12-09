// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

// Manually defining globals to ensure availability
const browserGlobals = {
  window: "readonly",
  document: "readonly",
  navigator: "readonly",
  console: "readonly",
  alert: "readonly",
  localStorage: "readonly",
  sessionStorage: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  setTimeout: "readonly",
  confirm: "readonly",
  prompt: "readonly",
  Event: "readonly",
  KeyboardEvent: "readonly",
  DragEvent: "readonly",
  HTMLInputElement: "readonly",
  HTMLTextAreaElement: "readonly",
  HTMLSelectElement: "readonly",
  File: "readonly",
  Blob: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
  location: "readonly",
  history: "readonly",
  screen: "readonly",
  Image: "readonly",
  FileReader: "readonly",
  FormData: "readonly",
  SVGCircleElement: "readonly",
  requestAnimationFrame: "readonly",
  cancelAnimationFrame: "readonly",
  MediaQueryListEvent: "readonly",
  Element: "readonly",
  HTMLCanvasElement: "readonly",
  process: "readonly",
  global: "readonly",
  performance: "readonly",
  HTMLDivElement: "readonly",
  clearTimeout: "readonly",
  HTMLMetaElement: "readonly",
};

const nodeGlobals = {
  module: "readonly",
  require: "readonly",
  __dirname: "readonly",
  process: "readonly",
  console: "readonly",
  Buffer: "readonly",
  global: "readonly",
  exports: "readonly",
};

export default [
  {
    ignores: ["dist/**", "node_modules/**", ".git/**"],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs["flat/recommended"],

  // Global Language Options
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  },

  // Vue Configuration
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
      globals: {
        ...browserGlobals,
      },
    },
    rules: {
      "vue/no-unused-components": "warn",
      "vue/no-mutating-props": "error",
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-undef": "off", // Handled by TypeScript / globals
    },
  },

  // Browser Source Configuration (JS/TS)
  {
    files: ["src/**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...browserGlobals,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-undef": "error",
    },
  },

  // Node Scripts Configuration
  {
    files: [
      "scripts/**/*.js",
      "*.config.{js,ts,cjs,mjs}",
      "eslint.config.js",
      "*.js",
    ],
    languageOptions: {
      sourceType: "script",
      globals: {
        ...nodeGlobals,
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
      "no-undef": "error",
    },
  },
];
