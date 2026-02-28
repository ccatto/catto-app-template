// @catto/ui - OtpInputCatto Stories
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import OtpInputCatto from './OtpInputCatto';

const meta = {
  title: 'Components/OtpInputCatto',
  component: OtpInputCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    length: {
      control: { type: 'number', min: 4, max: 8 },
    },
  },
} satisfies Meta<typeof OtpInputCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper
const OtpWrapper = (props: React.ComponentProps<typeof OtpInputCatto>) => {
  const [result, setResult] = useState<string>('');

  return (
    <div className="flex flex-col items-center gap-4">
      <OtpInputCatto
        {...props}
        onComplete={(otp) => {
          setResult(otp);
          props.onComplete?.(otp);
        }}
      />
      {result && (
        <p className="text-sm text-green-600 dark:text-green-400">
          Entered: {result}
        </p>
      )}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <OtpWrapper {...args} />,
  args: {
    length: 6,
    onComplete: (otp) => console.log('OTP:', otp),
  },
};

export const FourDigits: Story = {
  render: (args) => <OtpWrapper {...args} />,
  args: {
    length: 4,
    onComplete: (otp) => console.log('OTP:', otp),
  },
};

export const EightDigits: Story = {
  render: (args) => <OtpWrapper {...args} />,
  args: {
    length: 8,
    onComplete: (otp) => console.log('OTP:', otp),
  },
};

export const WithError: Story = {
  render: (args) => <OtpWrapper {...args} />,
  args: {
    length: 6,
    error: 'Invalid verification code',
    onComplete: (otp) => console.log('OTP:', otp),
  },
};

export const Disabled: Story = {
  args: {
    length: 6,
    disabled: true,
    onComplete: (otp) => console.log('OTP:', otp),
  },
};
