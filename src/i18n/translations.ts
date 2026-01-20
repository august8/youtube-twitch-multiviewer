export type Locale = 'ja' | 'en'

interface FeatureTranslation {
  title: string
  description: string
}

interface TranslationSchema {
  welcome: {
    title: string
    description: string
    descriptionSub: string
    startButton: string
    features: {
      multiView: FeatureTranslation
      liveChat: FeatureTranslation
      seekControl: FeatureTranslation
    }
  }
  controls: {
    urlPlaceholder: string
    liveToggle: string
    addButton: string
    resetButton: string
    shareButton: string
    closeButton: string
    layoutLabel: string
    themeLabel: string
    layouts: {
      grid: string
      focus: string
      horizontal: string
      vertical: string
    }
    themes: {
      system: string
      light: string
      dark: string
    }
    language: string
  }
  toast: {
    urlRequired: string
    invalidPlatform: string
    youtubeIdError: string
    twitchIdError: string
    videoAdded: string
    noVideosToDelete: string
    allVideosDeleted: string
    noVideosToShare: string
    urlCopied: string
    copyFailed: string
    videoDeleted: string
    archiveChatUnavailable: string
  }
  a11y: {
    controlsMenu: string
    videoUrlInput: string
    layoutSelection: string
    themeSelection: string
    languageSelection: string
  }
}

export const translations: Record<Locale, TranslationSchema> = {
  ja: {
    // Welcome Screen
    welcome: {
      title: 'YouTube / Twitch マルチビューア',
      description:
        '複数のYouTubeライブ配信やTwitchストリーミングを同時に視聴できるツールです。',
      descriptionSub: '配信を比較したり、複数の視点から楽しむことができます。',
      startButton: '使い始める',
      features: {
        multiView: {
          title: '複数配信の同時視聴',
          description:
            'YouTube・Twitchの配信を同時に表示。画面は自動でグリッド配置されます。',
        },
        liveChat: {
          title: 'ライブチャット表示',
          description:
            '各配信のチャットを表示可能。ライブ配信やVODのチャットリプレイに対応。',
        },
        seekControl: {
          title: '再生時間の微調整',
          description:
            'YouTube動画は±5秒/10秒のシークボタンで配信のズレを調整できます。',
        },
      },
    },
    // Controls Modal
    controls: {
      urlPlaceholder: 'YouTube または Twitch の URL を入力',
      liveToggle: 'ライブ配信（チャット機能を有効化）',
      addButton: '追加',
      resetButton: 'リセット',
      shareButton: '共有URLをコピー',
      closeButton: '閉じる',
      layoutLabel: 'レイアウト',
      themeLabel: 'テーマ',
      layouts: {
        grid: 'グリッド',
        focus: 'フォーカス',
        horizontal: '横並び',
        vertical: '縦並び',
      },
      themes: {
        system: '自動',
        light: 'ライト',
        dark: 'ダーク',
      },
      language: '言語',
    },
    // Toast Messages
    toast: {
      urlRequired: 'URLを入力してください',
      invalidPlatform: 'YouTube または Twitch の URL を入力してください',
      youtubeIdError:
        'YouTube の動画IDを取得できませんでした。URLを確認してください',
      twitchIdError:
        'Twitch のチャンネル/VOD情報を取得できませんでした。URLを確認してください',
      videoAdded: '動画を追加しました',
      noVideosToDelete: '削除する動画がありません',
      allVideosDeleted: '全ての動画を削除しました',
      noVideosToShare: '共有する動画がありません',
      urlCopied: 'URLをコピーしました！',
      copyFailed: 'コピーに失敗しました',
      videoDeleted: '動画を削除しました',
      archiveChatUnavailable: 'アーカイブ動画ではチャット機能は利用できません',
    },
    // Accessibility
    a11y: {
      controlsMenu: 'コントロールメニュー',
      videoUrlInput: '動画URL',
      layoutSelection: 'レイアウト選択',
      themeSelection: 'テーマ選択',
      languageSelection: '言語選択',
    },
  },
  en: {
    // Welcome Screen
    welcome: {
      title: 'YouTube / Twitch Multi-Viewer',
      description:
        'A tool to watch multiple YouTube live streams and Twitch streams simultaneously.',
      descriptionSub:
        'Compare streams or enjoy multiple perspectives at once.',
      startButton: 'Get Started',
      features: {
        multiView: {
          title: 'Multi-Stream Viewing',
          description:
            'Display YouTube and Twitch streams together. Screens are automatically arranged in a grid.',
        },
        liveChat: {
          title: 'Live Chat Display',
          description:
            'Show chat for each stream. Supports live chat and VOD chat replay.',
        },
        seekControl: {
          title: 'Playback Time Adjustment',
          description:
            'Adjust YouTube video sync with ±5s/10s seek buttons.',
        },
      },
    },
    // Controls Modal
    controls: {
      urlPlaceholder: 'Enter YouTube or Twitch URL',
      liveToggle: 'Live stream (enable chat)',
      addButton: 'Add',
      resetButton: 'Reset',
      shareButton: 'Copy Share URL',
      closeButton: 'Close',
      layoutLabel: 'Layout',
      themeLabel: 'Theme',
      layouts: {
        grid: 'Grid',
        focus: 'Focus',
        horizontal: 'Horizontal',
        vertical: 'Vertical',
      },
      themes: {
        system: 'Auto',
        light: 'Light',
        dark: 'Dark',
      },
      language: 'Language',
    },
    // Toast Messages
    toast: {
      urlRequired: 'Please enter a URL',
      invalidPlatform: 'Please enter a YouTube or Twitch URL',
      youtubeIdError: 'Could not get YouTube video ID. Please check the URL',
      twitchIdError:
        'Could not get Twitch channel/VOD info. Please check the URL',
      videoAdded: 'Video added',
      noVideosToDelete: 'No videos to delete',
      allVideosDeleted: 'All videos deleted',
      noVideosToShare: 'No videos to share',
      urlCopied: 'URL copied!',
      copyFailed: 'Copy failed',
      videoDeleted: 'Video deleted',
      archiveChatUnavailable: 'Chat is not available for archived videos',
    },
    // Accessibility
    a11y: {
      controlsMenu: 'Controls Menu',
      videoUrlInput: 'Video URL',
      layoutSelection: 'Layout Selection',
      themeSelection: 'Theme Selection',
      languageSelection: 'Language Selection',
    },
  },
}

export type TranslationKeys = TranslationSchema
