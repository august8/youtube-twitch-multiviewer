interface ChatPanelProps {
  platform: 'youtube' | 'twitch'
  videoId: string
  twitchType?: 'channel' | 'vod'
}

export function ChatPanel({ platform, videoId, twitchType }: ChatPanelProps) {
  const domain = window.location.hostname || 'localhost'
  const darkMode = 1 // Always dark mode

  let chatSrc: string

  if (platform === 'twitch') {
    const darkParam = darkMode ? '&darkpopout' : ''
    if (twitchType === 'vod') {
      chatSrc = `https://www.twitch.tv/videos/${videoId}/chat?parent=${domain}${darkParam}`
    } else {
      chatSrc = `https://www.twitch.tv/embed/${videoId}/chat?parent=${domain}${darkParam}`
    }
  } else {
    chatSrc = `https://www.youtube.com/live_chat?is_popout=1&v=${videoId}&embed_domain=${domain}&dark_theme=${darkMode}`
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    if (platform === 'youtube') {
      e.preventDefault()
      const chatUrl = `https://www.youtube.com/live_chat?is_popout=1&v=${videoId}&dark_theme=${darkMode}`
      window.open(chatUrl, `chat_${videoId}`, 'width=400,height=600,scrollbars=yes')
    }
  }

  return (
    <div
      className="w-[340px] min-w-[280px] bg-dark-card"
      onContextMenu={handleContextMenu}
      title={platform === 'youtube' ? '右クリックで別ウィンドウで開く' : undefined}
    >
      <iframe
        src={chatSrc}
        className="w-full h-full border-none"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title={`${platform} chat`}
      />
    </div>
  )
}
