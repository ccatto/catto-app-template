import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import EmptyStateCatto from './EmptyStateCatto';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyStateCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    iconType: {
      control: 'select',
      options: [
        'teams',
        'players',
        'tournaments',
        'venues',
        'matches',
        'members',
        'leagues',
        'search',
        'error',
        'default',
      ],
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'noResults', 'error', 'subtle'],
    },
  },
} satisfies Meta<typeof EmptyStateCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No items found',
    description: 'There are no items to display at this time.',
  },
};

export const NoTeams: Story = {
  args: {
    title: 'No Teams Yet',
    description: 'Create your first team to get started with the league.',
    iconType: 'teams',
    action: {
      label: 'Create Team',
      onClick: fn(),
    },
  },
};

export const NoPlayers: Story = {
  args: {
    title: 'No Players',
    description: 'Add players to your team roster.',
    iconType: 'players',
    action: {
      label: 'Add Player',
      onClick: fn(),
    },
  },
};

export const NoTournaments: Story = {
  args: {
    title: 'No Tournaments',
    description: 'There are no upcoming tournaments scheduled.',
    iconType: 'tournaments',
    action: {
      label: 'Create Tournament',
      onClick: fn(),
    },
  },
};

export const NoSearchResults: Story = {
  args: {
    title: 'No Results Found',
    description: 'Try adjusting your search terms or filters.',
    iconType: 'search',
    variant: 'noResults',
  },
};

export const ErrorState: Story = {
  args: {
    title: 'Something Went Wrong',
    description:
      'We encountered an error loading this content. Please try again.',
    iconType: 'error',
    variant: 'error',
    action: {
      label: 'Try Again',
      onClick: fn(),
    },
  },
};

export const PrimaryVariant: Story = {
  args: {
    title: 'Get Started',
    description: 'Welcome! Create your first item to begin.',
    variant: 'primary',
    action: {
      label: 'Create New',
      onClick: fn(),
    },
  },
};

export const SubtleVariant: Story = {
  args: {
    title: 'All Caught Up',
    description: 'You have no new notifications.',
    variant: 'subtle',
  },
};

export const NoVenues: Story = {
  args: {
    title: 'No Venues',
    description: 'Add venues where your matches will be played.',
    iconType: 'venues',
    action: {
      label: 'Add Venue',
      onClick: fn(),
    },
  },
};

export const NoMatches: Story = {
  args: {
    title: 'No Matches Scheduled',
    description: 'Matches will appear here once the schedule is created.',
    iconType: 'matches',
  },
};

export const NoMembers: Story = {
  args: {
    title: 'No Members',
    description: 'Invite members to join your organization.',
    iconType: 'members',
    action: {
      label: 'Invite Members',
      onClick: fn(),
    },
  },
};
