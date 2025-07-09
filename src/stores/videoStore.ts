import { create } from 'zustand';
import * as API from '../services/apis';
import { showToast } from '../components/Toast';

interface TranscriptItem {
  time: number;
  text: string;
  isHighlight: boolean;
}

interface TranscriptSection {
  id: string;
  title: string;
  summary: string;
  items: TranscriptItem[];
}

interface Highlight {
  time: number;
  text: string;
  sectionId: string;
}

interface VideoState {
  isProcessing: boolean;
  selectedVideo: File | null;
  videoUrl: string | null;
  currentTime: number;
  fullTranscript: string | null;
  sections: TranscriptSection[];
  highlights: Highlight[];
  uploadVideo: (file: File) => Promise<void>;
  setCurrentTime: (time: number) => void;
  toggleSelection: (sectionId: string, itemIndex: number) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  // Initial state
  isProcessing: false,
  selectedVideo: null,
  videoUrl: null,
  currentTime: 0,
  fullTranscript: null,
  sections: [],
  highlights: [],
  // Actions
  uploadVideo: async (file: File) => {
    if (!file || !file.type.startsWith('video/')) {
      showToast('Please select a video file', 'error');
      return;
    }

    set((state: VideoState) => ({
      ...state,
      selectedVideo: file,
      isProcessing: true,
      videoUrl: null,
      fullTranscript: null,
      sections: [],
      highlights: [],
    }));

    try {
      const response = await API.processVideo(file);

      if (response.data.success) {
        const { videoUrl, fullTranscript, sections, highlights } =
          response.data.data;
        console.log('Video processing completed:', response.data.data);

        set((state: VideoState) => ({
          ...state,
          isProcessing: false,
          videoUrl,
          fullTranscript,
          sections,
          highlights,
        }));
      }
    } catch (error) {
      console.error('Video processing error:', error);
      showToast('Processing failed', 'error');
      set((state: VideoState) => ({
        ...state,
        isProcessing: false,
        selectedVideo: null,
        videoUrl: null,
        fullTranscript: null,
        sections: [],
        highlights: [],
      }));
    }
  },
  setCurrentTime: (time: number) =>
    set((state: VideoState) => ({
      ...state,
      currentTime: time,
    })),
  toggleSelection: (sectionId: string, itemIndex: number) =>
    set((state: VideoState) => ({
      ...state,
      sections: state.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item, i) => {
              if (i === itemIndex) {
                return { ...item, isHighlight: !item.isHighlight };
              }
              return item;
            }),
          };
        }
        return section;
      }),
    })),
}));

export type { TranscriptSection, TranscriptItem, Highlight };
