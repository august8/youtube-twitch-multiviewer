import { describe, it, expect, beforeEach } from 'vitest'
import { useVideoStore } from './videoStore'

describe('videoStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useVideoStore.setState({
      videos: [],
      videoOrder: {},
      isWelcomeVisible: true,
      isModalOpen: false,
      ytApiReady: false,
      layoutMode: 'grid',
      themeMode: 'system',
    })
  })

  describe('addVideo', () => {
    it('should add a video to the store', () => {
      const { addVideo } = useVideoStore.getState()

      addVideo({
        videoId: 'abc123',
        platform: 'youtube',
        isLive: true,
      })

      const { videos } = useVideoStore.getState()
      expect(videos).toHaveLength(1)
      expect(videos[0].videoId).toBe('abc123')
      expect(videos[0].platform).toBe('youtube')
      expect(videos[0].isLive).toBe(true)
      expect(videos[0].isChatVisible).toBe(false)
      expect(videos[0].isMuted).toBe(false)
    })

    it('should add video to videoOrder', () => {
      const { addVideo } = useVideoStore.getState()

      addVideo({ videoId: 'video1', platform: 'youtube', isLive: true })
      addVideo({ videoId: 'video2', platform: 'twitch', twitchType: 'channel', isLive: true })

      const { videos, videoOrder } = useVideoStore.getState()
      expect(Object.keys(videoOrder)).toHaveLength(2)
      expect(videoOrder[videos[0].id]).toBe(1)
      expect(videoOrder[videos[1].id]).toBe(2)
    })
  })

  describe('removeVideo', () => {
    it('should remove a video from the store', () => {
      const { addVideo, removeVideo } = useVideoStore.getState()

      addVideo({ videoId: 'abc123', platform: 'youtube', isLive: true })
      const { videos } = useVideoStore.getState()
      const videoId = videos[0].id

      removeVideo(videoId)

      const updatedState = useVideoStore.getState()
      expect(updatedState.videos).toHaveLength(0)
      expect(updatedState.videoOrder[videoId]).toBeUndefined()
    })
  })

  describe('resetVideos', () => {
    it('should remove all videos', () => {
      const { addVideo, resetVideos } = useVideoStore.getState()

      addVideo({ videoId: 'video1', platform: 'youtube', isLive: true })
      addVideo({ videoId: 'video2', platform: 'youtube', isLive: true })

      resetVideos()

      const { videos, videoOrder } = useVideoStore.getState()
      expect(videos).toHaveLength(0)
      expect(Object.keys(videoOrder)).toHaveLength(0)
    })
  })

  describe('toggleChat', () => {
    it('should toggle chat visibility', () => {
      const { addVideo, toggleChat } = useVideoStore.getState()

      addVideo({ videoId: 'abc123', platform: 'youtube', isLive: true })
      const { videos } = useVideoStore.getState()
      const videoId = videos[0].id

      expect(videos[0].isChatVisible).toBe(false)

      toggleChat(videoId)
      expect(useVideoStore.getState().videos[0].isChatVisible).toBe(true)

      toggleChat(videoId)
      expect(useVideoStore.getState().videos[0].isChatVisible).toBe(false)
    })
  })

  describe('toggleMute', () => {
    it('should toggle mute state', () => {
      const { addVideo, toggleMute } = useVideoStore.getState()

      addVideo({ videoId: 'abc123', platform: 'youtube', isLive: true })
      const { videos } = useVideoStore.getState()
      const videoId = videos[0].id

      expect(videos[0].isMuted).toBe(false)

      toggleMute(videoId)
      expect(useVideoStore.getState().videos[0].isMuted).toBe(true)

      toggleMute(videoId)
      expect(useVideoStore.getState().videos[0].isMuted).toBe(false)
    })
  })

  describe('setLayoutMode', () => {
    it('should set layout mode', () => {
      const { setLayoutMode } = useVideoStore.getState()

      setLayoutMode('focus')
      expect(useVideoStore.getState().layoutMode).toBe('focus')

      setLayoutMode('horizontal')
      expect(useVideoStore.getState().layoutMode).toBe('horizontal')
    })
  })

  describe('setThemeMode', () => {
    it('should set theme mode', () => {
      const { setThemeMode } = useVideoStore.getState()

      setThemeMode('dark')
      expect(useVideoStore.getState().themeMode).toBe('dark')

      setThemeMode('light')
      expect(useVideoStore.getState().themeMode).toBe('light')

      setThemeMode('system')
      expect(useVideoStore.getState().themeMode).toBe('system')
    })
  })

  describe('reorderVideos', () => {
    it('should swap video order', () => {
      const { addVideo, reorderVideos } = useVideoStore.getState()

      addVideo({ videoId: 'video1', platform: 'youtube', isLive: true })
      addVideo({ videoId: 'video2', platform: 'youtube', isLive: true })

      const { videos, videoOrder: initialOrder } = useVideoStore.getState()
      const id1 = videos[0].id
      const id2 = videos[1].id

      expect(initialOrder[id1]).toBe(1)
      expect(initialOrder[id2]).toBe(2)

      reorderVideos(id1, id2)

      const { videoOrder: newOrder } = useVideoStore.getState()
      expect(newOrder[id1]).toBe(2)
      expect(newOrder[id2]).toBe(1)
    })
  })

  describe('getOrderedVideos', () => {
    it('should return videos in order', () => {
      const { addVideo, reorderVideos, getOrderedVideos } = useVideoStore.getState()

      addVideo({ videoId: 'video1', platform: 'youtube', isLive: true })
      addVideo({ videoId: 'video2', platform: 'youtube', isLive: true })
      addVideo({ videoId: 'video3', platform: 'youtube', isLive: true })

      const { videos } = useVideoStore.getState()

      // Swap first and last (order 1 and 3 swap)
      reorderVideos(videos[0].id, videos[2].id)

      const ordered = getOrderedVideos()
      // After swap: video1 has order 3, video3 has order 1, video2 stays at 2
      expect(ordered[0].videoId).toBe('video3')
      expect(ordered[1].videoId).toBe('video2')
      expect(ordered[2].videoId).toBe('video1')
    })
  })

  describe('startViewing', () => {
    it('should hide welcome screen and open modal', () => {
      const { startViewing } = useVideoStore.getState()

      startViewing()

      const { isWelcomeVisible, isModalOpen } = useVideoStore.getState()
      expect(isWelcomeVisible).toBe(false)
      expect(isModalOpen).toBe(true)
    })
  })

  describe('loadVideosFromUrl', () => {
    it('should load videos and set up order', () => {
      const { loadVideosFromUrl } = useVideoStore.getState()

      loadVideosFromUrl([
        { videoId: 'yt1', platform: 'youtube', isLive: true },
        { videoId: 'tw1', platform: 'twitch', twitchType: 'channel', isLive: true },
      ])

      const { videos, videoOrder, isWelcomeVisible } = useVideoStore.getState()
      expect(videos).toHaveLength(2)
      expect(Object.keys(videoOrder)).toHaveLength(2)
      expect(isWelcomeVisible).toBe(false)
    })
  })
})
