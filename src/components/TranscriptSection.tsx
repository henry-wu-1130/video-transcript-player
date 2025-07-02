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
              data-current={isCurrentTime ? 'true' : 'false'}
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
