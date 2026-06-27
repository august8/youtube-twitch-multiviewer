import { memo } from 'react'

interface SlotHeaderProps {
  platform: 'youtube' | 'twitch'
  isVideoVisible: boolean
  isMuted: boolean
  isChatVisible: boolean
  isLive: boolean
  onVideoToggle: () => void
  onMuteToggle: () => void
  onChatToggle: () => void
  onDelete: () => void
}

export const SlotHeader = memo(function SlotHeader({
  platform,
  isVideoVisible,
  isMuted,
  isChatVisible,
  isLive,
  onVideoToggle,
  onMuteToggle,
  onChatToggle,
  onDelete,
}: SlotHeaderProps) {
  const isTwitch = platform === 'twitch'

  return (
    <div className="flex items-center justify-end gap-1 px-2 py-1 bg-light-control dark:bg-dark-control border-b border-black/10 dark:border-white/10">
      <button
        onClick={onVideoToggle}
        className={`px-2 py-1 text-xs rounded focus:outline-none focus:ring-2 focus:ring-white ${
          isVideoVisible
            ? 'bg-green-600/80 hover:bg-green-600 text-white'
            : 'bg-gray-600/80 hover:bg-gray-600 text-white'
        }`}
        title={isVideoVisible ? '映像を非表示（音声・チャットは残せます）' : '映像を表示'}
        aria-label={isVideoVisible ? '映像を非表示' : '映像を表示'}
        aria-pressed={isVideoVisible}
      >
        🎬
      </button>

      <button
        onClick={onMuteToggle}
        disabled={isTwitch}
        className={`px-2 py-1 text-xs rounded focus:outline-none focus:ring-2 focus:ring-white ${
          isTwitch
            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
            : !isMuted
              ? 'bg-green-600/80 hover:bg-green-600 text-white'
              : 'bg-gray-600/80 hover:bg-gray-600 text-white'
        }`}
        title={
          isTwitch
            ? 'Twitchプレイヤーで直接操作してください'
            : isMuted
              ? 'ミュート解除'
              : 'ミュート'
        }
        aria-label={isMuted ? 'ミュート解除' : 'ミュート'}
        aria-pressed={!isMuted}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      <button
        onClick={onChatToggle}
        disabled={!isLive}
        className={`px-2 py-1 text-xs rounded focus:outline-none focus:ring-2 focus:ring-white ${
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
        💬
      </button>

      <button
        onClick={onDelete}
        className="px-2 py-1 text-xs bg-red-600/80 hover:bg-red-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="動画を削除"
      >
        ✕
      </button>
    </div>
  )
})
