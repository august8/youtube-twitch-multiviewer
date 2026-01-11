import { useState } from 'react'

interface TwitchPlayerProps {
  videoId: string
  twitchType: 'channel' | 'vod'
}

export function TwitchPlayer({ videoId, twitchType }: TwitchPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const domain = window.location.hostname || 'localhost'

  const src =
    twitchType === 'vod'
      ? `https://player.twitch.tv/?video=${videoId}&parent=${domain}&autoplay=false`
      : `https://player.twitch.tv/?channel=${videoId}&parent=${domain}`

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-gray-400 gap-3 z-10">
          <div className="w-8 h-8 border-2 border-gray-600 border-t-purple-500 rounded-full animate-spin" />
          <span className="text-sm">Twitch を読み込み中...</span>
        </div>
      )}
      <iframe
        src={src}
        className="w-full h-full border-none"
        allowFullScreen
        title={`Twitch ${twitchType}: ${videoId}`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}
