import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  beforeAll,
  afterEach,
  afterAll,
} from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Header } from '../Header';
import { Toast } from '../Toast';
import { useVideoStore } from '../../stores/videoStore';
import { useToastStore } from '../../stores/toastStore';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/test';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
    <Toast />
  </>
);

describe('Header Component', () => {
  // Start MSW server before tests
  beforeAll(() => server.listen());

  // Reset handlers after each test
  afterEach(() => server.resetHandlers());

  // Clean up after all tests
  afterAll(() => server.close());

  beforeEach(() => {
    vi.resetAllMocks();
    useToastStore.setState({ message: '', isVisible: false });
    useVideoStore.setState({
      isProcessing: false,
      selectedVideo: null,
      videoUrl: null,
      currentTime: 0,
      fullTranscript: null,
      sections: [],
      highlights: [],
    });
  });

  it('should show loading state when video is processing', () => {
    useVideoStore.setState({ isProcessing: true });

    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('should handle video upload and API processing', async () => {
    // Mock API response
    server.use(
      http.post('/api/video/process', () => {
        return HttpResponse.json({
          success: true,
          data: {
            videoUrl: 'test.mp4',
            fullTranscript: 'Test transcript',
            sections: [
              {
                id: '1',
                title: 'Test Section',
                summary: 'Test summary',
                items: [{ time: 0, text: 'Test text', isHighlight: false }],
              },
            ],
            highlights: [],
          },
        });
      })
    );

    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    // Prepare test file and simulate user selecting it
    const file = new File([''], 'test.mp4', { type: 'video/mp4' });
    const input = screen.getByTestId('video-input');
    fireEvent.change(input, { target: { files: [file] } });

    // Verify loading state is set
    await waitFor(() => {
      const store = useVideoStore.getState();
      expect(store.isProcessing).toBe(true);
    });

    // Wait for processing to complete and verify final state
    await waitFor(() => {
      const store = useVideoStore.getState();
      expect(store.isProcessing).toBe(false);
      expect(store.videoUrl).toBe('test.mp4');
      expect(store.fullTranscript).toBe('Test transcript');
      expect(store.sections).toHaveLength(1);
      expect(store.sections[0].title).toBe('Test Section');
    });
  });

  it('should handle API error', async () => {
    // Mock API error response
    server.use(
      http.post('/api/video/process', () => {
        return HttpResponse.error();
      })
    );

    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    );

    // Prepare test file and simulate user selecting it
    const file = new File([''], 'test.mp4', { type: 'video/mp4' });
    const input = screen.getByTestId('video-input');
    fireEvent.change(input, { target: { files: [file] } });

    // Verify loading state is set
    await waitFor(() => {
      const store = useVideoStore.getState();
      expect(store.isProcessing).toBe(true);
    });

    // Wait for error state and verify store is reset
    await waitFor(() => {
      const store = useVideoStore.getState();
      expect(store.isProcessing).toBe(false);
      expect(store.videoUrl).toBeNull();
      expect(store.selectedVideo).toBeNull();
      expect(store.fullTranscript).toBeNull();
      expect(store.sections).toHaveLength(0);
    });

    // Check if error toast is shown
    await waitFor(() => {
      expect(screen.getByText('Processing failed')).toBeInTheDocument();
    });
  });
});
