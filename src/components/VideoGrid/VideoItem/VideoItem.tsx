import { useRef, useState, useCallback, memo } from 'react'
import { toast } from 'sonner'
import type { VideoItem as VideoItemType } from '@/types/video'
import { useVideoStore } from '@/stores/videoStore'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { TwitchPlayer } from './TwitchPlayer'
import { YouTubePlayer, type YouTubePlayerHandle } from './YouTubePlayer'
import { VideoControls } from './VideoControls'
import { ControlsOverlay } from './ControlsOverlay'
import { ChatPanel } from './ChatPanel'

interface VideoItemProps {
  video: VideoItemType
}

export const VideoItem = memo(function VideoItem({ video }: VideoItemProps) {
  const removeVideo = useVideoStore((state) => state.removeVideo)
  const toggleChat = useVideoStore((state) => state.toggleChat)
  const toggleMute = useVideoStore((state) => state.toggleMute)
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
      toast.error('アーカイブ動画ではチャット機能は利用できません')
    }
  }, [video.id, video.isLive, toggleChat])

  const handleDelete = useCallback(() => {
    removeVideo(video.id)
    toast.success('動画を削除しました')
  }, [video.id, removeVideo])

  return (
    <div className="flex gap-2 bg-light-card dark:bg-dark-card rounded-lg overflow-hidden min-w-0 h-full">
      <div className="flex flex-col flex-1 min-w-0">
        <div className="relative bg-black flex-1 min-w-0">
          <ErrorBoundary>
            {video.platform === 'twitch' ? (
              <TwitchPlayer videoId={video.videoId} twitchType={video.twitchType || 'channel'} />
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
            isChatVisible={video.isChatVisible}
            isLive={video.isLive}
            onMuteToggle={handleMuteToggle}
            onChatToggle={handleChatToggle}
            onDelete={handleDelete}
          />
        </div>

        {/* YouTube Controls */}
        {video.platform === 'youtube' && (
          <VideoControls currentTime={currentTime} onSeek={handleSeek} />
        )}
      </div>

      {/* Chat Panel */}
      {video.isChatVisible && video.isLive && (
        <ChatPanel
          platform={video.platform}
          videoId={video.videoId}
          twitchType={video.twitchType}
        />
      )}
    </div>
  )
})
