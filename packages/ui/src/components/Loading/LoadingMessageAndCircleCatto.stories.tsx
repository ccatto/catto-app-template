import type { Meta, StoryObj } from '@storybook/react';
import LoadingMessageAndCircleCatto from './LoadingMessageAndCircleCatto';

const meta = {
  title: 'Components/Loading/MessageAndCircle',
  component: LoadingMessageAndCircleCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LoadingMessageAndCircleCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'Loading...',
  },
};

export const CustomMessage: Story = {
  args: {
    message: 'Fetching your data...',
  },
};

export const LongMessage: Story = {
  args: {
    message:
      'Please wait while we process your request. This may take a moment.',
  },
};
