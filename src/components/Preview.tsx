import { useVideoStore } from '../stores/videoStore';
import { Loading } from './Loading';

export function Preview() {
  const { videoUrl, isProcessing } = useVideoStore();

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <h2 className="text-xl text-white font-medium">Preview</h2>
      </div>
      <div className="flex-1">
        {isProcessing ? (
          <Loading />
        ) : !videoUrl ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-300">
              <p>Upload a video to preview</p>
            </div>
          </div>
        ) : (
          <video
            src={videoUrl}
            className="w-full h-full object-contain bg-black"
            controls
            data-testid="video-player"
          />
        )}
      </div>
    </div>
  );
}
