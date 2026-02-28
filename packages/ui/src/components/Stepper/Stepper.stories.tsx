// @catto/ui - Stepper Components Stories
import type { Meta, StoryObj } from '@storybook/react';
import DetailedStepperCatto from './DetailedStepperCatto';
import ProgressStepperCatto from './ProgressStepperCatto';

const meta = {
  title: 'Components/Stepper',
  component: ProgressStepperCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ProgressStepperCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

// ProgressStepperCatto Stories

export const ProgressDefault: Story = {
  args: {
    totalSteps: 4,
    currentStep: 1,
  },
};

export const ProgressFirstStep: Story = {
  args: {
    totalSteps: 4,
    currentStep: 0,
  },
};

export const ProgressMiddleStep: Story = {
  args: {
    totalSteps: 5,
    currentStep: 2,
  },
};

export const ProgressLastStep: Story = {
  args: {
    totalSteps: 4,
    currentStep: 3,
  },
};

export const ProgressAllComplete: Story = {
  args: {
    totalSteps: 4,
    currentStep: 4, // Past the last step
  },
};

export const ProgressThreeSteps: Story = {
  args: {
    totalSteps: 3,
    currentStep: 1,
  },
};

export const ProgressFiveSteps: Story = {
  args: {
    totalSteps: 5,
    currentStep: 2,
  },
};

// DetailedStepperCatto Stories

const detailedSteps = [
  { title: 'Account Info', description: 'Enter your email and password' },
  { title: 'Personal Details', description: 'Your name and phone number' },
  { title: 'Confirmation', description: 'Review and submit' },
];

const detailedSteps4 = [
  { title: 'Cart', description: 'Review items' },
  { title: 'Shipping', description: 'Delivery address' },
  { title: 'Payment', description: 'Payment method' },
  { title: 'Confirmation', description: 'Place order' },
];

export const DetailedDefault: Story = {
  render: () => <DetailedStepperCatto steps={detailedSteps} currentStep={1} />,
};

export const DetailedFirstStep: Story = {
  render: () => <DetailedStepperCatto steps={detailedSteps} currentStep={0} />,
};

export const DetailedLastStep: Story = {
  render: () => <DetailedStepperCatto steps={detailedSteps} currentStep={2} />,
};

export const DetailedFourSteps: Story = {
  render: () => <DetailedStepperCatto steps={detailedSteps4} currentStep={2} />,
};

export const DetailedNoDescriptions: Story = {
  render: () => (
    <DetailedStepperCatto
      steps={[{ title: 'Step 1' }, { title: 'Step 2' }, { title: 'Step 3' }]}
      currentStep={1}
    />
  ),
};

export const DetailedWithCompletedSteps: Story = {
  render: () => (
    <DetailedStepperCatto
      steps={[
        { title: 'Setup', description: 'Complete', completed: true },
        { title: 'Configure', description: 'In progress' },
        { title: 'Deploy', description: 'Pending' },
      ]}
      currentStep={1}
    />
  ),
};

// Comparison Story
export const BothSteppers: Story = {
  render: () => (
    <div className="space-y-8 w-full max-w-2xl">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          ProgressStepperCatto
        </p>
        <ProgressStepperCatto totalSteps={4} currentStep={2} />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          DetailedStepperCatto
        </p>
        <DetailedStepperCatto steps={detailedSteps4} currentStep={2} />
      </div>
    </div>
  ),
};
