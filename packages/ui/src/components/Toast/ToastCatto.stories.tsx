import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ToastCatto from './ToastCatto';

const meta = {
  title: 'Components/Toast',
  component: ToastCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
    },
    position: {
      control: 'select',
      options: [
        'top-right',
        'top-left',
        'bottom-right',
        'bottom-left',
        'top-center',
        'bottom-center',
      ],
    },
  },
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof ToastCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    message: 'Your changes have been saved successfully!',
    type: 'success',
    isVisible: true,
  },
};

export const Error: Story = {
  args: {
    message: 'Something went wrong. Please try again.',
    type: 'error',
    isVisible: true,
  },
};

export const Warning: Story = {
  args: {
    message: 'Your session will expire in 5 minutes.',
    type: 'warning',
    isVisible: true,
  },
};

export const Info: Story = {
  args: {
    message: 'A new version is available. Refresh to update.',
    type: 'info',
    isVisible: true,
  },
};

export const WithTitle: Story = {
  args: {
    title: 'Success!',
    message: 'Your profile has been updated.',
    type: 'success',
    isVisible: true,
  },
};

export const LongMessage: Story = {
  args: {
    message:
      'This is a longer toast message that contains more information about what happened. It might wrap to multiple lines depending on the container width.',
    type: 'info',
    isVisible: true,
  },
};

export const AutoDismiss: Story = {
  args: {
    message: 'This toast will auto-dismiss in 5 seconds',
    type: 'success',
    isVisible: true,
    duration: 5000,
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ToastCatto
        message="Success message"
        type="success"
        isVisible={true}
        onClose={() => {}}
      />
      <ToastCatto
        message="Error message"
        type="error"
        isVisible={true}
        onClose={() => {}}
      />
      <ToastCatto
        message="Warning message"
        type="warning"
        isVisible={true}
        onClose={() => {}}
      />
      <ToastCatto
        message="Info message"
        type="info"
        isVisible={true}
        onClose={() => {}}
      />
    </div>
  ),
};
