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
import type { LayoutMode, VideoItem } from '@/types/video'

const HIDDEN_WITH_CHAT_TRACK = '0.5fr'
const HIDDEN_NO_CHAT_TRACK = 'auto'

function getSlotTrackSize(video: VideoItem): string {
  if (video.isVideoVisible) return '1fr'
  if (video.isChatVisible && video.isLive) return HIDDEN_WITH_CHAT_TRACK
  return HIDDEN_NO_CHAT_TRACK
}

function buildTracks(videos: VideoItem[]): string {
  if (videos.length === 0) return '1fr'
  const sizes = videos.map(getSlotTrackSize)
  return sizes.every((s) => s === '1fr') ? `repeat(${sizes.length}, 1fr)` : sizes.join(' ')
}

export function getLayoutStyle(
  layoutMode: LayoutMode,
  orderedVideos: VideoItem[],
  cols: number,
  rows: number,
  mainVideoId?: string | null
): React.CSSProperties {
  const videoCount = orderedVideos.length
  switch (layoutMode) {
    case 'horizontal':
      return {
        gridTemplateColumns: buildTracks(orderedVideos),
        gridTemplateRows: '1fr',
      }
    case 'vertical':
      return {
        gridTemplateColumns: '1fr',
        gridTemplateRows: buildTracks(orderedVideos),
      }
    case 'focus': {
      if (videoCount <= 1) {
        return {
          gridTemplateColumns: '1fr',
          gridTemplateRows: '1fr',
        }
      }
      const mainVideo = orderedVideos.find((v) => v.id === mainVideoId) ?? orderedVideos[0]
      const subVideos = orderedVideos.filter((v) => v.id !== mainVideo.id)
      const mainHidden = !mainVideo.isVideoVisible

      // Single-sub case: main spans the only sub row, so shrinking that row also
      // shrinks main vertically. Optimize via column widths instead.
      if (subVideos.length === 1) {
        const sub = subVideos[0]
        const subHidden = !sub.isVideoVisible
        const subSize = getSlotTrackSize(sub)
        let colTracks: string
        if (mainHidden && subHidden) {
          colTracks = 'auto auto'
        } else if (mainHidden) {
          colTracks = 'auto 1fr'
        } else if (subHidden) {
          colTracks = `1fr ${subSize}`
        } else {
          colTracks = '7fr 3fr'
        }
        return { gridTemplateColumns: colTracks, gridTemplateRows: '1fr' }
      }

      // Multi-sub case: shrink rows per visibility, but ensure at least one row
      // is 1fr (otherwise main spanning all rows collapses to content height).
      const subSizes = subVideos.map(getSlotTrackSize)
      const hasOneFr = subSizes.some((s) => s === '1fr')
      const rowTracks =
        !hasOneFr || subSizes.every((s) => s === '1fr')
          ? `repeat(${subVideos.length}, 1fr)`
          : subSizes.join(' ')

      return {
        gridTemplateColumns: mainHidden ? 'auto 1fr' : '7fr 3fr',
        gridTemplateRows: rowTracks,
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

  const orderedVideos = useMemo(() => getOrderedVideos(), [getOrderedVideos, videos, videoOrder])

  // Find the main video (lowest order) for focus mode
  const mainVideoId = useMemo(() => {
    if (orderedVideos.length === 0) return null
    return orderedVideos[0].id
  }, [orderedVideos])

  const layoutStyle = useMemo(
    () => getLayoutStyle(layoutMode, orderedVideos, cols, rows, mainVideoId),
    [layoutMode, orderedVideos, cols, rows, mainVideoId]
  )

  const sortedVideoIds = useMemo(() => orderedVideos.map((v) => v.id), [orderedVideos])

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
