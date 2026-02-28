import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react';
import '../src/themes/tokens.css';
import '../src/themes/rleaguez.css';
import '../src/themes/neon-pulse.css';
import '../src/themes/royal-crown.css';
import '../src/themes/corporate-steel.css';
import '../src/themes/forest-earth.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1f2937' },
        { name: 'light', value: '#f9fafb' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        rleaguez: 'rleaguez',
        'neon-pulse': 'neon-pulse',
        'royal-crown': 'royal-crown',
        'corporate-steel': 'corporate-steel',
        'forest-earth': 'forest-earth',
      },
      defaultTheme: 'rleaguez',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
