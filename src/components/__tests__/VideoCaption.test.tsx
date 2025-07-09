import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VideoCaption } from '../VideoCaption';
import { useVideoStore } from '../../stores/videoStore';

// Mock the video store
vi.mock('../../stores/videoStore', () => ({
  useVideoStore: vi.fn(),
}));

describe('VideoCaption', () => {
  const mockSections = [
    {
      id: 'section1',
      title: '測試段落 1',
      summary: '段落一摘要',
      items: [
        { time: 0, text: '測試字幕 1', isHighlight: false },
        { time: 10, text: '測試字幕 2', isHighlight: false },
      ],
    },
  ];

  beforeEach(() => {
    vi.mocked(useVideoStore).mockReturnValue({
      sections: mockSections,
      currentTime: 5,
    });
  });

  it('renders current caption text', () => {
    render(<VideoCaption />);
    expect(screen.getByText('測試字幕 1')).toBeInTheDocument();
  });

  it('renders nothing when no current caption', () => {
    vi.mocked(useVideoStore).mockReturnValue({
      sections: mockSections,
      currentTime: 20, // Time after all captions
    });

    const { container } = render(<VideoCaption />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when no sections available', () => {
    vi.mocked(useVideoStore).mockReturnValue({
      sections: [],
      currentTime: 0,
    });

    const { container } = render(<VideoCaption />);
    expect(container.firstChild).toBeNull();
  });
});
