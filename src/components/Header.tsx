import { useRef, useEffect, useState } from 'react';
import { useVideoStore } from '../stores/videoStore';
import { useToastStore } from '../stores/toastStore';

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({ isOpen, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Are you sure you want to remove the video?
        </h3>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            onClick={onConfirm}
          >
            移除
          </button>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { uploadVideo, videoUrl, clearVideo, isProcessing } = useVideoStore();
  const { showToast } = useToastStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  const handleRemoveVideo = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmRemove = () => {
    clearVideo();
    setShowConfirmDialog(false);
  };

  const handleCancelRemove = () => {
    setShowConfirmDialog(false);
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
    <div className="max-w-7xl h-full mx-auto px-4 flex justify-between items-center">
      <h1 className="text-white text-xl font-medium">
        Video Transcript Player
      </h1>
      <div className="flex items-center gap-4">
        <button
          className={`px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded transition-colors ${
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
        {videoUrl && (
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded transition-colors"
            onClick={handleRemoveVideo}
          >
            Remove Video
          </button>
        )}
      </div>
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
    </div>
  );
}
