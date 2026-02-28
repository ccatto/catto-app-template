// @catto/ui - Component Accessibility Tests
import { describe, expect, it } from 'vitest';
import ButtonCatto from '../../components/Button/ButtonCatto';
import CardCatto from '../../components/Card/CardCatto';
import CheckboxCatto from '../../components/Checkbox/CheckboxCatto';
import EmptyStateCatto from '../../components/EmptyState/EmptyStateCatto';
import InputCatto from '../../components/Input/InputCatto';
import LinkCatto from '../../components/Link/LinkCatto';
import MellowModalCatto from '../../components/Modal/MellowModalCatto';
import SelectCatto from '../../components/Select/SelectCatto';
import TabsCatto from '../../components/Tabs/TabsCatto';
import TooltipCatto from '../../components/Tooltip/TooltipCatto';
import { render, screen } from '../test-utils';
import { a11yChecks, checkA11y } from './a11y-test-utils';

describe('Accessibility Tests', () => {
  describe('ButtonCatto', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<ButtonCatto>Click Me</ButtonCatto>);
      await checkA11y(container);
    });

    it('button is focusable', () => {
      render(<ButtonCatto>Click Me</ButtonCatto>);
      const button = screen.getByRole('button');
      expect(a11yChecks.isFocusable(button)).toBe(true);
    });

    it('button has accessible name', () => {
      render(<ButtonCatto>Click Me</ButtonCatto>);
      const button = screen.getByRole('button');
      expect(a11yChecks.hasAccessibleName(button)).toBe(true);
    });

    it('disabled button has disabled attribute', () => {
      render(<ButtonCatto disabled>Disabled</ButtonCatto>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled');
    });

    it('loading button indicates loading state', () => {
      render(<ButtonCatto isLoading>Loading</ButtonCatto>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('InputCatto', () => {
    it('has no accessibility violations with label', async () => {
      const { container } = render(
        <InputCatto label="Email" id="email" placeholder="Enter email" />,
      );
      await checkA11y(container);
    });

    it('input has associated label', () => {
      render(<InputCatto label="Email" id="email" />);
      const input = screen.getByRole('textbox');
      expect(a11yChecks.inputHasLabel(input)).toBe(true);
    });

    it('required input shows required indicator', () => {
      render(<InputCatto label="Email" id="email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('error state has aria-invalid', () => {
      render(<InputCatto label="Email" id="email" error="Invalid email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('error message is linked via aria-describedby', () => {
      render(<InputCatto label="Email" id="email" error="Invalid email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
    });
  });

  describe('SelectCatto', () => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ];

    it('has no accessibility violations', async () => {
      const { container } = render(
        <SelectCatto
          options={options}
          label="Choose"
          value=""
          onChange={() => {}}
        />,
      );
      await checkA11y(container);
    });

    it('has role combobox', () => {
      const { container } = render(
        <SelectCatto options={options} value="" onChange={() => {}} />,
      );
      const combobox = container.querySelector('[role="combobox"]');
      expect(combobox).toBeInTheDocument();
    });

    it('has aria-controls for listbox', () => {
      const { container } = render(
        <SelectCatto options={options} value="" onChange={() => {}} />,
      );
      const combobox = container.querySelector('[role="combobox"]');
      expect(combobox).toHaveAttribute('aria-controls');
    });

    // SelectCatto uses a div with tabindex instead of combobox role - check it's focusable
    it('select trigger is focusable', () => {
      const { container } = render(<SelectCatto options={options} />);
      const trigger = container.querySelector('[tabindex="0"]');
      expect(trigger).toBeInTheDocument();
    });

    it('has aria-expanded attribute', () => {
      const { container } = render(<SelectCatto options={options} />);
      const trigger = container.querySelector('[aria-expanded]');
      expect(trigger).toHaveAttribute('aria-expanded');
    });

    it('has aria-haspopup attribute', () => {
      const { container } = render(<SelectCatto options={options} />);
      const trigger = container.querySelector('[aria-haspopup]');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    });
  });

  describe('CheckboxCatto', () => {
    it('has no accessibility violations with label', async () => {
      const { container } = render(
        <CheckboxCatto
          id="terms"
          checked={false}
          onChange={() => {}}
          label="I agree to terms"
        />,
      );
      await checkA11y(container);
    });

    it('has no accessibility violations with aria-label', async () => {
      const { container } = render(
        <CheckboxCatto
          id="terms"
          checked={false}
          onChange={() => {}}
          aria-label="Toggle terms"
        />,
      );
      await checkA11y(container);
    });

    it('checkbox is accessible via label', () => {
      const { container } = render(
        <CheckboxCatto id="terms" checked={false} onChange={() => {}} />,
      );
      const label = container.querySelector('label');
      expect(label).toHaveAttribute('for', 'terms');
    });

    it('checkbox reflects checked state', () => {
      render(<CheckboxCatto id="terms" checked={true} onChange={() => {}} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
  });

  describe('MellowModalCatto', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <MellowModalCatto isOpen onClose={() => {}} title="Modal Title">
          Modal content
        </MellowModalCatto>,
      );
      await checkA11y(container);
    });

    it('has role dialog', () => {
      render(
        <MellowModalCatto isOpen onClose={() => {}}>
          Content
        </MellowModalCatto>,
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has aria-modal attribute', () => {
      render(
        <MellowModalCatto isOpen onClose={() => {}}>
          Content
        </MellowModalCatto>,
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('has aria-labelledby when title provided', () => {
      render(
        <MellowModalCatto isOpen onClose={() => {}} title="Test Title">
          Content
        </MellowModalCatto>,
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby');
    });

    it('close button has accessible name', () => {
      render(
        <MellowModalCatto isOpen onClose={() => {}}>
          Content
        </MellowModalCatto>,
      );
      expect(
        screen.getByRole('button', { name: 'Close modal' }),
      ).toBeInTheDocument();
    });
  });

  describe('TabsCatto', () => {
    const tabs = [
      { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
      { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
    ];

    it('has no accessibility violations', async () => {
      const { container } = render(<TabsCatto tabs={tabs} />);
      await checkA11y(container);
    });

    it('has tablist role', () => {
      render(<TabsCatto tabs={tabs} />);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('tabs have tab role', () => {
      render(<TabsCatto tabs={tabs} />);
      expect(screen.getAllByRole('tab')).toHaveLength(2);
    });

    it('has tabpanel role', () => {
      render(<TabsCatto tabs={tabs} />);
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('active tab has aria-selected true', () => {
      render(<TabsCatto tabs={tabs} />);
      const firstTab = screen.getByRole('tab', { name: 'Tab 1' });
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });

    it('inactive tab has aria-selected false', () => {
      render(<TabsCatto tabs={tabs} />);
      const secondTab = screen.getByRole('tab', { name: 'Tab 2' });
      expect(secondTab).toHaveAttribute('aria-selected', 'false');
    });

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
  });

  describe('LinkCatto', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <LinkCatto href="/test">Test Link</LinkCatto>,
      );
      await checkA11y(container);
    });

    it('link is focusable', () => {
      render(<LinkCatto href="/test">Test Link</LinkCatto>);
      const link = screen.getByRole('link');
      expect(a11yChecks.isFocusable(link)).toBe(true);
    });

    it('link has accessible name', () => {
      render(<LinkCatto href="/test">Test Link</LinkCatto>);
      const link = screen.getByRole('link');
      expect(a11yChecks.hasAccessibleName(link)).toBe(true);
    });

    it('disabled link has aria-disabled', () => {
      render(
        <LinkCatto href="/test" disabled>
          Disabled
        </LinkCatto>,
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('CardCatto', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <CardCatto title="Card Title">Card content</CardCatto>,
      );
      await checkA11y(container);
    });

    it('heading has aria-level', () => {
      const { container } = render(
        <CardCatto title="Card Title">Card content</CardCatto>,
      );
      const heading = container.querySelector('[role="heading"]');
      expect(heading).toHaveAttribute('aria-level', '2');
    });

    it('collapsible card button has accessible name', () => {
      render(
        <CardCatto title="Collapsible" collapsible>
          Content
        </CardCatto>,
      );
      // The collapse button should have an aria-label
      const collapseButton = screen.getByRole('button', {
        name: /collapse/i,
      });
      expect(collapseButton).toBeInTheDocument();
    });
  });

  describe('EmptyStateCatto', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <EmptyStateCatto
          title="No Results"
          description="Try a different search"
        />,
      );
      await checkA11y(container);
    });

    it('has heading', () => {
      render(<EmptyStateCatto title="No Results" />);
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('action button is accessible', () => {
      render(
        <EmptyStateCatto
          title="No Items"
          action={{ label: 'Add Item', onClick: () => {} }}
        />,
      );
      expect(
        screen.getByRole('button', { name: 'Add Item' }),
      ).toBeInTheDocument();
    });
  });

  describe('TooltipCatto', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <TooltipCatto content="Tooltip text">
          <button>Hover me</button>
        </TooltipCatto>,
      );
      await checkA11y(container);
    });

    it('tooltip has role tooltip', () => {
      render(
        <TooltipCatto content="Tooltip text">
          <button>Hover me</button>
        </TooltipCatto>,
      );
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });
});
