import '@testing-library/jest-dom'

// Mock navigator.language to return Japanese for consistent test results
Object.defineProperty(navigator, 'language', {
  value: 'ja-JP',
  configurable: true,
})
