import { useRef, useState, useCallback, memo } from 'react'
import { toast } from 'sonner'
import type { VideoItem as VideoItemType } from '@/types/video'
import { useVideoStore } from '@/stores/videoStore'
import { useTranslation } from '@/i18n'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { TwitchPlayer, type TwitchPlayerHandle } from './TwitchPlayer'
import { YouTubePlayer, type YouTubePlayerHandle } from './YouTubePlayer'
import { VideoControls } from './VideoControls'
import { ChatPanel } from './ChatPanel'
import { SlotHeader } from './SlotHeader'

interface VideoItemProps {
  video: VideoItemType
}

export const VideoItem = memo(function VideoItem({ video }: VideoItemProps) {
  const removeVideo = useVideoStore((state) => state.removeVideo)
  const toggleChat = useVideoStore((state) => state.toggleChat)
  const toggleVideo = useVideoStore((state) => state.toggleVideo)
  const setMuted = useVideoStore((state) => state.setMuted)
  const t = useTranslation()
  const youtubePlayerRef = useRef<YouTubePlayerHandle>(null)
  const twitchPlayerRef = useRef<TwitchPlayerHandle>(null)
  const [currentTime, setCurrentTime] = useState(0)

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time)
  }, [])

  const handleSeek = useCallback((seconds: number) => {
    youtubePlayerRef.current?.seekTo(seconds)
  }, [])

  const handleMuteToggle = useCallback(() => {
    const newMuted =
      video.platform === 'youtube'
        ? youtubePlayerRef.current?.toggleMute()
        : twitchPlayerRef.current?.toggleMute()
    if (newMuted !== undefined) {
      setMuted(video.id, newMuted)
    }
  }, [video.id, video.platform, setMuted])

  const handleMuteChange = useCallback(
    (muted: boolean) => {
      setMuted(video.id, muted)
    },
    [video.id, setMuted]
  )

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

  return (
    <div className="flex flex-col bg-light-card dark:bg-dark-card rounded-lg overflow-hidden min-w-0 h-full">
      <SlotHeader
        isVideoVisible={video.isVideoVisible}
        isMuted={video.isMuted}
        isChatVisible={video.isChatVisible}
        isLive={video.isLive}
        onVideoToggle={handleVideoToggle}
        onMuteToggle={handleMuteToggle}
        onChatToggle={handleChatToggle}
        onDelete={handleDelete}
      />

      <div className="flex gap-2 flex-1 min-h-0">
        <div className={`flex flex-col flex-1 min-w-0 ${video.isVideoVisible ? '' : 'hidden'}`}>
          <div className="relative bg-black flex-1 min-w-0">
            <ErrorBoundary>
              {video.platform === 'twitch' ? (
                <TwitchPlayer
                  ref={twitchPlayerRef}
                  videoId={video.videoId}
                  twitchType={video.twitchType || 'channel'}
                  onMuteChange={handleMuteChange}
                />
              ) : (
                <YouTubePlayer
                  ref={youtubePlayerRef}
                  videoId={video.videoId}
                  onTimeUpdate={handleTimeUpdate}
                  onMuteChange={handleMuteChange}
                />
              )}
            </ErrorBoundary>
          </div>

          {video.platform === 'youtube' && (
            <VideoControls currentTime={currentTime} onSeek={handleSeek} />
          )}
        </div>

        {showChat && (
          <div className={video.isVideoVisible ? '' : 'flex-1 min-w-0'}>
            <ChatPanel
              platform={video.platform}
              videoId={video.videoId}
              twitchType={video.twitchType}
              fillWidth={!video.isVideoVisible}
            />
          </div>
        )}
      </div>
    </div>
  )
})
