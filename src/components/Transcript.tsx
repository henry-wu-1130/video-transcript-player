import { type TranscriptSection as ITranscriptSection } from '../stores/videoStore';
import { Loading } from './Loading';
import { TranscriptSection } from './TranscriptSection';
import type { RefObject } from 'react';

interface TranscriptProps {
  containerRef: RefObject<HTMLDivElement>;
  sections: ITranscriptSection[];
  currentSectionIndex: number;
  currentItemIndex: number;
  isProcessing: boolean;
  onTimeClick: (time: number) => void;
  onToggleSelection: (sectionId: string, itemIndex: number) => void;
}

export function Transcript({
  containerRef,
  sections,
  currentSectionIndex,
  currentItemIndex,
  isProcessing,
  onTimeClick,
  onToggleSelection,
}: TranscriptProps) {

  if (isProcessing) {
    return <Loading />;
  }

  return (
    <div className="h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h2 className="text-xl text-gray-800 font-medium">Transcript</h2>
      </div>
      <div
        ref={containerRef}
        className="p-4 overflow-y-auto h-[calc(100%-3.5rem)]"
      >
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
              onTimeClick={onTimeClick}
              onToggleSelection={(itemIndex) =>
                onToggleSelection(section.id, itemIndex)
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
