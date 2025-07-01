import { useRef } from 'react';
import { useVideoStore } from '../stores/videoStore';

interface TimelineProps {
  duration: number;
}

export function Timeline({ duration }: TimelineProps) {
  const { currentTime, sections, setCurrentTime } = useVideoStore();
  const timelineRef = useRef<HTMLDivElement>(null);

  // Convert time to percentage
  const timeToPercent = (time: number) => (time / duration) * 100;

  // Get all selected items from sections
  const selectedItems = sections.flatMap((section) =>
    section.items
      .map((item, index) => ({
        ...item,
        sectionId: section.id,
        sectionTitle: section.title,
        index,
      }))
      .filter((item) => item.isHighlight)
  );

  // Handle timeline click
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    if (!rect) return;

    const clickPosition = e.clientX - rect.left;
    const clickPercent = clickPosition / rect.width;
    if (isNaN(clickPercent)) return;

    const newTime = clickPercent * duration;
    setCurrentTime(newTime);
  };

  return (
    <div className="bg-gray-900">
      {/* Timeline container */}
      <div
        ref={timelineRef}
        role="button"
        className="relative h-4 bg-gray-800 rounded cursor-pointer"
        onClick={handleTimelineClick}
      >
        {/* Selected sections */}
        {selectedItems.map((item) => (
          <div
            key={`${item.sectionId}-${item.index}`}
            className="absolute inset-y-0 border-blue-500 bg-blue-500"
            style={{
              left: `${timeToPercent(item.time)}%`,
              width: '16px',
            }}
            title={item.sectionTitle}
          />
        ))}

        {/* Current time indicator */}
        <div
          data-testid="current-time-indicator"
          className="absolute top-0 bottom-0 w-1 bg-red-500"
          style={{
            left: `${timeToPercent(currentTime)}%`,
            transform: 'translateX(-50%)',
          }}
        />
      </div>
    </div>
  );
}
