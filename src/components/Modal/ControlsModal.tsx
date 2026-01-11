import { useState, useMemo, useCallback } from 'react'
import { toast } from 'sonner'
import { useVideoStore } from '@/stores/videoStore'
import { parseVideoUrl, detectPlatform } from '@/utils/urlParser'
import { getShareableUrl, copyToClipboard } from '@/utils/urlState'

export function ControlsModal() {
  const isModalOpen = useVideoStore((state) => state.isModalOpen)
  const setModalOpen = useVideoStore((state) => state.setModalOpen)
  const addVideo = useVideoStore((state) => state.addVideo)
  const resetVideos = useVideoStore((state) => state.resetVideos)
  const videos = useVideoStore((state) => state.videos)

  const [url, setUrl] = useState('')
  const [isLiveOverride, setIsLiveOverride] = useState<boolean | null>(null)

  const platform = useMemo(() => detectPlatform(url), [url])
  const isTwitchVod = platform === 'twitch' && url.includes('/videos/')

  const showLiveToggle = platform === 'youtube' || isTwitchVod
  const isLive = isLiveOverride ?? !isTwitchVod

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    setIsLiveOverride(null)
  }, [])

  const handleAdd = useCallback(() => {
    const parsed = parseVideoUrl(url.trim())
    if (!parsed) {
      toast.error('YouTube または Twitch の URL を入力してください')
      return
    }

    addVideo({
      videoId: parsed.videoId,
      platform: parsed.platform,
      twitchType: parsed.twitchType,
      isLive: parsed.platform === 'twitch' ? parsed.twitchType === 'channel' : isLive,
    })
    toast.success('動画を追加しました')
    setUrl('')
    setIsLiveOverride(null)
  }, [url, isLive, addVideo])

  const handleReset = useCallback(() => {
    if (videos.length === 0) {
      toast.error('削除する動画がありません')
      return
    }
    resetVideos()
    toast.success('全ての動画を削除しました')
  }, [videos.length, resetVideos])

  const handleShare = useCallback(async () => {
    if (videos.length === 0) {
      toast.error('共有する動画がありません')
      return
    }

    const shareUrl = getShareableUrl(videos)
    const success = await copyToClipboard(shareUrl)
    if (success) {
      toast.success('URLをコピーしました！')
    } else {
      toast.error('コピーに失敗しました')
    }
  }, [videos])

  const handleClose = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose()
      }
    },
    [handleClose]
  )

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleAdd()
      }
    },
    [handleAdd]
  )

  if (!isModalOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-40"
      onClick={handleBackdropClick}
    >
      <div className="bg-dark-card p-5 rounded-lg shadow-xl w-[90%] max-w-md flex flex-col gap-3">
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          onKeyPress={handleKeyPress}
          placeholder="YouTube または Twitch の URL を入力"
          className="w-full px-3 py-2 rounded bg-white text-gray-900 text-sm"
        />

        {showLiveToggle && (
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={isLive}
              onChange={(e) => setIsLiveOverride(e.target.checked)}
              className="w-4 h-4"
            />
            ライブ配信（チャット機能を有効化）
          </label>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            追加
          </button>
          <button
            onClick={handleReset}
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            リセット
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            共有URLをコピー
          </button>
          <button
            onClick={handleClose}
            className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          >
            閉じる
          </button>
        </div>

        <div className="text-center pt-3 border-t border-gray-700 text-xs text-gray-500">
          v2.1.0 (React)
        </div>
      </div>
    </div>
  )
}
