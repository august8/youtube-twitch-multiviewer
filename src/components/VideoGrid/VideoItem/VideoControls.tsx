import { memo } from 'react'
import { formatTime } from '@/utils/timeFormatter'

interface VideoControlsProps {
  currentTime: number
  onSeek: (seconds: number) => void
}

export const VideoControls = memo(function VideoControls({
  currentTime,
  onSeek,
}: VideoControlsProps) {
  return (
    <div className="bg-light-control dark:bg-dark-control p-2 flex items-center justify-between gap-2">
      <div className="flex gap-1">
        <button
          onClick={() => onSeek(-10)}
          className="px-2 py-1 text-xs bg-blue-600/70 hover:bg-blue-600 text-white rounded"
        >
          -10s
        </button>
        <button
          onClick={() => onSeek(-5)}
          className="px-2 py-1 text-xs bg-blue-600/70 hover:bg-blue-600 text-white rounded"
        >
          -5s
        </button>
        <button
          onClick={() => onSeek(5)}
          className="px-2 py-1 text-xs bg-blue-600/70 hover:bg-blue-600 text-white rounded"
        >
          +5s
        </button>
        <button
          onClick={() => onSeek(10)}
          className="px-2 py-1 text-xs bg-blue-600/70 hover:bg-blue-600 text-white rounded"
        >
          +10s
        </button>
      </div>
      <div className="text-xs text-gray-400 min-w-[60px] text-center">
        {formatTime(currentTime)}
      </div>
    </div>
  )
})
