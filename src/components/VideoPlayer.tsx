import { useRef, useEffect, useState } from 'react';
import { useVideoStore } from '../stores/videoStore';
import { Timeline } from './Timeline';
import { VideoControls } from './VideoControls';

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState<number>(0);
  const { videoUrl, currentTime, setCurrentTime } = useVideoStore();

  // Sync video current time with store
  useEffect(() => {
    if (
      videoRef.current &&
      Math.abs(videoRef.current.currentTime - currentTime) > 0.5
    ) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  // Update store current time when video is playing
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <h2 className="text-xl text-white font-medium">Video Preview</h2>
      </div>
      {!videoUrl ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-300">
            <p>Upload a video to preview</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-black">
          <div className="flex-1 flex items-center justify-center">
            <video
              ref={videoRef}
              src={videoUrl}
              className="max-h-full max-w-full"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration);
                }
              }}
            />
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
