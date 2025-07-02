import { useMemo, useEffect } from 'react';
import type { RefObject } from 'react';
import { type TranscriptSection } from '../stores/videoStore';

export function useTranscriptItemMap(
  sections: TranscriptSection[],
  currentTime: number
) {
  return useMemo(() => {
    // Create a sorted array of all items with their indices
    const allItems = sections
      .flatMap((section, sectionIndex) =>
        section.items.map((item, itemIndex) => ({
          time: item.time,
          sectionIndex,
          itemIndex,
        }))
      )
      .sort((a, b) => a.time - b.time);

    // Binary search for the current time
    let left = 0;
    let right = allItems.length - 1;
    let targetIndex = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midItem = allItems[mid];
      const nextItem = allItems[mid + 1];

      if (
        currentTime >= midItem.time &&
        (!nextItem || currentTime < nextItem.time)
      ) {
        targetIndex = mid;
        break;
      }

      if (currentTime < midItem.time) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    if (targetIndex === -1) {
      // If not found, find the last item with time <= currentTime
      targetIndex = allItems.findIndex((item) => item.time > currentTime) - 1;
      if (targetIndex === -2) targetIndex = allItems.length - 1;
    }

    return targetIndex >= 0
      ? {
          currentSectionIndex: allItems[targetIndex].sectionIndex,
          currentItemIndex: allItems[targetIndex].itemIndex,
        }
      : { currentSectionIndex: -1, currentItemIndex: -1 };
  }, [sections, currentTime]);
}

export function useAutoScroll(
  containerRef: RefObject<HTMLElement>,
  currentItemIndex: number,
  padding = 100
) {
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const currentItem = container.querySelector(
        '[data-current="true"]'
      ) as HTMLElement;

      if (currentItem && 'scrollIntoView' in currentItem) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = currentItem.getBoundingClientRect();

        if (
          itemRect.top < containerRect.top + padding ||
          itemRect.bottom > containerRect.bottom - padding
        ) {
          currentItem.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }
    }
  }, [containerRef, currentItemIndex, padding]);
}
