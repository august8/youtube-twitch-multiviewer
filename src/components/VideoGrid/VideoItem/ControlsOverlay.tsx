import { memo } from 'react'

interface ControlsOverlayProps {
  platform: 'youtube' | 'twitch'
  isMuted: boolean
  onMuteToggle: () => void
}

export const ControlsOverlay = memo(function ControlsOverlay({
  platform,
  isMuted,
  onMuteToggle,
}: ControlsOverlayProps) {
  const isTwitch = platform === 'twitch'

  return (
    <div className="absolute top-1 right-1 flex gap-1 z-10">
      <button
        onClick={onMuteToggle}
        disabled={isTwitch}
        className={`px-2 py-1 text-xs rounded backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white ${
          isTwitch
            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
            : 'bg-gray-600/80 hover:bg-gray-600 text-white'
        }`}
        title={isTwitch ? 'Twitchプレイヤーで直接操作してください' : 'ミュート切り替え'}
        aria-label={isMuted ? 'ミュート解除' : 'ミュート'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  )
})
