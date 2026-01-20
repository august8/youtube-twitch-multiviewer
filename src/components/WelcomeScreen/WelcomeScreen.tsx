import { useVideoStore } from '@/stores/videoStore'
import { useTranslation } from '@/i18n'
import { FeatureCard } from './FeatureCard'

export function WelcomeScreen() {
  const startViewing = useVideoStore((state) => state.startViewing)
  const t = useTranslation()

  const features = [
    {
      icon: '📺',
      title: t.welcome.features.multiView.title,
      description: t.welcome.features.multiView.description,
    },
    {
      icon: '💬',
      title: t.welcome.features.liveChat.title,
      description: t.welcome.features.liveChat.description,
    },
    {
      icon: '⏱️',
      title: t.welcome.features.seekControl.title,
      description: t.welcome.features.seekControl.description,
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center max-w-3xl mx-auto px-5 py-10 text-center">
      <h1 className="text-3xl font-bold mb-5 text-blue-400">🎬 {t.welcome.title}</h1>
      <p className="text-base leading-relaxed mb-8 text-gray-300">
        {t.welcome.description}
        <br />
        {t.welcome.descriptionSub}
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
        {t.welcome.startButton}
      </button>
    </div>
  )
}
