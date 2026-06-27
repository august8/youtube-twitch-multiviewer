export type LayoutMode = 'grid' | 'focus' | 'horizontal' | 'vertical'
export type ThemeMode = 'system' | 'light' | 'dark'
export type Locale = 'ja' | 'en'

export interface VideoItem {
  id: string
  videoId: string
  platform: 'youtube' | 'twitch'
  twitchType?: 'channel' | 'vod'
  isLive: boolean
  isChatVisible: boolean
  isVideoVisible: boolean
  isMuted: boolean
}

export interface VideoState {
  videos: VideoItem[]
  videoOrder: Record<string, number>
  isWelcomeVisible: boolean
  isModalOpen: boolean
  ytApiReady: boolean
  twitchApiReady: boolean
  layoutMode: LayoutMode
  themeMode: ThemeMode
  locale: Locale
  chatOnlySlotWidth: number

  addVideo: (video: Omit<VideoItem, 'id' | 'isChatVisible' | 'isVideoVisible' | 'isMuted'>) => void
  removeVideo: (id: string) => void
  resetVideos: () => void
  toggleChat: (id: string) => void
  toggleVideo: (id: string) => void
  setMuted: (id: string, muted: boolean) => void
  setYtApiReady: (ready: boolean) => void
  setTwitchApiReady: (ready: boolean) => void
  setModalOpen: (open: boolean) => void
  setWelcomeVisible: (visible: boolean) => void
  setLayoutMode: (mode: LayoutMode) => void
  setThemeMode: (mode: ThemeMode) => void
  setLocale: (locale: Locale) => void
  setChatOnlySlotWidth: (width: number) => void
  startViewing: () => void
  loadVideosFromUrl: (
    videos: Omit<VideoItem, 'id' | 'isChatVisible' | 'isVideoVisible' | 'isMuted'>[]
  ) => void
  reorderVideos: (activeId: string, overId: string) => void
  getOrderedVideos: () => VideoItem[]
}
