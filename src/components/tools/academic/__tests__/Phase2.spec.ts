import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FlashcardMaker from '../FlashcardMaker.vue'
import CitationGenerator from '../CitationGenerator.vue'
import MathSolver from '../MathSolver.vue'
import StudyPlanner from '../StudyPlanner.vue'
import TimetableGenerator from '../TimetableGenerator.vue'
import ReadingSpeedTest from '../ReadingSpeedTest.vue'
import TypingSpeedTest from '../TypingSpeedTest.vue'

describe('Academic Tools - Phase 2', () => {
  describe('FlashcardMaker.vue', () => {
    it('renders flashcard maker component', () => {
      const wrapper = mount(FlashcardMaker)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Flashcard Maker')
    })
  })

  describe('CitationGenerator.vue', () => {
    it('renders citation generator component', () => {
      const wrapper = mount(CitationGenerator)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Citation Generator')
    })
  })

  describe('MathSolver.vue', () => {
    it('renders math solver component', () => {
      const wrapper = mount(MathSolver)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Math Equation Solver')
    })
  })

  describe('StudyPlanner.vue', () => {
    it('renders study planner component', () => {
      const wrapper = mount(StudyPlanner)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Study Planner')
    })
  })

  describe('TimetableGenerator.vue', () => {
    it('renders timetable generator component', () => {
      const wrapper = mount(TimetableGenerator)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Timetable Generator')
    })
  })

  describe('ReadingSpeedTest.vue', () => {
    it('renders reading speed test component', () => {
      const wrapper = mount(ReadingSpeedTest)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Reading Speed Test')
    })
  })

  describe('TypingSpeedTest.vue', () => {
    it('renders typing speed test component', () => {
      const wrapper = mount(TypingSpeedTest)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Typing Speed Test')
    })
  })
})
