import { type TranscriptSection as ITranscriptSection } from '../stores/videoStore';

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

export function TranscriptSection({
  section,
  currentItemIndex,
  onTimeClick,
  onToggleSelection,
}: TranscriptSectionProps) {
  return (
    <div className="mb-6 sm:mb-8" data-section-id={section.id}>
      <h3 className="text-secondary-900 text-base sm:text-lg font-medium mb-3 sm:mb-4">
        {section.title}
      </h3>
      <div className="flex flex-col gap-1 sm:gap-2">
        {section.items.map((item, index) => {
          const isCurrentTime = index === currentItemIndex;

          return (
            <div
              key={index}
              data-testid="transcript-item"
              data-item-index={index}
              data-current={isCurrentTime ? 'true' : 'false'}
              className={`flex gap-3 p-2 sm:p-3 rounded transition-colors cursor-pointer border-2
                ${
                  item.isHighlight
                    ? 'bg-primary-600 text-secondary-50'
                    : 'hover:bg-secondary-100'
                }
                ${isCurrentTime ? 'border-warning-400' : 'border-transparent'}`}
              onClick={() => onToggleSelection(index)}
            >
              <button
                data-testid="timestamp"
                className={`font-mono text-sm sm:text-base shrink-0 hover:opacity-80 transition-opacity
                  ${
                    item.isHighlight ? 'text-secondary-50' : 'text-primary-600'
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onTimeClick(item.time);
                }}
              >
                {formatTime(item.time)}
              </button>
              <span
                className={`${
                  item.isHighlight ? 'text-secondary-50' : 'text-secondary-700'
                } text-sm sm:text-base`}
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
