import type { VideoItem } from '@/types/video'

type VideoData = Omit<VideoItem, 'id' | 'isChatVisible' | 'isVideoVisible' | 'isMuted'>

const STORAGE_KEY = 'multiviewer:videos'

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
 * Replace the current URL's `v` query param to mirror the given videos.
 * Uses history.replaceState so navigation history is not polluted.
 */
export function syncVideosToUrl(videos: VideoItem[]): void {
  const url = new URL(window.location.href)
  const encoded = encodeVideosToUrl(videos)
  if (encoded) {
    url.searchParams.set('v', encoded)
  } else {
    url.searchParams.delete('v')
  }
  window.history.replaceState(null, '', url.toString())
}

/**
 * Persist videos to localStorage as a backup against history navigation loss.
 * Empty arrays remove the key so stale data does not resurface.
 */
export function saveVideosToStorage(videos: VideoItem[]): void {
  try {
    const encoded = encodeVideosToUrl(videos)
    if (encoded) {
      window.localStorage.setItem(STORAGE_KEY, encoded)
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // localStorage may be unavailable (private mode, quota) — ignore silently
  }
}

/**
 * Load videos previously saved to localStorage.
 */
export function loadVideosFromStorage(): VideoData[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? decodeVideosFromUrl(stored) : []
  } catch {
    return []
  }
}

/**
 * Remove persisted videos from localStorage.
 */
export function clearVideosFromStorage(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
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
