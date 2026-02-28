import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Bell, Home, Settings, User } from 'lucide-react';
import TabsCatto from './TabsCatto';

const meta = {
  title: 'Components/Tabs',
  component: TabsCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'pill', 'underline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof TabsCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicTabs = [
  { id: 'home', label: 'Home' },
  { id: 'profile', label: 'Profile' },
  { id: 'settings', label: 'Settings' },
];

const tabsWithIcons = [
  { id: 'home', label: 'Home', icon: <Home className="h-4 w-4" /> },
  { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <Bell className="h-4 w-4" />,
  },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
];

const tabsWithDisabled = [
  { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Pending' },
  { id: 'disabled', label: 'Disabled', disabled: true },
];

export const Default: Story = {
  args: {
    tabs: basicTabs,
    defaultTab: 'home',
  },
};

export const WithIcons: Story = {
  args: {
    tabs: tabsWithIcons,
    defaultTab: 'home',
  },
};

export const PillVariant: Story = {
  args: {
    tabs: basicTabs,
    defaultTab: 'home',
    variant: 'pill',
  },
};

export const UnderlineVariant: Story = {
  args: {
    tabs: basicTabs,
    defaultTab: 'home',
    variant: 'underline',
  },
};

export const Small: Story = {
  args: {
    tabs: basicTabs,
    defaultTab: 'home',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    tabs: basicTabs,
    defaultTab: 'home',
    size: 'lg',
  },
};

export const FullWidth: Story = {
  args: {
    tabs: basicTabs,
    defaultTab: 'home',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithDisabledTab: Story = {
  args: {
    tabs: tabsWithDisabled,
    defaultTab: 'active',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-gray-500 mb-2">Default</p>
        <TabsCatto tabs={basicTabs} defaultTab="home" variant="default" />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-2">Pill</p>
        <TabsCatto tabs={basicTabs} defaultTab="home" variant="pill" />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-2">Underline</p>
        <TabsCatto tabs={basicTabs} defaultTab="home" variant="underline" />
      </div>
    </div>
  ),
};
