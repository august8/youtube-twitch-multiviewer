declare namespace YT {
  class Player {
    constructor(
      element: HTMLElement | string,
      options: {
        height?: string | number
        width?: string | number
        videoId?: string
        playerVars?: {
          enablejsapi?: number
          origin?: string
          autoplay?: number
        }
        events?: {
          onReady?: (event: PlayerEvent) => void
          onError?: (event: OnErrorEvent) => void
          onStateChange?: (event: OnStateChangeEvent) => void
        }
      }
    )
    destroy(): void
    getCurrentTime(): number
    seekTo(seconds: number, allowSeekAhead: boolean): void
    isMuted(): boolean
    mute(): void
    unMute(): void
    getPlayerState(): number
  }

  interface PlayerEvent {
    target: Player
  }

  interface OnErrorEvent {
    data: number
    target: Player
  }

  interface OnStateChangeEvent {
    data: number
    target: Player
  }

  const PlayerState: {
    UNSTARTED: -1
    ENDED: 0
    PLAYING: 1
    PAUSED: 2
    BUFFERING: 3
    CUED: 5
  }
}

interface Window {
  YT: typeof YT
  onYouTubeIframeAPIReady: () => void
}
