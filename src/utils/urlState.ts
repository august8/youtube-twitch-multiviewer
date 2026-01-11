import type { VideoItem } from '@/types/video'

type VideoData = Omit<VideoItem, 'id' | 'isChatVisible' | 'isMuted'>

/**
 * Encode videos to URL query parameter
 * Format: platform:videoId:type (comma separated)
 * Types: L=live, A=archive for YouTube, c=channel, v=vod for Twitch
 */
export function encodeVideosToUrl(videos: VideoItem[]): string {
  if (videos.length === 0) return ''

  const encoded = videos.map((video) => {
    if (video.platform === 'youtube') {
      const type = video.isLive ? 'L' : 'A'
      return `yt:${video.videoId}:${type}`
    } else {
      const type = video.twitchType === 'channel' ? 'c' : 'v'
      return `tw:${video.videoId}:${type}`
    }
  })

  return encoded.join(',')
}

/**
 * Decode videos from URL query parameter
 */
export function decodeVideosFromUrl(param: string): VideoData[] {
  if (!param) return []

  const videos: VideoData[] = []
  const parts = param.split(',')

  for (const part of parts) {
    const [platform, videoId, type] = part.split(':')
    if (!platform || !videoId || !type) continue

    if (platform === 'yt') {
      videos.push({
        platform: 'youtube',
        videoId,
        isLive: type === 'L',
        twitchType: undefined,
      })
    } else if (platform === 'tw') {
      const twitchType = type === 'c' ? 'channel' : 'vod'
      videos.push({
        platform: 'twitch',
        videoId,
        isLive: twitchType === 'channel',
        twitchType,
      })
    }
  }

  return videos
}

/**
 * Get shareable URL with current videos
 */
export function getShareableUrl(videos: VideoItem[]): string {
  const encoded = encodeVideosToUrl(videos)
  if (!encoded) return window.location.origin + window.location.pathname

  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set('v', encoded)
  return url.toString()
}

/**
 * Read videos from current URL
 */
export function getVideosFromCurrentUrl(): VideoData[] {
  const params = new URLSearchParams(window.location.search)
  const videoParam = params.get('v')
  return videoParam ? decodeVideosFromUrl(videoParam) : []
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
