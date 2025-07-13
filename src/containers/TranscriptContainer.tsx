import { useRef } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useTranscriptItemMap } from '../hooks/useTranscriptItemMap';
import { useVideoStore } from '../stores/videoStore';
import { Transcript } from '../components/Transcript';

export function TranscriptContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    sections,
    currentTime,
    setCurrentTime,
    toggleSelection,
    isProcessing,
  } = useVideoStore();

  const { currentSectionIndex, currentItemIndex } = useTranscriptItemMap(
    sections,
    currentTime
  );

  useAutoScroll(containerRef, currentItemIndex);

  return (
    <Transcript
      containerRef={containerRef}
      sections={sections}
      currentSectionIndex={currentSectionIndex}
      currentItemIndex={currentItemIndex}
      isProcessing={isProcessing}
      onTimeClick={setCurrentTime}
      onToggleSelection={toggleSelection}
    />
  );
}
