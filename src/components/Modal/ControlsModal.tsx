import { useState, useEffect, useCallback } from 'react'
import { useVideoStore } from '@/stores/videoStore'
import { parseVideoUrl, detectPlatform } from '@/utils/urlParser'

export function ControlsModal() {
  const isModalOpen = useVideoStore((state) => state.isModalOpen)
  const setModalOpen = useVideoStore((state) => state.setModalOpen)
  const addVideo = useVideoStore((state) => state.addVideo)
  const resetVideos = useVideoStore((state) => state.resetVideos)

  const [url, setUrl] = useState('')
  const [isLive, setIsLive] = useState(true)
  const [showLiveToggle, setShowLiveToggle] = useState(true)

  useEffect(() => {
    const platform = detectPlatform(url)
    if (platform === 'twitch') {
      const isVod = url.includes('/videos/')
      setShowLiveToggle(isVod)
      setIsLive(!isVod)
    } else if (platform === 'youtube') {
      setShowLiveToggle(true)
    }
  }, [url])

  const handleAdd = useCallback(() => {
    const parsed = parseVideoUrl(url.trim())
    if (!parsed) {
      alert('YouTube または Twitch の URL を入力してください。')
      return
    }

    addVideo({
      videoId: parsed.videoId,
      platform: parsed.platform,
      twitchType: parsed.twitchType,
      isLive: parsed.platform === 'twitch' ? parsed.twitchType === 'channel' : isLive,
    })
    setUrl('')
  }, [url, isLive, addVideo])

  const handleReset = useCallback(() => {
    resetVideos()
  }, [resetVideos])

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
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="YouTube または Twitch の URL を入力"
          className="w-full px-3 py-2 rounded bg-white text-gray-900 text-sm"
        />

        {showLiveToggle && (
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
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

        <button
          onClick={handleClose}
          className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
        >
          閉じる
        </button>

        <div className="text-center pt-3 border-t border-gray-700 text-xs text-gray-500">
          v2.0.0 (React)
        </div>
      </div>
    </div>
  )
}
