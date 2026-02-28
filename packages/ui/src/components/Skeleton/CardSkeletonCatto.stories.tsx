import type { Meta, StoryObj } from '@storybook/react';
import CardSkeletonCatto from './CardSkeletonCatto';

const meta = {
  title: 'Components/Skeleton/Card',
  component: CardSkeletonCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CardSkeletonCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithImage: Story = {
  args: {
    showImage: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4" style={{ width: '800px' }}>
      <CardSkeletonCatto showImage />
      <CardSkeletonCatto showImage />
      <CardSkeletonCatto showImage />
    </div>
  ),
};
