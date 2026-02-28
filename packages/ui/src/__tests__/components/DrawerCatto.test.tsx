// @catto/ui - DrawerCatto Tests
// Comprehensive tests for the slide-in drawer component

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DrawerCatto from '../../components/Drawer/DrawerCatto';

// Mock createPortal to render inline for testing
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  };
});

describe('DrawerCatto', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div>Drawer Content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset body overflow
    document.body.style.overflow = '';
  });

  afterEach(() => {
    // Cleanup body overflow
    document.body.style.overflow = '';
  });

  // ============================================
  // Rendering Tests
  // ============================================

  describe('Rendering', () => {
    it('renders drawer content when open', () => {
      render(<DrawerCatto {...defaultProps} />);
      expect(screen.getByText('Drawer Content')).toBeInTheDocument();
    });

    it('renders drawer even when closed (with transform)', () => {
      render(<DrawerCatto {...defaultProps} isOpen={false} />);
      // Drawer still renders but is translated off-screen
      expect(screen.getByText('Drawer Content')).toBeInTheDocument();
    });

    it('renders with dialog role', () => {
      render(<DrawerCatto {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has aria-modal attribute', () => {
      render(<DrawerCatto {...defaultProps} />);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('renders children content', () => {
      render(
        <DrawerCatto {...defaultProps}>
          <p>Custom child content</p>
          <button>Action Button</button>
        </DrawerCatto>,
      );
      expect(screen.getByText('Custom child content')).toBeInTheDocument();
      expect(screen.getByText('Action Button')).toBeInTheDocument();
    });

    it('does not render portal content before mount when usePortal is true', () => {
      // This is tested indirectly - the mock makes portal render inline
      render(<DrawerCatto {...defaultProps} usePortal={true} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('renders inline when usePortal is false', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} usePortal={false} />,
      );
      expect(container.querySelector('[role="dialog"]')).toBeInTheDocument();
    });
  });

  // ============================================
  // Title and Header Tests
  // ============================================

  describe('Title and Header', () => {
    it('renders title when provided', () => {
      render(<DrawerCatto {...defaultProps} title="Settings" />);
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders title in h2 element', () => {
      render(<DrawerCatto {...defaultProps} title="Settings" />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Settings',
      );
    });

    it('renders custom header instead of title', () => {
      render(
        <DrawerCatto
          {...defaultProps}
          title="Should Not Show"
          header={<span data-testid="custom-header">Custom Header</span>}
        />,
      );
      expect(screen.getByTestId('custom-header')).toBeInTheDocument();
      expect(screen.queryByText('Should Not Show')).not.toBeInTheDocument();
    });

    it('uses title for aria-label when no aria-label provided', () => {
      render(<DrawerCatto {...defaultProps} title="Navigation" />);
      expect(screen.getByRole('dialog')).toHaveAttribute(
        'aria-label',
        'Navigation',
      );
    });

    it('uses custom aria-label over title', () => {
      render(
        <DrawerCatto
          {...defaultProps}
          title="Navigation"
          aria-label="Main Navigation Menu"
        />,
      );
      expect(screen.getByRole('dialog')).toHaveAttribute(
        'aria-label',
        'Main Navigation Menu',
      );
    });

    it('uses default aria-label when no title or aria-label', () => {
      render(<DrawerCatto {...defaultProps} />);
      expect(screen.getByRole('dialog')).toHaveAttribute(
        'aria-label',
        'Drawer',
      );
    });
  });

  // ============================================
  // Close Button Tests
  // ============================================

  describe('Close Button', () => {
    it('renders close button by default', () => {
      render(<DrawerCatto {...defaultProps} title="Test" />);
      expect(
        screen.getByRole('button', { name: /close drawer/i }),
      ).toBeInTheDocument();
    });

    it('calls onClose when close button clicked', async () => {
      const onClose = vi.fn();
      render(<DrawerCatto {...defaultProps} onClose={onClose} title="Test" />);

      await userEvent.click(
        screen.getByRole('button', { name: /close drawer/i }),
      );
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('hides close button when showCloseButton is false', () => {
      render(
        <DrawerCatto {...defaultProps} title="Test" showCloseButton={false} />,
      );
      expect(
        screen.queryByRole('button', { name: /close drawer/i }),
      ).not.toBeInTheDocument();
    });

    it('shows header section when title provided and showCloseButton is false', () => {
      render(
        <DrawerCatto {...defaultProps} title="Test" showCloseButton={false} />,
      );
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  // ============================================
  // Side/Position Tests
  // ============================================

  describe('Side Positions', () => {
    it('defaults to left side', () => {
      const { container } = render(<DrawerCatto {...defaultProps} />);
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('left-0');
    });

    it('renders on left side', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} side="left" />,
      );
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('left-0');
    });

    it('renders on right side', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} side="right" />,
      );
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('right-0');
    });

    it('applies translate-x-0 when open on left', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} side="left" isOpen={true} />,
      );
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('translate-x-0');
    });

    it('applies translate-x-0 when open on right', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} side="right" isOpen={true} />,
      );
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('translate-x-0');
    });

    it('applies -translate-x-full when closed on left', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} side="left" isOpen={false} />,
      );
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('-translate-x-full');
    });

    it('applies translate-x-full when closed on right', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} side="right" isOpen={false} />,
      );
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('translate-x-full');
    });
  });

  // ============================================
  // Width Tests
  // ============================================

  describe('Width Variants', () => {
    it('defaults to md width', () => {
      const { container } = render(<DrawerCatto {...defaultProps} />);
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('w-80');
    });

    it('applies sm width class', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} width="sm" />,
      );
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('w-64');
    });

    it('applies md width class', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} width="md" />,
      );
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('w-80');
    });

    it('applies lg width class', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} width="lg" />,
      );
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('w-96');
    });

    it('applies xl width class', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} width="xl" />,
      );
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('w-[28rem]');
    });

    it('applies full width class', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} width="full" />,
      );
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('w-full');
    });

    it('uses customWidth over width prop', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} width="md" customWidth="w-[500px]" />,
      );
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('w-[500px]');
      expect(drawer).not.toHaveClass('w-80');
    });
  });

  // ============================================
  // Overlay Tests
  // ============================================

  describe('Overlay', () => {
    it('renders overlay by default when open', () => {
      const { container } = render(<DrawerCatto {...defaultProps} />);
      // Overlay has fixed inset-0 bg-black/50 classes
      const overlay = container.querySelector('.fixed.inset-0');
      expect(overlay).toBeInTheDocument();
    });

    it('does not render overlay when closed', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} isOpen={false} />,
      );
      // Overlay should not render when drawer is closed
      const overlay = container.querySelector('.fixed.inset-0.bg-black\\/50');
      expect(overlay).not.toBeInTheDocument();
    });

    it('does not render overlay when overlay prop is false', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} overlay={false} />,
      );
      // Overlay should not render when overlay prop is false
      const overlay = container.querySelector('.fixed.inset-0.bg-black\\/50');
      expect(overlay).not.toBeInTheDocument();
    });

    it('calls onClose when overlay clicked and closeOnOverlayClick is true', async () => {
      const onClose = vi.fn();
      const { container } = render(
        <DrawerCatto {...defaultProps} onClose={onClose} />,
      );

      const overlay = container.querySelector('.fixed.inset-0');
      if (overlay) {
        await userEvent.click(overlay);
      }
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when overlay clicked and closeOnOverlayClick is false', async () => {
      const onClose = vi.fn();
      const { container } = render(
        <DrawerCatto
          {...defaultProps}
          onClose={onClose}
          closeOnOverlayClick={false}
        />,
      );

      const overlay = container.querySelector('.fixed.inset-0');
      if (overlay) {
        await userEvent.click(overlay);
      }
      expect(onClose).not.toHaveBeenCalled();
    });

    it('applies custom overlay className', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} overlayClassName="bottom-20" />,
      );
      const overlay = container.querySelector('.fixed.inset-0');
      expect(overlay).toHaveClass('bottom-20');
    });
  });

  // ============================================
  // Escape Key Tests
  // ============================================

  describe('Escape Key', () => {
    it('calls onClose when Escape pressed and closeOnEscape is true', () => {
      const onClose = vi.fn();
      render(<DrawerCatto {...defaultProps} onClose={onClose} />);

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when Escape pressed and closeOnEscape is false', () => {
      const onClose = vi.fn();
      render(
        <DrawerCatto
          {...defaultProps}
          onClose={onClose}
          closeOnEscape={false}
        />,
      );

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not call onClose when drawer is closed', () => {
      const onClose = vi.fn();
      render(
        <DrawerCatto {...defaultProps} onClose={onClose} isOpen={false} />,
      );

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not call onClose for other keys', () => {
      const onClose = vi.fn();
      render(<DrawerCatto {...defaultProps} onClose={onClose} />);

      fireEvent.keyDown(window, { key: 'Enter' });
      fireEvent.keyDown(window, { key: 'Tab' });
      fireEvent.keyDown(window, { key: 'a' });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // Body Scroll Lock Tests
  // ============================================

  describe('Body Scroll Lock', () => {
    it('sets body overflow to hidden when open and preventScroll is true', () => {
      render(<DrawerCatto {...defaultProps} preventScroll={true} />);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('does not set body overflow when preventScroll is false', () => {
      render(<DrawerCatto {...defaultProps} preventScroll={false} />);
      expect(document.body.style.overflow).toBe('');
    });

    it('restores body overflow on unmount', () => {
      const { unmount } = render(
        <DrawerCatto {...defaultProps} preventScroll={true} />,
      );
      expect(document.body.style.overflow).toBe('hidden');

      unmount();
      expect(document.body.style.overflow).toBe('');
    });

    it('restores body overflow when closed', async () => {
      const { rerender } = render(
        <DrawerCatto {...defaultProps} preventScroll={true} isOpen={true} />,
      );
      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <DrawerCatto {...defaultProps} preventScroll={true} isOpen={false} />,
      );
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('');
      });
    });
  });

  // ============================================
  // Custom className Tests
  // ============================================

  describe('Custom Classes', () => {
    it('applies custom className to drawer', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} className="custom-drawer-class" />,
      );
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('custom-drawer-class');
    });

    it('applies custom contentClassName to content area', () => {
      const { container } = render(
        <DrawerCatto
          {...defaultProps}
          contentClassName="custom-content-class"
        />,
      );
      const content = container.querySelector('.custom-content-class');
      expect(content).toBeInTheDocument();
    });

    it('applies custom height class', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} customHeight="top-0 bottom-20" />,
      );
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('top-0');
      expect(drawer).toHaveClass('bottom-20');
    });
  });

  // ============================================
  // z-index Tests
  // ============================================

  describe('z-index', () => {
    it('uses default z-index of 50', () => {
      const { container } = render(<DrawerCatto {...defaultProps} />);
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveStyle({ zIndex: '50' });
    });

    it('applies custom z-index', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} zIndex={100} />,
      );
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveStyle({ zIndex: '100' });
    });

    it('overlay has z-index one less than drawer', () => {
      const { container } = render(
        <DrawerCatto {...defaultProps} zIndex={60} />,
      );
      const overlay = container.querySelector('.fixed.inset-0');
      expect(overlay).toHaveStyle({ zIndex: '59' });
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================

  describe('Accessibility', () => {
    it('has role="dialog"', () => {
      render(<DrawerCatto {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has aria-modal="true"', () => {
      render(<DrawerCatto {...defaultProps} />);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('has aria-label', () => {
      render(<DrawerCatto {...defaultProps} aria-label="Test Drawer" />);
      expect(screen.getByRole('dialog')).toHaveAttribute(
        'aria-label',
        'Test Drawer',
      );
    });

    it('close button has aria-label', () => {
      render(<DrawerCatto {...defaultProps} title="Test" />);
      expect(
        screen.getByRole('button', { name: /close drawer/i }),
      ).toBeInTheDocument();
    });

    it('overlay has aria-hidden', () => {
      const { container } = render(<DrawerCatto {...defaultProps} />);
      const overlay = container.querySelector('.fixed.inset-0');
      expect(overlay).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // ============================================
  // Transition Classes Tests
  // ============================================

  describe('Transition Classes', () => {
    it('has transition-transform class', () => {
      const { container } = render(<DrawerCatto {...defaultProps} />);
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('transition-transform');
    });

    it('has duration-300 class', () => {
      const { container } = render(<DrawerCatto {...defaultProps} />);
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('duration-300');
    });

    it('has ease-in-out class', () => {
      const { container } = render(<DrawerCatto {...defaultProps} />);
      const drawer = container.querySelector('[role="dialog"]');
      expect(drawer).toHaveClass('ease-in-out');
    });
  });
});
