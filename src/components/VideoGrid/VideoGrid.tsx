import { useMemo } from 'react'
import { useVideoStore } from '@/stores/videoStore'
import { useGridLayout } from '@/hooks/useGridLayout'
import { VideoItem } from './VideoItem/VideoItem'
import type { LayoutMode } from '@/types/video'

function getLayoutStyle(
  layoutMode: LayoutMode,
  videoCount: number,
  cols: number,
  rows: number
): React.CSSProperties {
  switch (layoutMode) {
    case 'horizontal':
      return {
        gridTemplateColumns: `repeat(${videoCount}, 1fr)`,
        gridTemplateRows: '1fr',
      }
    case 'vertical':
      return {
        gridTemplateColumns: '1fr',
        gridTemplateRows: `repeat(${videoCount}, 1fr)`,
      }
    case 'focus': {
      if (videoCount <= 1) {
        return {
          gridTemplateColumns: '1fr',
          gridTemplateRows: '1fr',
        }
      }
      const subRows = videoCount - 1
      return {
        gridTemplateColumns: '7fr 3fr',
        gridTemplateRows: `repeat(${subRows}, 1fr)`,
      }
    }
    case 'grid':
    default:
      return {
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }
  }
}

export function VideoGrid() {
  const videos = useVideoStore((state) => state.videos)
  const layoutMode = useVideoStore((state) => state.layoutMode)
  const { cols, rows } = useGridLayout(videos.length)

  const layoutStyle = useMemo(
    () => getLayoutStyle(layoutMode, videos.length, cols, rows),
    [layoutMode, videos.length, cols, rows]
  )

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        右下の ☰ ボタンから動画を追加してください
      </div>
    )
  }

  if (layoutMode === 'focus' && videos.length > 1) {
    const [mainVideo, ...subVideos] = videos
    const mainGridRow = `1 / ${subVideos.length + 1}`
    return (
      <div className="grid w-full h-full gap-2 p-2" style={layoutStyle}>
        <div className="h-full" style={{ gridRow: mainGridRow }}>
          <VideoItem video={mainVideo} />
        </div>
        {subVideos.map((video) => (
          <VideoItem key={video.id} video={video} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid w-full h-full gap-2 p-2" style={layoutStyle}>
      {videos.map((video) => (
        <VideoItem key={video.id} video={video} />
      ))}
    </div>
  )
}
