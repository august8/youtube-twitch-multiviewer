import { useVideoStore } from '@/stores/videoStore'
import { translations, type TranslationKeys } from './translations'

export function useTranslation(): TranslationKeys {
  const locale = useVideoStore((state) => state.locale)
  return translations[locale]
}
