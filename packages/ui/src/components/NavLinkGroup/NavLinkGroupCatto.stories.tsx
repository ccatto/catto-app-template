import type { Meta, StoryObj } from '@storybook/react';
import { Calendar, Home, Settings, Trophy, Users } from 'lucide-react';
import NavLinkGroupCatto from './NavLinkGroupCatto';

const meta = {
  title: 'Components/NavLinkGroup',
  component: NavLinkGroupCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof NavLinkGroupCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

const links = [
  { href: '#', label: 'Home', icon: <Home className="h-4 w-4" /> },
  { href: '#', label: 'Teams', icon: <Users className="h-4 w-4" /> },
  { href: '#', label: 'Tournaments', icon: <Trophy className="h-4 w-4" /> },
  { href: '#', label: 'Schedule', icon: <Calendar className="h-4 w-4" /> },
  { href: '#', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
];

const simpleLinks = [
  { href: '#', label: 'Home' },
  { href: '#', label: 'About' },
  { href: '#', label: 'Services' },
  { href: '#', label: 'Contact' },
];

export const Horizontal: Story = {
  args: {
    links: simpleLinks,
    orientation: 'horizontal',
  },
};

export const Vertical: Story = {
  args: {
    links: simpleLinks,
    orientation: 'vertical',
  },
};

export const WithIcons: Story = {
  args: {
    links,
    orientation: 'vertical',
  },
};

export const HorizontalWithIcons: Story = {
  args: {
    links,
    orientation: 'horizontal',
  },
};

export const WithActiveLink: Story = {
  args: {
    links: links.map((link, i) => ({
      ...link,
      isActive: i === 0,
    })),
    orientation: 'vertical',
  },
};
