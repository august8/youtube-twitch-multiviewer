interface TwitchPlayerProps {
  videoId: string
  twitchType: 'channel' | 'vod'
}

export function TwitchPlayer({ videoId, twitchType }: TwitchPlayerProps) {
  const domain = window.location.hostname || 'localhost'

  const src =
    twitchType === 'vod'
      ? `https://player.twitch.tv/?video=${videoId}&parent=${domain}&autoplay=false`
      : `https://player.twitch.tv/?channel=${videoId}&parent=${domain}`

  return (
    <iframe
      src={src}
      className="w-full h-full border-none"
      allowFullScreen
      title={`Twitch ${twitchType}: ${videoId}`}
    />
  )
}
