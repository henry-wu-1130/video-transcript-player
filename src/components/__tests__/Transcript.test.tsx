import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Transcript } from '../Transcript';
import { useVideoStore } from '../../stores/videoStore';

// Mock the video store
vi.mock('../../stores/videoStore', () => ({
  useVideoStore: vi.fn(),
}));

describe('Transcript Component', () => {
  const mockSections = [
    {
      id: 'section1',
      title: '測試段落 1',
      items: [
        { time: 0, text: '測試文字 1' },
        { time: 10, text: '測試文字 2', isHighlight: true },
      ],
    },
    {
      id: 'section2',
      title: '測試段落 2',
      items: [
        { time: 20, text: '測試文字 3' },
        { time: 30, text: '測試文字 4' },
      ],
    },
  ];

  const mockSetCurrentTime = vi.fn();
  const mockToggleSelection = vi.fn();

  beforeEach(() => {
    // Setup mock store
    (useVideoStore as any).mockReturnValue({
      sections: mockSections,
      currentTime: 5,
      setCurrentTime: mockSetCurrentTime,
      toggleSelection: mockToggleSelection,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders all sections and items', () => {
    render(<Transcript />);

    // Check section title
    expect(screen.getByText('測試段落 1')).toBeInTheDocument();

    // Check items
    expect(screen.getByText('測試文字 1')).toBeInTheDocument();
    expect(screen.getByText('測試文字 2')).toBeInTheDocument();
  });

  it('handles time click correctly', () => {
    render(<Transcript />);

    // Click on the first timestamp
    const timeButton = screen.getByText('00:00');
    fireEvent.click(timeButton);

    expect(mockSetCurrentTime).toHaveBeenCalledWith(0);
  });

  it('highlights correct item when clicking timestamp in second section', () => {
    cleanup();

    // Set current time to second section's first item
    (useVideoStore as any).mockReturnValue({
      sections: mockSections,
      currentTime: 20,
      setCurrentTime: mockSetCurrentTime,
      toggleSelection: mockToggleSelection,
    });

    const { container, rerender } = render(<Transcript />);

    // Click on the second section's second timestamp
    const timeButton = screen.getByText('00:30');
    fireEvent.click(timeButton);

    // Should call setCurrentTime with the correct time
    expect(mockSetCurrentTime).toHaveBeenCalledWith(30);

    // Update store to simulate video seeking to that time
    (useVideoStore as any).mockReturnValue({
      sections: mockSections,
      currentTime: 30,
      setCurrentTime: mockSetCurrentTime,
      toggleSelection: mockToggleSelection,
    });

    // Re-render the same component instance
    rerender(<Transcript />);

    // Query items by their unique combination of section and index
    const section2Items = container.querySelectorAll(
      '[data-section-id="section2"] [data-item-index]'
    );
    const currentItem = section2Items[1];
    const notCurrentItem = section2Items[0];

    expect(currentItem).toHaveClass('border-2');
    expect(currentItem).toHaveClass('border-amber-400');
    expect(notCurrentItem).not.toHaveClass('border-amber-400');
  });

  it('handles item selection correctly', () => {
    render(<Transcript />);

    // Click on the first item
    const item = screen.getByText('測試文字 1');
    fireEvent.click(item.parentElement!);

    expect(mockToggleSelection).toHaveBeenCalledWith('section1', 0);
  });

  it('shows current playing item with golden border', () => {
    render(<Transcript />);

    // The first item should be highlighted as current (time: 5 is between 0 and 10)
    const currentItem = screen.getByText('測試文字 1').parentElement;
    expect(currentItem).toHaveClass('border-2');
    expect(currentItem).toHaveClass('border-amber-400');
  });

  it('shows selected items with blue background', () => {
    render(<Transcript />);

    // The second item is marked as selected in mock data
    const selectedItem = screen.getByText('測試文字 2').parentElement;
    expect(selectedItem).toHaveClass('bg-blue-500');
  });
});
