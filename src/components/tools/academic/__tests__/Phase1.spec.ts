import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GPACalculator from '../GPACalculator.vue'
import GradeCalculator from '../GradeCalculator.vue'
import AttendanceCalculator from '../AttendanceCalculator.vue'
import FractionCalculator from '../FractionCalculator.vue'
import AssignmentTracker from '../AssignmentTracker.vue'
import ExamCountdown from '../ExamCountdown.vue'

describe('Academic Tools - Phase 1', () => {
  describe('GPACalculator.vue', () => {
    it('renders GPA calculator component', () => {
      const wrapper = mount(GPACalculator)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('GPA Calculator')
    })
  })

  describe('GradeCalculator.vue', () => {
    it('renders grade calculator component', () => {
      const wrapper = mount(GradeCalculator)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Grade Calculator')
    })
  })

  describe('AttendanceCalculator.vue', () => {
    it('renders attendance calculator component', () => {
      const wrapper = mount(AttendanceCalculator)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Attendance Calculator')
    })
  })

  describe('FractionCalculator.vue', () => {
    it('renders fraction calculator component', () => {
      const wrapper = mount(FractionCalculator)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Fraction Calculator')
    })
  })

  describe('AssignmentTracker.vue', () => {
    it('renders assignment tracker component', () => {
      const wrapper = mount(AssignmentTracker)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Assignment Tracker')
    })
  })

  describe('ExamCountdown.vue', () => {
    it('renders exam countdown component', () => {
      const wrapper = mount(ExamCountdown)
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.text()).toContain('Exam Countdown')
    })
  })
})
