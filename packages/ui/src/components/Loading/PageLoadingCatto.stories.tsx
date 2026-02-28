import type { Meta, StoryObj } from '@storybook/react';
import PageLoadingCatto from './PageLoadingCatto';

const meta = {
  title: 'Components/Loading/PageLoading',
  component: PageLoadingCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PageLoadingCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div style={{ height: '400px', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithMessage: Story = {
  args: {
    message: 'Loading your data...',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '400px', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};

export const FullHeight: Story = {
  args: {
    minHeight: 'full',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};
