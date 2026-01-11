import { useEffect } from 'react'
import { useVideoStore } from '@/stores/videoStore'

let isLoading = false

export function useYouTubeAPI() {
  const setYtApiReady = useVideoStore((state) => state.setYtApiReady)
  const ytApiReady = useVideoStore((state) => state.ytApiReady)

  useEffect(() => {
    if (ytApiReady) return
    if (window.YT && window.YT.Player) {
      setYtApiReady(true)
      return
    }
    if (isLoading) return

    isLoading = true

    window.onYouTubeIframeAPIReady = () => {
      setYtApiReady(true)
    }

    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    document.head.appendChild(script)
  }, [setYtApiReady, ytApiReady])

  return ytApiReady
}
