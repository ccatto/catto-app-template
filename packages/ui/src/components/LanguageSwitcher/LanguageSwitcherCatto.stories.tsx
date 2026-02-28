import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import LanguageSwitcherCatto from './LanguageSwitcherCatto';

const meta = {
  title: 'Components/LanguageSwitcher',
  component: LanguageSwitcherCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof LanguageSwitcherCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentLanguage: 'en',
    languages: [
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Español' },
      { code: 'fr', label: 'Français' },
    ],
  },
};

export const WithFlags: Story = {
  args: {
    currentLanguage: 'en',
    languages: [
      { code: 'en', label: 'English', flag: '🇺🇸' },
      { code: 'es', label: 'Español', flag: '🇪🇸' },
      { code: 'fr', label: 'Français', flag: '🇫🇷' },
      { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    ],
    showFlags: true,
  },
};

export const SpanishSelected: Story = {
  args: {
    currentLanguage: 'es',
    languages: [
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Español' },
    ],
  },
};

export const ManyLanguages: Story = {
  args: {
    currentLanguage: 'en',
    languages: [
      { code: 'en', label: 'English' },
      { code: 'es', label: 'Español' },
      { code: 'fr', label: 'Français' },
      { code: 'de', label: 'Deutsch' },
      { code: 'it', label: 'Italiano' },
      { code: 'pt', label: 'Português' },
      { code: 'ja', label: '日本語' },
      { code: 'zh', label: '中文' },
    ],
  },
};
