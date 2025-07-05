import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranscriptItemMap, useAutoScroll } from '../useTranscript';
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

describe('useAutoScroll', () => {
  const mockRef = { current: document.createElement('div') };
  const mockCurrentItem = document.createElement('div');
  mockCurrentItem.setAttribute('data-current', 'true');

  beforeEach(() => {
    vi.spyOn(mockRef.current, 'querySelector').mockReturnValue(mockCurrentItem);
    vi.spyOn(mockCurrentItem, 'getBoundingClientRect').mockReturnValue({
      top: 600,
      bottom: 640,
      height: 40,
    } as DOMRect);
    vi.spyOn(mockRef.current, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 500,
      height: 500,
    } as DOMRect);
  });

  it('scrolls when item is out of view', () => {
    const scrollIntoViewMock = vi.fn();
    mockCurrentItem.scrollIntoView = scrollIntoViewMock;

    renderHook(() => useAutoScroll(mockRef, 1));

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    });
  });

  it('does not scroll when item is in view', () => {
    const scrollIntoViewMock = vi.fn();
    mockCurrentItem.scrollIntoView = scrollIntoViewMock;

    vi.spyOn(mockCurrentItem, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 140,
      height: 40,
    } as DOMRect);

    renderHook(() => useAutoScroll(mockRef, 1));

    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });

  it('does nothing when no current item found', () => {
    vi.spyOn(mockRef.current, 'querySelector').mockReturnValue(null);
    const { result } = renderHook(() => useAutoScroll(mockRef, 1));
    expect(result.current).toBeUndefined();
  });
});
