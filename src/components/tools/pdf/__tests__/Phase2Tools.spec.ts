// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import PDFMerger from '../PDFMerger.vue'
import PDFSplitter from '../PDFSplitter.vue'
import PDFRotator from '../PDFRotator.vue'
import PDFCompressor from '../PDFCompressor.vue'
import PDFConverter from '../PDFConverter.vue'
import PDFToImages from '../PDFToImages.vue'

// Mock pdf-lib
const { mockPDFDocument, mockPage } = vi.hoisted(() => {
  const mockPage = {
    getSize: () => ({ width: 600, height: 800 }),
    setRotation: vi.fn(),
    getRotation: () => ({ angle: 0 }),
    drawImage: vi.fn(),
    drawText: vi.fn(),
    render: vi.fn().mockResolvedValue({}),
    getViewport: vi.fn().mockReturnValue({ width: 600, height: 800 }),
  }

  const mockPDFDocument = {
    save: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    addPage: vi.fn().mockReturnValue(mockPage),
    copyPages: vi.fn().mockResolvedValue([mockPage]),
    embedPng: vi.fn().mockResolvedValue({ width: 100, height: 100 }),
    embedJpg: vi.fn().mockResolvedValue({ width: 100, height: 100 }),
    embedFont: vi.fn().mockResolvedValue({
      widthOfTextAtSize: () => 10
    }),
    getPageCount: vi.fn().mockReturnValue(5),
    getPageIndices: vi.fn().mockReturnValue([0, 1, 2, 3, 4]),
    getPage: vi.fn().mockReturnValue(mockPage),
    getPages: vi.fn().mockReturnValue([mockPage, mockPage, mockPage, mockPage, mockPage]),
  }
  
  return { mockPDFDocument, mockPage }
})

vi.mock('pdf-lib', async () => {
  const actual = await vi.importActual('pdf-lib')
  return {
    ...actual,
    PDFDocument: {
      create: vi.fn().mockResolvedValue(mockPDFDocument),
      load: vi.fn().mockResolvedValue(mockPDFDocument),
    },
    rgb: vi.fn(),
    StandardFonts: { Helvetica: 'Helvetica' }
  }
})

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: () => 'data:image/png;base64,fake',
    width: 500,
    height: 500
  })
}))

// Mock Composables
vi.mock('@vueuse/head', () => ({
  useHead: vi.fn()
}))

vi.mock('@/composables/useMilestones', () => ({
  useMilestones: () => ({
    celebrateFirstUse: vi.fn(),
    celebrateLargeOperation: vi.fn()
  })
}))

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost:3000/123')
global.URL.revokeObjectURL = vi.fn()

// Mock Fetch
global.fetch = vi.fn().mockResolvedValue({
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
  blob: () => Promise.resolve(new Blob(['fake']))
})

// Mock File and Blob
class MockFile extends Blob {
  name: string;
  lastModified: number;

  constructor(content: any[], name: string, options?: any) {
    super(content, options);
    this.name = name;
    this.lastModified = Date.now();
  }

  arrayBuffer() {
    return Promise.resolve(new ArrayBuffer(10));
  }
}

global.File = MockFile as any;

describe('Phase 2 Tools: PDF & File Management', () => {

  describe('PDFMerger', () => {
    it('renders correctly', () => {
      const wrapper = mount(PDFMerger)
      expect(wrapper.text()).toContain('Merge PDF Files')
      expect(wrapper.find('input[type="file"]').exists()).toBe(true)
    })

    it('handles file selection', async () => {
      const wrapper = mount(PDFMerger)
      const file = new File(['fake'], 'test.pdf', { type: 'application/pdf' })
      
      // Trigger file input change
      const input = wrapper.find('input[type="file"]')
      Object.defineProperty(input.element, 'files', {
        value: [file],
        writable: false,
      })
      await input.trigger('change')
      await flushPromises() // Wait for async file reading

      // Check if file is added to list
      expect(wrapper.text()).toContain('test.pdf')
    })
  })

  describe('PDFSplitter', () => {
    it('renders correctly', () => {
      const wrapper = mount(PDFSplitter)
      expect(wrapper.text()).toContain('Split PDF')
    })

    it('shows split options when file is loaded', async () => {
      const wrapper = mount(PDFSplitter)
      const file = new File(['fake'], 'test.pdf', { type: 'application/pdf' })
      
      // Simulate file drop or select
      const input = wrapper.find('input[type="file"]')
      Object.defineProperty(input.element, 'files', {
        value: [file],
        writable: false,
      })
      await input.trigger('change')
      await flushPromises()

      expect(wrapper.text()).toContain('Split Method')
      expect(wrapper.findAll('option').length).toBeGreaterThan(0)
    })
  })

  describe('PDFRotator', () => {
    it('renders correctly', () => {
      const wrapper = mount(PDFRotator)
      expect(wrapper.text()).toContain('Rotate PDF')
    })

    it('updates rotation state', async () => {
      const wrapper = mount(PDFRotator)
      const file = new File(['fake'], 'test.pdf', { type: 'application/pdf' })
      
      const input = wrapper.find('input[type="file"]')
      Object.defineProperty(input.element, 'files', {
        value: [file],
        writable: false,
      })
      await input.trigger('change')
      await flushPromises()

      // Check rotation buttons exist
      const buttons = wrapper.findAll('button')
      const rotateButton = buttons.find(b => b.text().includes('Rotate 1 PDF'))
      expect(rotateButton).toBeDefined()
    })
  })

  describe('PDFCompressor', () => {
    it('renders correctly', () => {
      const wrapper = mount(PDFCompressor)
      expect(wrapper.text()).toContain('Compress PDF')
    })

    it('allows selecting compression level', async () => {
      const wrapper = mount(PDFCompressor)
      const file = new File(['fake'], 'test.pdf', { type: 'application/pdf' })
      
      const input = wrapper.find('input[type="file"]')
      Object.defineProperty(input.element, 'files', {
        value: [file],
        writable: false,
      })
      await input.trigger('change')
      await flushPromises()

      expect(wrapper.text()).toContain('Compression Level')
      expect(wrapper.find('select').exists()).toBe(true)
    })
  })

  describe('PDFConverter', () => {
    it('renders correctly', () => {
      const wrapper = mount(PDFConverter)
      expect(wrapper.text()).toContain('Convert to PDF')
    })

    it('switches conversion modes', async () => {
      const wrapper = mount(PDFConverter)
      const select = wrapper.find('select')
      
      await select.setValue('text')
      expect(wrapper.text()).toContain('Enter Text or Upload Document')
      
      await select.setValue('html')
      expect(wrapper.text()).toContain('HTML Content')
      
      await select.setValue('images')
      expect(wrapper.text()).toContain('Drop image files here')
    })
  })

  describe('PDFToImages', () => {
    it('renders correctly', () => {
      const wrapper = mount(PDFToImages)
      expect(wrapper.text()).toContain('PDF to Images')
    })

    it('handles file input', async () => {
      const wrapper = mount(PDFToImages)
      const file = new File(['fake'], 'test.pdf', { type: 'application/pdf' })
      
      const input = wrapper.find('input[type="file"]')
      Object.defineProperty(input.element, 'files', {
        value: [file],
        writable: false,
      })
      await input.trigger('change')
      await flushPromises()

      expect(wrapper.text()).toContain('test.pdf')
      expect(wrapper.text()).toContain('Image Format')
    })
  })

})
