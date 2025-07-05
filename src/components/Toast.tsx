import { Toaster, toast } from 'react-hot-toast';

// 將 toast 函數暴露出去，方便其他組件使用
export const showToast = (message: string, type: 'success' | 'error') => {
  const toastOptions = {
    duration: 3000,
    className: `text-secondary-50 ${
      type === 'error' ? 'bg-error-500' : 'bg-success-500'
    }`,
  };
  
  if (type === 'error') {
    toast.error(message, toastOptions);
  } else {
    toast.success(message, toastOptions);
  }
};

// Toast 組件現在只負責渲染 Toaster
export const Toast = () => {
  return (
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      toastOptions={{
        className: 'px-4 py-2 rounded-lg shadow-lg animate-slide-up',
        duration: 3000,
      }}
    />
  );
};
