import { describe, it, expect, vi, beforeEach } from 'vitest'
import { encodeVideosToUrl, decodeVideosFromUrl, getShareableUrl } from './urlState'
import type { VideoItem } from '@/types/video'

describe('encodeVideosToUrl', () => {
  it('should encode YouTube live video', () => {
    const videos: VideoItem[] = [
      {
        id: '1',
        videoId: 'abc123',
        platform: 'youtube',
        isLive: true,
        isChatVisible: false,
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
        isMuted: false,
      },
      {
        id: '2',
        videoId: 'streamer',
        platform: 'twitch',
        twitchType: 'channel',
        isLive: true,
        isChatVisible: false,
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

describe('encode/decode roundtrip', () => {
  it('should roundtrip YouTube videos correctly', () => {
    const original: VideoItem[] = [
      {
        id: '1',
        videoId: 'test123',
        platform: 'youtube',
        isLive: true,
        isChatVisible: false,
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
