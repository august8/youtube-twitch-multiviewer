export type Platform = 'youtube' | 'twitch' | null

export interface TwitchInfo {
  type: 'channel' | 'vod'
  id: string
}

export function detectPlatform(url: string): Platform {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube'
  }
  if (url.includes('twitch.tv')) {
    return 'twitch'
  }
  return null
}

export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^&\s?]+)/,
    /(?:youtube\.com\/live\/)([^&\s?]+)/,
    /(?:youtube\.com\/embed\/)([^&\s?]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function extractTwitchInfo(url: string): TwitchInfo | null {
  const vodPattern = /(?:twitch\.tv\/videos\/)(\d+)/
  const vodMatch = url.match(vodPattern)
  if (vodMatch) {
    return { type: 'vod', id: vodMatch[1] }
  }

  const channelPatterns = [
    /(?:twitch\.tv\/)([^\/\s?]+)/,
    /(?:www\.twitch\.tv\/)([^\/\s?]+)/,
  ]

  for (const pattern of channelPatterns) {
    const match = url.match(pattern)
    if (match && match[1] !== 'videos') {
      return { type: 'channel', id: match[1] }
    }
  }

  return null
}

export function parseVideoUrl(url: string) {
  const platform = detectPlatform(url)

  if (platform === 'youtube') {
    const videoId = extractYouTubeVideoId(url)
    return videoId ? { platform, videoId, twitchType: undefined } : null
  }

  if (platform === 'twitch') {
    const info = extractTwitchInfo(url)
    return info ? { platform, videoId: info.id, twitchType: info.type } : null
  }

  return null
}
