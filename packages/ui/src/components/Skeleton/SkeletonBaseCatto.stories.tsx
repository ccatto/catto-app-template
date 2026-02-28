import type { Meta, StoryObj } from '@storybook/react';
import SkeletonBaseCatto from './SkeletonBaseCatto';

const meta = {
  title: 'Components/Skeleton/Base',
  component: SkeletonBaseCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular'],
    },
  },
} satisfies Meta<typeof SkeletonBaseCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    variant: 'text',
    width: 200,
  },
};

export const TextMultiLine: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '300px' }}>
      <SkeletonBaseCatto variant="text" width="100%" />
      <SkeletonBaseCatto variant="text" width="100%" />
      <SkeletonBaseCatto variant="text" width="60%" />
    </div>
  ),
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: 48,
    height: 48,
  },
};

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: 200,
    height: 120,
  },
};

export const CardSkeleton: Story = {
  render: () => (
    <div
      className="flex flex-col gap-3 p-4 border rounded-lg"
      style={{ width: '300px' }}
    >
      <SkeletonBaseCatto variant="rectangular" width="100%" height={150} />
      <SkeletonBaseCatto variant="text" width="70%" />
      <SkeletonBaseCatto variant="text" width="100%" />
      <SkeletonBaseCatto variant="text" width="40%" />
    </div>
  ),
};

export const AvatarWithText: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <SkeletonBaseCatto variant="circular" width={48} height={48} />
      <div className="flex flex-col gap-2">
        <SkeletonBaseCatto variant="text" width={120} />
        <SkeletonBaseCatto variant="text" width={80} />
      </div>
    </div>
  ),
};
