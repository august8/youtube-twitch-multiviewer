import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { useVideoStore } from '@/stores/videoStore'

export interface YouTubePlayerHandle {
  seekTo: (seconds: number) => void
  toggleMute: () => boolean
  getCurrentTime: () => number
}

interface YouTubePlayerProps {
  videoId: string
  onTimeUpdate?: (time: number) => void
  onReady?: () => void
}

export const YouTubePlayer = forwardRef<YouTubePlayerHandle, YouTubePlayerProps>(
  function YouTubePlayer({ videoId, onTimeUpdate, onReady }, ref) {
    const ytApiReady = useVideoStore((state) => state.ytApiReady)
    const playerRef = useRef<YT.Player | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const intervalRef = useRef<number | null>(null)

    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        if (playerRef.current) {
          const current = playerRef.current.getCurrentTime()
          playerRef.current.seekTo(Math.max(0, current + seconds), true)
        }
      },
      toggleMute: () => {
        if (playerRef.current) {
          if (playerRef.current.isMuted()) {
            playerRef.current.unMute()
            return false
          } else {
            playerRef.current.mute()
            return true
          }
        }
        return false
      },
      getCurrentTime: () => {
        return playerRef.current?.getCurrentTime() || 0
      },
    }))

    useEffect(() => {
      if (!ytApiReady || !containerRef.current) return

      playerRef.current = new window.YT.Player(containerRef.current, {
        width: '100%',
        height: '100%',
        videoId,
        playerVars: {
          enablejsapi: 1,
          origin: window.location.origin,
          autoplay: 0,
        },
        events: {
          onReady: () => {
            onReady?.()
            intervalRef.current = window.setInterval(() => {
              if (playerRef.current) {
                try {
                  const time = playerRef.current.getCurrentTime()
                  onTimeUpdate?.(time)
                } catch {
                  // Player not ready
                }
              }
            }, 1000)
          },
          onError: (event: YT.OnErrorEvent) => {
            const errorMessages: Record<number, string> = {
              2: '無効なパラメータです',
              5: 'HTML5 プレイヤーのエラー',
              100: '動画が見つかりません',
              101: '埋め込みが許可されていません',
              150: '埋め込みが許可されていません',
            }
            alert(`動画の読み込みエラー: ${errorMessages[event.data] || `Code: ${event.data}`}`)
          },
        },
      })

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
        playerRef.current?.destroy()
      }
    }, [ytApiReady, videoId, onTimeUpdate, onReady])

    if (!ytApiReady) {
      return (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          YouTube API を読み込み中...
        </div>
      )
    }

    return <div ref={containerRef} className="w-full h-full" />
  }
)
