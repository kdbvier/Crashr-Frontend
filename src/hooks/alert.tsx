import toast, { Toaster } from 'react-hot-toast';

export const infoAlert = (text: any) => {
  toast.error(text, {
    duration: 4000,
    position: 'top-right',
  });
};

export const successAlert = (text: any) => {
  toast.success(text, {
    duration: 4000,
    position: 'top-right',
  });
};

