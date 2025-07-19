import toast from 'react-hot-toast';
import {
  FaCheck,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaInfo,
} from 'react-icons/fa';

// Custom toast functions with icons (React components instead of emoji)
export const showSuccessToast = (message, options = {}) => {
  return toast.success(message, {
    icon: <FaCheck className="text-white" />,
    style: {
      background: '#10B981',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    duration: 3000,
    ...options,
  });
};

export const showErrorToast = (message, options = {}) => {
  return toast.error(message, {
    icon: <FaTimes className="text-white" />,
    style: {
      background: '#EF4444',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    duration: 4000,
    ...options,
  });
};

export const showLoadingToast = (message, options = {}) => {
  return toast.loading(message, {
    icon: <FaSpinner className="text-white animate-spin" />,
    style: {
      background: '#3B82F6',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    ...options,
  });
};

export const showWarningToast = (message, options = {}) => {
  return toast(message, {
    icon: <FaExclamationTriangle className="text-white" />,
    style: {
      background: '#F59E0B',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    duration: 4000,
    ...options,
  });
};

export const showInfoToast = (message, options = {}) => {
  return toast(message, {
    icon: <FaInfo className="text-white" />,
    style: {
      background: '#6366F1',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    duration: 3000,
    ...options,
  });
};

// Contact-specific toast messages
export const contactToasts = {
  create: {
    loading: () => showLoadingToast('Đang tạo liên hệ...'),
    success: (loadingToast) =>
      showSuccessToast('Tạo liên hệ thành công! 🎉', { id: loadingToast }),
    error: (error, loadingToast) =>
      showErrorToast(error || 'Không thể tạo liên hệ', { id: loadingToast }),
  },
  update: {
    loading: () => showLoadingToast('Đang cập nhật liên hệ...'),
    success: (loadingToast) =>
      showSuccessToast('Cập nhật liên hệ thành công! ✨', { id: loadingToast }),
    error: (error, loadingToast) =>
      showErrorToast(error || 'Không thể cập nhật liên hệ', { id: loadingToast }),
  },
  delete: {
    loading: () => showLoadingToast('Đang xóa liên hệ...'),
    success: (loadingToast) =>
      showSuccessToast('Xóa liên hệ thành công! 🗑️', { id: loadingToast }),
    error: (error, loadingToast) =>
      showErrorToast(error || 'Không thể xóa liên hệ', { id: loadingToast }),
  },
};
