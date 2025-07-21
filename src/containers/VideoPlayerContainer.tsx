import { lazy, useRef, useState } from 'react';
import { useVideoStore } from '../stores/videoStore';
const VideoPlayer = lazy(() =>
  import('../components/VideoPlayer').then((module) => ({
    default: module.VideoPlayer,
  }))
);

export function VideoPlayerContainer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState<number>(0);
  const { videoUrl, currentTime, setCurrentTime } = useVideoStore();

  // Update store current time when video is playing
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle duration change
  const handleDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  if (!videoUrl) {
    return (
      <div className="h-full bg-gray-900 flex flex-col">
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
          <h2 className="text-xl text-white font-medium">Video Preview</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-300">
            <p>Upload a video to preview</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <VideoPlayer
      videoRef={videoRef}
      videoUrl={videoUrl}
      currentTime={currentTime}
      duration={duration}
      onTimeUpdate={handleTimeUpdate}
      onDurationChange={handleDurationChange}
    />
  );
}
