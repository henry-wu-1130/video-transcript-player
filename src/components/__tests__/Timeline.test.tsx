import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Timeline } from '../Timeline';
import { useVideoStore } from '../../stores/videoStore';

vi.mock('../../stores/videoStore');

describe('Timeline', () => {
  const mockSetCurrentTime = vi.fn();
  const mockStore = {
    currentTime: 30,
    sections: [
      {
        id: 'section1',
        title: 'Section 1',
        items: [
          { time: 0, text: 'Item 1', isHighlight: true },
          { time: 15, text: 'Item 2', isHighlight: false },
        ],
      },
      {
        id: 'section2',
        title: 'Section 2',
        items: [
          { time: 30, text: 'Item 3', isHighlight: true },
          { time: 45, text: 'Item 4', isHighlight: true },
        ],
      },
    ],
    setCurrentTime: mockSetCurrentTime,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useVideoStore).mockReturnValue(mockStore as any);
  });

  it('should render timeline with correct duration', () => {
    render(<Timeline duration={60} />);
    const timeline = screen.getByRole('button');
    expect(timeline).toHaveAttribute(
      'class',
      expect.stringContaining('bg-gray-800')
    );
  });

  it('should render highlighted sections', () => {
    render(<Timeline duration={60} />);
    const highlightedSections = screen.getAllByTitle(/Section/);
    expect(highlightedSections).toHaveLength(3); // Items at 0, 30, and 45 seconds
  });

  it('should show current time indicator', () => {
    render(<Timeline duration={60} />);
    const indicator = screen.getByTestId('current-time-indicator');
    expect(indicator).toHaveStyle({ left: '50%' }); // 30 seconds is 50% of 60 seconds
  });

  it('should handle timeline click', () => {
    const { container } = render(<Timeline duration={60} />);
    const timeline = container.querySelector('.cursor-pointer');

    // Mock getBoundingClientRect
    const mockRect = {
      left: 0,
      width: 100,
    };
    vi.spyOn(timeline as HTMLElement, 'getBoundingClientRect').mockReturnValue(
      mockRect as DOMRect
    );

    // Click at 75% of the timeline
    fireEvent.click(timeline as HTMLElement, {
      clientX: 75,
    });

    expect(mockStore.setCurrentTime).toHaveBeenCalledWith(45); // 75% of 60 seconds
  });

  it('should not handle timeline click when ref is not available', () => {
    const { container } = render(<Timeline duration={60} />);
    const timeline = container.querySelector('.cursor-pointer');

    // Mock getBoundingClientRect to return undefined
    vi.spyOn(timeline as HTMLElement, 'getBoundingClientRect').mockReturnValue(
      undefined as unknown as DOMRect
    );

    fireEvent.click(timeline as HTMLElement);
    expect(mockStore.setCurrentTime).not.toHaveBeenCalled();
  });
});
