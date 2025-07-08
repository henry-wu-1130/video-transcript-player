import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Preview } from '../Preview';
import { useVideoStore } from '../../stores/videoStore';

vi.mock('../../stores/videoStore');

describe('Preview', () => {
  const mockStore = {
    videoUrl: null,
    isProcessing: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useVideoStore).mockReturnValue(mockStore as any);
  });

  it('should show upload message when no video', () => {
    render(<Preview />);
    expect(screen.getByText('Upload a video to preview')).toBeInTheDocument();
  });

  it('should show loading when processing', () => {
    vi.mocked(useVideoStore).mockReturnValue({
      ...mockStore,
      isProcessing: true,
    } as any);
    render(<Preview />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should show video player when video is available', () => {
    const videoUrl = 'test-video.mp4';
    vi.mocked(useVideoStore).mockReturnValue({
      ...mockStore,
      videoUrl,
    } as any);
    render(<Preview />);
    const video = screen.getByTestId('video-player');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', videoUrl);
  });
});
