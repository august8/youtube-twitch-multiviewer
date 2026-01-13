import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ControlsModal } from './ControlsModal'
import { useVideoStore } from '@/stores/videoStore'

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('ControlsModal', () => {
  beforeEach(() => {
    // Reset store state before each test
    useVideoStore.setState({
      videos: [],
      videoOrder: {},
      isWelcomeVisible: false,
      isModalOpen: true,
      ytApiReady: false,
      layoutMode: 'grid',
      themeMode: 'system',
    })

    // Mock clipboard API
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  it('should not render when modal is closed', () => {
    useVideoStore.setState({ isModalOpen: false })
    render(<ControlsModal />)
    expect(screen.queryByPlaceholderText(/YouTube または Twitch/)).not.toBeInTheDocument()
  })

  it('should render when modal is open', () => {
    render(<ControlsModal />)
    expect(screen.getByPlaceholderText(/YouTube または Twitch/)).toBeInTheDocument()
  })

  it('should render all buttons', () => {
    render(<ControlsModal />)
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'リセット' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '共有URLをコピー' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '閉じる' })).toBeInTheDocument()
  })

  it('should render layout options', () => {
    render(<ControlsModal />)
    expect(screen.getByText('グリッド')).toBeInTheDocument()
    expect(screen.getByText('フォーカス')).toBeInTheDocument()
    expect(screen.getByText('横並び')).toBeInTheDocument()
    expect(screen.getByText('縦並び')).toBeInTheDocument()
  })

  it('should render theme options', () => {
    render(<ControlsModal />)
    expect(screen.getByText('自動')).toBeInTheDocument()
    expect(screen.getByText('ライト')).toBeInTheDocument()
    expect(screen.getByText('ダーク')).toBeInTheDocument()
  })

  it('should change layout mode when layout button is clicked', () => {
    render(<ControlsModal />)

    fireEvent.click(screen.getByText('フォーカス'))
    expect(useVideoStore.getState().layoutMode).toBe('focus')

    fireEvent.click(screen.getByText('横並び'))
    expect(useVideoStore.getState().layoutMode).toBe('horizontal')
  })

  it('should change theme mode when theme button is clicked', () => {
    render(<ControlsModal />)

    fireEvent.click(screen.getByText('ダーク'))
    expect(useVideoStore.getState().themeMode).toBe('dark')

    fireEvent.click(screen.getByText('ライト'))
    expect(useVideoStore.getState().themeMode).toBe('light')
  })

  it('should close modal when close button is clicked', () => {
    render(<ControlsModal />)

    fireEvent.click(screen.getByRole('button', { name: '閉じる' }))
    expect(useVideoStore.getState().isModalOpen).toBe(false)
  })

  it('should close modal when backdrop is clicked', () => {
    render(<ControlsModal />)

    // Get the backdrop (first div with fixed class)
    const backdrop = document.querySelector('.fixed.inset-0')
    if (backdrop) {
      fireEvent.click(backdrop)
      expect(useVideoStore.getState().isModalOpen).toBe(false)
    }
  })

  it('should update URL input value', () => {
    render(<ControlsModal />)

    const input = screen.getByPlaceholderText(/YouTube または Twitch/)
    fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=test' } })
    expect(input).toHaveValue('https://youtube.com/watch?v=test')
  })
})
