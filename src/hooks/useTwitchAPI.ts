import { useEffect } from 'react'
import { useVideoStore } from '@/stores/videoStore'

let isLoading = false

export function useTwitchAPI() {
  const setTwitchApiReady = useVideoStore((state) => state.setTwitchApiReady)
  const twitchApiReady = useVideoStore((state) => state.twitchApiReady)

  useEffect(() => {
    if (twitchApiReady) return
    if (window.Twitch?.Player) {
      setTwitchApiReady(true)
      return
    }
    if (isLoading) return

    isLoading = true

    const script = document.createElement('script')
    script.src = 'https://embed.twitch.tv/embed/v1.js'
    script.async = true
    script.onload = () => setTwitchApiReady(true)
    document.head.appendChild(script)
  }, [setTwitchApiReady, twitchApiReady])

  return twitchApiReady
}
