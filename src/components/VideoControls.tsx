import { useCallback } from 'react';
import { useVideoStore } from '../stores/videoStore';
import { PrevSectionIcon, PlayIcon, PauseIcon, NextSectionIcon } from './Icons';

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  duration: number;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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
    <div className="flex items-center justify-between px-4 py-2 bg-secondary-800">
      <div className="flex items-center gap-4">
        {/* Previous Section */}
        <button
          className="text-secondary-400 hover:text-secondary-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => navigateToSection('prev')}
          disabled={findCurrentSectionIndex() <= 0}
          aria-label="Previous section"
        >
          <PrevSectionIcon size={24} color="currentColor" aria-hidden={true} />
        </button>

        {/* Play/Pause */}
        <button
          className="text-secondary-400 hover:text-secondary-200 transition-colors"
          onClick={handlePlayPause}
          aria-label={videoRef.current?.paused ? 'Play' : 'Pause'}
        >
          {videoRef.current?.paused ? (
            <PlayIcon size={24} color="currentColor" aria-hidden={true} />
          ) : (
            <PauseIcon size={24} color="currentColor" aria-hidden={true} />
          )}
        </button>

        {/* Next Section */}
        <button
          className="text-secondary-400 hover:text-secondary-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => navigateToSection('next')}
          disabled={findCurrentSectionIndex() >= sections.length - 1}
          aria-label="Next section"
        >
          <NextSectionIcon size={24} color="currentColor" aria-hidden={true} />
        </button>
      </div>

      {/* Time Display */}
      <div className="text-secondary-400 font-mono">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
}
