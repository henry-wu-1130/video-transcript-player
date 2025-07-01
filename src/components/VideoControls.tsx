import { useCallback } from 'react';
import { useVideoStore } from '../stores/videoStore';

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  duration: number;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

export function VideoControls({ videoRef, duration }: VideoControlsProps) {
  const { currentTime, sections, setCurrentTime } = useVideoStore();

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const findCurrentSectionIndex = useCallback(() => {
    // First, find which section contains our current time
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const firstItemTime = section.items[0].time;
      const nextSectionFirstTime = sections[i + 1]?.items[0].time ?? Infinity;

      // console.log(`Checking section ${i}:`, {
      //   sectionTitle: section.title,
      //   firstItemTime,
      //   nextSectionFirstTime,
      //   isInThisSection:
      //     currentTime >= firstItemTime && currentTime < nextSectionFirstTime,
      // });

      if (currentTime >= firstItemTime && currentTime < nextSectionFirstTime) {
        return i;
      }
    }

    // If we're before the first section, return 0
    return 0;
  }, [currentTime, sections]);

  const navigateToSection = (direction: 'prev' | 'next') => {
    const currentSectionIndex = findCurrentSectionIndex();
    if (currentSectionIndex === -1) return;

    const targetSection =
      sections[currentSectionIndex + (direction === 'next' ? 1 : -1)];
    if (!targetSection) return;

    const targetTime = targetSection.items[0].time;
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-4">
        {/* Previous Section */}
        <button
          className="text-gray-400 hover:text-white transition-colors"
          onClick={() => navigateToSection('prev')}
          disabled={findCurrentSectionIndex() <= 0}
          aria-label="Previous section"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          className="text-gray-400 hover:text-white transition-colors"
          onClick={handlePlayPause}
          aria-label={videoRef.current?.paused ? 'Play' : 'Pause'}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                videoRef.current?.paused
                  ? 'M8 5v14l11-7-11-7z'
                  : 'M6 4h4v16H6zm8 0h4v16h-4z'
              }
            />
          </svg>
        </button>

        {/* Next Section */}
        <button
          className="text-gray-400 hover:text-white transition-colors"
          onClick={() => navigateToSection('next')}
          disabled={findCurrentSectionIndex() >= sections.length - 1}
          aria-label="Next section"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Time Display */}
      <div className="text-gray-400 font-mono">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
}
