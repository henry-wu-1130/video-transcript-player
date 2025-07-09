import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAutoScroll } from '../useTranscriptItemMap';

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
