import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranscriptItemMap } from '../useTranscriptItemMap';
import type { TranscriptSection } from '../../stores/videoStore';

describe('useTranscriptItemMap', () => {
  const mockSections: TranscriptSection[] = [
    {
      id: 'section1',
      title: '測試段落 1',
      summary: '段落一摘要',
      items: [
        { time: 0, text: '測試字幕 1', isHighlight: false },
        { time: 10, text: '測試字幕 2', isHighlight: false },
      ],
    },
    {
      id: 'section2',
      title: '測試段落 2',
      summary: '段落二摘要',
      items: [
        { time: 20, text: '測試字幕 3', isHighlight: false },
        { time: 30, text: '測試字幕 4', isHighlight: false },
      ],
    },
  ];

  it('returns correct item for exact time match', () => {
    const { result } = renderHook(() => useTranscriptItemMap(mockSections, 10));
    expect(result.current).toEqual({
      currentSectionIndex: 0,
      currentItemIndex: 1,
      currentItem: { time: 10, text: '測試字幕 2', isHighlight: false },
    });
  });

  it('returns correct item for time between items', () => {
    const { result } = renderHook(() => useTranscriptItemMap(mockSections, 5));
    expect(result.current).toEqual({
      currentSectionIndex: 0,
      currentItemIndex: 0,
      currentItem: { time: 0, text: '測試字幕 1', isHighlight: false },
    });
  });

  it('returns null item for time before first item', () => {
    const { result } = renderHook(() => useTranscriptItemMap(mockSections, -1));
    expect(result.current).toEqual({
      currentSectionIndex: -1,
      currentItemIndex: -1,
      currentItem: null,
    });
  });

  it('returns null item for time after last item', () => {
    const { result } = renderHook(() => useTranscriptItemMap(mockSections, 40));
    expect(result.current).toEqual({
      currentSectionIndex: -1,
      currentItemIndex: -1,
      currentItem: null,
    });
  });

  it('handles empty sections array', () => {
    const { result } = renderHook(() => useTranscriptItemMap([], 0));
    expect(result.current).toEqual({
      currentSectionIndex: -1,
      currentItemIndex: -1,
      currentItem: null,
    });
  });
});
