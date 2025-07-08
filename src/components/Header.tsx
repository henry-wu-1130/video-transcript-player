import { useRef, useEffect } from 'react';
import { useVideoStore } from '../stores/videoStore';
import { showToast } from './Toast';

export function Header() {
  const { uploadVideo, videoUrl, isProcessing } = useVideoStore();
  // 使用新的 showToast 函數
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('video/')) {
      showToast('Please select a video file', 'error');
      return;
    }

    await uploadVideo(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    // 清理 URL 對象
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  return (
    <div className="max-w-[1440px] h-full mx-auto p-4 lg:p-6 flex justify-between items-center">
      <h1 className="text-secondary-900 text-xl font-medium">
        Video Transcript Player
      </h1>
      <div className="flex items-center gap-4">
        <button
          className={`px-4 py-2 text-sm font-medium text-secondary-50 bg-primary-600 hover:bg-primary-700 rounded transition-colors ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleClick}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Upload Video'}
        </button>
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          ref={fileInputRef}
          className="hidden"
          data-testid="video-input"
        />
      </div>
    </div>
  );
}
