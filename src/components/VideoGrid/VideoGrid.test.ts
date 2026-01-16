import { describe, it, expect } from 'vitest'
import { getLayoutStyle } from './VideoGrid'

describe('getLayoutStyle', () => {
  describe('horizontal layout', () => {
    it('should create horizontal grid with multiple videos', () => {
      const style = getLayoutStyle('horizontal', 3, 2, 2)
      expect(style.gridTemplateColumns).toBe('repeat(3, 1fr)')
      expect(style.gridTemplateRows).toBe('1fr')
    })

    it('should work with single video', () => {
      const style = getLayoutStyle('horizontal', 1, 1, 1)
      expect(style.gridTemplateColumns).toBe('repeat(1, 1fr)')
      expect(style.gridTemplateRows).toBe('1fr')
    })
  })

  describe('vertical layout', () => {
    it('should create vertical grid with multiple videos', () => {
      const style = getLayoutStyle('vertical', 3, 2, 2)
      expect(style.gridTemplateColumns).toBe('1fr')
      expect(style.gridTemplateRows).toBe('repeat(3, 1fr)')
    })

    it('should work with single video', () => {
      const style = getLayoutStyle('vertical', 1, 1, 1)
      expect(style.gridTemplateColumns).toBe('1fr')
      expect(style.gridTemplateRows).toBe('repeat(1, 1fr)')
    })
  })

  describe('focus layout', () => {
    it('should return 1x1 grid for single video', () => {
      const style = getLayoutStyle('focus', 1, 1, 1)
      expect(style.gridTemplateColumns).toBe('1fr')
      expect(style.gridTemplateRows).toBe('1fr')
    })

    it('should return 1x1 grid for zero videos', () => {
      const style = getLayoutStyle('focus', 0, 1, 1)
      expect(style.gridTemplateColumns).toBe('1fr')
      expect(style.gridTemplateRows).toBe('1fr')
    })

    it('should create 7:3 ratio with sub-video rows for multiple videos', () => {
      const style = getLayoutStyle('focus', 3, 2, 2)
      expect(style.gridTemplateColumns).toBe('7fr 3fr')
      expect(style.gridTemplateRows).toBe('repeat(2, 1fr)')
    })

    it('should calculate correct sub-rows for 5 videos', () => {
      const style = getLayoutStyle('focus', 5, 3, 2)
      expect(style.gridTemplateColumns).toBe('7fr 3fr')
      expect(style.gridTemplateRows).toBe('repeat(4, 1fr)')
    })
  })

  describe('grid layout', () => {
    it('should use provided cols and rows', () => {
      const style = getLayoutStyle('grid', 4, 2, 2)
      expect(style.gridTemplateColumns).toBe('repeat(2, 1fr)')
      expect(style.gridTemplateRows).toBe('repeat(2, 1fr)')
    })

    it('should handle different col/row combinations', () => {
      const style = getLayoutStyle('grid', 6, 3, 2)
      expect(style.gridTemplateColumns).toBe('repeat(3, 1fr)')
      expect(style.gridTemplateRows).toBe('repeat(2, 1fr)')
    })

    it('should use grid layout as default for unknown mode', () => {
      // @ts-expect-error Testing invalid layout mode
      const style = getLayoutStyle('unknown', 4, 2, 2)
      expect(style.gridTemplateColumns).toBe('repeat(2, 1fr)')
      expect(style.gridTemplateRows).toBe('repeat(2, 1fr)')
    })
  })
})
