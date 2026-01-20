import { useState, useMemo, useCallback } from 'react'
import { toast } from 'sonner'
import { useVideoStore } from '@/stores/videoStore'
import { useTranslation } from '@/i18n'
import { parseVideoUrl, detectPlatform } from '@/utils/urlParser'
import { getShareableUrl, copyToClipboard } from '@/utils/urlState'
import type { LayoutMode, ThemeMode, Locale } from '@/types/video'

const LAYOUT_ICONS: Record<LayoutMode, string> = {
  grid: '⊞',
  focus: '◧',
  horizontal: '▭',
  vertical: '▯',
}

const THEME_ICONS: Record<ThemeMode, string> = {
  system: '💻',
  light: '☀️',
  dark: '🌙',
}

const LOCALE_OPTIONS: { mode: Locale; label: string; icon: string }[] = [
  { mode: 'ja', label: '日本語', icon: '🇯🇵' },
  { mode: 'en', label: 'English', icon: '🇺🇸' },
]

export function ControlsModal() {
  const isModalOpen = useVideoStore((state) => state.isModalOpen)
  const setModalOpen = useVideoStore((state) => state.setModalOpen)
  const addVideo = useVideoStore((state) => state.addVideo)
  const resetVideos = useVideoStore((state) => state.resetVideos)
  const videos = useVideoStore((state) => state.videos)
  const layoutMode = useVideoStore((state) => state.layoutMode)
  const setLayoutMode = useVideoStore((state) => state.setLayoutMode)
  const themeMode = useVideoStore((state) => state.themeMode)
  const setThemeMode = useVideoStore((state) => state.setThemeMode)
  const locale = useVideoStore((state) => state.locale)
  const setLocale = useVideoStore((state) => state.setLocale)
  const t = useTranslation()

  const [url, setUrl] = useState('')
  const [isLiveOverride, setIsLiveOverride] = useState<boolean | null>(null)

  const platform = useMemo(() => detectPlatform(url), [url])
  const isTwitchVod = platform === 'twitch' && url.includes('/videos/')

  const showLiveToggle = platform === 'youtube' || isTwitchVod
  const isLive = isLiveOverride ?? !isTwitchVod

  const layoutOptions: { mode: LayoutMode; label: string; icon: string }[] = [
    { mode: 'grid', label: t.controls.layouts.grid, icon: LAYOUT_ICONS.grid },
    { mode: 'focus', label: t.controls.layouts.focus, icon: LAYOUT_ICONS.focus },
    { mode: 'horizontal', label: t.controls.layouts.horizontal, icon: LAYOUT_ICONS.horizontal },
    { mode: 'vertical', label: t.controls.layouts.vertical, icon: LAYOUT_ICONS.vertical },
  ]

  const themeOptions: { mode: ThemeMode; label: string; icon: string }[] = [
    { mode: 'system', label: t.controls.themes.system, icon: THEME_ICONS.system },
    { mode: 'light', label: t.controls.themes.light, icon: THEME_ICONS.light },
    { mode: 'dark', label: t.controls.themes.dark, icon: THEME_ICONS.dark },
  ]

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    setIsLiveOverride(null)
  }, [])

  const handleAdd = useCallback(() => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      toast.error(t.toast.urlRequired)
      return
    }

    const detectedPlatform = detectPlatform(trimmedUrl)
    if (!detectedPlatform) {
      toast.error(t.toast.invalidPlatform)
      return
    }

    const parsed = parseVideoUrl(trimmedUrl)
    if (!parsed) {
      if (detectedPlatform === 'youtube') {
        toast.error(t.toast.youtubeIdError)
      } else {
        toast.error(t.toast.twitchIdError)
      }
      return
    }

    addVideo({
      videoId: parsed.videoId,
      platform: parsed.platform,
      twitchType: parsed.twitchType,
      isLive: parsed.platform === 'twitch' ? parsed.twitchType === 'channel' : isLive,
    })
    toast.success(t.toast.videoAdded)
    setUrl('')
    setIsLiveOverride(null)
  }, [url, isLive, addVideo, t])

  const handleReset = useCallback(() => {
    if (videos.length === 0) {
      toast.error(t.toast.noVideosToDelete)
      return
    }
    resetVideos()
    toast.success(t.toast.allVideosDeleted)
  }, [videos.length, resetVideos, t])

  const handleShare = useCallback(async () => {
    if (videos.length === 0) {
      toast.error(t.toast.noVideosToShare)
      return
    }

    const shareUrl = getShareableUrl(videos)
    const success = await copyToClipboard(shareUrl)
    if (success) {
      toast.success(t.toast.urlCopied)
    } else {
      toast.error(t.toast.copyFailed)
    }
  }, [videos, t])

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
      <div
        className="bg-light-card dark:bg-dark-card p-5 rounded-lg shadow-xl w-[90%] max-w-md flex flex-col gap-3"
        role="dialog"
        aria-modal="true"
        aria-label={t.a11y.controlsMenu}
      >
        <label htmlFor="video-url-input" className="sr-only">
          {t.a11y.videoUrlInput}
        </label>
        <input
          id="video-url-input"
          type="text"
          value={url}
          onChange={handleUrlChange}
          onKeyDown={handleKeyPress}
          placeholder={t.controls.urlPlaceholder}
          className="w-full px-3 py-2 rounded bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {showLiveToggle && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <input
              id="live-toggle"
              type="checkbox"
              checked={isLive}
              onChange={(e) => setIsLiveOverride(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="live-toggle">{t.controls.liveToggle}</label>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            {t.controls.addButton}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            {t.controls.resetButton}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            {t.controls.shareButton}
          </button>
          <button
            onClick={handleClose}
            className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            {t.controls.closeButton}
          </button>
        </div>

        <div className="pt-3 border-t border-gray-300 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t.controls.layoutLabel}</div>
          <div className="grid grid-cols-4 gap-1" role="group" aria-label={t.a11y.layoutSelection}>
            {layoutOptions.map((option) => (
              <button
                key={option.mode}
                onClick={() => setLayoutMode(option.mode)}
                className={`py-2 px-1 rounded text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  layoutMode === option.mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                aria-pressed={layoutMode === option.mode}
              >
                <div className="text-lg" aria-hidden="true">{option.icon}</div>
                <div>{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-300 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t.controls.themeLabel}</div>
          <div className="grid grid-cols-3 gap-1" role="group" aria-label={t.a11y.themeSelection}>
            {themeOptions.map((option) => (
              <button
                key={option.mode}
                onClick={() => setThemeMode(option.mode)}
                className={`py-2 px-1 rounded text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  themeMode === option.mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                aria-pressed={themeMode === option.mode}
              >
                <div className="text-lg" aria-hidden="true">{option.icon}</div>
                <div>{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-300 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t.controls.language}</div>
          <div className="grid grid-cols-2 gap-1" role="group" aria-label={t.a11y.languageSelection}>
            {LOCALE_OPTIONS.map((option) => (
              <button
                key={option.mode}
                onClick={() => setLocale(option.mode)}
                className={`py-2 px-1 rounded text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  locale === option.mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                aria-pressed={locale === option.mode}
              >
                <div className="text-lg" aria-hidden="true">{option.icon}</div>
                <div>{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center pt-3 border-t border-gray-300 dark:border-gray-700 text-xs text-gray-500">
          v{__APP_VERSION__} (React)
        </div>
      </div>
    </div>
  )
}
