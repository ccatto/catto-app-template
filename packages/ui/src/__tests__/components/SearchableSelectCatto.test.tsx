// @catto/ui - SearchableSelectCatto Tests
import { describe, expect, it, vi } from 'vitest';
import SearchableSelectCatto from '../../components/SearchableSelect/SearchableSelectCatto';
import { fireEvent, render, screen } from '../test-utils';

const mockOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
];

describe('SearchableSelectCatto', () => {
  describe('rendering', () => {
    it('renders with placeholder', () => {
      render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          placeholder="Search fruits..."
        />,
      );

      expect(
        screen.getByPlaceholderText('Search fruits...'),
      ).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          label="Select a fruit"
        />,
      );

      expect(screen.getByText('Select a fruit')).toBeInTheDocument();
    });

    it('shows selected value', () => {
      render(
        <SearchableSelectCatto
          options={mockOptions}
          value="banana"
          onChange={vi.fn()}
        />,
      );

      expect(screen.getByDisplayValue('Banana')).toBeInTheDocument();
    });
  });

  describe('dropdown', () => {
    it('opens dropdown on click', () => {
      render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      const input = screen.getByRole('textbox');
      fireEvent.click(input);

      // Should show all options
      expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Banana' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: 'Cherry' }),
      ).toBeInTheDocument();
    });

    it('closes dropdown when clicking outside', () => {
      render(
        <div>
          <span data-testid="outside">Outside</span>
          <SearchableSelectCatto
            options={mockOptions}
            value=""
            onChange={vi.fn()}
          />
        </div>,
      );

      // Open dropdown
      fireEvent.click(screen.getByRole('textbox'));
      expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();

      // Click outside
      fireEvent.mouseDown(screen.getByTestId('outside'));

      expect(
        screen.queryByRole('option', { name: 'Apple' }),
      ).not.toBeInTheDocument();
    });

    it('closes dropdown after selecting option', () => {
      render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      // Open dropdown
      fireEvent.click(screen.getByRole('textbox'));

      // Select option
      fireEvent.click(screen.getByRole('option', { name: 'Apple' }));

      expect(
        screen.queryByRole('option', { name: 'Apple' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('search functionality', () => {
    it('filters options as user types', () => {
      render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      const input = screen.getByRole('textbox');
      fireEvent.click(input);
      fireEvent.change(input, { target: { value: 'app' } });

      // Should only show Apple
      expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
      expect(
        screen.queryByRole('option', { name: 'Banana' }),
      ).not.toBeInTheDocument();
    });

    it('shows no results message when no matches', () => {
      render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          noResultsText="No fruits found"
        />,
      );

      const input = screen.getByRole('textbox');
      fireEvent.click(input);
      fireEvent.change(input, { target: { value: 'xyz' } });

      expect(screen.getByText('No fruits found')).toBeInTheDocument();
    });

    it('is case insensitive', () => {
      render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      const input = screen.getByRole('textbox');
      fireEvent.click(input);
      fireEvent.change(input, { target: { value: 'APPLE' } });

      expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('calls onChange when option is selected', () => {
      const handleChange = vi.fn();
      render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={handleChange}
        />,
      );

      fireEvent.click(screen.getByRole('textbox'));
      fireEvent.click(screen.getByRole('option', { name: 'Cherry' }));

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('cherry');
    });

    it('shows checkmark on selected option', () => {
      render(
        <SearchableSelectCatto
          options={mockOptions}
          value="banana"
          onChange={vi.fn()}
        />,
      );

      fireEvent.click(screen.getByRole('textbox'));

      const selectedOption = screen.getByRole('option', { name: 'Banana' });
      const checkIcon = selectedOption.querySelector('svg');
      expect(checkIcon).toBeInTheDocument();
    });

    it('sets aria-selected on selected option', () => {
      render(
        <SearchableSelectCatto
          options={mockOptions}
          value="grape"
          onChange={vi.fn()}
        />,
      );

      fireEvent.click(screen.getByRole('textbox'));

      const selectedOption = screen.getByRole('option', { name: 'Grape' });
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');

      const unselectedOption = screen.getByRole('option', { name: 'Apple' });
      expect(unselectedOption).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('create new functionality', () => {
    it('shows create new option when allowCreate is true', () => {
      render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          allowCreate
          onCreateNew={vi.fn()}
          createNewText="Add new fruit"
        />,
      );

      const input = screen.getByRole('textbox');
      fireEvent.click(input);
      fireEvent.change(input, { target: { value: 'mango' } });

      expect(screen.getByText('Add new fruit: "mango"')).toBeInTheDocument();
    });

    it('calls onCreateNew when create option is clicked', () => {
      const handleCreateNew = vi.fn();
      render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          allowCreate
          onCreateNew={handleCreateNew}
        />,
      );

      const input = screen.getByRole('textbox');
      fireEvent.click(input);
      fireEvent.change(input, { target: { value: 'mango' } });

      fireEvent.click(screen.getByText(/Create new: "mango"/));

      expect(handleCreateNew).toHaveBeenCalledWith('mango');
    });
  });

  describe('disabled state', () => {
    it('does not open dropdown when disabled', () => {
      render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          disabled
        />,
      );

      fireEvent.click(screen.getByRole('textbox'));

      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('applies disabled styling', () => {
      const { container } = render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          disabled
        />,
      );

      const selectContainer = container.querySelector('.opacity-50');
      expect(selectContainer).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('shows error message', () => {
      render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          error="Please select a fruit"
        />,
      );

      expect(screen.getByText('Please select a fruit')).toBeInTheDocument();
    });

    it('applies error styling', () => {
      const { container } = render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          error="Error"
        />,
      );

      const selectContainer = container.querySelector('.border-red-500');
      expect(selectContainer).toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    it('closes dropdown on Escape', () => {
      render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      const input = screen.getByRole('textbox');
      fireEvent.click(input);

      expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();

      fireEvent.keyDown(input, { key: 'Escape' });

      expect(
        screen.queryByRole('option', { name: 'Apple' }),
      ).not.toBeInTheDocument();
    });

    it('navigates options with arrow keys', () => {
      render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      const input = screen.getByRole('textbox');
      fireEvent.click(input);

      // Press arrow down to focus first option
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      const firstOption = screen.getByRole('option', { name: 'Apple' });
      expect(document.activeElement).toBe(firstOption);
    });
  });

  describe('sizes', () => {
    it('applies small size', () => {
      const { container } = render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          size="small"
        />,
      );

      const selectContainer = container.querySelector('.h-8');
      expect(selectContainer).toBeInTheDocument();
    });

    it('applies medium size by default', () => {
      const { container } = render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      const selectContainer = container.querySelector('.h-10');
      expect(selectContainer).toBeInTheDocument();
    });

    it('applies large size', () => {
      const { container } = render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          size="large"
        />,
      );

      const selectContainer = container.querySelector('.h-12');
      expect(selectContainer).toBeInTheDocument();
    });
  });

  describe('themes', () => {
    it('applies light theme', () => {
      const { container } = render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          theme="light"
        />,
      );

      const selectContainer = container.querySelector('.bg-slate-50');
      expect(selectContainer).toBeInTheDocument();
    });

    it('applies sunset theme by default', () => {
      const { container } = render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      const selectContainer = container.querySelector('.bg-orange-50');
      expect(selectContainer).toBeInTheDocument();
    });

    it('applies ocean theme', () => {
      const { container } = render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          theme="ocean"
        />,
      );

      const selectContainer = container.querySelector('.bg-indigo-50');
      expect(selectContainer).toBeInTheDocument();
    });
  });

  describe('width', () => {
    it('applies full width by default', () => {
      const { container } = render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
        />,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('w-full');
    });

    it('applies custom width', () => {
      const { container } = render(
        <SearchableSelectCatto
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

  describe('custom className', () => {
    it('merges custom className', () => {
      const { container } = render(
        <SearchableSelectCatto
          options={mockOptions}
          value=""
          onChange={vi.fn()}
          className="my-custom-class"
        />,
      );

      const wrapper = container.querySelector('.my-custom-class');
      expect(wrapper).toBeInTheDocument();
    });
  });
});
