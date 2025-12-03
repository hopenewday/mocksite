import { describe, it, expect } from 'vitest';
import { formatSize } from './formatUtils';

describe('formatSize', () => {
  it('formats 0 bytes correctly', () => {
    expect(formatSize(0)).toBe('0 B');
  });

  it('formats bytes to KB correctly', () => {
    expect(formatSize(1024)).toBe('1 KB');
    expect(formatSize(1536)).toBe('1.5 KB');
  });

  it('formats bytes to MB correctly', () => {
    expect(formatSize(1024 * 1024)).toBe('1 MB');
    expect(formatSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
  });

  it('formats bytes to GB correctly', () => {
    expect(formatSize(1024 * 1024 * 1024)).toBe('1 GB');
  });

  it('formats bytes to TB correctly (extended unit)', () => {
    expect(formatSize(1024 * 1024 * 1024 * 1024)).toBe('1 TB');
  });

  it('handles negative bytes gracefully', () => {
    expect(formatSize(-100)).toBe('0 B');
  });

  it('handles very large numbers gracefully', () => {
      // YB is 1024^8
      const YB = Math.pow(1024, 8);
      expect(formatSize(YB)).toBe('1 YB');
      
      // Beyond YB, it should still use YB or clamp safely (logic dependent)
      // With current logic: index = Math.min(i, sizes.length - 1)
      // sizes has 9 elements (0-8), so max index is 8 (YB)
      const beyondYB = YB * 1024;
      expect(formatSize(beyondYB)).toBe('1024 YB');
  });
});
