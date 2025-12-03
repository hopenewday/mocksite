// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageCompressor from '../ImageCompressor.vue'
import ImageCropper from '../ImageCropper.vue'
import ImageConverter from '../ImageConverter.vue'
import ImageResizer from '../ImageResizer.vue'

// --- Mocks ---

// Mock browser-image-compression
const { mockImageCompression } = vi.hoisted(() => {
  return {
    mockImageCompression: vi.fn().mockImplementation(async (file, options) => {
      // Return a smaller blob to simulate compression
      return new Blob(['compressed content'], { type: file.type })
    })
  }
})

vi.mock('browser-image-compression', () => ({
  default: mockImageCompression
}))

// Mock file-saver
vi.mock('file-saver', () => ({
  saveAs: vi.fn()
}))

// Mock jszip
vi.mock('jszip', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      file: vi.fn(),
      generateAsync: vi.fn().mockResolvedValue(new Blob(['zip content']))
    }))
  }
})

// Mock Composables
vi.mock('@vueuse/head', () => ({
  useHead: vi.fn()
}))

vi.mock('../../../composables/useCountUp', () => ({
  useCountUp: (initial) => ({ value: initial })
}))

vi.mock('../../../composables/useMilestones', () => ({
  useMilestones: () => ({
    celebrateFirstUse: vi.fn(),
    celebrateLargeOperation: vi.fn(),
    celebrateCompressionSavings: vi.fn()
  })
}))

// --- Browser API Mocks ---

// URL.createObjectURL & revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = vi.fn()

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Canvas Mock
// JSDOM has basic canvas support, but we often need to mock toBlob or getContext behaviors for image ops
const mockToBlob = vi.fn((callback) => callback(new Blob(['mock-image'], { type: 'image/png' })))
Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: mockToBlob,
  writable: true
})

// Mock Image loading (since JSDOM doesn't load images)
// We trigger onload manually in tests if needed, or rely on the component to handle it.
// Many components use `new Image()` or `<img>` tags.
// We can spy on Image constructor if needed, but usually setting src triggers nothing in JSDOM.
// We might need to manually trigger onload events on image elements in tests.

describe('Phase 3: Image Tools', () => {
  
  describe('ImageCompressor.vue', () => {
    it('renders correctly', () => {
      const wrapper = mount(ImageCompressor)
      expect(wrapper.find('h2').text()).toBe('Image Compressor')
      expect(wrapper.text()).toContain('Drop images here')
    })

    it('handles file upload and compression', async () => {
      const wrapper = mount(ImageCompressor)
      
      // Simulate file input change
      const file = new File(['test content'], 'test.png', { type: 'image/png' })
      const input = wrapper.find('input[type="file"]')
      
      // Mock files property on the input element
      Object.defineProperty(input.element, 'files', {
        value: [file],
        writable: false,
      })
      
      await input.trigger('change')

      // Wait for reactivity
      await wrapper.vm.$nextTick()
      
      // Check if file is added to list
      expect(wrapper.vm.files.length).toBe(1)
      expect(wrapper.vm.files[0].original.name).toBe('test.png')
      
      // It auto-compresses on add, so check if compression was called
      expect(mockImageCompression).toHaveBeenCalled()
      
      // Wait for async operation (compression)
      // Allow time for the async compression mock to resolve
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Check if state updated (compressed blob should be present)
      expect(wrapper.vm.files[0].compressed).toBeTruthy()
    })
  })

  describe('ImageCropper.vue', () => {
    it('renders correctly', () => {
      const wrapper = mount(ImageCropper)
      expect(wrapper.find('h2').text()).toBe('Image Cropper')
    })

    it('loads an image for cropping', async () => {
      const wrapper = mount(ImageCropper)
      
      const file = new File(['image data'], 'test.jpg', { type: 'image/jpeg' })
      const input = wrapper.find('input[type="file"]')
      
      // Mock files property on the input element
      Object.defineProperty(input.element, 'files', {
        value: [file],
        writable: false,
      })
      
      await input.trigger('change')
      
      // Wait for FileReader
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(wrapper.vm.originalImage).toEqual(file)
      expect(wrapper.vm.imagePreview).toBeTruthy()
    })
  })

  describe('ImageConverter.vue', () => {
    it('renders correctly', () => {
      const wrapper = mount(ImageConverter)
      expect(wrapper.text()).toContain('Image Format Converter')
    })
  })

  describe('ImageResizer.vue', () => {
    it('renders correctly', () => {
      const wrapper = mount(ImageResizer)
      expect(wrapper.text()).toContain('Image Resizer')
    })
  })

})
