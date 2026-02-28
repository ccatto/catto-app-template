# Contributing to @catto/ui

Thank you for your interest in contributing to @catto/ui! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Component Guidelines](#component-guidelines)
- [Naming Conventions](#naming-conventions)
- [Testing Requirements](#testing-requirements)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)

---

## Development Setup

### Prerequisites

- Node.js >= 23.3.0
- Yarn 1.22.x (do NOT use npm)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/rleaguez.git
cd rleaguez

# Install dependencies
yarn install

# Build the UI package
yarn workspace @catto/ui build

# Run tests
yarn workspace @catto/ui test
```

### Development Commands

```bash
# Run tests in watch mode
yarn workspace @catto/ui test

# Run tests once
yarn workspace @catto/ui test:run

# Run tests with coverage
yarn workspace @catto/ui test:coverage

# Type check
yarn workspace @catto/ui typecheck

# Build
yarn workspace @catto/ui build
```

---

## Project Structure

```
packages/ui/
├── src/
│   ├── components/       # React components
│   │   ├── Button/
│   │   │   └── ButtonCatto.tsx
│   │   ├── Card/
│   │   │   └── CardCatto.tsx
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── i18n/             # Internationalization defaults
│   ├── themes/           # Theme configurations
│   └── __tests__/        # Test files
│       ├── components/   # Component tests
│       └── test-utils.tsx
├── CHANGELOG.md
├── CONTRIBUTING.md
├── README.md
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── vitest.setup.ts
```

---

## Component Guidelines

### File Structure

Each component should be in its own directory:

```
components/
└── ComponentName/
    └── ComponentNameCatto.tsx
```

### Component Template

```tsx
// @catto/ui - ComponentNameCatto Component
'use client';

import React from 'react';
import { cn } from '../../utils';

export interface ComponentNameCattoProps {
  /** Description of prop */
  propName: string;
  /** Optional prop with default */
  optionalProp?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Children content */
  children?: React.ReactNode;
}

/**
 * ComponentNameCatto - Brief description of the component
 *
 * @example
 * <ComponentNameCatto propName="value">
 *   Content here
 * </ComponentNameCatto>
 */
const ComponentNameCatto: React.FC<ComponentNameCattoProps> = ({
  propName,
  optionalProp = false,
  className,
  children,
}) => {
  return <div className={cn('base-classes', className)}>{children}</div>;
};

export default ComponentNameCatto;
```

### Required Features

1. **TypeScript** - All components must be fully typed
2. **JSDoc** - Export interfaces and main component must have JSDoc comments
3. **Dark Mode** - Support both light and dark modes
4. **Accessibility** - Follow WCAG 2.1 AA guidelines
5. **i18n Ready** - Use labels prop pattern for translatable strings

---

## Naming Conventions

### Components

- **Suffix**: All components use the `Catto` suffix (e.g., `ButtonCatto`, `CardCatto`)
- **Case**: PascalCase for component names and files
- **Location**: `src/components/{ComponentName}/{ComponentName}Catto.tsx`

### Props

- **Interfaces**: `{ComponentName}CattoProps`
- **Naming**: camelCase, descriptive names
- **Optional**: Use `?` for optional props with sensible defaults

### CSS Classes

- Use Tailwind CSS utility classes
- Use `cn()` utility for conditional classes
- Theme tokens preferred over hardcoded colors:
  - `bg-theme-surface` instead of `bg-white`
  - `text-theme-primary` instead of `text-blue-600`

---

## Testing Requirements

### Coverage Goals

- **Minimum**: 60% statement coverage for new components
- **Target**: 80% statement coverage for v1.0.0 release

### Test File Structure

```
src/__tests__/components/ComponentNameCatto.test.tsx
```

### Test Template

```tsx
// @catto/ui - ComponentNameCatto Tests
import { describe, expect, it, vi } from 'vitest';
import ComponentNameCatto from '../../components/ComponentName/ComponentNameCatto';
import { fireEvent, render, screen } from '../test-utils';

describe('ComponentNameCatto', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<ComponentNameCatto propName="test" />);
      expect(screen.getByText('test')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('handles click events', () => {
      const handleClick = vi.fn();
      render(<ComponentNameCatto onClick={handleClick} />);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('variants', () => {
    it('applies variant styles', () => {
      render(<ComponentNameCatto variant="primary" />);
      const element = screen.getByRole('button');
      expect(element.className).toContain('bg-theme-primary');
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<ComponentNameCatto ariaLabel="Test" />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Test');
    });
  });
});
```

### Running Tests

```bash
# Run all tests
yarn workspace @catto/ui test:run

# Run specific test file
yarn workspace @catto/ui test:run ComponentNameCatto

# Run with coverage
yarn workspace @catto/ui test:coverage
```

---

## Code Style

### Formatting

- **Prettier** - Run `yarn prettier` before committing
- **ESLint** - Must pass linting with `yarn lint`

### TypeScript

- Strict mode enabled
- No `any` types (use `unknown` if truly needed)
- Explicit return types on exported functions

### Imports

```tsx
// Order: React, external libs, internal utils, internal components, types
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils';
import ButtonCatto from '../Button/ButtonCatto';
import type { SomeType } from './types';
```

---

## Pull Request Process

### Before Submitting

1. [ ] Code compiles without errors (`yarn workspace @catto/ui typecheck`)
2. [ ] All tests pass (`yarn workspace @catto/ui test:run`)
3. [ ] Code is formatted (`yarn prettier`)
4. [ ] Linting passes (`yarn lint`)
5. [ ] New features have tests (80% coverage target)
6. [ ] JSDoc comments added for new exports
7. [ ] CHANGELOG.md updated (if applicable)

### PR Title Format

```
feat(ui): Add NewComponentCatto
fix(ui): Fix ButtonCatto disabled state
docs(ui): Update README examples
test(ui): Add CardCatto edge case tests
```

### PR Description Template

```markdown
## Summary

Brief description of changes

## Changes

- Added X
- Fixed Y
- Updated Z

## Testing

- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Tested in dark mode

## Screenshots (if UI changes)

Before | After
```

---

## Questions?

If you have questions about contributing, please:

1. Check existing issues and discussions
2. Open a new issue with the `question` label
3. Tag maintainers for urgent matters

Thank you for contributing to @catto/ui!
