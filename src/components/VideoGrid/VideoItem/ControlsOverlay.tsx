interface ControlsOverlayProps {
  platform: 'youtube' | 'twitch'
  isMuted: boolean
  isChatVisible: boolean
  isLive: boolean
  onMuteToggle: () => void
  onChatToggle: () => void
  onDelete: () => void
}

export function ControlsOverlay({
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
        className={`px-2 py-1 text-xs rounded backdrop-blur-sm ${
          isTwitch
            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
            : 'bg-gray-600/80 hover:bg-gray-600 text-white'
        }`}
        title={isTwitch ? 'Twitchプレイヤーで直接操作してください' : 'ミュート切り替え'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      {/* Chat Button */}
      <button
        onClick={onChatToggle}
        disabled={!isLive}
        className={`px-2 py-1 text-xs rounded backdrop-blur-sm ${
          !isLive
            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
            : isChatVisible
            ? 'bg-green-600/80 hover:bg-green-600 text-white'
            : 'bg-blue-600/80 hover:bg-blue-600 text-white'
        }`}
        title={
          !isLive
            ? 'アーカイブ動画ではチャット機能は利用できません'
            : 'チャットを表示/非表示'
        }
      >
        💬
      </button>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="px-2 py-1 text-xs bg-red-600/80 hover:bg-red-600 text-white rounded backdrop-blur-sm"
      >
        ✕
      </button>
    </div>
  )
}
