import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useToastStore } from '../stores/toastStore';

export const Toast = () => {
  const { message, type, isVisible, hideToast } = useToastStore();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, hideToast]);

  if (!isVisible) return null;

  return createPortal(
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`px-4 py-2 rounded-lg shadow-lg text-white ${
          type === 'error' ? 'bg-red-500' : 'bg-green-500'
        }`}
      >
        {message}
      </div>
    </div>,
    document.body
  );
};
