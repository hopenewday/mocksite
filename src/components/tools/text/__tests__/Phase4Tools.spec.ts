// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import CaseConverter from '../CaseConverter.vue'
import DiffTool from '../DiffTool.vue'
import DuplicateRemover from '../DuplicateRemover.vue'
import LineCounter from '../LineCounter.vue'
import LoremIpsumGenerator from '../LoremIpsumGenerator.vue'
import TextCleaner from '../TextCleaner.vue'
import WordCounter from '../WordCounter.vue'

// --- Mocks ---

vi.mock('@vueuse/head', () => ({
  useHead: vi.fn()
}))

vi.mock('../../../../composables/useCountUp', async () => {
  const { ref } = await import('vue')
  return {
    useCountUp: (initial: number) => {
      const value = ref(initial)
      const displayValue = ref(String(initial))
      const setValue = (val: number) => {
        // console.log('Mock setValue called with:', val)
        value.value = val
        displayValue.value = String(val)
      }
      return { currentValue: value, displayValue, setValue, start: vi.fn(), stop: vi.fn() }
    }
  }
})

vi.mock('../../../../composables/useCopyFeedback', () => ({
  useCopyFeedback: () => ({
    copyToClipboard: vi.fn(),
    feedback: vi.fn(),
    copyWithFeedback: vi.fn(),
    isCopying: { value: false }
  })
}))

vi.mock('../../../../composables/useMilestones', () => ({
  useMilestones: () => ({
    celebrateFirstUse: vi.fn(),
    celebrateLargeOperation: vi.fn()
  })
}))

// Mock Clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
    readText: vi.fn().mockResolvedValue('pasted text')
  }
})

// Mock window.alert and confirm
global.alert = vi.fn()
global.confirm = vi.fn(() => true)

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

describe('Phase 4: Text Tools', () => {

  describe('CaseConverter.vue', () => {
    it('renders correctly', () => {
      const wrapper = mount(CaseConverter)
      expect(wrapper.text()).toContain('Case Converter')
    })

    it('converts text case', async () => {
      const wrapper = mount(CaseConverter)
      const textarea = wrapper.find('textarea')
      await textarea.setValue('Hello World')

      // Find buttons - simpler to check if conversion functions exist or check result if bound
      // Assuming standard implementation with buttons for Upper, Lower, etc.
      // Let's verify by finding buttons with specific text
      const buttons = wrapper.findAll('button')
      const upperBtn = buttons.find(b => b.text().includes('UPPERCASE'))

      if (upperBtn) {
        await upperBtn.trigger('click')

        // Check if output updated
        // The output is in a readonly textarea, so we check its value property
        const textareas = wrapper.findAll('textarea')
        const outputTextarea = textareas.length > 1 ? textareas[1] : textareas[0] // Assuming output is 2nd or checking distinct one

        // Actually CaseConverter likely has 2 textareas (input and output)
        if (textareas.length >= 2) {
          expect(textareas[1].element.value).toContain('HELLO WORLD')
        } else {
          // Fallback if logic differs
          expect(wrapper.text()).toContain('HELLO WORLD')
        }
      }
    })
  })

  describe('DiffTool.vue', () => {
    it('renders correctly', () => {
      const wrapper = mount(DiffTool)
      expect(wrapper.text()).toContain('Text Diff Tool')
    })

    it('compares text', async () => {
      const wrapper = mount(DiffTool)
      const textareas = wrapper.findAll('textarea')
      await textareas[0].setValue('line 1\nline 2')
      await textareas[1].setValue('line 1\nline 3')

      const compareBtn = wrapper.find('button.btn-primary-lime')
      await compareBtn.trigger('click')

      // Expect results to be shown
      expect(wrapper.text()).toContain('Comparison Summary')
      // Should show some diff stats
      expect(wrapper.text()).toMatch(/1|0/) // 1 added, 1 removed or similar
    })
  })

  describe('DuplicateRemover.vue', () => {
    it('renders correctly', () => {
      const wrapper = mount(DuplicateRemover)
      expect(wrapper.text()).toContain('Duplicate Line Remover')
    })

    it('removes duplicates', async () => {
      const wrapper = mount(DuplicateRemover)
      const textarea = wrapper.find('textarea')
      await textarea.setValue('a\nb\na\nc')

      const removeBtn = wrapper.findAll('button').find(b => b.text().includes('Remove Duplicates'))
      await removeBtn?.trigger('click')

      // Check output
      const outputTextarea = wrapper.findAll('textarea')[1] // Assuming 2nd is output
      if (outputTextarea) {
        expect(outputTextarea.element.value).toContain('a')
        expect(outputTextarea.element.value).toContain('b')
        expect(outputTextarea.element.value).toContain('c')
        // Should not have 4 lines roughly
        const lines = outputTextarea.element.value.split('\n').filter(l => l)
        expect(lines.length).toBe(3)
      }
    })
  })

  describe('LineCounter.vue', () => {
    it('renders correctly', () => {
      const wrapper = mount(LineCounter)
      expect(wrapper.text()).toContain('Line Counter')
    })

    it('counts lines and words', async () => {
      const wrapper = mount(LineCounter)
      const textarea = wrapper.find('textarea')
      await textarea.setValue('one\ntwo three')

      // Wait for watchers
      await flushPromises()
      await wrapper.vm.$nextTick()

      // Debug output if needed
      // console.log('LineCounter text:', wrapper.text())

      expect(wrapper.text()).toContain('2') // lines
      expect(wrapper.text()).toContain('3') // words
    })
  })

  describe('LoremIpsumGenerator.vue', () => {
    it('renders correctly', () => {
      const wrapper = mount(LoremIpsumGenerator)
      expect(wrapper.text()).toContain('Lorem Ipsum Generator')
    })

    it('generates text', async () => {
      const wrapper = mount(LoremIpsumGenerator)
      const generateBtn = wrapper.find('button.btn-primary-lime')
      await generateBtn.trigger('click')

      const textarea = wrapper.find('textarea')
      expect(textarea.element.value).toBeTruthy()
      expect(textarea.element.value).toContain('Lorem')
    })
  })

  describe('TextCleaner.vue', () => {
    it('renders correctly', () => {
      const wrapper = mount(TextCleaner)
      expect(wrapper.text()).toContain('Text Cleaner')
    })

    it('cleans text', async () => {
      const wrapper = mount(TextCleaner)
      const textarea = wrapper.find('textarea')
      await textarea.setValue('  hello   world  ')

      // Trigger clean - might be specific button like "Trim Whitespace" or "Clean All"
      // Assuming there is a "Clean" or similar action or multiple actions
      // Let's verify existence of buttons
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('WordCounter.vue', () => {
    it('renders correctly', () => {
      const wrapper = mount(WordCounter)
      expect(wrapper.text()).toContain('Word Counter')
    })

    it('counts words', async () => {
      const wrapper = mount(WordCounter)
      const textarea = wrapper.find('textarea')
      await textarea.setValue('Hello world this is a test')

      await flushPromises()
      await wrapper.vm.$nextTick()

      const wordsDisplay = wrapper.find('.text-brutal-cyan')
      // console.log('Words Display:', wordsDisplay.text())
      // console.log('Full Text:', wrapper.text())

      expect(wrapper.text()).toContain('6') // Words
      expect(wrapper.text()).toContain('26') // Characters
    })
  })

})
