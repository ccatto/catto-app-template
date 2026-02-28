// @catto/ui - SelectCatto Tests
import { describe, expect, it, vi } from 'vitest';
import SelectCatto from '../../components/Select/SelectCatto';
import { fireEvent, render, screen } from '../test-utils';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('SelectCatto', () => {
  describe('rendering', () => {
    it('renders with placeholder', () => {
      render(
        <SelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          placeholder="Select an item"
        />,
      );

      expect(screen.getByText('Select an item')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(
        <SelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          label="Choose Option"
        />,
      );

      expect(screen.getByText('Choose Option')).toBeInTheDocument();
    });

    it('shows selected value', () => {
      render(
        <SelectCatto
          options={mockOptions}
          value="option2"
          onChange={vi.fn()}
        />,
      );

      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('dropdown', () => {
    it('opens dropdown on click', () => {
      render(<SelectCatto options={mockOptions} value="" onChange={vi.fn()} />);

      fireEvent.click(screen.getByText('Select an option'));

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Option 1' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Option 2' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Option 3' }),
      ).toBeInTheDocument();
    });

    it('closes dropdown when clicking outside', () => {
      render(
        <div>
          <span data-testid="outside">Outside</span>
          <SelectCatto options={mockOptions} value="" onChange={vi.fn()} />
        </div>,
      );

      // Open dropdown
      fireEvent.click(screen.getByText('Select an option'));
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      // Click outside
      fireEvent.mouseDown(screen.getByTestId('outside'));

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('closes dropdown after selecting option', () => {
      render(<SelectCatto options={mockOptions} value="" onChange={vi.fn()} />);

      // Open dropdown
      fireEvent.click(screen.getByText('Select an option'));

      // Select option
      fireEvent.click(screen.getByRole('option', { name: 'Option 1' }));

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('calls onChange when option is selected', () => {
      const handleChange = vi.fn();
      render(
        <SelectCatto options={mockOptions} value="" onChange={handleChange} />,
      );

      // Open dropdown
      fireEvent.click(screen.getByText('Select an option'));

      // Select option
      fireEvent.click(screen.getByRole('option', { name: 'Option 2' }));

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('option2');
    });

    it('shows checkmark on selected option', () => {
      render(
        <SelectCatto
          options={mockOptions}
          value="option1"
          onChange={vi.fn()}
        />,
      );

      // Open dropdown
      fireEvent.click(screen.getByText('Option 1'));

      // The selected option should have a Check icon (SVG)
      const selectedOption = screen.getByRole('option', { name: 'Option 1' });
      const checkIcon = selectedOption.querySelector('svg');
      expect(checkIcon).toBeInTheDocument();
    });

    it('sets aria-selected on selected option', () => {
      render(
        <SelectCatto
          options={mockOptions}
          value="option2"
          onChange={vi.fn()}
        />,
      );

      // Open dropdown
      fireEvent.click(screen.getByText('Option 2'));

      const selectedOption = screen.getByRole('option', { name: 'Option 2' });
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');

      const unselectedOption = screen.getByRole('option', { name: 'Option 1' });
      expect(unselectedOption).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('auto-select single option', () => {
    it('auto-selects when only one option exists', () => {
      const handleChange = vi.fn();
      const singleOption = [{ value: 'only', label: 'Only Option' }];

      render(
        <SelectCatto options={singleOption} value="" onChange={handleChange} />,
      );

      expect(handleChange).toHaveBeenCalledWith('only');
    });

    it('does not auto-select when value already exists', () => {
      const handleChange = vi.fn();
      const singleOption = [{ value: 'only', label: 'Only Option' }];

      render(
        <SelectCatto
          options={singleOption}
          value="only"
          onChange={handleChange}
        />,
      );

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('does not open dropdown when disabled', () => {
      render(
        <SelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          disabled
        />,
      );

      fireEvent.click(screen.getByText('Select an option'));

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('applies disabled styling', () => {
      const { container } = render(
        <SelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          disabled
        />,
      );

      const selectButton = container.querySelector('.opacity-50');
      expect(selectButton).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('shows error message when error provided', () => {
      render(
        <SelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          error="Please select an option"
        />,
      );

      expect(screen.getByText('Please select an option')).toBeInTheDocument();
    });

    it('applies error styling when error exists', () => {
      const { container } = render(
        <SelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          error="Error"
        />,
      );

      const selectButton = container.querySelector('.border-red-500');
      expect(selectButton).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('applies small size styles', () => {
      const { container } = render(
        <SelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          size="sm"
        />,
      );

      const selectButton = container.querySelector('.text-sm');
      expect(selectButton).toBeInTheDocument();
    });

    it('applies medium size styles by default', () => {
      const { container } = render(
        <SelectCatto options={mockOptions} value="" onChange={vi.fn()} />,
      );

      const selectButton = container.querySelector('.px-4');
      expect(selectButton).toBeInTheDocument();
    });

    it('applies large size styles', () => {
      const { container } = render(
        <SelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          size="lg"
        />,
      );

      const selectButton = container.querySelector('.text-lg');
      expect(selectButton).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('applies default variant styles', () => {
      const { container } = render(
        <SelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          variant="default"
          theme="dark"
        />,
      );

      // Uses explicit Tailwind colors
      const selectButton = container.querySelector('.bg-slate-800');
      expect(selectButton).toBeInTheDocument();
    });

    it('applies primary variant styles', () => {
      const { container } = render(
        <SelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          variant="primary"
          theme="dark"
        />,
      );

      // Uses explicit Tailwind colors
      const selectButton = container.querySelector('.text-blue-300');
      expect(selectButton).toBeInTheDocument();
    });

    it('applies outline variant styles', () => {
      const { container } = render(
        <SelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          variant="outline"
          theme="dark"
        />,
      );

      const selectButton = container.querySelector('.border-2');
      expect(selectButton).toBeInTheDocument();
    });
  });

  describe('width', () => {
    it('applies full width by default', () => {
      const { container } = render(
        <SelectCatto options={mockOptions} value="" onChange={vi.fn()} />,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('w-full');
    });

    it('applies custom width', () => {
      const { container } = render(
        <SelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          width="md"
        />,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('w-48');
    });
  });

  describe('accessibility', () => {
    it('has aria-expanded attribute', () => {
      const { container } = render(
        <SelectCatto options={mockOptions} value="" onChange={vi.fn()} />,
      );

      const trigger = container.querySelector('[aria-expanded]');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(screen.getByText('Select an option'));

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('has aria-haspopup attribute', () => {
      const { container } = render(
        <SelectCatto options={mockOptions} value="" onChange={vi.fn()} />,
      );

      const trigger = container.querySelector('[aria-haspopup]');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    });
  });

  describe('custom className', () => {
    it('merges custom className', () => {
      const { container } = render(
        <SelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          className="my-custom-class"
        />,
      );

      const selectWrapper = container.querySelector('.my-custom-class');
      expect(selectWrapper).toBeInTheDocument();
    });
  });

  describe('typeahead keyboard navigation', () => {
    const stateOptions = [
      { value: 'al', label: 'Alabama' },
      { value: 'ak', label: 'Alaska' },
      { value: 'fl', label: 'Florida' },
      { value: 'ga', label: 'Georgia' },
      { value: 'ne', label: 'Nebraska' },
      { value: 'nv', label: 'Nevada' },
      { value: 'ny', label: 'New York' },
    ];

    it('opens dropdown and jumps to matching option when letter pressed while closed', () => {
      render(
        <SelectCatto
          options={stateOptions}
          value=""
          onChange={vi.fn()}
          placeholder="Select a state"
        />,
      );

      const trigger = screen.getByRole('combobox');
      trigger.focus();

      // Press "f" while closed
      fireEvent.keyDown(trigger, { key: 'f' });

      // Dropdown should open
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('jumps to first matching option when letter pressed while open', () => {
      render(
        <SelectCatto
          options={stateOptions}
          value=""
          onChange={vi.fn()}
          placeholder="Select a state"
        />,
      );

      const trigger = screen.getByRole('combobox');

      // Open dropdown
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      // Press "n" — should focus Nebraska (first N option)
      fireEvent.keyDown(trigger, { key: 'n' });

      const nebraskaOption = screen.getByRole('option', { name: 'Nebraska' });
      expect(document.activeElement).toBe(nebraskaOption);
    });

    it('cycles through same-letter options on repeated key press', async () => {
      render(
        <SelectCatto
          options={stateOptions}
          value=""
          onChange={vi.fn()}
          placeholder="Select a state"
        />,
      );

      const trigger = screen.getByRole('combobox');

      // Open dropdown
      fireEvent.click(trigger);

      // Press "n" — should focus Nebraska
      fireEvent.keyDown(trigger, { key: 'n' });
      expect(document.activeElement).toBe(
        screen.getByRole('option', { name: 'Nebraska' }),
      );

      // Press "n" again — should cycle to Nevada
      fireEvent.keyDown(trigger, { key: 'n' });
      expect(document.activeElement).toBe(
        screen.getByRole('option', { name: 'Nevada' }),
      );

      // Press "n" again — should cycle to New York
      fireEvent.keyDown(trigger, { key: 'n' });
      expect(document.activeElement).toBe(
        screen.getByRole('option', { name: 'New York' }),
      );

      // Press "n" again — should wrap back to Nebraska
      fireEvent.keyDown(trigger, { key: 'n' });
      expect(document.activeElement).toBe(
        screen.getByRole('option', { name: 'Nebraska' }),
      );
    });

    it('does multi-character prefix search when different letters typed quickly', () => {
      render(
        <SelectCatto
          options={stateOptions}
          value=""
          onChange={vi.fn()}
          placeholder="Select a state"
        />,
      );

      const trigger = screen.getByRole('combobox');

      // Open dropdown
      fireEvent.click(trigger);

      // Type "ne" quickly — should match "Nebraska" (not "Nevada")
      fireEvent.keyDown(trigger, { key: 'n' });
      fireEvent.keyDown(trigger, { key: 'e' });

      expect(document.activeElement).toBe(
        screen.getByRole('option', { name: 'Nebraska' }),
      );
    });

    it('selects focused option with Enter after typeahead', () => {
      const handleChange = vi.fn();
      render(
        <SelectCatto
          options={stateOptions}
          value=""
          onChange={handleChange}
          placeholder="Select a state"
        />,
      );

      const trigger = screen.getByRole('combobox');

      // Open dropdown
      fireEvent.click(trigger);

      // Type "f" to jump to Florida
      fireEvent.keyDown(trigger, { key: 'f' });
      expect(document.activeElement).toBe(
        screen.getByRole('option', { name: 'Florida' }),
      );

      // Press Enter on the focused Florida option
      fireEvent.keyDown(trigger, { key: 'Enter' });

      expect(handleChange).toHaveBeenCalledWith('fl');
    });

    it('cycles through "a" options: Alabama → Alaska → wrap', () => {
      render(
        <SelectCatto
          options={stateOptions}
          value=""
          onChange={vi.fn()}
          placeholder="Select a state"
        />,
      );

      const trigger = screen.getByRole('combobox');

      // Open dropdown
      fireEvent.click(trigger);

      // Press "a" — Alabama
      fireEvent.keyDown(trigger, { key: 'a' });
      expect(document.activeElement).toBe(
        screen.getByRole('option', { name: 'Alabama' }),
      );

      // Press "a" again — Alaska
      fireEvent.keyDown(trigger, { key: 'a' });
      expect(document.activeElement).toBe(
        screen.getByRole('option', { name: 'Alaska' }),
      );

      // Press "a" again — wraps back to Alabama
      fireEvent.keyDown(trigger, { key: 'a' });
      expect(document.activeElement).toBe(
        screen.getByRole('option', { name: 'Alabama' }),
      );
    });
  });
});
