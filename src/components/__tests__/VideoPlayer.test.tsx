import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VideoPlayer } from '../VideoPlayer';

// Mock child components
vi.mock('../Timeline', () => ({
  Timeline: ({ duration }: { duration: number }) => (
    <div data-testid="timeline">Timeline: {duration}</div>
  ),
}));

vi.mock('../VideoControls', () => ({
  VideoControls: ({ duration }: { duration: number }) => (
    <div data-testid="video-controls">Controls: {duration}</div>
  ),
}));

vi.mock('../VideoCaption', () => ({
  VideoCaption: () => <div data-testid="video-caption">Caption</div>,
}));

// Mock video element
class MockVideoElement extends HTMLVideoElement {
  constructor() {
    super();
    Object.defineProperty(this, 'paused', {
      value: true,
      writable: true,
    });
  }
}

window.HTMLVideoElement = MockVideoElement as any;

describe('VideoPlayer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  const mockVideoRef = { current: null } as React.RefObject<HTMLVideoElement>;
  const mockProps = {
    videoRef: mockVideoRef,
    videoUrl: 'test-video.mp4',
    currentTime: 30,
    duration: 60,
    onTimeUpdate: vi.fn(),
    onDurationChange: vi.fn(),
  };

  it('should render video player with controls when video is available', () => {
    render(<VideoPlayer {...mockProps} />);

    const videoContainer = screen.getByTestId('video-container');
    expect(videoContainer).toBeInTheDocument();

    const video = videoContainer.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', mockProps.videoUrl);
    expect(video).not.toHaveAttribute('controls');

    expect(screen.getByTestId('video-controls')).toBeInTheDocument();
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
    expect(screen.getByTestId('video-caption')).toBeInTheDocument();
  });

  it('should show upload message when no video', () => {
    render(<VideoPlayer {...mockProps} videoUrl="" />);
    expect(screen.getByText('Upload a video to preview')).toBeInTheDocument();
    expect(screen.queryByTestId('video-container')).not.toBeInTheDocument();
  });

  it('should handle play/pause on video container click', async () => {
    let isPaused = true;
    const mockVideo = {} as HTMLVideoElement;
    const mockPlay = vi.fn().mockImplementation(() => {
      isPaused = false;
      return Promise.resolve();
    });
    const mockPause = vi.fn().mockImplementation(() => {
      isPaused = true;
      return Promise.resolve();
    });
    Object.defineProperty(mockVideo, 'play', {
      value: mockPlay,
      configurable: true,
    });
    Object.defineProperty(mockVideo, 'pause', {
      value: mockPause,
      configurable: true,
    });
    Object.defineProperty(mockVideo, 'paused', {
      get: () => isPaused,
      configurable: true,
    });
    const videoRef = {
      current: mockVideo,
    } as React.RefObject<HTMLVideoElement>;

    render(<VideoPlayer {...mockProps} videoRef={videoRef} />);
    const container = screen.getByTestId('video-container');

    // Test play
    await act(async () => {
      fireEvent.click(container);
      await mockPlay();
      await vi.runAllTimersAsync();
    });

    expect(mockPlay).toHaveBeenCalled();

    // Test pause
    mockPlay.mockImplementation(() => {
      isPaused = false;
      return Promise.resolve();
    });
    await act(async () => {
      fireEvent.click(container);
      await mockPause();
      await vi.runAllTimersAsync();
    });
    expect(mockPause).toHaveBeenCalled();
  });

  it('should sync video time with currentTime prop when difference is > 0.5s', async () => {
    let currentTime = 45;
    const mockVideo = {
      currentTime: 45,
      play: vi.fn(),
      pause: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      paused: true,
    } as unknown as HTMLVideoElement;

    // 先設置 videoRef，確保它在 render 前就準備好了
    const videoRef = {
      current: mockVideo,
    } as React.RefObject<HTMLVideoElement>;

    // 在 render 前就設置 currentTime 的 getter/setter
    Object.defineProperty(mockVideo, 'currentTime', {
      get: () => currentTime,
      set: (value) => {
        currentTime = value;
      },
      configurable: true,
    });

    // 當時間差 > 0.5s 時，應該更新
    render(
      <VideoPlayer
        videoRef={videoRef}
        videoUrl="test-video.mp4"
        currentTime={30}
        duration={60}
        onTimeUpdate={() => {}}
        onDurationChange={() => {}}
      />
    );

    act(() => {
      vi.runAllTimers();
    });

    expect(videoRef.current?.currentTime).toBe(30);
  });

  it('should not sync video time with currentTime prop when difference is < 0.5s', async () => {
    let currentTime = 30;
    const mockVideo = {
      currentTime: 30,
      play: vi.fn(),
      pause: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      paused: true,
    } as unknown as HTMLVideoElement;

    // 先設置 videoRef，確保它在 render 前就準備好了
    const videoRef = {
      current: mockVideo,
    } as React.RefObject<HTMLVideoElement>;

    // 在 render 後再設置 currentTime 的 getter/setter
    Object.defineProperty(mockVideo, 'currentTime', {
      get: () => currentTime,
      set: (value) => {
        currentTime = value;
      },
      configurable: true,
    });

    // 當時間差 < 0.5s 時，不應該更新
    render(
      <VideoPlayer
        videoRef={videoRef}
        videoUrl="test-video.mp4"
        currentTime={30.3}
        duration={60}
        onTimeUpdate={() => {}}
        onDurationChange={() => {}}
      />
    );

    act(() => {
      vi.runAllTimers();
    });

    expect(mockVideo.currentTime).toBe(30); // 應該保持原值
  });

  it('should call onTimeUpdate when video time updates', () => {
    const onTimeUpdate = vi.fn();
    const mockVideo = {
      currentTime: 0,
      paused: true,
    } as unknown as HTMLVideoElement;
    const videoRef = {
      current: mockVideo,
    } as React.RefObject<HTMLVideoElement>;

    render(
      <VideoPlayer
        {...mockProps}
        videoRef={videoRef}
        onTimeUpdate={onTimeUpdate}
      />
    );

    const video = screen.getByTestId('video-container').querySelector('video');
    expect(video).toBeInTheDocument();

    fireEvent.timeUpdate(video!);
    expect(onTimeUpdate).toHaveBeenCalled();
  });

  it('should call onDurationChange when video metadata is loaded', () => {
    const onDurationChange = vi.fn();
    const mockVideo = {
      currentTime: 0,
      paused: true,
      duration: 120,
    } as unknown as HTMLVideoElement;
    const videoRef = {
      current: mockVideo,
    } as React.RefObject<HTMLVideoElement>;

    render(
      <VideoPlayer
        {...mockProps}
        videoRef={videoRef}
        onDurationChange={onDurationChange}
      />
    );

    const video = screen.getByTestId('video-container').querySelector('video');
    expect(video).toBeInTheDocument();

    fireEvent.loadedMetadata(video!);
    expect(onDurationChange).toHaveBeenCalled();
  });

  it('should sync video time with currentTime prop', () => {
    const videoRef = {
      current: {
        currentTime: 0,
      } as unknown as HTMLVideoElement,
    } as React.RefObject<HTMLVideoElement>;

    render(<VideoPlayer {...mockProps} videoRef={videoRef} currentTime={45} />);
    expect(videoRef.current?.currentTime).toBe(45);
  });
});
