import { describe, it, expect } from 'vitest'
import { getLayoutStyle } from './VideoGrid'
import type { VideoItem } from '@/types/video'

function makeVideo(overrides: Partial<VideoItem> = {}): VideoItem {
  return {
    id: overrides.id ?? `id-${Math.random().toString(36).slice(2)}`,
    videoId: overrides.videoId ?? 'vid',
    platform: overrides.platform ?? 'youtube',
    isLive: overrides.isLive ?? true,
    isChatVisible: overrides.isChatVisible ?? false,
    isVideoVisible: overrides.isVideoVisible ?? true,
    isMuted: overrides.isMuted ?? false,
    twitchType: overrides.twitchType,
  }
}

function visibleVideos(n: number): VideoItem[] {
  return Array.from({ length: n }, (_, i) => makeVideo({ id: `v${i}` }))
}

describe('getLayoutStyle', () => {
  describe('horizontal layout', () => {
    it('should create horizontal grid with multiple videos', () => {
      const style = getLayoutStyle('horizontal', visibleVideos(3), 2, 2)
      expect(style.gridTemplateColumns).toBe('repeat(3, 1fr)')
      expect(style.gridTemplateRows).toBe('1fr')
    })

    it('should work with single video', () => {
      const style = getLayoutStyle('horizontal', visibleVideos(1), 1, 1)
      expect(style.gridTemplateColumns).toBe('repeat(1, 1fr)')
      expect(style.gridTemplateRows).toBe('1fr')
    })

    it('should shrink chat-only slot to 0.5fr', () => {
      const videos = [
        makeVideo({ id: 'a' }),
        makeVideo({ id: 'b', isVideoVisible: false, isChatVisible: true }),
        makeVideo({ id: 'c' }),
      ]
      const style = getLayoutStyle('horizontal', videos, 2, 2)
      expect(style.gridTemplateColumns).toBe('1fr 0.5fr 1fr')
    })

    it('should collapse fully hidden slot to auto', () => {
      const videos = [
        makeVideo({ id: 'a' }),
        makeVideo({ id: 'b' }),
        makeVideo({ id: 'c', isVideoVisible: false, isChatVisible: false }),
      ]
      const style = getLayoutStyle('horizontal', videos, 2, 2)
      expect(style.gridTemplateColumns).toBe('1fr 1fr auto')
    })

    it('should treat hidden chat on non-live as fully hidden', () => {
      const videos = [
        makeVideo({ id: 'a' }),
        makeVideo({
          id: 'b',
          isVideoVisible: false,
          isChatVisible: true,
          isLive: false,
        }),
      ]
      const style = getLayoutStyle('horizontal', videos, 2, 2)
      expect(style.gridTemplateColumns).toBe('1fr auto')
    })
  })

  describe('vertical layout', () => {
    it('should create vertical grid with multiple videos', () => {
      const style = getLayoutStyle('vertical', visibleVideos(3), 2, 2)
      expect(style.gridTemplateColumns).toBe('1fr')
      expect(style.gridTemplateRows).toBe('repeat(3, 1fr)')
    })

    it('should work with single video', () => {
      const style = getLayoutStyle('vertical', visibleVideos(1), 1, 1)
      expect(style.gridTemplateColumns).toBe('1fr')
      expect(style.gridTemplateRows).toBe('repeat(1, 1fr)')
    })

    it('should shrink hidden video rows', () => {
      const videos = [
        makeVideo({ id: 'a' }),
        makeVideo({ id: 'b', isVideoVisible: false, isChatVisible: true }),
        makeVideo({ id: 'c', isVideoVisible: false, isChatVisible: false }),
      ]
      const style = getLayoutStyle('vertical', videos, 2, 2)
      expect(style.gridTemplateRows).toBe('1fr 0.5fr auto')
    })
  })

  describe('focus layout', () => {
    it('should return 1x1 grid for single video', () => {
      const style = getLayoutStyle('focus', visibleVideos(1), 1, 1, 'v0')
      expect(style.gridTemplateColumns).toBe('1fr')
      expect(style.gridTemplateRows).toBe('1fr')
    })

    it('should return 1x1 grid for zero videos', () => {
      const style = getLayoutStyle('focus', [], 1, 1)
      expect(style.gridTemplateColumns).toBe('1fr')
      expect(style.gridTemplateRows).toBe('1fr')
    })

    it('should create 7:3 ratio with sub-video rows for multiple videos', () => {
      const videos = visibleVideos(3)
      const style = getLayoutStyle('focus', videos, 2, 2, videos[0].id)
      expect(style.gridTemplateColumns).toBe('7fr 3fr')
      expect(style.gridTemplateRows).toBe('repeat(2, 1fr)')
    })

    it('should calculate correct sub-rows for 5 videos', () => {
      const videos = visibleVideos(5)
      const style = getLayoutStyle('focus', videos, 3, 2, videos[0].id)
      expect(style.gridTemplateColumns).toBe('7fr 3fr')
      expect(style.gridTemplateRows).toBe('repeat(4, 1fr)')
    })

    it('should shrink main column when main video is hidden', () => {
      const videos = [
        makeVideo({ id: 'main', isVideoVisible: false }),
        makeVideo({ id: 'sub1' }),
        makeVideo({ id: 'sub2' }),
      ]
      const style = getLayoutStyle('focus', videos, 2, 2, 'main')
      expect(style.gridTemplateColumns).toBe('auto 1fr')
      expect(style.gridTemplateRows).toBe('repeat(2, 1fr)')
    })

    it('should shrink sub row when sub video is hidden', () => {
      const videos = [
        makeVideo({ id: 'main' }),
        makeVideo({ id: 'sub1', isVideoVisible: false, isChatVisible: true }),
        makeVideo({ id: 'sub2' }),
      ]
      const style = getLayoutStyle('focus', videos, 2, 2, 'main')
      expect(style.gridTemplateColumns).toBe('7fr 3fr')
      expect(style.gridTemplateRows).toBe('0.5fr 1fr')
    })
  })

  describe('grid layout', () => {
    it('should use provided cols and rows', () => {
      const style = getLayoutStyle('grid', visibleVideos(4), 2, 2)
      expect(style.gridTemplateColumns).toBe('repeat(2, 1fr)')
      expect(style.gridTemplateRows).toBe('repeat(2, 1fr)')
    })

    it('should handle different col/row combinations', () => {
      const style = getLayoutStyle('grid', visibleVideos(6), 3, 2)
      expect(style.gridTemplateColumns).toBe('repeat(3, 1fr)')
      expect(style.gridTemplateRows).toBe('repeat(2, 1fr)')
    })

    it('should ignore visibility (grid mode is not optimized)', () => {
      const videos = [
        makeVideo({ id: 'a', isVideoVisible: false, isChatVisible: false }),
        makeVideo({ id: 'b' }),
        makeVideo({ id: 'c' }),
        makeVideo({ id: 'd' }),
      ]
      const style = getLayoutStyle('grid', videos, 2, 2)
      expect(style.gridTemplateColumns).toBe('repeat(2, 1fr)')
      expect(style.gridTemplateRows).toBe('repeat(2, 1fr)')
    })

    it('should use grid layout as default for unknown mode', () => {
      // @ts-expect-error Testing invalid layout mode
      const style = getLayoutStyle('unknown', visibleVideos(4), 2, 2)
      expect(style.gridTemplateColumns).toBe('repeat(2, 1fr)')
      expect(style.gridTemplateRows).toBe('repeat(2, 1fr)')
    })
  })
})
