import { create } from 'zustand'
import type { VideoState } from '@/types/video'

export const useVideoStore = create<VideoState>((set) => ({
  videos: [],
  isWelcomeVisible: true,
  isModalOpen: false,
  ytApiReady: false,

  addVideo: (video) =>
    set((state) => ({
      videos: [
        ...state.videos,
        {
          ...video,
          id: `${video.videoId}-${Date.now()}`,
          isChatVisible: false,
          isMuted: false,
        },
      ],
    })),

  removeVideo: (id) =>
    set((state) => ({
      videos: state.videos.filter((v) => v.id !== id),
    })),

  resetVideos: () => set({ videos: [] }),

  toggleChat: (id) =>
    set((state) => ({
      videos: state.videos.map((v) =>
        v.id === id ? { ...v, isChatVisible: !v.isChatVisible } : v
      ),
    })),

  toggleMute: (id) =>
    set((state) => ({
      videos: state.videos.map((v) => (v.id === id ? { ...v, isMuted: !v.isMuted } : v)),
    })),

  setYtApiReady: (ready) => set({ ytApiReady: ready }),

  setModalOpen: (open) => set({ isModalOpen: open }),

  setWelcomeVisible: (visible) => set({ isWelcomeVisible: visible }),

  startViewing: () => set({ isWelcomeVisible: false, isModalOpen: true }),

  loadVideosFromUrl: (videoData) =>
    set({
      videos: videoData.map((video, index) => ({
        ...video,
        id: `${video.videoId}-${Date.now()}-${index}`,
        isChatVisible: false,
        isMuted: false,
      })),
      isWelcomeVisible: false,
    }),
}))
