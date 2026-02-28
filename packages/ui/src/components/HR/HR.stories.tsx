// @catto/ui - HR (Horizontal Rule / Divider) Components Stories
import type { Meta, StoryObj } from '@storybook/react';
import {
  HRAnimatedLineCatto,
  HRCircleCatto,
  HRDividerCatto,
  HRHypnoCatto,
  HRPartyPulseCatto,
  HRPulseDividerCatto,
  HRSquareCatto,
  HRSquaresCatto,
  HRSubtleCatto,
  HRTriangleCatto,
  HRWideCatto,
  SectionTitleCatto,
} from './index';

// Use HRDividerCatto as the "main" component for autodocs
const meta = {
  title: 'Components/HR Dividers',
  component: HRDividerCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof HRDividerCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper for consistent story presentation
const DividerWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-96 p-4">
    <p className="text-slate-900 dark:text-slate-50 mb-4">
      Content above the divider
    </p>
    {children}
    <p className="text-slate-900 dark:text-slate-50 mt-4">
      Content below the divider
    </p>
  </div>
);

export const Divider: Story = {
  render: () => (
    <DividerWrapper>
      <HRDividerCatto />
    </DividerWrapper>
  ),
};

export const DividerFullWidth: Story = {
  render: () => (
    <DividerWrapper>
      <HRDividerCatto width="w-full" />
    </DividerWrapper>
  ),
};

export const Circle: Story = {
  render: () => (
    <DividerWrapper>
      <HRCircleCatto />
    </DividerWrapper>
  ),
};

export const Triangle: Story = {
  render: () => (
    <DividerWrapper>
      <HRTriangleCatto />
    </DividerWrapper>
  ),
};

export const AnimatedLine: Story = {
  render: () => (
    <DividerWrapper>
      <HRAnimatedLineCatto />
    </DividerWrapper>
  ),
};

export const Square: Story = {
  render: () => (
    <DividerWrapper>
      <HRSquareCatto />
    </DividerWrapper>
  ),
};

export const Squares: Story = {
  render: () => (
    <DividerWrapper>
      <HRSquaresCatto />
    </DividerWrapper>
  ),
};

export const PartyPulse: Story = {
  render: () => (
    <DividerWrapper>
      <HRPartyPulseCatto />
    </DividerWrapper>
  ),
};

export const PulseDivider: Story = {
  render: () => (
    <DividerWrapper>
      <HRPulseDividerCatto />
    </DividerWrapper>
  ),
};

export const Subtle: Story = {
  render: () => (
    <DividerWrapper>
      <HRSubtleCatto />
    </DividerWrapper>
  ),
};

export const Wide: Story = {
  render: () => (
    <DividerWrapper>
      <HRWideCatto />
    </DividerWrapper>
  ),
};

export const Hypno: Story = {
  render: () => (
    <DividerWrapper>
      <HRHypnoCatto />
    </DividerWrapper>
  ),
};

export const SectionTitle: Story = {
  render: () => (
    <DividerWrapper>
      <SectionTitleCatto title="Section Title" />
    </DividerWrapper>
  ),
};

export const SectionTitleWithSubtitle: Story = {
  render: () => (
    <DividerWrapper>
      <SectionTitleCatto title="Main Title" subtitle="Optional subtitle text" />
    </DividerWrapper>
  ),
};

export const AllDividers: Story = {
  render: () => (
    <div className="w-96 space-y-8 p-4">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          HRDividerCatto
        </p>
        <HRDividerCatto />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          HRCircleCatto
        </p>
        <HRCircleCatto />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          HRTriangleCatto
        </p>
        <HRTriangleCatto />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          HRAnimatedLineCatto
        </p>
        <HRAnimatedLineCatto />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          HRSquareCatto
        </p>
        <HRSquareCatto />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          HRSquaresCatto
        </p>
        <HRSquaresCatto />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          HRPartyPulseCatto
        </p>
        <HRPartyPulseCatto />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          HRPulseDividerCatto
        </p>
        <HRPulseDividerCatto />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          HRSubtleCatto
        </p>
        <HRSubtleCatto />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          HRWideCatto
        </p>
        <HRWideCatto />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          HRHypnoCatto
        </p>
        <HRHypnoCatto />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          SectionTitleCatto
        </p>
        <SectionTitleCatto title="Section Title" />
      </div>
    </div>
  ),
};
