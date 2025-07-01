import { useMemo } from 'react';
import {
  useVideoStore,
  type TranscriptSection as ITranscriptSection,
} from '../stores/videoStore';
import { Loading } from './Loading';

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

interface TranscriptSectionProps {
  section: ITranscriptSection;
  currentItemIndex: number;
  onTimeClick: (time: number) => void;
  onToggleSelection: (itemIndex: number) => void;
}

function TranscriptSection({
  section,
  currentItemIndex,
  onTimeClick,
  onToggleSelection,
}: TranscriptSectionProps) {
  return (
    <div className="mb-6" data-section-id={section.id}>
      <h3 className="text-gray-800 text-base font-medium mb-3">
        {section.title}
      </h3>
      <div className="flex flex-col gap-1">
        {section.items.map((item, index) => {
          const isCurrentTime = index === currentItemIndex;

          return (
            <div
              key={index}
              data-testid="transcript-item"
              data-item-index={index}
              className={`flex gap-3 p-2 rounded transition-colors cursor-pointer border-2
                ${
                  item.isHighlight
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }
                ${isCurrentTime ? 'border-amber-400' : 'border-transparent'}`}
              onClick={() => onToggleSelection(index)}
            >
              <button
                data-testid="timestamp"
                className={`font-mono text-sm shrink-0 hover:opacity-80 transition-opacity
                  ${item.isHighlight ? 'text-white' : 'text-blue-500'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onTimeClick(item.time);
                }}
              >
                {formatTime(item.time)}
              </button>
              <span
                className={item.isHighlight ? 'text-white' : 'text-gray-700'}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Transcript() {
  const {
    sections,
    currentTime,
    setCurrentTime,
    toggleSelection,
    isProcessing,
  } = useVideoStore();

  // Create a map of all items with their section and item indices
  const { currentSectionIndex, currentItemIndex } = useMemo(() => {
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

  console.log('currentTime', currentTime);
  console.log('currentSectionIndex', currentSectionIndex);
  console.log('currentItemIndex', currentItemIndex);

  if (isProcessing) {
    return <Loading />;
  }

  return (
    <div className="h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h2 className="text-xl text-gray-800 font-medium">Transcript</h2>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100%-3.5rem)]">
        {sections.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            Upload a video to view transcript
          </div>
        ) : (
          sections.map((section, sectionIndex) => (
            <TranscriptSection
              key={section.id}
              section={section}
              currentItemIndex={
                sectionIndex === currentSectionIndex ? currentItemIndex : -1
              }
              onTimeClick={setCurrentTime}
              onToggleSelection={(itemIndex) =>
                toggleSelection(section.id, itemIndex)
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
