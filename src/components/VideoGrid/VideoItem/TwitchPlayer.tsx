import { useState } from 'react'
import { toast } from 'sonner'

interface TwitchPlayerProps {
  videoId: string
  twitchType: 'channel' | 'vod'
}

export function TwitchPlayer({ videoId, twitchType }: TwitchPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const domain = window.location.hostname || 'localhost'

  const src =
    twitchType === 'vod'
      ? `https://player.twitch.tv/?video=${videoId}&parent=${domain}&autoplay=false`
      : `https://player.twitch.tv/?channel=${videoId}&parent=${domain}`

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    toast.error(`Twitch の読み込みに失敗しました: ${videoId}`)
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-gray-400 gap-3 z-10">
          <div className="w-8 h-8 border-2 border-gray-600 border-t-purple-500 rounded-full animate-spin" />
          <span className="text-sm">Twitch を読み込み中...</span>
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-gray-400 gap-3 z-10">
          <span className="text-2xl">⚠️</span>
          <span className="text-sm">読み込みに失敗しました</span>
        </div>
      )}
      <iframe
        src={src}
        className="w-full h-full border-none"
        allowFullScreen
        title={`Twitch ${twitchType}: ${videoId}`}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
      />
    </div>
  )
}
