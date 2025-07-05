import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Toast, showToast } from '../Toast';
import * as hotToast from 'react-hot-toast';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  Toaster: vi.fn(() => null),
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('Toast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Toaster component', () => {
    const { container } = render(<Toast />);
    expect(container).toBeDefined();
  });

  describe('showToast', () => {
    it('should call toast.error with correct options for error type', () => {
      showToast('Error message', 'error');

      expect(hotToast.toast.error).toHaveBeenCalledWith('Error message', {
        duration: 3000,
        className: expect.stringContaining('bg-error-500'),
      });
    });

    it('should call toast.success with correct options for success type', () => {
      showToast('Success message', 'success');

      expect(hotToast.toast.success).toHaveBeenCalledWith('Success message', {
        duration: 3000,
        className: expect.stringContaining('bg-success-500'),
      });
    });
  });
});
