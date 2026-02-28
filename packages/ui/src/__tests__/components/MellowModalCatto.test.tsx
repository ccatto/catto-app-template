// @catto/ui - MellowModalCatto Tests
import { describe, expect, it, vi } from 'vitest';
import MellowModalCatto from '../../components/Modal/MellowModalCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('MellowModalCatto', () => {
  describe('rendering', () => {
    it('renders when isOpen is true', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()}>
          Modal content
        </MellowModalCatto>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(
        <MellowModalCatto isOpen={false} onClose={vi.fn()}>
          Modal content
        </MellowModalCatto>,
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders title when provided', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()} title="Modal Title">
          Content
        </MellowModalCatto>,
      );

      expect(
        screen.getByRole('heading', { name: 'Modal Title' }),
      ).toBeInTheDocument();
    });

    it('renders children', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()}>
          <span data-testid="modal-content">Custom content</span>
        </MellowModalCatto>,
      );

      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    });

    it('renders footer when provided', () => {
      render(
        <MellowModalCatto
          isOpen
          onClose={vi.fn()}
          footer={<span data-testid="modal-footer">Footer content</span>}
        >
          Content
        </MellowModalCatto>,
      );

      expect(screen.getByTestId('modal-footer')).toBeInTheDocument();
    });
  });

  describe('close button', () => {
    it('shows close button by default', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()}>
          Content
        </MellowModalCatto>,
      );

      expect(
        screen.getByRole('button', { name: 'Close modal' }),
      ).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
      const handleClose = vi.fn();
      render(
        <MellowModalCatto isOpen onClose={handleClose}>
          Content
        </MellowModalCatto>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('hides close button when showCloseButton is false', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()} showCloseButton={false}>
          Content
        </MellowModalCatto>,
      );

      expect(
        screen.queryByRole('button', { name: 'Close modal' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('escape key', () => {
    it('closes on Escape key by default', () => {
      const handleClose = vi.fn();
      render(
        <MellowModalCatto isOpen onClose={handleClose}>
          Content
        </MellowModalCatto>,
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not close on Escape when closeOnEscape is false', () => {
      const handleClose = vi.fn();
      render(
        <MellowModalCatto isOpen onClose={handleClose} closeOnEscape={false}>
          Content
        </MellowModalCatto>,
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('backdrop click', () => {
    it('closes on backdrop click by default', () => {
      const handleClose = vi.fn();
      const { container } = render(
        <MellowModalCatto isOpen onClose={handleClose}>
          Content
        </MellowModalCatto>,
      );

      const backdrop = container.querySelector('.fixed.inset-0.z-50');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not close on backdrop click when closeOnOutsideClick is false', () => {
      const handleClose = vi.fn();
      const { container } = render(
        <MellowModalCatto
          isOpen
          onClose={handleClose}
          closeOnOutsideClick={false}
        >
          Content
        </MellowModalCatto>,
      );

      const backdrop = container.querySelector('.fixed.inset-0.z-50');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      expect(handleClose).not.toHaveBeenCalled();
    });

    it('does not close when clicking inside modal', () => {
      const handleClose = vi.fn();
      render(
        <MellowModalCatto isOpen onClose={handleClose}>
          <span data-testid="content">Content</span>
        </MellowModalCatto>,
      );

      fireEvent.click(screen.getByTestId('content'));

      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('themes', () => {
    it('applies primary theme styles', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()} theme="primary">
          Content
        </MellowModalCatto>,
      );

      const dialog = screen.getByRole('dialog');
      // Uses semantic theme token
      expect(dialog.className).toContain('bg-theme-primary-subtle');
    });

    it('applies danger theme styles', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()} theme="danger">
          Content
        </MellowModalCatto>,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog.className).toContain('bg-red-50');
    });

    it('applies success theme styles', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()} theme="success">
          Content
        </MellowModalCatto>,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog.className).toContain('bg-green-50');
    });

    it('applies warning theme styles', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()} theme="warning">
          Content
        </MellowModalCatto>,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog.className).toContain('bg-yellow-50');
    });

    it('applies neutral theme styles', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()} theme="neutral">
          Content
        </MellowModalCatto>,
      );

      const dialog = screen.getByRole('dialog');
      // Uses semantic theme token
      expect(dialog.className).toContain('bg-theme-surface');
    });

    it('applies branded theme styles', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()} theme="branded">
          Content
        </MellowModalCatto>,
      );

      const dialog = screen.getByRole('dialog');
      // Uses semantic theme token
      expect(dialog.className).toContain('bg-theme-surface');
    });
  });

  describe('sizes', () => {
    it('applies small size', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()} size="sm">
          Content
        </MellowModalCatto>,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog.className).toContain('max-w-sm');
    });

    it('applies medium size by default', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()}>
          Content
        </MellowModalCatto>,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog.className).toContain('max-w-md');
    });

    it('applies large size', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()} size="lg">
          Content
        </MellowModalCatto>,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog.className).toContain('max-w-lg');
    });

    it('applies xl size', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()} size="xl">
          Content
        </MellowModalCatto>,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog.className).toContain('max-w-xl');
    });

    it('applies 2xl size', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()} size="2xl">
          Content
        </MellowModalCatto>,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog.className).toContain('max-w-2xl');
    });

    it('applies full size', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()} size="full">
          Content
        </MellowModalCatto>,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog.className).toContain('max-w-full');
    });
  });

  describe('position', () => {
    it('applies center position by default', () => {
      const { container } = render(
        <MellowModalCatto isOpen onClose={vi.fn()}>
          Content
        </MellowModalCatto>,
      );

      const wrapper = container.querySelector('.fixed.inset-0.z-50');
      expect(wrapper?.className).toContain('items-center');
    });

    it('applies top position', () => {
      const { container } = render(
        <MellowModalCatto isOpen onClose={vi.fn()} position="top">
          Content
        </MellowModalCatto>,
      );

      const wrapper = container.querySelector('.fixed.inset-0.z-50');
      expect(wrapper?.className).toContain('items-start');
    });

    it('applies bottom position', () => {
      const { container } = render(
        <MellowModalCatto isOpen onClose={vi.fn()} position="bottom">
          Content
        </MellowModalCatto>,
      );

      const wrapper = container.querySelector('.fixed.inset-0.z-50');
      expect(wrapper?.className).toContain('items-end');
    });
  });

  describe('auto close', () => {
    it('auto-closes after specified time', async () => {
      vi.useFakeTimers();
      const handleClose = vi.fn();

      render(
        <MellowModalCatto isOpen onClose={handleClose} autoCloseTime={2}>
          Content
        </MellowModalCatto>,
      );

      expect(handleClose).not.toHaveBeenCalled();

      vi.advanceTimersByTime(2000);

      expect(handleClose).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });
  });

  describe('accessibility', () => {
    it('has role dialog', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()}>
          Content
        </MellowModalCatto>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has aria-modal attribute', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()}>
          Content
        </MellowModalCatto>,
      );

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('has aria-labelledby when title provided', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()} title="Test Title">
          Content
        </MellowModalCatto>,
      );

      expect(screen.getByRole('dialog')).toHaveAttribute(
        'aria-labelledby',
        'modal-title',
      );
    });

    it('does not have aria-labelledby when no title', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()}>
          Content
        </MellowModalCatto>,
      );

      expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby');
    });
  });

  describe('custom className', () => {
    it('merges custom className with default classes', () => {
      render(
        <MellowModalCatto isOpen onClose={vi.fn()} className="my-custom-class">
          Content
        </MellowModalCatto>,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog.className).toContain('my-custom-class');
    });
  });
});
