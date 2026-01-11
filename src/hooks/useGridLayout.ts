import { useMemo } from 'react'

export function useGridLayout(videoCount: number) {
  return useMemo(() => {
    if (videoCount === 0) return { cols: 1, rows: 1 }
    if (videoCount === 1) return { cols: 1, rows: 1 }

    const cols = Math.ceil(Math.sqrt(videoCount))
    const rows = Math.ceil(videoCount / cols)

    return { cols, rows }
  }, [videoCount])
}
