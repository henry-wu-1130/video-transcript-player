import { useMemo, useEffect } from 'react';
import type { RefObject } from 'react';
import { type TranscriptSection } from '../stores/videoStore';

interface TranscriptMapResult {
  currentSectionIndex: number;
  currentItemIndex: number;
  currentItem: {
    text: string;
    time: number;
  } | null;
}

export function useTranscriptItemMap(
  sections: TranscriptSection[],
  currentTime: number
): TranscriptMapResult {
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

    // If time is after the last item, return null
    if (allItems.length > 0 && currentTime > allItems[allItems.length - 1].time) {
      return {
        currentSectionIndex: -1,
        currentItemIndex: -1,
        currentItem: null,
      };
    }

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
      // If target index is -2 or -1, it means we're before the first item or after the last item
      if (targetIndex <= -1) {
        return {
          currentSectionIndex: -1,
          currentItemIndex: -1,
          currentItem: null,
        };
      }
    }

    const { sectionIndex, itemIndex } = allItems[targetIndex];
    return {
      currentSectionIndex: sectionIndex,
      currentItemIndex: itemIndex,
      currentItem: sections[sectionIndex].items[itemIndex],
    };
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
