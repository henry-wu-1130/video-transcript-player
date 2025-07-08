import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock child components
vi.mock('./components/Layout', () => ({
  Layout: ({ header, children }: { header: React.ReactNode, children: React.ReactNode }) => (
    <div data-testid="layout">
      <div data-testid="layout-header">{header}</div>
      {children}
    </div>
  ),
}));

vi.mock('./components/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

vi.mock('./containers/TranscriptContainer', () => ({
  TranscriptContainer: () => <div data-testid="transcript-container">TranscriptContainer</div>,
}));

vi.mock('./containers/VideoPlayerContainer', () => ({
  VideoPlayerContainer: () => <div data-testid="video-player-container">VideoPlayerContainer</div>,
}));

describe('App', () => {
  it('should render all main components in correct layout', () => {
    render(<App />);
    
    // 確認所有主要組件都有渲染
    // 檢查基本結構
    const layout = screen.getByTestId('layout');
    const layoutHeader = screen.getByTestId('layout-header');
    const header = screen.getByTestId('header');
    
    expect(layout).toBeInTheDocument();
    expect(layoutHeader).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(layoutHeader).toContainElement(header);
    expect(screen.getByTestId('transcript-container')).toBeInTheDocument();
    expect(screen.getByTestId('video-player-container')).toBeInTheDocument();

    // 確認主要容器的存在
    const transcriptContainer = screen.getByTestId('transcript-container');
    const videoPlayerContainer = screen.getByTestId('video-player-container');
    
    expect(transcriptContainer).toBeInTheDocument();
    expect(videoPlayerContainer).toBeInTheDocument();
    
    // 確認兩個容器都是直接的兄弟節點
    expect(transcriptContainer.parentElement?.parentElement).toBe(
      videoPlayerContainer.parentElement?.parentElement
    );
    
    // 確認兩個容器都是可見的
    expect(transcriptContainer).toBeVisible();
    expect(videoPlayerContainer).toBeVisible();
  });
});
