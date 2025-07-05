import { useEffect } from 'react';
import type { RefObject } from 'react';
import { Timeline } from './Timeline';
import { VideoControls } from './VideoControls';
import { VideoCaption } from './VideoCaption';

interface VideoPlayerProps {
  videoRef: RefObject<HTMLVideoElement>;
  videoUrl: string;
  currentTime: number;
  duration: number;
  onTimeUpdate: () => void;
  onDurationChange: () => void;
}

export function VideoPlayer({
  videoRef,
  videoUrl,
  currentTime,
  duration,
  onTimeUpdate,
  onDurationChange,
}: VideoPlayerProps) {
  // Sync video current time with prop
  useEffect(() => {
    if (
      videoRef.current &&
      Math.abs(videoRef.current.currentTime - currentTime) > 0.5
    ) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime, videoRef]);

  return (
    <div className="h-full bg-secondary-900 flex flex-col">
      <div className="bg-secondary-800 border-b border-secondary-700 px-4 py-3">
        <h2 className="text-xl text-secondary-50 font-medium">Video Preview</h2>
      </div>
      {!videoUrl ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-secondary-300">
            <p>Upload a video to preview</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-secondary-950">
          <div className="flex-1 flex items-center justify-center relative">
            <video
              ref={videoRef}
              src={videoUrl}
              className="max-h-full max-w-full"
              onTimeUpdate={onTimeUpdate}
              onLoadedMetadata={onDurationChange}
            />
            <VideoCaption />
          </div>
          <div className="flex flex-col gap-2">
            {duration > 0 && (
              <>
                <VideoControls videoRef={videoRef} duration={duration} />
                <Timeline duration={duration} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
