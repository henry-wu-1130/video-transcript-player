import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock URL.createObjectURL and URL.revokeObjectURL
window.URL.createObjectURL = vi.fn()
window.URL.revokeObjectURL = vi.fn()
