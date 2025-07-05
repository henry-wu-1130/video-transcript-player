import { useTranscriptItemMap } from '../hooks/useTranscript';
import { useVideoStore } from '../stores/videoStore';

export function VideoCaption() {
  const { sections, currentTime } = useVideoStore();

  if (!sections || sections.length === 0) {
    return null;
  }

  const { currentItem } = useTranscriptItemMap(sections, currentTime);

  if (!currentItem) {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-secondary-900/80 text-secondary-50 text-center text-lg animate-fade-in">
      {currentItem.text}
    </div>
  );
}
