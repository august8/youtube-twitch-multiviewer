import { useMemo, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useVideoStore } from '@/stores/videoStore'
import { useGridLayout } from '@/hooks/useGridLayout'
import { SortableVideoItem } from './SortableVideoItem'
import type { LayoutMode } from '@/types/video'

export function getLayoutStyle(
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
  const videoOrder = useVideoStore((state) => state.videoOrder)
  const layoutMode = useVideoStore((state) => state.layoutMode)
  const reorderVideos = useVideoStore((state) => state.reorderVideos)
  const getOrderedVideos = useVideoStore((state) => state.getOrderedVideos)
  const { cols, rows } = useGridLayout(videos.length)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        reorderVideos(active.id as string, over.id as string)
      }
    },
    [reorderVideos]
  )

  const layoutStyle = useMemo(
    () => getLayoutStyle(layoutMode, videos.length, cols, rows),
    [layoutMode, videos.length, cols, rows]
  )

  // Get sorted video IDs for SortableContext
  const sortedVideoIds = useMemo(() => {
    return getOrderedVideos().map((v) => v.id)
  }, [getOrderedVideos])

  // Find the main video (lowest order) for focus mode
  const mainVideoId = useMemo(() => {
    if (videos.length === 0) return null
    return videos.reduce((minVideo, video) => {
      const minOrder = videoOrder[minVideo.id] ?? Infinity
      const currentOrder = videoOrder[video.id] ?? Infinity
      return currentOrder < minOrder ? video : minVideo
    }).id
  }, [videos, videoOrder])

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        右下の ☰ ボタンから動画を追加してください
      </div>
    )
  }

  if (layoutMode === 'focus' && videos.length > 1) {
    const subCount = videos.length - 1
    const mainGridRow = `1 / ${subCount + 1}`
    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortedVideoIds} strategy={rectSortingStrategy}>
          <div className="grid w-full h-full gap-2 p-2" style={layoutStyle}>
            {videos.map((video) => (
              <SortableVideoItem
                key={video.id}
                video={video}
                order={videoOrder[video.id] ?? 0}
                style={video.id === mainVideoId ? { gridRow: mainGridRow } : undefined}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sortedVideoIds} strategy={rectSortingStrategy}>
        <div className="grid w-full h-full gap-2 p-2" style={layoutStyle}>
          {videos.map((video) => (
            <SortableVideoItem
              key={video.id}
              video={video}
              order={videoOrder[video.id] ?? 0}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
