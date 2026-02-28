// @catto/ui - CarouselCatto Stories
import type { Meta, StoryObj } from '@storybook/react';
import CarouselCatto from './CarouselCatto';

const meta = {
  title: 'Components/CarouselCatto',
  component: CarouselCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    interval: {
      control: { type: 'number', min: 1000, max: 10000, step: 500 },
    },
  },
} satisfies Meta<typeof CarouselCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample placeholder images
const sampleImages = [
  'https://picsum.photos/seed/1/800/400',
  'https://picsum.photos/seed/2/800/400',
  'https://picsum.photos/seed/3/800/400',
  'https://picsum.photos/seed/4/800/400',
];

export const Default: Story = {
  args: {
    images: sampleImages,
    interval: 3000,
  },
};

export const FastAutoAdvance: Story = {
  args: {
    images: sampleImages,
    interval: 1500,
  },
};

export const SlowAutoAdvance: Story = {
  args: {
    images: sampleImages,
    interval: 5000,
  },
};

export const SmallSize: Story = {
  args: {
    images: sampleImages,
    width: 'w-[300px]',
    height: 'h-[200px]',
    interval: 3000,
  },
};

export const LargeSize: Story = {
  args: {
    images: sampleImages,
    width: 'w-[700px]',
    height: 'h-[400px]',
    interval: 3000,
  },
};

export const TwoImages: Story = {
  args: {
    images: sampleImages.slice(0, 2),
    interval: 3000,
  },
};
