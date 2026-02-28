// @catto/ui - MobileScrollIndicatorWrapperCatto Stories
import type { Meta, StoryObj } from '@storybook/react';
import { MobileScrollIndicatorWrapperCatto } from './index';

const meta = {
  title: 'Components/MobileScrollIndicatorWrapperCatto',
  component: MobileScrollIndicatorWrapperCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MobileScrollIndicatorWrapperCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <MobileScrollIndicatorWrapperCatto>
        <div className="flex gap-4 overflow-x-auto p-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-32 h-24 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center"
            >
              Item {i + 1}
            </div>
          ))}
        </div>
      </MobileScrollIndicatorWrapperCatto>
    </div>
  ),
};

export const WithFewItems: Story = {
  render: () => (
    <div className="w-64">
      <MobileScrollIndicatorWrapperCatto>
        <div className="flex gap-4 overflow-x-auto p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-32 h-24 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center"
            >
              Item {i + 1}
            </div>
          ))}
        </div>
      </MobileScrollIndicatorWrapperCatto>
    </div>
  ),
};

export const WithCards: Story = {
  render: () => (
    <div className="w-72">
      <MobileScrollIndicatorWrapperCatto>
        <div className="flex gap-4 overflow-x-auto p-4">
          {[
            'Product A',
            'Product B',
            'Product C',
            'Product D',
            'Product E',
          ].map((name, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-40 p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                {name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                $19.99
              </p>
            </div>
          ))}
        </div>
      </MobileScrollIndicatorWrapperCatto>
    </div>
  ),
};
