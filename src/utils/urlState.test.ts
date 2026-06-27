import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  encodeVideosToUrl,
  decodeVideosFromUrl,
  getShareableUrl,
  syncVideosToUrl,
  saveVideosToStorage,
  loadVideosFromStorage,
  clearVideosFromStorage,
} from './urlState'
import type { VideoItem } from '@/types/video'

const STORAGE_KEY = 'multiviewer:videos'

const sampleVideos: VideoItem[] = [
  {
    id: '1',
    videoId: 'abc123',
    platform: 'youtube',
    isLive: true,
    isChatVisible: false,
    isVideoVisible: true,
    isMuted: false,
  },
  {
    id: '2',
    videoId: 'streamer',
    platform: 'twitch',
    twitchType: 'channel',
    isLive: true,
    isChatVisible: false,
    isVideoVisible: true,
    isMuted: false,
  },
]

describe('encodeVideosToUrl', () => {
  it('should encode YouTube live video', () => {
    const videos: VideoItem[] = [
      {
        id: '1',
        videoId: 'abc123',
        platform: 'youtube',
        isLive: true,
        isChatVisible: false,
        isVideoVisible: true,
        isMuted: false,
      },
    ]
    expect(encodeVideosToUrl(videos)).toBe('yt:abc123:L')
  })

  it('should encode YouTube archive video', () => {
    const videos: VideoItem[] = [
      {
        id: '1',
        videoId: 'abc123',
        platform: 'youtube',
        isLive: false,
        isChatVisible: false,
        isVideoVisible: true,
        isMuted: false,
      },
    ]
    expect(encodeVideosToUrl(videos)).toBe('yt:abc123:A')
  })

  it('should encode Twitch channel', () => {
    const videos: VideoItem[] = [
      {
        id: '1',
        videoId: 'streamer',
        platform: 'twitch',
        twitchType: 'channel',
        isLive: true,
        isChatVisible: false,
        isVideoVisible: true,
        isMuted: false,
      },
    ]
    expect(encodeVideosToUrl(videos)).toBe('tw:streamer:c')
  })

  it('should encode Twitch VOD', () => {
    const videos: VideoItem[] = [
      {
        id: '1',
        videoId: '123456',
        platform: 'twitch',
        twitchType: 'vod',
        isLive: false,
        isChatVisible: false,
        isVideoVisible: true,
        isMuted: false,
      },
    ]
    expect(encodeVideosToUrl(videos)).toBe('tw:123456:v')
  })

  it('should encode multiple videos', () => {
    const videos: VideoItem[] = [
      {
        id: '1',
        videoId: 'yt123',
        platform: 'youtube',
        isLive: true,
        isChatVisible: false,
        isVideoVisible: true,
        isMuted: false,
      },
      {
        id: '2',
        videoId: 'streamer',
        platform: 'twitch',
        twitchType: 'channel',
        isLive: true,
        isChatVisible: false,
        isVideoVisible: true,
        isMuted: false,
      },
    ]
    expect(encodeVideosToUrl(videos)).toBe('yt:yt123:L,tw:streamer:c')
  })

  it('should return empty string for empty array', () => {
    expect(encodeVideosToUrl([])).toBe('')
  })
})

describe('decodeVideosFromUrl', () => {
  it('should decode YouTube live video', () => {
    const result = decodeVideosFromUrl('yt:abc123:L')
    expect(result).toEqual([
      {
        platform: 'youtube',
        videoId: 'abc123',
        isLive: true,
        twitchType: undefined,
      },
    ])
  })

  it('should decode YouTube archive video', () => {
    const result = decodeVideosFromUrl('yt:abc123:A')
    expect(result).toEqual([
      {
        platform: 'youtube',
        videoId: 'abc123',
        isLive: false,
        twitchType: undefined,
      },
    ])
  })

  it('should decode Twitch channel', () => {
    const result = decodeVideosFromUrl('tw:streamer:c')
    expect(result).toEqual([
      {
        platform: 'twitch',
        videoId: 'streamer',
        isLive: true,
        twitchType: 'channel',
      },
    ])
  })

  it('should decode Twitch VOD', () => {
    const result = decodeVideosFromUrl('tw:123456:v')
    expect(result).toEqual([
      {
        platform: 'twitch',
        videoId: '123456',
        isLive: false,
        twitchType: 'vod',
      },
    ])
  })

  it('should decode multiple videos', () => {
    const result = decodeVideosFromUrl('yt:abc:L,tw:xyz:c')
    expect(result).toHaveLength(2)
    expect(result[0].platform).toBe('youtube')
    expect(result[1].platform).toBe('twitch')
  })

  it('should return empty array for empty string', () => {
    expect(decodeVideosFromUrl('')).toEqual([])
  })

  it('should skip invalid parts', () => {
    const result = decodeVideosFromUrl('yt:abc:L,invalid,tw:xyz:c')
    expect(result).toHaveLength(2)
  })
})

