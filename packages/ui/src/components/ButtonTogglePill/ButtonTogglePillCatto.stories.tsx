// @catto/ui - ButtonTogglePillCatto Stories
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ButtonTogglePillCatto from './ButtonTogglePillCatto';

const meta = {
  title: 'Components/ButtonTogglePillCatto',
  component: ButtonTogglePillCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ButtonTogglePillCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper
const ToggleWrapper = (
  props: React.ComponentProps<typeof ButtonTogglePillCatto>,
) => {
  const [isLeft, setIsLeft] = useState(props.initialState ?? true);

  return (
    <div className="flex flex-col items-center gap-4">
      <ButtonTogglePillCatto
        {...props}
        initialState={isLeft}
        onToggle={(newState) => {
          setIsLeft(newState);
          props.onToggle?.(newState);
        }}
      />
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Current: {isLeft ? 'Dark Mode (Moon)' : 'Light Mode (Sun)'}
      </p>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <ToggleWrapper {...args} />,
  args: {
    onToggle: (isLeft) => console.log('Toggle:', isLeft ? 'Dark' : 'Light'),
  },
};

export const StartLight: Story = {
  render: (args) => <ToggleWrapper {...args} />,
  args: {
    initialState: false,
    onToggle: (isLeft) => console.log('Toggle:', isLeft ? 'Dark' : 'Light'),
  },
};

export const StartDark: Story = {
  render: (args) => <ToggleWrapper {...args} />,
  args: {
    initialState: true,
    onToggle: (isLeft) => console.log('Toggle:', isLeft ? 'Dark' : 'Light'),
  },
};
