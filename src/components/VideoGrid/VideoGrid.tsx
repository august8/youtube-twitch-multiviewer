import { useVideoStore } from '@/stores/videoStore'
import { useGridLayout } from '@/hooks/useGridLayout'
import { VideoItem } from './VideoItem/VideoItem'

export function VideoGrid() {
  const videos = useVideoStore((state) => state.videos)
  const { cols, rows } = useGridLayout(videos.length)

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        右下の ☰ ボタンから動画を追加してください
      </div>
    )
  }

  return (
    <div
      className="grid w-full h-full gap-2 p-2"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {videos.map((video) => (
        <VideoItem key={video.id} video={video} />
      ))}
    </div>
  )
}
