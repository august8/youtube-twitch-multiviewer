import { create } from 'zustand'
import type { VideoState, Locale } from '@/types/video'

function getInitialLocale(): Locale {
  const browserLang = navigator.language.toLowerCase()
  return browserLang.startsWith('ja') ? 'ja' : 'en'
}

export const useVideoStore = create<VideoState>((set, get) => ({
  videos: [],
  videoOrder: {},
  isWelcomeVisible: true,
  isModalOpen: false,
  ytApiReady: false,
  twitchApiReady: false,
  layoutMode: 'grid',
  themeMode: 'system',
  locale: getInitialLocale(),
  chatOnlySlotWidth: 300,

  addVideo: (video) =>
    set((state) => {
      const id = `${video.videoId}-${Date.now()}`
      const maxOrder = Math.max(0, ...Object.values(state.videoOrder))
      return {
        videos: [
          ...state.videos,
          {
            ...video,
            id,
            isChatVisible: false,
            isVideoVisible: true,
            isMuted: false,
          },
        ],
        videoOrder: {
          ...state.videoOrder,
          [id]: maxOrder + 1,
        },
      }
    }),

  removeVideo: (id) =>
    set((state) => {
      const newOrder = { ...state.videoOrder }
      delete newOrder[id]
      return {
        videos: state.videos.filter((v) => v.id !== id),
        videoOrder: newOrder,
      }
    }),

  resetVideos: () => set({ videos: [], videoOrder: {} }),

  toggleChat: (id) =>
    set((state) => ({
      videos: state.videos.map((v) =>
        v.id === id ? { ...v, isChatVisible: !v.isChatVisible } : v
      ),
    })),

  toggleVideo: (id) =>
    set((state) => ({
      videos: state.videos.map((v) =>
        v.id === id ? { ...v, isVideoVisible: !v.isVideoVisible } : v
      ),
    })),

  setMuted: (id, muted) =>
    set((state) => ({
      videos: state.videos.map((v) => (v.id === id ? { ...v, isMuted: muted } : v)),
    })),

  setYtApiReady: (ready) => set({ ytApiReady: ready }),

  setTwitchApiReady: (ready) => set({ twitchApiReady: ready }),

  setModalOpen: (open) => set({ isModalOpen: open }),

  setWelcomeVisible: (visible) => set({ isWelcomeVisible: visible }),

  setLayoutMode: (mode) => set({ layoutMode: mode }),

  setThemeMode: (mode) => set({ themeMode: mode }),

  setLocale: (locale) => set({ locale }),

  setChatOnlySlotWidth: (width) => set({ chatOnlySlotWidth: width }),

  startViewing: () => set({ isWelcomeVisible: false, isModalOpen: true }),

  loadVideosFromUrl: (videoData) => {
    const videos = videoData.map((video, index) => ({
      ...video,
      id: `${video.videoId}-${Date.now()}-${index}`,
      isChatVisible: false,
      isVideoVisible: true,
      isMuted: false,
    }))
    const videoOrder: Record<string, number> = {}
    videos.forEach((v, i) => {
      videoOrder[v.id] = i + 1
    })
    return set({
      videos,
      videoOrder,
      isWelcomeVisible: false,
    })
  },

  reorderVideos: (activeId, overId) =>
    set((state) => {
      const activeOrder = state.videoOrder[activeId]
      const overOrder = state.videoOrder[overId]
      if (activeOrder === undefined || overOrder === undefined) return state
      return {
        videoOrder: {
          ...state.videoOrder,
          [activeId]: overOrder,
          [overId]: activeOrder,
        },
      }
    }),

  getOrderedVideos: () => {
    const state = get()
    return [...state.videos].sort(
      (a, b) => (state.videoOrder[a.id] ?? 0) - (state.videoOrder[b.id] ?? 0)
    )
  },
}))
