// @catto/ui - TabsCatto Tests
import { describe, expect, it, vi } from 'vitest';
import TabsCatto from '../../components/Tabs/TabsCatto';
import { fireEvent, render, screen } from '../test-utils';

const mockTabs = [
  {
    id: 'tab1',
    label: 'Tab 1',
    content: <div data-testid="content-1">Content 1</div>,
  },
  {
    id: 'tab2',
    label: 'Tab 2',
    content: <div data-testid="content-2">Content 2</div>,
  },
  {
    id: 'tab3',
    label: 'Tab 3',
    content: <div data-testid="content-3">Content 3</div>,
  },
];

describe('TabsCatto', () => {
  describe('rendering', () => {
    it('renders all tabs', () => {
      render(<TabsCatto tabs={mockTabs} />);

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeInTheDocument();
    });

    it('renders tablist', () => {
      render(<TabsCatto tabs={mockTabs} />);

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('renders tabpanel', () => {
      render(<TabsCatto tabs={mockTabs} />);

      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('renders first tab content by default', () => {
      render(<TabsCatto tabs={mockTabs} />);

      expect(screen.getByTestId('content-1')).toBeInTheDocument();
      expect(screen.queryByTestId('content-2')).not.toBeInTheDocument();
    });

    it('renders tab icons when provided', () => {
      const tabsWithIcons = [
        {
          id: 'tab1',
          label: 'Tab 1',
          icon: <span data-testid="icon-1">icon</span>,
          content: <div>Content</div>,
        },
      ];

      render(<TabsCatto tabs={tabsWithIcons} />);

      expect(screen.getByTestId('icon-1')).toBeInTheDocument();
    });
  });

  describe('default tab', () => {
    it('first tab is active by default', () => {
      render(<TabsCatto tabs={mockTabs} />);

      const firstTab = screen.getByRole('tab', { name: 'Tab 1' });
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });

    it('defaultTab sets initial active tab', () => {
      render(<TabsCatto tabs={mockTabs} defaultTab="tab2" />);

      const secondTab = screen.getByRole('tab', { name: 'Tab 2' });
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByTestId('content-2')).toBeInTheDocument();
    });
  });

  describe('tab switching', () => {
    it('clicking tab switches content', () => {
      render(<TabsCatto tabs={mockTabs} />);

      expect(screen.getByTestId('content-1')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(screen.getByTestId('content-2')).toBeInTheDocument();
      expect(screen.queryByTestId('content-1')).not.toBeInTheDocument();
    });

    it('calls onChange callback when tab is clicked', () => {
      const handleChange = vi.fn();
      render(<TabsCatto tabs={mockTabs} onChange={handleChange} />);

      fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('tab2');
    });

    it('updates aria-selected when switching tabs', () => {
      render(<TabsCatto tabs={mockTabs} />);

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab2).toHaveAttribute('aria-selected', 'false');

      fireEvent.click(tab2);

      expect(tab1).toHaveAttribute('aria-selected', 'false');
      expect(tab2).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('disabled tabs', () => {
    it('disabled tab has aria-disabled', () => {
      const tabsWithDisabled = [
        { id: 'tab1', label: 'Tab 1', content: <div>Content</div> },
        {
          id: 'tab2',
          label: 'Tab 2',
          content: <div>Content</div>,
          disabled: true,
        },
      ];

      render(<TabsCatto tabs={tabsWithDisabled} />);

      const disabledTab = screen.getByRole('tab', { name: 'Tab 2' });
      expect(disabledTab).toHaveAttribute('aria-disabled', 'true');
    });

    it('disabled tab has tabIndex -1', () => {
      const tabsWithDisabled = [
        { id: 'tab1', label: 'Tab 1', content: <div>Content</div> },
        {
          id: 'tab2',
          label: 'Tab 2',
          content: <div>Content</div>,
          disabled: true,
        },
      ];

      render(<TabsCatto tabs={tabsWithDisabled} />);

      const disabledTab = screen.getByRole('tab', { name: 'Tab 2' });
      expect(disabledTab).toHaveAttribute('tabIndex', '-1');
    });

    it('clicking disabled tab does not switch content', () => {
      const handleChange = vi.fn();
      const tabsWithDisabled = [
        {
          id: 'tab1',
          label: 'Tab 1',
          content: <div data-testid="content-1">Content 1</div>,
        },
        {
          id: 'tab2',
          label: 'Tab 2',
          content: <div data-testid="content-2">Content 2</div>,
          disabled: true,
        },
      ];

      render(<TabsCatto tabs={tabsWithDisabled} onChange={handleChange} />);

      fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(handleChange).not.toHaveBeenCalled();
      expect(screen.getByTestId('content-1')).toBeInTheDocument();
    });

    it('disabled tab has opacity styling', () => {
      const tabsWithDisabled = [
        { id: 'tab1', label: 'Tab 1', content: <div>Content</div> },
        {
          id: 'tab2',
          label: 'Tab 2',
          content: <div>Content</div>,
          disabled: true,
        },
      ];

      render(<TabsCatto tabs={tabsWithDisabled} />);

      const disabledTab = screen.getByRole('tab', { name: 'Tab 2' });
      expect(disabledTab.className).toContain('opacity-50');
    });
  });

  describe('variants', () => {
    it('applies default variant styles', () => {
      render(<TabsCatto tabs={mockTabs} variant="default" />);

      const activeTab = screen.getByRole('tab', { name: 'Tab 1' });
      expect(activeTab.className).toContain('rounded-t-lg');
    });

    it('applies underline variant styles', () => {
      render(<TabsCatto tabs={mockTabs} variant="underline" />);

      const activeTab = screen.getByRole('tab', { name: 'Tab 1' });
      expect(activeTab.className).toContain('border-b-2');
      expect(activeTab.className).toContain('border-orange-500');
    });

    it('applies pills variant styles', () => {
      render(<TabsCatto tabs={mockTabs} variant="pills" />);

      const activeTab = screen.getByRole('tab', { name: 'Tab 1' });
      expect(activeTab.className).toContain('rounded-full');
      expect(activeTab.className).toContain('bg-orange-500');
    });

    it('applies bordered variant styles', () => {
      render(<TabsCatto tabs={mockTabs} variant="bordered" />);

      const activeTab = screen.getByRole('tab', { name: 'Tab 1' });
      expect(activeTab.className).toContain('border-2');
      expect(activeTab.className).toContain('rounded-lg');
    });
  });

  describe('sizes', () => {
    it('applies small size styles', () => {
      render(<TabsCatto tabs={mockTabs} size="sm" />);

      const tab = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab.className).toContain('text-sm');
      expect(tab.className).toContain('px-3');
    });

    it('applies medium size styles by default', () => {
      render(<TabsCatto tabs={mockTabs} />);

      const tab = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab.className).toContain('text-base');
      expect(tab.className).toContain('px-4');
    });

    it('applies large size styles', () => {
      render(<TabsCatto tabs={mockTabs} size="lg" />);

      const tab = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab.className).toContain('text-lg');
      expect(tab.className).toContain('px-5');
    });
  });

  describe('fullWidth', () => {
    it('applies flex-1 to tabs when fullWidth is true', () => {
      render(<TabsCatto tabs={mockTabs} fullWidth />);

      const tab = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab.className).toContain('flex-1');
    });

    it('does not apply flex-1 when fullWidth is false', () => {
      render(<TabsCatto tabs={mockTabs} fullWidth={false} />);

      const tab = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab.className).not.toContain('flex-1');
    });
  });

  describe('alignment', () => {
    it('applies left alignment by default', () => {
      const { container } = render(<TabsCatto tabs={mockTabs} />);

      const tablist = container.querySelector('[role="tablist"]');
      expect(tablist?.className).toContain('justify-start');
    });

    it('applies center alignment', () => {
      const { container } = render(
        <TabsCatto tabs={mockTabs} align="center" />,
      );

      const tablist = container.querySelector('[role="tablist"]');
      expect(tablist?.className).toContain('justify-center');
    });

    it('applies right alignment', () => {
      const { container } = render(<TabsCatto tabs={mockTabs} align="right" />);

      const tablist = container.querySelector('[role="tablist"]');
      expect(tablist?.className).toContain('justify-end');
    });
  });

  describe('custom classNames', () => {
    it('applies custom className to container', () => {
      const { container } = render(
        <TabsCatto tabs={mockTabs} className="my-custom-class" />,
      );

      expect(container.firstChild).toHaveClass('my-custom-class');
    });

    it('applies custom tabsClassName to tabs container', () => {
      const { container } = render(
        <TabsCatto tabs={mockTabs} tabsClassName="custom-tabs-class" />,
      );

      const tablist = container.querySelector('[role="tablist"]');
      expect(tablist?.className).toContain('custom-tabs-class');
    });

    it('applies custom contentClassName to content area', () => {
      const { container } = render(
        <TabsCatto tabs={mockTabs} contentClassName="custom-content-class" />,
      );

      const tabpanel = container.querySelector('[role="tabpanel"]');
      expect(tabpanel?.className).toContain('custom-content-class');
    });
  });

  describe('accessibility', () => {
    it('tabs have role="tab"', () => {
      render(<TabsCatto tabs={mockTabs} />);

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3);
    });

    it('enabled tabs have tabIndex 0', () => {
      render(<TabsCatto tabs={mockTabs} />);

      const tab = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab).toHaveAttribute('tabIndex', '0');
    });
  });
});
