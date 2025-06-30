import { useVideoStore, type TranscriptSection as ITranscriptSection } from '../stores/videoStore'
import { Loading } from './Loading'

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

interface TranscriptSectionProps {
  section: ITranscriptSection
  currentTime: number
  onTimeClick: (time: number) => void
  onToggleSelection: (itemIndex: number) => void
}

function TranscriptSection({ section, currentTime, onTimeClick, onToggleSelection }: TranscriptSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{section.title}</h3>
      <div className="flex flex-col gap-2">
        {section.items.map((item, index) => {
          const isCurrentTime = currentTime >= item.time && 
            (index === section.items.length - 1 || currentTime < section.items[index + 1].time)

          return (
            <div 
              key={index} 
              data-testid="transcript-item"
              className={`flex gap-4 p-2 rounded transition-colors cursor-pointer
                ${item.isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                ${isCurrentTime ? 'ring-1 ring-blue-400' : ''}`}
              onClick={() => onToggleSelection(index)}
            >
              <button
                data-testid="timestamp"
                className="text-gray-500 font-mono shrink-0 hover:text-blue-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  onTimeClick(item.time)
                }}
              >
                {formatTime(item.time)}
              </button>
              <span className="text-gray-700">{item.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function Transcript() {
  const { sections, currentTime, setCurrentTime, toggleSelection, isProcessing } = useVideoStore()

  if (isProcessing) {
    return <Loading />
  }

  return (
    <div className="h-full">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-xl text-gray-800 font-medium">Transcript</h2>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100%-3.5rem)]">

      {sections.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          Upload a video to view transcript
        </div>
      ) : (
        sections.map((section) => (
          <TranscriptSection
            key={section.id}
            section={section}
            currentTime={currentTime}
            onTimeClick={setCurrentTime}
            onToggleSelection={(itemIndex) => toggleSelection(section.id, itemIndex)}
          />
        ))
      )}
      </div>
    </div>
  )
}
