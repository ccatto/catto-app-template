// @catto/ui - ToastCatto Tests
import { describe, expect, it, vi } from 'vitest';
import ToastCatto from '../../components/Toast/ToastCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('ToastCatto', () => {
  describe('rendering', () => {
    it('renders with body text', () => {
      render(<ToastCatto body="Toast message" />);

      expect(screen.getByText('Toast message')).toBeInTheDocument();
    });

    it('renders header when provided', () => {
      render(<ToastCatto body="Message" header="Alert" />);

      expect(screen.getByText('Alert')).toBeInTheDocument();
      expect(screen.getByText('Message')).toBeInTheDocument();
    });

    it('renders body as ReactNode', () => {
      render(
        <ToastCatto body={<span data-testid="custom-body">Custom</span>} />,
      );

      expect(screen.getByTestId('custom-body')).toBeInTheDocument();
    });

    it('has role alert', () => {
      render(<ToastCatto body="Message" />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('has aria-live assertive', () => {
      render(<ToastCatto body="Message" />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });
  });

  describe('close button', () => {
    it('renders close button', () => {
      render(<ToastCatto body="Message" />);

      expect(
        screen.getByRole('button', { name: 'Close toast' }),
      ).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      const handleClose = vi.fn();
      render(<ToastCatto body="Message" onClose={handleClose} />);

      fireEvent.click(screen.getByRole('button', { name: 'Close toast' }));

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('hides toast when close button is clicked', () => {
      render(<ToastCatto body="Message" />);

      fireEvent.click(screen.getByRole('button', { name: 'Close toast' }));

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('escape key', () => {
    it('closes toast on Escape key', () => {
      const handleClose = vi.fn();
      render(<ToastCatto body="Message" onClose={handleClose} />);

      fireEvent.keyDown(window, { key: 'Escape' });

      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('auto close', () => {
    it('auto-closes after duration', async () => {
      vi.useFakeTimers();
      const handleClose = vi.fn();

      render(
        <ToastCatto body="Message" duration={2000} onClose={handleClose} />,
      );

      expect(handleClose).not.toHaveBeenCalled();

      vi.advanceTimersByTime(2000);

      expect(handleClose).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });

    it('uses default 3000ms duration', async () => {
      vi.useFakeTimers();
      const handleClose = vi.fn();

      render(<ToastCatto body="Message" onClose={handleClose} />);

      vi.advanceTimersByTime(2999);
      expect(handleClose).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(handleClose).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
  });

  describe('variants', () => {
    it('applies primary variant styles', () => {
      render(<ToastCatto body="Message" variant="primary" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('bg-blue-500');
    });

    it('applies success variant styles', () => {
      render(<ToastCatto body="Message" variant="success" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('bg-green-500');
    });

    it('applies warning variant styles', () => {
      render(<ToastCatto body="Message" variant="warning" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('bg-yellow-500');
    });

    it('applies error variant styles', () => {
      render(<ToastCatto body="Message" variant="error" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('bg-red-500');
    });

    it('applies info variant styles', () => {
      render(<ToastCatto body="Message" variant="info" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('bg-cyan-500');
    });

    it('applies midnightEmber variant styles', () => {
      render(<ToastCatto body="Message" variant="midnightEmber" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('bg-[#1a2743]');
    });
  });

  describe('sizes', () => {
    it('applies small size styles', () => {
      render(<ToastCatto body="Message" size="sm" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('text-sm');
      expect(alert.className).toContain('py-2');
    });

    it('applies medium size styles by default', () => {
      render(<ToastCatto body="Message" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('text-base');
      expect(alert.className).toContain('py-3');
    });

    it('applies large size styles', () => {
      render(<ToastCatto body="Message" size="lg" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('text-lg');
      expect(alert.className).toContain('py-4');
    });
  });

  describe('animations', () => {
    it('applies slide animation by default', () => {
      render(<ToastCatto body="Message" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('animate-slideIn');
    });

    it('applies fade animation', () => {
      render(<ToastCatto body="Message" animation="fade" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('animate-fadeIn');
    });

    it('applies bounce animation', () => {
      render(<ToastCatto body="Message" animation="bounce" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('animate-bounceIn');
    });

    it('applies no animation when set to none', () => {
      render(<ToastCatto body="Message" animation="none" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).not.toContain('animate-');
    });
  });

  describe('placements', () => {
    it('applies upperRight placement by default', () => {
      render(<ToastCatto body="Message" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('top-4');
      expect(alert.className).toContain('right-4');
    });

    it('applies lowerLeft placement', () => {
      render(<ToastCatto body="Message" placement="lowerLeft" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('bottom-20');
      expect(alert.className).toContain('left-4');
    });

    it('applies lowerRight placement', () => {
      render(<ToastCatto body="Message" placement="lowerRight" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('bottom-20');
      expect(alert.className).toContain('right-4');
    });

    it('applies upperLeft placement', () => {
      render(<ToastCatto body="Message" placement="upperLeft" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('top-4');
      expect(alert.className).toContain('left-4');
    });

    it('applies center placement', () => {
      render(<ToastCatto body="Message" placement="center" />);

      const alert = screen.getByRole('alert');
      expect(alert.className).toContain('top-1/2');
      expect(alert.className).toContain('left-1/2');
    });
  });

  describe('progress bar', () => {
    it('renders progress bar', () => {
      const { container } = render(<ToastCatto body="Message" />);

      const progressBar = container.querySelector('.bg-gray-900\\/30');
      expect(progressBar).toBeInTheDocument();
    });
  });
});
