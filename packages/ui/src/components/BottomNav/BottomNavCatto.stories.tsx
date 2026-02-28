import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Bell, Home, Search, Settings, User } from 'lucide-react';
import BottomNavCatto from './BottomNavCatto';

const meta = {
  title: 'Components/BottomNav',
  component: BottomNavCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onItemClick: fn(),
  },
} satisfies Meta<typeof BottomNavCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

const threeItems = [
  { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
  { id: 'search', label: 'Search', icon: <Search className="h-5 w-5" /> },
  { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
];

const fiveItems = [
  { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
  { id: 'search', label: 'Search', icon: <Search className="h-5 w-5" /> },
  {
    id: 'notifications',
    label: 'Alerts',
    icon: <Bell className="h-5 w-5" />,
    badge: 3,
  },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
];

export const ThreeItems: Story = {
  args: {
    items: threeItems,
    activeId: 'home',
  },
  decorators: [
    (Story) => (
      <div className="h-screen flex flex-col">
        <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
          <p className="text-gray-600 dark:text-gray-300">
            Page content goes here
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const FiveItems: Story = {
  args: {
    items: fiveItems,
    activeId: 'home',
  },
  decorators: [
    (Story) => (
      <div className="h-screen flex flex-col">
        <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
          <p className="text-gray-600 dark:text-gray-300">
            Page content goes here
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const WithBadge: Story = {
  args: {
    items: fiveItems,
    activeId: 'notifications',
  },
  decorators: [
    (Story) => (
      <div className="h-screen flex flex-col">
        <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
          <p className="text-gray-600 dark:text-gray-300">
            Notice the badge on Alerts
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const SearchActive: Story = {
  args: {
    items: threeItems,
    activeId: 'search',
  },
  decorators: [
    (Story) => (
      <div className="h-screen flex flex-col">
        <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
          <p className="text-gray-600 dark:text-gray-300">Search is active</p>
        </div>
        <Story />
      </div>
    ),
  ],
};
