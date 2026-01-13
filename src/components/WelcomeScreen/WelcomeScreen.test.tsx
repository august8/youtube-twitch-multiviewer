import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WelcomeScreen } from './WelcomeScreen'
import { useVideoStore } from '@/stores/videoStore'

describe('WelcomeScreen', () => {
  beforeEach(() => {
    // Reset store state before each test
    useVideoStore.setState({
      videos: [],
      videoOrder: {},
      isWelcomeVisible: true,
      isModalOpen: false,
      ytApiReady: false,
      layoutMode: 'grid',
      themeMode: 'system',
    })
  })

  it('should render the title', () => {
    render(<WelcomeScreen />)
    expect(screen.getByText(/マルチビューア/)).toBeInTheDocument()
  })

  it('should render all feature cards', () => {
    render(<WelcomeScreen />)
    // Text is split by icon, so use partial match
    expect(screen.getByText(/複数配信の同時視聴/)).toBeInTheDocument()
    expect(screen.getByText(/ライブチャット表示/)).toBeInTheDocument()
    expect(screen.getByText(/再生時間の微調整/)).toBeInTheDocument()
  })

  it('should render start button', () => {
    render(<WelcomeScreen />)
    expect(screen.getByRole('button', { name: '使い始める' })).toBeInTheDocument()
  })

  it('should call startViewing when button is clicked', () => {
    render(<WelcomeScreen />)

    const button = screen.getByRole('button', { name: '使い始める' })
    fireEvent.click(button)

    const { isWelcomeVisible, isModalOpen } = useVideoStore.getState()
    expect(isWelcomeVisible).toBe(false)
    expect(isModalOpen).toBe(true)
  })
})
