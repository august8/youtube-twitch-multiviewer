import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { toast } from 'sonner'
import { useVideoStore } from '@/stores/videoStore'

interface TwitchPlayerProps {
  videoId: string
  twitchType: 'channel' | 'vod'
}

export interface TwitchPlayerHandle {
  toggleMute: () => boolean
}

export function buildTwitchEmbedUrl(
  videoId: string,
  twitchType: 'channel' | 'vod',
  domain: string
): string {
  return twitchType === 'vod'
    ? `https://player.twitch.tv/?video=${videoId}&parent=${domain}&autoplay=false`
    : `https://player.twitch.tv/?channel=${videoId}&parent=${domain}`
}

export const TwitchPlayer = forwardRef<TwitchPlayerHandle, TwitchPlayerProps>(
  function TwitchPlayer({ videoId, twitchType }, ref) {
    const twitchApiReady = useVideoStore((state) => state.twitchApiReady)
    const playerRef = useRef<TwitchPlayerInstance | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    useImperativeHandle(ref, () => ({
      toggleMute: () => {
        if (!playerRef.current) return false
        const currentlyMuted = playerRef.current.getMuted()
        const next = !currentlyMuted
        playerRef.current.setMuted(next)
        return next
      },
    }))

    useEffect(() => {
      if (!twitchApiReady || !containerRef.current || !window.Twitch?.Player) {
        return
      }

      const options: TwitchPlayerOptions = {
        width: '100%',
        height: '100%',
        parent: [window.location.hostname || 'localhost'],
        autoplay: twitchType === 'channel',
        ...(twitchType === 'vod' ? { video: videoId } : { channel: videoId }),
      }

      let player: TwitchPlayerInstance
      try {
        player = new window.Twitch.Player(containerRef.current, options)
        playerRef.current = player
      } catch (err) {
        console.error('Failed to create Twitch player:', err)
        setHasError(true)
        setIsLoading(false)
        toast.error(`Twitch の読み込みに失敗しました: ${videoId}`)
        return
      }

      const handleReady = () => setIsLoading(false)
      const handlePlaying = () => setIsLoading(false)
      player.addEventListener(window.Twitch.Player.READY, handleReady)
      player.addEventListener(window.Twitch.Player.PLAYING, handlePlaying)

      return () => {
        try {
          player.removeEventListener(window.Twitch!.Player.READY, handleReady)
          player.removeEventListener(window.Twitch!.Player.PLAYING, handlePlaying)
          player.destroy?.()
        } catch {
          // ignore teardown errors
        }
        playerRef.current = null
        // Twitch's destroy is unreliable across versions; explicitly clear the
        // container so leftover iframes don't accumulate.
        if (containerRef.current) {
          containerRef.current.innerHTML = ''
        }
      }
    }, [twitchApiReady, videoId, twitchType])

    return (
      <div className="relative w-full h-full">
        {(!twitchApiReady || isLoading) && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-gray-400 gap-3 z-10">
            <div className="w-8 h-8 border-2 border-gray-600 border-t-purple-500 rounded-full animate-spin" />
            <span className="text-sm">
              {!twitchApiReady ? 'Twitch API を読み込み中...' : 'Twitch を読み込み中...'}
            </span>
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-gray-400 gap-3 z-10">
            <span className="text-2xl">⚠️</span>
            <span className="text-sm">読み込みに失敗しました</span>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>
    )
  }
)
