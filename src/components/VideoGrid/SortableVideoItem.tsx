import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { VideoItem as VideoItemType } from '@/types/video'
import { VideoItem } from './VideoItem/VideoItem'

interface SortableVideoItemProps {
  video: VideoItemType
  order: number
  style?: React.CSSProperties
}

export function SortableVideoItem({ video, order, style }: SortableVideoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: video.id,
  })

  const combinedStyle: React.CSSProperties = {
    ...style,
    order,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  }

  return (
    <div ref={setNodeRef} style={combinedStyle} {...attributes} {...listeners} className="h-full">
      <VideoItem video={video} />
    </div>
  )
}
