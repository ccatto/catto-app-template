import type { Meta, StoryObj } from '@storybook/react';
import HideOnScrollWrapper from './HideOnScrollWrapper';

const meta = {
  title: 'Components/HideOnScroll',
  component: HideOnScrollWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HideOnScrollWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="h-screen overflow-auto">
      <HideOnScrollWrapper>
        <header className="sticky top-0 bg-white dark:bg-gray-800 shadow p-4 z-10">
          <h1 className="text-lg font-semibold">
            Sticky Header - Scroll to hide
          </h1>
        </header>
      </HideOnScrollWrapper>
      <div className="p-4 space-y-4">
        {Array.from({ length: 50 }, (_, i) => (
          <p key={i} className="text-gray-600 dark:text-gray-300">
            Scroll down to see the header hide. This is paragraph {i + 1}. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        ))}
      </div>
    </div>
  ),
};

export const WithNavBar: Story = {
  render: () => (
    <div className="h-screen overflow-auto">
      <HideOnScrollWrapper>
        <nav className="sticky top-0 bg-orange-500 text-white p-4 z-10">
          <div className="flex justify-between items-center">
            <span className="font-bold">RLeaguez</span>
            <div className="space-x-4">
              <a href="#" className="hover:underline">
                Home
              </a>
              <a href="#" className="hover:underline">
                Teams
              </a>
              <a href="#" className="hover:underline">
                Leagues
              </a>
            </div>
          </div>
        </nav>
      </HideOnScrollWrapper>
      <div className="p-4 space-y-4">
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <h3 className="font-medium">Section {i + 1}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Content for section {i + 1}. Scroll to see the nav bar hide/show.
            </p>
          </div>
        ))}
      </div>
    </div>
  ),
};
