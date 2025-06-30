import { useVideoStore } from '../stores/videoStore';
import { Loading } from './Loading';

export function Preview() {
  const { videoUrl, isProcessing } = useVideoStore();

  return (
    <div className="h-full">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-xl text-gray-800 font-medium">Preview</h2>
      </div>
      <div className="h-[calc(100%-3.5rem)]">
        {isProcessing ? (
          <Loading />
        ) : !videoUrl ? (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <div className="text-gray-500 text-center">
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
