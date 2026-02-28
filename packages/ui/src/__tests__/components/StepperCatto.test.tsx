// @catto/ui - ProgressStepperCatto and DetailedStepperCatto Tests
import { describe, expect, it } from 'vitest';
import DetailedStepperCatto from '../../components/Stepper/DetailedStepperCatto';
import ProgressStepperCatto from '../../components/Stepper/ProgressStepperCatto';
import { render, screen } from '../test-utils';

describe('ProgressStepperCatto', () => {
  describe('rendering', () => {
    it('renders correct number of steps with totalSteps', () => {
      const { container } = render(
        <ProgressStepperCatto totalSteps={5} currentStep={2} />,
      );

      const steps = container.querySelectorAll('li');
      expect(steps).toHaveLength(5);
    });

    it('renders correct number of steps with steps array', () => {
      const steps = [
        { completed: true },
        { completed: true },
        { completed: false },
        { completed: false },
      ];

      const { container } = render(
        <ProgressStepperCatto steps={steps} currentStep={2} />,
      );

      const stepElements = container.querySelectorAll('li');
      expect(stepElements).toHaveLength(4);
    });

    it('displays step numbers', () => {
      render(<ProgressStepperCatto totalSteps={3} currentStep={0} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('shows checkmark for completed steps', () => {
      const { container } = render(
        <ProgressStepperCatto totalSteps={3} currentStep={2} />,
      );

      // First two steps should have checkmark SVGs
      const checkmarks = container.querySelectorAll('svg');
      expect(checkmarks.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('step states', () => {
    it('marks steps before currentStep as completed', () => {
      const { container } = render(
        <ProgressStepperCatto totalSteps={4} currentStep={2} />,
      );

      const steps = container.querySelectorAll('li');

      // First two steps should have completed styling
      expect(steps[0].className).toContain('text-blue-600');
      expect(steps[1].className).toContain('text-blue-600');
    });

    it('highlights current step', () => {
      render(<ProgressStepperCatto totalSteps={4} currentStep={2} />);

      // Step 3 (index 2) should be displayed with current step styling
      const currentStepNumber = screen.getByText('3');
      expect(currentStepNumber.className).toContain('text-blue-600');
    });

    it('uses completed property from steps array', () => {
      const steps = [
        { completed: true },
        { completed: false },
        { completed: true },
      ];

      const { container } = render(
        <ProgressStepperCatto steps={steps} currentStep={1} />,
      );

      const stepElements = container.querySelectorAll('li');

      // First step should be completed
      expect(stepElements[0].className).toContain('text-blue-600');
      // Third step should also be completed (explicit override)
      expect(stepElements[2].className).toContain('text-blue-600');
    });
  });

  describe('custom icons', () => {
    it('renders custom icons when provided', () => {
      const steps = [
        { completed: true, icon: <span data-testid="custom-icon">✓</span> },
        { completed: false },
      ];

      render(<ProgressStepperCatto steps={steps} currentStep={1} />);

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('custom className', () => {
    it('merges custom className', () => {
      const { container } = render(
        <ProgressStepperCatto
          totalSteps={3}
          currentStep={0}
          className="my-custom-class"
        />,
      );

      const stepper = container.querySelector('ol');
      expect(stepper?.className).toContain('my-custom-class');
    });
  });
});

describe('DetailedStepperCatto', () => {
  const mockSteps = [
    { title: 'Account Info', description: 'Enter your details' },
    { title: 'Verification', description: 'Verify your email' },
    { title: 'Confirmation', description: 'Review and confirm' },
  ];

  describe('rendering', () => {
    it('renders all steps', () => {
      render(<DetailedStepperCatto steps={mockSteps} currentStep={0} />);

      expect(screen.getByText('Account Info')).toBeInTheDocument();
      expect(screen.getByText('Verification')).toBeInTheDocument();
      expect(screen.getByText('Confirmation')).toBeInTheDocument();
    });

    it('renders step descriptions', () => {
      render(<DetailedStepperCatto steps={mockSteps} currentStep={0} />);

      expect(screen.getByText('Enter your details')).toBeInTheDocument();
      expect(screen.getByText('Verify your email')).toBeInTheDocument();
      expect(screen.getByText('Review and confirm')).toBeInTheDocument();
    });

    it('renders step numbers', () => {
      render(<DetailedStepperCatto steps={mockSteps} currentStep={0} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders without descriptions', () => {
      const stepsWithoutDesc = [{ title: 'Step 1' }, { title: 'Step 2' }];

      render(<DetailedStepperCatto steps={stepsWithoutDesc} currentStep={0} />);

      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
    });
  });

  describe('step states', () => {
    it('marks completed steps with active styling', () => {
      const { container } = render(
        <DetailedStepperCatto steps={mockSteps} currentStep={2} />,
      );

      const steps = container.querySelectorAll('li');

      // First two steps should have completed styling
      expect(steps[0].className).toContain('text-blue-600');
      expect(steps[1].className).toContain('text-blue-600');
    });

    it('marks current step with active styling', () => {
      const { container } = render(
        <DetailedStepperCatto steps={mockSteps} currentStep={1} />,
      );

      const steps = container.querySelectorAll('li');

      // Current step should have active styling
      expect(steps[1].className).toContain('text-blue-600');
    });

    it('marks future steps with inactive styling', () => {
      const { container } = render(
        <DetailedStepperCatto steps={mockSteps} currentStep={0} />,
      );

      const steps = container.querySelectorAll('li');

      // Future steps should have inactive styling
      expect(steps[1].className).toContain('text-gray-500');
      expect(steps[2].className).toContain('text-gray-500');
    });

    it('uses completed property override', () => {
      const stepsWithOverride = [
        { title: 'Step 1', completed: false },
        { title: 'Step 2', completed: true },
        { title: 'Step 3', completed: false },
      ];

      const { container } = render(
        <DetailedStepperCatto steps={stepsWithOverride} currentStep={0} />,
      );

      const steps = container.querySelectorAll('li');

      // Step 1 should be inactive (completed: false override)
      expect(steps[0].className).toContain('text-blue-600'); // but current
      // Step 2 should be active (completed: true override)
      expect(steps[1].className).toContain('text-blue-600');
      // Step 3 should be inactive
      expect(steps[2].className).toContain('text-gray-500');
    });
  });

  describe('step number circle', () => {
    it('applies active border to completed/current steps', () => {
      const { container } = render(
        <DetailedStepperCatto steps={mockSteps} currentStep={1} />,
      );

      const circles = container.querySelectorAll('span.flex');

      // First two should have active border
      expect(circles[0].className).toContain('border-blue-600');
      expect(circles[1].className).toContain('border-blue-600');
      // Third should have inactive border
      expect(circles[2].className).toContain('border-gray-500');
    });
  });

  describe('custom className', () => {
    it('merges custom className', () => {
      const { container } = render(
        <DetailedStepperCatto
          steps={mockSteps}
          currentStep={0}
          className="my-custom-class"
        />,
      );

      const stepper = container.querySelector('ol');
      expect(stepper?.className).toContain('my-custom-class');
    });
  });

  describe('responsive layout', () => {
    it('has responsive flex layout classes', () => {
      const { container } = render(
        <DetailedStepperCatto steps={mockSteps} currentStep={0} />,
      );

      const stepper = container.querySelector('ol');
      expect(stepper?.className).toContain('sm:flex');
      expect(stepper?.className).toContain('space-y-4');
      expect(stepper?.className).toContain('sm:space-y-0');
    });
  });
});
