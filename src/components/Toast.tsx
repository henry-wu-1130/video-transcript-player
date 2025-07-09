import { Toaster, toast } from 'react-hot-toast';

export const showToast = (message: string, type: 'success' | 'error') => {
  const toastOptions = {
    duration: 3000,
    className: `text-secondary-50 ${type === 'error' ? 'bg-error-500' : 'bg-success-500'}`,
  };

  if (type === 'error') {
    toast.error(message, toastOptions);
  } else {
    toast.success(message, toastOptions);
  }
};

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
