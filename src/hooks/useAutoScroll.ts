import { useEffect, type RefObject } from 'react';

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
