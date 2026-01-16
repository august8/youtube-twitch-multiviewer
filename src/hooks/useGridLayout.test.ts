import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useGridLayout } from './useGridLayout'

describe('useGridLayout', () => {
  it('should return 1x1 for 0 videos', () => {
    const { result } = renderHook(() => useGridLayout(0))
    expect(result.current).toEqual({ cols: 1, rows: 1 })
  })

  it('should return 1x1 for 1 video', () => {
    const { result } = renderHook(() => useGridLayout(1))
    expect(result.current).toEqual({ cols: 1, rows: 1 })
  })

  it('should return 2x1 for 2 videos', () => {
    const { result } = renderHook(() => useGridLayout(2))
    expect(result.current).toEqual({ cols: 2, rows: 1 })
  })

  it('should return 2x2 for 3 videos', () => {
    const { result } = renderHook(() => useGridLayout(3))
    expect(result.current).toEqual({ cols: 2, rows: 2 })
  })

  it('should return 2x2 for 4 videos', () => {
    const { result } = renderHook(() => useGridLayout(4))
    expect(result.current).toEqual({ cols: 2, rows: 2 })
  })

  it('should return 3x2 for 5 videos', () => {
    const { result } = renderHook(() => useGridLayout(5))
    expect(result.current).toEqual({ cols: 3, rows: 2 })
  })

  it('should return 3x2 for 6 videos', () => {
    const { result } = renderHook(() => useGridLayout(6))
    expect(result.current).toEqual({ cols: 3, rows: 2 })
  })

  it('should return 3x3 for 9 videos', () => {
    const { result } = renderHook(() => useGridLayout(9))
    expect(result.current).toEqual({ cols: 3, rows: 3 })
  })

  it('should return 4x3 for 10 videos', () => {
    const { result } = renderHook(() => useGridLayout(10))
    expect(result.current).toEqual({ cols: 4, rows: 3 })
  })
})
