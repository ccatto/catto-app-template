import type { Meta, StoryObj } from '@storybook/react';
import LoadingCircleOrangeFancyCatto from './LoadingCircleOrangeFancyCatto';

const meta = {
  title: 'Components/Loading/CircleOrangeFancy',
  component: LoadingCircleOrangeFancyCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LoadingCircleOrangeFancyCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
