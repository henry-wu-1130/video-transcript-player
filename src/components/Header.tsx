import { useRef, useEffect, useState } from 'react';
import { useVideoStore } from '../stores/videoStore';
import { showToast } from './Toast';

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({ isOpen, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-secondary-900/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-secondary-50 rounded-lg p-6 max-w-sm w-full mx-4 shadow-lg animate-scale">
        <h3 className="text-lg font-medium text-secondary-900 mb-4">
          Are you sure you want to remove the video?
        </h3>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-100 rounded-md transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-secondary-50 bg-error-600 hover:bg-error-700 rounded-md transition-colors"
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
  // 使用新的 showToast 函數
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
        {videoUrl && (
          <button
            className="px-4 py-2 text-sm font-medium text-secondary-50 bg-error-600 hover:bg-error-700 rounded transition-colors"
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
