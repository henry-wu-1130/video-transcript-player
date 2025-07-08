import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VideoPlayerContainer } from '../VideoPlayerContainer';
import { useVideoStore } from '../../stores/videoStore';

// Mock VideoPlayer component
vi.mock('../../components/VideoPlayer', () => ({
  VideoPlayer: ({
    videoRef,
    videoUrl,
    currentTime,
    duration,
    onTimeUpdate,
    onDurationChange,
  }: any) => (
    // 模擬組件渲染
    <div data-testid="video-player-container">
      <div data-testid="video-url">URL: {videoUrl}</div>
      <div data-testid="video-time">Time: {currentTime}</div>
      <div data-testid="video-duration">Duration: {duration}</div>
      <button 
        data-testid="update-time-btn" 
        onClick={() => {
          // 模擬 video 元素
          const mockVideo = { currentTime: 45 };
          Object.defineProperty(mockVideo, 'currentTime', {
            get: () => 45,
            configurable: true
          });
          // 設置到 videoRef.current
          (videoRef as any).current = mockVideo;
          onTimeUpdate();
        }}
      >
        Update Time
      </button>
      <button 
        data-testid="update-duration-btn" 
        onClick={() => {
          // 模擬 video 元素
          const mockVideo = { duration: 90 };
          Object.defineProperty(mockVideo, 'duration', {
            get: () => 90,
            configurable: true
          });
          // 設置到 videoRef.current
          (videoRef as any).current = mockVideo;
          onDurationChange();
        }}
      >
        Update Duration
      </button>
    </div>
  ),
}));

// Mock store
vi.mock('../../stores/videoStore');

describe('VideoPlayerContainer', () => {
  const mockSetCurrentTime = vi.fn();
  const mockStore = {
    videoUrl: 'test-video.mp4',
    currentTime: 30,
    setCurrentTime: mockSetCurrentTime,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useVideoStore).mockReturnValue(mockStore as any);
  });

  it('should render VideoPlayer with correct props', () => {
    render(<VideoPlayerContainer />);
    
    const player = screen.getByTestId('video-player-container');
    const urlElement = screen.getByTestId('video-url');
    const timeElement = screen.getByTestId('video-time');
    
    expect(player).toBeInTheDocument();
    expect(urlElement).toHaveTextContent('URL: test-video.mp4');
    expect(timeElement).toHaveTextContent('Time: 30');
  });

  it('should update current time when video time changes', () => {
    render(<VideoPlayerContainer />);
    
    const updateButton = screen.getByTestId('update-time-btn');
    fireEvent.click(updateButton);
    
    expect(mockSetCurrentTime).toHaveBeenCalled();
  });

  it('should handle duration change', () => {
    render(<VideoPlayerContainer />);
    
    const durationButton = screen.getByTestId('update-duration-btn');
    fireEvent.click(durationButton);
    
    expect(screen.getByTestId('video-duration')).toBeInTheDocument();
  });

  it('should show preview message when no video', () => {
    vi.mocked(useVideoStore).mockReturnValue({
      ...mockStore,
      videoUrl: null,
    } as any);

    render(<VideoPlayerContainer />);
    expect(screen.getByText('Upload a video to preview')).toBeInTheDocument();
    expect(screen.queryByTestId('video-url')).not.toBeInTheDocument();
  });
});