describe('getShareableUrl', () => {
  beforeEach(() => {
    // Mock window.location
    vi.stubGlobal('location', {
      origin: 'http://localhost:3000',
      pathname: '/',
      href: 'http://localhost:3000/',
      search: '',
    })
  })

  it('should generate shareable URL with videos', () => {
    const videos: VideoItem[] = [
      {
        id: '1',
        videoId: 'abc123',
        platform: 'youtube',
        isLive: true,
        isChatVisible: false,
        isVideoVisible: true,
        isMuted: false,
      },
    ]
    const url = getShareableUrl(videos)
    expect(url).toContain('v=yt%3Aabc123%3AL')
  })

  it('should return base URL for empty videos', () => {
    const url = getShareableUrl([])
    expect(url).toBe('http://localhost:3000/')
  })
})

describe('saveVideosToStorage / loadVideosFromStorage', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    window.localStorage.clear()
  })

  it('should roundtrip videos through localStorage', () => {
    saveVideosToStorage(sampleVideos)
    const loaded = loadVideosFromStorage()
    expect(loaded).toHaveLength(2)
    expect(loaded[0].videoId).toBe('abc123')
    expect(loaded[0].platform).toBe('youtube')
    expect(loaded[1].videoId).toBe('streamer')
    expect(loaded[1].twitchType).toBe('channel')
  })

  it('should remove storage key when saving empty array', () => {
    window.localStorage.setItem(STORAGE_KEY, 'yt:abc:L')
    saveVideosToStorage([])
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('should return empty array when no data stored', () => {
    expect(loadVideosFromStorage()).toEqual([])
  })

  it('should return empty array for malformed stored data', () => {
    window.localStorage.setItem(STORAGE_KEY, 'totally-broken-payload')
    expect(loadVideosFromStorage()).toEqual([])
  })

  it('clearVideosFromStorage removes the key', () => {
    saveVideosToStorage(sampleVideos)
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull()
    clearVideosFromStorage()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})

describe('syncVideosToUrl', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    window.history.replaceState(null, '', 'http://localhost:3000/')
  })

  it('should write ?v=... to the current URL', () => {
    syncVideosToUrl(sampleVideos)
    const params = new URLSearchParams(window.location.search)
    expect(params.get('v')).toBe('yt:abc123:L,tw:streamer:c')
  })

  it('should remove ?v param when given empty array', () => {
    window.history.replaceState(null, '', 'http://localhost:3000/?v=yt:abc:L')
    syncVideosToUrl([])
    expect(new URLSearchParams(window.location.search).get('v')).toBeNull()
  })

  it('should preserve other query parameters', () => {
    window.history.replaceState(null, '', 'http://localhost:3000/?lang=ja')
    syncVideosToUrl(sampleVideos)
    const params = new URLSearchParams(window.location.search)
    expect(params.get('lang')).toBe('ja')
    expect(params.get('v')).toBe('yt:abc123:L,tw:streamer:c')
  })
})

describe('encode/decode roundtrip', () => {
  it('should roundtrip YouTube videos correctly', () => {
    const original: VideoItem[] = [
      {
        id: '1',
        videoId: 'test123',
        platform: 'youtube',
        isLive: true,
        isChatVisible: false,
        isVideoVisible: true,
        isMuted: false,
      },
    ]
    const encoded = encodeVideosToUrl(original)
    const decoded = decodeVideosFromUrl(encoded)

    expect(decoded[0].platform).toBe(original[0].platform)
    expect(decoded[0].videoId).toBe(original[0].videoId)
    expect(decoded[0].isLive).toBe(original[0].isLive)
  })

  it('should roundtrip Twitch videos correctly', () => {
    const original: VideoItem[] = [
      {
        id: '1',
        videoId: 'streamer',
        platform: 'twitch',
        twitchType: 'channel',
        isLive: true,
        isChatVisible: false,
        isVideoVisible: true,
        isMuted: false,
      },
    ]
    const encoded = encodeVideosToUrl(original)
    const decoded = decodeVideosFromUrl(encoded)

    expect(decoded[0].platform).toBe(original[0].platform)
    expect(decoded[0].videoId).toBe(original[0].videoId)
    expect(decoded[0].twitchType).toBe(original[0].twitchType)
  })
})
