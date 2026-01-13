export type LayoutMode = 'grid' | 'focus' | 'horizontal' | 'vertical'

export interface VideoItem {
  id: string
  videoId: string
  platform: 'youtube' | 'twitch'
  twitchType?: 'channel' | 'vod'
  isLive: boolean
  isChatVisible: boolean
  isMuted: boolean
}

export interface VideoState {
  videos: VideoItem[]
  videoOrder: Record<string, number>
  isWelcomeVisible: boolean
  isModalOpen: boolean
  ytApiReady: boolean
  layoutMode: LayoutMode

  addVideo: (video: Omit<VideoItem, 'id' | 'isChatVisible' | 'isMuted'>) => void
  removeVideo: (id: string) => void
  resetVideos: () => void
  toggleChat: (id: string) => void
  toggleMute: (id: string) => void
  setYtApiReady: (ready: boolean) => void
  setModalOpen: (open: boolean) => void
  setWelcomeVisible: (visible: boolean) => void
  setLayoutMode: (mode: LayoutMode) => void
  startViewing: () => void
  loadVideosFromUrl: (videos: Omit<VideoItem, 'id' | 'isChatVisible' | 'isMuted'>[]) => void
  reorderVideos: (activeId: string, overId: string) => void
  getOrderedVideos: () => VideoItem[]
}
