// @catto/ui - Accessibility Test Utilities
import axe, { type AxeResults } from 'axe-core';
import { expect } from 'vitest';

// Configure axe with common rules
const axeConfig: axe.RunOptions = {
  rules: {
    // Disable rules that might conflict with test environment
    'color-contrast': { enabled: false }, // Hard to test without real CSS
    region: { enabled: false }, // Not relevant for isolated components
  },
};

// Helper to run axe on a container and assert no violations
export async function checkA11y(container: Element): Promise<void> {
  const results: AxeResults = await axe.run(container, axeConfig);

  if (results.violations.length > 0) {
    const violationMessages = results.violations
      .map((violation) => {
        const nodes = violation.nodes
          .map((node) => `  - ${node.html}`)
          .join('\n');
        return `${violation.id}: ${violation.help}\n${nodes}`;
      })
      .join('\n\n');

    expect.fail(`Accessibility violations found:\n\n${violationMessages}`);
  }
}

// Common accessibility checks that don't need axe
export const a11yChecks = {
  // Check that interactive elements are focusable
  isFocusable(element: HTMLElement): boolean {
    const tabIndex = element.getAttribute('tabIndex');
    return (
      tabIndex !== '-1' &&
      (element.tagName === 'BUTTON' ||
        element.tagName === 'A' ||
        element.tagName === 'INPUT' ||
        element.tagName === 'SELECT' ||
        element.tagName === 'TEXTAREA' ||
        tabIndex !== null)
    );
  },

  // Check that element has accessible name
  hasAccessibleName(element: HTMLElement): boolean {
    return !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.getAttribute('title') ||
      element.textContent?.trim()
    );
  },

  // Check that buttons have accessible names
  buttonHasName(button: HTMLElement): boolean {
    return !!(
      button.getAttribute('aria-label') ||
      button.textContent?.trim() ||
      button.querySelector('svg[aria-label]')
    );
  },

  // Check that form inputs have labels
  inputHasLabel(input: HTMLElement): boolean {
    const id = input.getAttribute('id');
    if (!id) return false;

    const label = document.querySelector(`label[for="${id}"]`);
    return !!(
      label ||
      input.getAttribute('aria-label') ||
      input.getAttribute('aria-labelledby')
    );
  },
};
