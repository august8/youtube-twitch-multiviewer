import { describe, it, expect } from 'vitest'
import {
  detectPlatform,
  extractYouTubeVideoId,
  extractTwitchInfo,
  parseVideoUrl,
} from './urlParser'

describe('detectPlatform', () => {
  it('should detect YouTube from youtube.com', () => {
    expect(detectPlatform('https://www.youtube.com/watch?v=abc123')).toBe('youtube')
  })

  it('should detect YouTube from youtu.be', () => {
    expect(detectPlatform('https://youtu.be/abc123')).toBe('youtube')
  })

  it('should detect Twitch', () => {
    expect(detectPlatform('https://www.twitch.tv/channelname')).toBe('twitch')
  })

  it('should return null for unknown URLs', () => {
    expect(detectPlatform('https://example.com')).toBe(null)
    expect(detectPlatform('')).toBe(null)
  })
})

describe('extractYouTubeVideoId', () => {
  it('should extract ID from standard watch URL', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      'dQw4w9WgXcQ'
    )
  })

  it('should extract ID from watch URL with extra params', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=abc123&t=120')).toBe('abc123')
  })

  it('should extract ID from short URL', () => {
    expect(extractYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('should extract ID from live URL', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/live/abc123')).toBe('abc123')
  })

  it('should extract ID from embed URL', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/embed/abc123')).toBe('abc123')
  })

  it('should return null for invalid URLs', () => {
    expect(extractYouTubeVideoId('https://youtube.com/')).toBe(null)
    expect(extractYouTubeVideoId('https://example.com')).toBe(null)
  })
})

describe('extractTwitchInfo', () => {
  it('should extract channel info', () => {
    expect(extractTwitchInfo('https://www.twitch.tv/streamer_name')).toEqual({
      type: 'channel',
      id: 'streamer_name',
    })
  })

  it('should extract VOD info', () => {
    expect(extractTwitchInfo('https://www.twitch.tv/videos/123456789')).toEqual({
      type: 'vod',
      id: '123456789',
    })
  })

  it('should return null for invalid URLs', () => {
    expect(extractTwitchInfo('https://example.com')).toBe(null)
  })
})

describe('parseVideoUrl', () => {
  it('should parse YouTube URL', () => {
    expect(parseVideoUrl('https://www.youtube.com/watch?v=abc123')).toEqual({
      platform: 'youtube',
      videoId: 'abc123',
      twitchType: undefined,
    })
  })

  it('should parse Twitch channel URL', () => {
    expect(parseVideoUrl('https://www.twitch.tv/streamer')).toEqual({
      platform: 'twitch',
      videoId: 'streamer',
      twitchType: 'channel',
    })
  })

  it('should parse Twitch VOD URL', () => {
    expect(parseVideoUrl('https://www.twitch.tv/videos/123456')).toEqual({
      platform: 'twitch',
      videoId: '123456',
      twitchType: 'vod',
    })
  })

  it('should return null for invalid URL', () => {
    expect(parseVideoUrl('https://example.com')).toBe(null)
    expect(parseVideoUrl('')).toBe(null)
  })
})
