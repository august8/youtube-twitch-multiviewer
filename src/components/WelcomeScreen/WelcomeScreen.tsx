import { useVideoStore } from '@/stores/videoStore'
import { FeatureCard } from './FeatureCard'

const features = [
  {
    icon: '📺',
    title: '複数配信の同時視聴',
    description:
      'YouTube・Twitchの配信を同時に表示。画面は自動でグリッド配置されます。',
  },
  {
    icon: '💬',
    title: 'ライブチャット表示',
    description:
      '各配信のチャットを表示可能。ライブ配信やVODのチャットリプレイに対応。',
  },
  {
    icon: '⏱️',
    title: '再生時間の微調整',
    description:
      'YouTube動画は±5秒/10秒のシークボタンで配信のズレを調整できます。',
  },
]

export function WelcomeScreen() {
  const startViewing = useVideoStore((state) => state.startViewing)

  return (
    <div className="flex flex-col items-center justify-center max-w-3xl mx-auto px-5 py-10 text-center">
      <h1 className="text-3xl font-bold mb-5 text-blue-400">
        🎬 YouTube / Twitch マルチビューア
      </h1>
      <p className="text-base leading-relaxed mb-8 text-gray-300">
        複数のYouTubeライブ配信やTwitchストリーミングを同時に視聴できるツールです。
        <br />
        配信を比較したり、複数の視点から楽しむことができます。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 text-left w-full">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>

      <button
        onClick={startViewing}
        className="px-10 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        使い始める
      </button>
    </div>
  )
}
