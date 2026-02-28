import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  // Storybook 10: addons are now built into core
  // essentials, a11y, themes, and interactions are included by default
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  docs: {
    autodocs: 'tag',
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
