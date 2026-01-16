import { describe, it, expect } from 'vitest'
import { buildTwitchEmbedUrl } from './TwitchPlayer'

describe('buildTwitchEmbedUrl', () => {
  describe('channel type', () => {
    it('should build correct URL for channel', () => {
      const url = buildTwitchEmbedUrl('testchannel', 'channel', 'localhost')
      expect(url).toBe('https://player.twitch.tv/?channel=testchannel&parent=localhost')
    })

    it('should include custom domain in parent parameter', () => {
      const url = buildTwitchEmbedUrl('ninja', 'channel', 'example.com')
      expect(url).toBe('https://player.twitch.tv/?channel=ninja&parent=example.com')
    })
  })

  describe('vod type', () => {
    it('should build correct URL for VOD', () => {
      const url = buildTwitchEmbedUrl('123456789', 'vod', 'localhost')
      expect(url).toBe(
        'https://player.twitch.tv/?video=123456789&parent=localhost&autoplay=false'
      )
    })

    it('should include autoplay=false for VOD', () => {
      const url = buildTwitchEmbedUrl('987654321', 'vod', 'mysite.com')
      expect(url).toContain('autoplay=false')
    })

    it('should include custom domain in parent parameter for VOD', () => {
      const url = buildTwitchEmbedUrl('111222333', 'vod', 'custom-domain.io')
      expect(url).toBe(
        'https://player.twitch.tv/?video=111222333&parent=custom-domain.io&autoplay=false'
      )
    })
  })
})
