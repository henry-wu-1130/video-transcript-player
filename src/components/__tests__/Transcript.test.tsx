import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Transcript } from '../Transcript'
import { useVideoStore } from '../../stores/videoStore'

// Mock the video store
vi.mock('../../stores/videoStore', () => ({
  useVideoStore: vi.fn()
}))

describe('Transcript Component', () => {
  const mockSections = [
    {
      id: 'section1',
      title: '測試段落',
      items: [
        { time: 0, text: '測試文字 1' },
        { time: 10, text: '測試文字 2', isSelected: true }
      ]
    }
  ]

  const mockSetCurrentTime = vi.fn()
  const mockToggleSelection = vi.fn()

  beforeEach(() => {
    // Setup mock store
    ;(useVideoStore as any).mockReturnValue({
      sections: mockSections,
      currentTime: 5,
      setCurrentTime: mockSetCurrentTime,
      toggleSelection: mockToggleSelection
    })
  })

  it('renders all sections and items', () => {
    render(<Transcript />)
    
    // Check section title
    expect(screen.getByText('測試段落')).toBeInTheDocument()
    
    // Check items
    expect(screen.getByText('測試文字 1')).toBeInTheDocument()
    expect(screen.getByText('測試文字 2')).toBeInTheDocument()
  })

  it('handles time click correctly', () => {
    render(<Transcript />)
    
    // Click on the first timestamp
    const timeButton = screen.getByText('00:00')
    fireEvent.click(timeButton)
    
    expect(mockSetCurrentTime).toHaveBeenCalledWith(0)
  })

  it('handles item selection correctly', () => {
    render(<Transcript />)
    
    // Click on the first item
    const item = screen.getByText('測試文字 1')
    fireEvent.click(item.parentElement!)
    
    expect(mockToggleSelection).toHaveBeenCalledWith('section1', 0)
  })

  it('highlights current playing item', () => {
    render(<Transcript />)
    
    // The first item should be highlighted as current (time: 5 is between 0 and 10)
    const currentItem = screen.getByText('測試文字 1').parentElement
    expect(currentItem).toHaveClass('ring-1')
    expect(currentItem).toHaveClass('ring-blue-400')
  })

  it('shows selected items with different background', () => {
    render(<Transcript />)
    
    // The second item is marked as selected in mock data
    const selectedItem = screen.getByText('測試文字 2').parentElement
    expect(selectedItem).toHaveClass('bg-blue-50')
  })
})
