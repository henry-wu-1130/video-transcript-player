import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { TranscriptContainer } from '../../containers/TranscriptContainer';
import { useVideoStore } from '../../stores/videoStore';

// Mock the video store
vi.mock('../../stores/videoStore', () => ({
  useVideoStore: vi.fn(),
}));

describe('TranscriptContainer', () => {
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
    render(<TranscriptContainer />);

    // Check section title
    expect(screen.getByText('測試段落 1')).toBeInTheDocument();

    // Check items
    expect(screen.getByText('測試文字 1')).toBeInTheDocument();
    expect(screen.getByText('測試文字 2')).toBeInTheDocument();
  });

  it('handles time click correctly', () => {
    render(<TranscriptContainer />);

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

    const { container, rerender } = render(<TranscriptContainer />);

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
    rerender(<TranscriptContainer />);

    // Query items by their unique combination of section and index
    const section2Items = container.querySelectorAll(
      '[data-section-id="section2"] [data-item-index]'
    );
    const currentItem = section2Items[1];
    const notCurrentItem = section2Items[0];

    expect(currentItem).toHaveClass('border-2');
    expect(currentItem).toHaveClass('border-amber-400');
    expect(currentItem).toHaveAttribute('data-current', 'true');
    expect(notCurrentItem).not.toHaveClass('border-amber-400');
    expect(notCurrentItem).toHaveAttribute('data-current', 'false');
  });

  it('handles item selection correctly', () => {
    render(<TranscriptContainer />);

    // Click on the first item
    const item = screen.getByText('測試文字 1');
    fireEvent.click(item.parentElement!);

    expect(mockToggleSelection).toHaveBeenCalledWith('section1', 0);
  });

  it('shows current playing item with golden border', () => {
    render(<TranscriptContainer />);

    // The first item should be highlighted as current (time: 5 is between 0 and 10)
    const currentItem = screen.getByText('測試文字 1').parentElement;
    expect(currentItem).toHaveClass('border-2');
    expect(currentItem).toHaveClass('border-amber-400');
  });

  it('shows selected items with blue background', () => {
    render(<TranscriptContainer />);

    // The second item is marked as selected in mock data
    const selectedItem = screen.getByText('測試文字 2').parentElement;
    expect(selectedItem).toHaveClass('bg-blue-500');
  });

  it('auto-scrolls to current item when it changes', () => {
    // Mock scrollIntoView
    const mockScrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;

    // Mock getBoundingClientRect for container and current item
    const mockContainerRect = {
      top: 0,
      bottom: 500,
      height: 500,
    };
    const mockItemRect = {
      top: 600,
      bottom: 640,
      height: 40,
    };

    // Mock element properties
    Element.prototype.getBoundingClientRect = vi
      .fn()
      .mockImplementation(function (this: Element) {
        if (this.hasAttribute('data-current')) {
          return mockItemRect;
        }
        return mockContainerRect;
      });
    Object.defineProperty(Element.prototype, 'clientHeight', {
      get: () => 500,
    });
    Object.defineProperty(Element.prototype, 'scrollTop', {
      get: () => 0,
    });

    // Set initial current time
    (useVideoStore as any).mockReturnValue({
      sections: mockSections,
      currentTime: 0,
      setCurrentTime: mockSetCurrentTime,
      toggleSelection: mockToggleSelection,
    });

    const { rerender } = render(<TranscriptContainer />);

    // Update current time to trigger auto-scroll
    (useVideoStore as any).mockReturnValue({
      sections: mockSections,
      currentTime: 30,
      setCurrentTime: mockSetCurrentTime,
      toggleSelection: mockToggleSelection,
    });

    rerender(<TranscriptContainer />);

    // Verify that scrollIntoView was called with correct options
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    });
  });
});
