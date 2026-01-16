import { memo } from 'react'

interface ControlsOverlayProps {
  platform: 'youtube' | 'twitch'
  isMuted: boolean
  isChatVisible: boolean
  isLive: boolean
  onMuteToggle: () => void
  onChatToggle: () => void
  onDelete: () => void
}

export const ControlsOverlay = memo(function ControlsOverlay({
  platform,
  isMuted,
  isChatVisible,
  isLive,
  onMuteToggle,
  onChatToggle,
  onDelete,
}: ControlsOverlayProps) {
  const isTwitch = platform === 'twitch'

  return (
    <div className="absolute top-1 right-1 flex gap-1 z-10">
      {/* Mute Button */}
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

      {/* Chat Button */}
      <button
        onClick={onChatToggle}
        disabled={!isLive}
        className={`px-2 py-1 text-xs rounded backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white ${
          !isLive
            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
            : isChatVisible
              ? 'bg-green-600/80 hover:bg-green-600 text-white'
              : 'bg-blue-600/80 hover:bg-blue-600 text-white'
        }`}
        title={!isLive ? 'アーカイブ動画ではチャット機能は利用できません' : 'チャットを表示/非表示'}
        aria-label={isChatVisible ? 'チャットを非表示' : 'チャットを表示'}
        aria-pressed={isChatVisible}
      >
        💬{isLive && <span className="ml-0.5">{isChatVisible ? '✓' : ''}</span>}
      </button>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="px-2 py-1 text-xs bg-red-600/80 hover:bg-red-600 text-white rounded backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="動画を削除"
      >
        ✕
      </button>
    </div>
  )
})
