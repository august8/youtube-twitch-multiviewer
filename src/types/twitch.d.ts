export {}

declare global {
  interface Window {
    Twitch?: {
      Player: TwitchPlayerConstructor
    }
  }
}

interface TwitchPlayerConstructor {
  new (id: string | HTMLElement, options: TwitchPlayerOptions): TwitchPlayerInstance
  READY: string
  PLAYING: string
  PAUSE: string
  ENDED: string
  PLAYBACK_BLOCKED: string
  ONLINE: string
  OFFLINE: string
  SEEK: string
}

interface TwitchPlayerOptions {
  channel?: string
  video?: string
  collection?: string
  width: string | number
  height: string | number
  parent: string[]
  autoplay?: boolean
  muted?: boolean
  time?: string
  allowfullscreen?: boolean
}

interface TwitchPlayerInstance {
  setMuted(muted: boolean): void
  getMuted(): boolean
  setVolume(level: number): void
  getVolume(): number
  pause(): void
  play(): void
  seek(timestamp: number): void
  addEventListener(event: string, callback: () => void): void
  removeEventListener(event: string, callback: () => void): void
  destroy?(): void
}
