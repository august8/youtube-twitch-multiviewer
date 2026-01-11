import { useVideoStore } from '@/stores/videoStore'
import { useYouTubeAPI } from '@/hooks/useYouTubeAPI'
import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen'
import { VideoGrid } from '@/components/VideoGrid/VideoGrid'
import { ControlsModal } from '@/components/Modal/ControlsModal'
import { FloatingButton } from '@/components/Modal/FloatingButton'

function App() {
  const isWelcomeVisible = useVideoStore((state) => state.isWelcomeVisible)

  // Load YouTube IFrame API
  useYouTubeAPI()

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
