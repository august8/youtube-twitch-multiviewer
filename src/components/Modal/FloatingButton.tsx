import { useVideoStore } from '@/stores/videoStore'

export function FloatingButton() {
  const isModalOpen = useVideoStore((state) => state.isModalOpen)
  const setModalOpen = useVideoStore((state) => state.setModalOpen)

  return (
    <button
      onClick={() => setModalOpen(!isModalOpen)}
      className="fixed bottom-5 right-5 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xl flex items-center justify-center shadow-lg transition-colors z-50"
    >
      ☰
    </button>
  )
}
