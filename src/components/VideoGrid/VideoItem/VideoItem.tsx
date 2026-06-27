import { useRef, useState, useCallback, memo } from 'react'
import { toast } from 'sonner'
import type { VideoItem as VideoItemType } from '@/types/video'
import { useVideoStore } from '@/stores/videoStore'
import { useTranslation } from '@/i18n'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { TwitchPlayer } from './TwitchPlayer'
import { YouTubePlayer, type YouTubePlayerHandle } from './YouTubePlayer'
import { VideoControls } from './VideoControls'
import { ControlsOverlay } from './ControlsOverlay'
import { ChatPanel } from './ChatPanel'
import { SlotHeader } from './SlotHeader'

interface VideoItemProps {
  video: VideoItemType
}

export const VideoItem = memo(function VideoItem({ video }: VideoItemProps) {
  const removeVideo = useVideoStore((state) => state.removeVideo)
  const toggleChat = useVideoStore((state) => state.toggleChat)
  const toggleVideo = useVideoStore((state) => state.toggleVideo)
  const toggleMute = useVideoStore((state) => state.toggleMute)
  const t = useTranslation()
  const youtubePlayerRef = useRef<YouTubePlayerHandle>(null)
  const [currentTime, setCurrentTime] = useState(0)

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time)
  }, [])

  const handleSeek = useCallback((seconds: number) => {
    youtubePlayerRef.current?.seekTo(seconds)
  }, [])

  const handleMuteToggle = useCallback(() => {
    if (video.platform === 'youtube') {
      const isMuted = youtubePlayerRef.current?.toggleMute()
      if (isMuted !== undefined) {
        toggleMute(video.id)
      }
    }
  }, [video.id, video.platform, toggleMute])

  const handleChatToggle = useCallback(() => {
    if (video.isLive) {
      toggleChat(video.id)
    } else {
      toast.error(t.toast.archiveChatUnavailable)
    }
  }, [video.id, video.isLive, toggleChat, t])

  const handleVideoToggle = useCallback(() => {
    toggleVideo(video.id)
  }, [video.id, toggleVideo])

  const handleDelete = useCallback(() => {
    removeVideo(video.id)
    toast.success(t.toast.videoDeleted)
  }, [video.id, removeVideo, t])

  const showChat = video.isChatVisible && video.isLive
  const showVideo = video.isVideoVisible

  return (
    <div className="flex flex-col bg-light-card dark:bg-dark-card rounded-lg overflow-hidden min-w-0 h-full">
      <SlotHeader
        isVideoVisible={video.isVideoVisible}
        isChatVisible={video.isChatVisible}
        isLive={video.isLive}
        onVideoToggle={handleVideoToggle}
        onChatToggle={handleChatToggle}
        onDelete={handleDelete}
      />

      <div className="flex gap-2 flex-1 min-h-0">
        {showVideo && (
          <div className="flex flex-col flex-1 min-w-0">
            <div className="relative bg-black flex-1 min-w-0">
              <ErrorBoundary>
                {video.platform === 'twitch' ? (
                  <TwitchPlayer
                    videoId={video.videoId}
                    twitchType={video.twitchType || 'channel'}
                  />
                ) : (
                  <YouTubePlayer
                    ref={youtubePlayerRef}
                    videoId={video.videoId}
                    onTimeUpdate={handleTimeUpdate}
                  />
                )}
              </ErrorBoundary>

              <ControlsOverlay
                platform={video.platform}
                isMuted={video.isMuted}
                onMuteToggle={handleMuteToggle}
              />
            </div>

            {video.platform === 'youtube' && (
              <VideoControls currentTime={currentTime} onSeek={handleSeek} />
            )}
          </div>
        )}

        {showChat && (
          <div className={showVideo ? '' : 'flex-1 min-w-0'}>
            <ChatPanel
              platform={video.platform}
              videoId={video.videoId}
              twitchType={video.twitchType}
              fillWidth={!showVideo}
            />
          </div>
        )}

        {!showVideo && !showChat && (
          <div className="flex-1 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 p-4 text-center">
            動画とチャットがどちらも非表示です。上のボタンから表示できます。
          </div>
        )}
      </div>
    </div>
  )
})
