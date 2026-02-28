import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight, ExternalLink, Home } from 'lucide-react';
import LinkCatto from './LinkCatto';

const meta = {
  title: 'Components/Link',
  component: LinkCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'subtle',
        'button',
        'outline',
        'underline',
        'ghost',
        'link',
        'card',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof LinkCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: '#',
    children: 'Default Link',
  },
};

export const Subtle: Story = {
  args: {
    href: '#',
    children: 'Subtle Link',
    variant: 'subtle',
  },
};

export const Button: Story = {
  args: {
    href: '#',
    children: 'Button Link',
    variant: 'button',
  },
};

export const Outline: Story = {
  args: {
    href: '#',
    children: 'Outline Link',
    variant: 'outline',
  },
};

export const Underline: Story = {
  args: {
    href: '#',
    children: 'Underline Link',
    variant: 'underline',
  },
};

export const Ghost: Story = {
  args: {
    href: '#',
    children: 'Ghost Link',
    variant: 'ghost',
  },
};

export const WithLeftIcon: Story = {
  args: {
    href: '#',
    children: 'Home',
    leftIcon: <Home className="h-4 w-4" />,
  },
};

export const WithRightIcon: Story = {
  args: {
    href: '#',
    children: 'Learn More',
    rightIcon: <ArrowRight className="h-4 w-4" />,
  },
};

export const ExternalLinkExample: Story = {
  args: {
    href: 'https://example.com',
    children: 'External Link',
    rightIcon: <ExternalLink className="h-4 w-4" />,
    external: true,
  },
};

export const Small: Story = {
  args: {
    href: '#',
    children: 'Small Link',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    href: '#',
    children: 'Large Link',
    size: 'lg',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <LinkCatto href="#" variant="default">
        Default
      </LinkCatto>
      <LinkCatto href="#" variant="subtle">
        Subtle
      </LinkCatto>
      <LinkCatto href="#" variant="button">
        Button
      </LinkCatto>
      <LinkCatto href="#" variant="outline">
        Outline
      </LinkCatto>
      <LinkCatto href="#" variant="underline">
        Underline
      </LinkCatto>
      <LinkCatto href="#" variant="ghost">
        Ghost
      </LinkCatto>
      <LinkCatto href="#" variant="link">
        Link
      </LinkCatto>
    </div>
  ),
};
