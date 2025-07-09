import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VideoControls } from '../VideoControls';
import { useVideoStore } from '../../stores/videoStore';
import { mockTranscriptSections } from '../../mocks/transcriptData';

// Mock video element
const mockVideoRef = {
  current: {
    paused: true,
    play: vi.fn(),
    pause: vi.fn(),
    currentTime: 30,
  },
} as unknown as React.MutableRefObject<HTMLVideoElement>;

// Mock store
vi.mock('../../stores/videoStore');

describe('VideoControls', () => {
  const mockSetCurrentTime = vi.fn();
  const defaultStore = {
    currentTime: 30,
    sections: mockTranscriptSections,
    setCurrentTime: mockSetCurrentTime,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset video ref state
    mockVideoRef.current = {
      paused: true,
      play: vi.fn(),
      pause: vi.fn(),
      currentTime: 30,
    } as unknown as HTMLVideoElement;
    // Reset store state
    vi.mocked(useVideoStore).mockReturnValue({ ...defaultStore });
  });

  it('should render time display correctly', () => {
    const store = { ...defaultStore };
    vi.mocked(useVideoStore).mockReturnValue(store);

    render(<VideoControls videoRef={mockVideoRef} duration={90} />);
    expect(screen.getByText('00:30 / 01:30')).toBeInTheDocument();
  });

  it('should handle play/pause button click', () => {
    const store = { ...defaultStore };
    vi.mocked(useVideoStore).mockReturnValue(store);

    render(<VideoControls videoRef={mockVideoRef} duration={90} />);
    const playButton = screen.getByRole('button', { name: /play/i });

    fireEvent.click(playButton);
    expect(mockVideoRef.current.play).toHaveBeenCalled();

    Object.defineProperty(mockVideoRef.current, 'paused', {
      configurable: true,
      get: () => false,
    });
    fireEvent.click(playButton);
    expect(mockVideoRef.current.pause).toHaveBeenCalled();
  });

  it('should navigate to previous section', () => {
    const store = {
      ...defaultStore,
      currentTime: 35, // Ensure we're in section2 (between 30 and 60)
      sections: [
        {
          id: 'section1',
          title: 'Section 1',
          items: [{ time: 0, text: 'Item 1' }],
        },
        {
          id: 'section2',
          title: 'Section 2',
          items: [{ time: 30, text: 'Item 2' }],
        },
        {
          id: 'section3',
          title: 'Section 3',
          items: [{ time: 60, text: 'Item 3' }],
        },
      ],
      setCurrentTime: mockSetCurrentTime,
    };
    vi.mocked(useVideoStore).mockReturnValue(store);

    render(<VideoControls videoRef={mockVideoRef} duration={90} />);
    const prevButton = screen.getByRole('button', {
      name: /previous section/i,
    });

    fireEvent.click(prevButton);
    expect(mockSetCurrentTime).toHaveBeenCalledWith(0); // Should navigate to first item of section1
  });

  it('should navigate to next section', () => {
    const store = { ...defaultStore };
    vi.mocked(useVideoStore).mockReturnValue(store);

    render(<VideoControls videoRef={mockVideoRef} duration={90} />);
    const nextButton = screen.getByRole('button', { name: /next section/i });

    fireEvent.click(nextButton);
    expect(mockSetCurrentTime).toHaveBeenCalledWith(35);
  });

  it('should disable previous button at first section', () => {
    const firstSectionStore = {
      currentTime: 0,
      sections: [
        {
          id: 'section1',
          title: 'Section 1',
          items: [{ time: 0, text: 'Item 1' }],
        },
      ],
      setCurrentTime: mockSetCurrentTime,
    };
    vi.mocked(useVideoStore).mockReturnValue(firstSectionStore);

    render(<VideoControls videoRef={mockVideoRef} duration={90} />);
    const prevButton = screen.getByRole('button', {
      name: /previous section/i,
    });
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button at last section', () => {
    const lastSectionStore = {
      currentTime: 60,
      sections: [
        {
          id: 'section3',
          title: 'Section 3',
          items: [{ time: 60, text: 'Item 3' }],
        },
      ],
      setCurrentTime: mockSetCurrentTime,
    };
    vi.mocked(useVideoStore).mockReturnValue(lastSectionStore);

    render(<VideoControls videoRef={mockVideoRef} duration={90} />);
    const nextButton = screen.getByRole('button', { name: /next section/i });
    expect(nextButton).toBeDisabled();
  });
});
