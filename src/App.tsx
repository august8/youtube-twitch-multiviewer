import { useEffect, useRef } from 'react'
import { useVideoStore } from '@/stores/videoStore'
import { useYouTubeAPI } from '@/hooks/useYouTubeAPI'
import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen'
import { VideoGrid } from '@/components/VideoGrid/VideoGrid'
import { ControlsModal } from '@/components/Modal/ControlsModal'
import { FloatingButton } from '@/components/Modal/FloatingButton'
import { getVideosFromCurrentUrl } from '@/utils/urlState'

function App() {
  const isWelcomeVisible = useVideoStore((state) => state.isWelcomeVisible)
  const videos = useVideoStore((state) => state.videos)
  const setWelcomeVisible = useVideoStore((state) => state.setWelcomeVisible)
  const loadVideosFromUrl = useVideoStore((state) => state.loadVideosFromUrl)
  const hasLoadedFromUrl = useRef(false)

  // Load YouTube IFrame API
  useYouTubeAPI()

  // Load videos from URL on initial mount
  useEffect(() => {
    if (hasLoadedFromUrl.current) return
    hasLoadedFromUrl.current = true

    const videosFromUrl = getVideosFromCurrentUrl()
    console.log('URL params check:', window.location.search)
    console.log('Videos from URL:', videosFromUrl)
    if (videosFromUrl.length > 0) {
      loadVideosFromUrl(videosFromUrl)
    }
  }, [loadVideosFromUrl])

  // Return to welcome screen when all videos are removed
  // Only trigger when videos become empty (not when starting fresh)
  const hadVideos = useRef(false)

  useEffect(() => {
    if (videos.length > 0) {
      hadVideos.current = true
    }
    // Only return to welcome if we previously had videos and now have none
    if (hadVideos.current && videos.length === 0 && !isWelcomeVisible) {
      setWelcomeVisible(true)
      hadVideos.current = false
    }
  }, [videos.length, isWelcomeVisible, setWelcomeVisible])

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100">
      {isWelcomeVisible ? (
        <div className="flex items-center justify-center min-h-screen">
          <WelcomeScreen />
        </div>
      ) : (
        <div className="w-screen h-screen">
          <VideoGrid />
        </div>
      )}

      {!isWelcomeVisible && (
        <>
          <ControlsModal />
          <FloatingButton />
        </>
      )}
    </div>
  )
}

export default App
