# @catto/ui

> **Catto** _(noun)_ — Pronounced like it rhymes with "tomato" or "potato" 🍅🥔
>
> _"Is it cat-oh or cah-toe?"_ — Yes.

A production-ready React component library built with Tailwind CSS v4, designed for modern web and mobile applications.

## The Story

I started building these components in 2022 while working on [RLeaguez.com](https://www.rleaguez.com), a sports league management platform. After years of copying the same Button, Card, and Modal components between projects, I decided to package them up properly.

Now I'm sharing them with the community. Take them, use them, build something cool. If they save you time, that's all the thanks I need.

— **Chris Catto**

## Who Is This For?

**@catto/ui is built for you if:**

- You're building a **Next.js 14+** app with the App Router
- You use **Tailwind CSS** (v3 or v4) for styling
- You want **dark mode** without the headache
- You need components that work on **web and mobile** (Capacitor/iOS/Android)
- You're tired of building the same Button, Modal, and Table for every project
- You value **TypeScript**, **accessibility**, and **consistent APIs**

**Perfect for:**

- SaaS dashboards
- E-commerce sites
- Sports/league management apps
- Admin panels
- Mobile-first web apps

**Not the best fit if:**

- You need unstyled/headless primitives (check out [Radix UI](https://www.radix-ui.com/) or [DaisyUI](https://daisyui.com/))
- You're not using React
- You prefer CSS-in-JS over Tailwind

## Overview

**@catto/ui** provides a comprehensive set of accessible, themeable UI components that work seamlessly with Next.js 14+ and React 18+. Built with a "dark-first" design philosophy, every component looks great in both light and dark modes out of the box.

**Why choose @catto/ui?**

- **Production-Tested** — Battle-tested in the RLeaguez sports platform serving real users
- **Accessibility First** — ARIA labels, keyboard navigation, and screen reader support built-in
- **Performance Optimized** — React.memo on high-frequency components, forwardRef support for form integration
- **i18n Ready** — Ships with 7 languages (EN, ES, PT, ZH, FR, DE, HI) + easy custom translations
- **Mobile Native** — Optional Capacitor haptics integration for iOS/Android apps
- **Consistent API** — Predictable props patterns across all components (`variant`, `size`, `className`)
- **Zero Config Theming** — CSS custom properties for runtime theme switching without rebuilds

Whether you're building a dashboard, e-commerce site, or mobile app, @catto/ui gives you the building blocks to ship faster without sacrificing quality.

## Features

- **71 UI Components** - Buttons, Cards, Inputs, Modals, Tables, Forms, Calendars, and more
- **4 Custom Hooks** - Table state management, haptic feedback, drag-and-drop
- **7 Languages** - English, Spanish, Portuguese, Chinese, French, German, Hindi
- **Tailwind CSS v4** - Modern utility-first styling
- **Dark Mode Support** - All components support light/dark themes
- **TypeScript** - Full type definitions included
- **Next.js Compatible** - Works with App Router and `use client` directive
- **Mobile Ready** - Optional Capacitor haptics support for iOS/Android
- **2 Themes** - RLeaguez (orange/navy) and Neon Pulse themes included
- **1,208 Unit Tests** - Comprehensive test coverage with Vitest
- **Storybook** - Visual component documentation with 50+ stories

## Installation

```bash
# Using yarn (recommended for RLeaguez monorepo)
yarn add @catto/ui

# Using npm
npm install @catto/ui
```

### Peer Dependencies

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "next": ">=13.0.0"
}
```

### Optional Peer Dependencies

```json
{
  "@capacitor/core": ">=5.0.0", // For mobile haptics
  "@capacitor/haptics": ">=5.0.0", // For mobile haptics
  "@tanstack/react-table": ">=8.0.0", // For table utilities
  "libphonenumber-js": ">=1.10.0", // For phone input formatting
  "react-hook-form": ">=7.0.0", // For FormCatto
  "zod": ">=3.0.0", // For FormCatto validation
  "@hookform/resolvers": ">=3.0.0", // For FormCatto zod integration
  "next-themes": ">=0.2.0" // For ThemeToggleCatto
}
```

## Quick Start

```tsx
import { ButtonCatto, CardCatto, InputCatto } from '@catto/ui';

function MyComponent() {
  return (
    <CardCatto title="Welcome" width="lg">
      <InputCatto placeholder="Enter your name" />
      <ButtonCatto variant="primary" onClick={() => alert('Hello!')}>
        Say Hello
      </ButtonCatto>
    </CardCatto>
  );
}
```

## Tailwind CSS Configuration

Add the package to your Tailwind CSS content sources:

```css
/* In your global.css (Tailwind v4) */
@import 'tailwindcss';
@source "../../node_modules/@catto/ui/dist";
```

Or in `tailwind.config.js` (Tailwind v3):

```js
module.exports = {
  content: [
    // ... your other paths
    './node_modules/@catto/ui/dist/**/*.{js,cjs}',
  ],
};
```

## Theme Setup

Import the theme CSS files in your app:

```tsx
// In your layout or global styles
import '@catto/ui/themes/tokens.css';
import '@catto/ui/themes/rleaguez.css';

// Or for the alternative theme:
// import '@catto/ui/themes/neon-pulse.css';
```

---

## Components (70)

### Core Components

| Component               | Description                                                             |
| ----------------------- | ----------------------------------------------------------------------- |
| `ButtonCatto`           | Versatile button with 13 variants, loading states, haptic feedback      |
| `CardCatto`             | Content container with collapsible sections, multiple widths/elevations |
| `InputCatto`            | Text input with validation, icons, multiple variants                    |
| `SelectCatto`           | Dropdown select with search, custom rendering, keyboard navigation      |
| `SearchableSelectCatto` | Searchable dropdown with create-new option                              |
| `LinkCatto`             | Styled links with 8 variants, icons, button-style options               |
| `CheckboxCatto`         | Checkbox input with 4 sizes, custom styling                             |

### Form Components

| Component         | Description                                        |
| ----------------- | -------------------------------------------------- |
| `FormCatto`       | Form wrapper with react-hook-form + Zod validation |
| `OtpInputCatto`   | Multi-digit OTP/verification code input            |
| `DatePickerCatto` | Date input with calendar popup                     |
| `CalendarCatto`   | Calendar for date selection with 5 themes          |

### Feedback Components

| Component          | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| `ToastCatto`       | Notifications with 6 variants, animations, placements           |
| `MellowModalCatto` | Modal dialog with themes, sizes, positions, auto-close          |
| `TooltipCatto`     | Hover tooltips with 5 variants, 4 positions                     |
| `EmptyStateCatto`  | Empty/no-data states with icons, actions, variants              |
| `BadgeCatto`       | Status badges with 8 variants, icons, dot mode, pulse animation |

### Navigation Components

| Component                | Description                                               |
| ------------------------ | --------------------------------------------------------- |
| `TabsCatto`              | Tabbed navigation with 4 variants, icons, disabled states |
| `DrawerCatto`            | Slide-out drawer/sidebar                                  |
| `BottomNavCatto`         | Mobile bottom navigation with hide-on-scroll              |
| `AnimatedHamburgerCatto` | Animated hamburger menu icon                              |
| `NavLinkGroupCatto`      | Grouped navigation links with section headers             |
| `HideOnScrollWrapper`    | Wrapper that hides content on scroll                      |

### Data Display

| Component            | Description                                                 |
| -------------------- | ----------------------------------------------------------- |
| `AvatarCatto`        | User avatar with image, initials fallback, status indicator |
| `SkeletonBaseCatto`  | Base skeleton with shimmer animation                        |
| `CardSkeletonCatto`  | Card-shaped loading skeleton                                |
| `TableSkeletonCatto` | Table loading skeleton                                      |
| `CarouselCatto`      | Image carousel with auto-advance and manual navigation      |

### Table Components (14)

| Component                                 | Description                                  |
| ----------------------------------------- | -------------------------------------------- |
| `TableCatto`                              | Full-featured data table with TanStack Table |
| `TableCoreCatto`                          | Core table rendering component               |
| `TableControlsCatto`                      | Table filter, search, and column visibility  |
| `SortableHeaderCatto`                     | Sortable column header                       |
| `Table`, `TableHeader`, `TableBody`, etc. | Primitive table elements                     |

### E-commerce Components

| Component               | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `ProductCardCatto`      | Product display card with image, price, rating, wishlist |
| `PricingCardCatto`      | Pricing tier card for subscription displays              |
| `CartItemCatto`         | Cart line item with quantity selector, remove action     |
| `QuantitySelectorCatto` | Quantity +/- buttons with min/max limits                 |
| `RatingStarsCatto`      | Star rating display/input with partial stars             |

### Phone Components

| Component           | Description                                         |
| ------------------- | --------------------------------------------------- |
| `PhoneInputCatto`   | Phone number input with auto-formatting, validation |
| `PhoneDisplayCatto` | Formatted phone number display                      |

### Loading Components

| Component                       | Description                                      |
| ------------------------------- | ------------------------------------------------ |
| `PageLoadingCatto`              | Full-page loading spinner with RLeaguez branding |
| `InlineLoadingCatto`            | Inline loading spinner for containers            |
| `LoadingCircleOrangeFancyCatto` | Animated orange loading circle                   |
| `LoadingMessageAndCircleCatto`  | Loading with message                             |

### Stepper Components

| Component              | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `ProgressStepperCatto` | Visual progress indicator for multi-step flows |
| `DetailedStepperCatto` | Stepper with titles and descriptions           |

### HR (Divider) Components (12)

| Component             | Description                          |
| --------------------- | ------------------------------------ |
| `HRDividerCatto`      | Basic dashed divider                 |
| `HRCircleCatto`       | Divider with circle decoration       |
| `HRTriangleCatto`     | Divider with triangle decoration     |
| `HRAnimatedLineCatto` | Animated line divider                |
| `HRSquareCatto`       | Divider with square decoration       |
| `HRSquaresCatto`      | Divider with multiple squares        |
| `HRPartyPulseCatto`   | Colorful pulsing divider             |
| `HRPulseDividerCatto` | Subtle pulsing divider               |
| `HRSubtleCatto`       | Minimal subtle divider               |
| `HRWideCatto`         | Wide decorative divider              |
| `HRHypnoCatto`        | Hypnotic animated divider            |
| `SectionTitleCatto`   | Section title with optional subtitle |

### Utility Components

| Component                           | Description                             |
| ----------------------------------- | --------------------------------------- |
| `ThemeSwitcherCatto`                | Theme selection component               |
| `ThemeToggleCatto`                  | Dark/light mode toggle (next-themes)    |
| `ButtonTogglePillCatto`             | Pill-shaped toggle button               |
| `LanguageSwitcherCatto`             | Language/locale switcher                |
| `MobileScrollIndicatorWrapperCatto` | Scroll indicator for mobile             |
| `AddToCalendarCatto`                | Calendar export dropdown (ICS + Google) |

---

## Component Examples

### ButtonCatto

```tsx
import { ButtonCatto } from '@catto/ui';
import { Mail } from 'lucide-react';

<ButtonCatto variant="primary" size="medium" onClick={handleClick}>
  Click Me
</ButtonCatto>

<ButtonCatto variant="danger" leftIcon={<Trash2 className="h-4 w-4" />}>
  Delete
</ButtonCatto>

<ButtonCatto variant="primary" isLoading>
  Saving...
</ButtonCatto>
```

**Variants:** `primary`, `secondary`, `tertiary`, `danger`, `catto`, `ghost`, `outline`, `goGreen`, `pill`, `pillOutline`, `funOrange`, `outlineRoundedXL`, `blueGradientXL`

### CardCatto

```tsx
import { CardCatto } from '@catto/ui';

<CardCatto
  title="Section Title"
  width="lg"
  collapsible
  defaultCollapsed={false}
>
  <p>Card content goes here</p>
</CardCatto>;
```

### BadgeCatto

```tsx
import { BadgeCatto } from '@catto/ui';

<BadgeCatto variant="success">Active</BadgeCatto>
<BadgeCatto variant="error" pulse>Live</BadgeCatto>
<BadgeCatto variant="primary" dot>New</BadgeCatto>
```

**Variants:** `default`, `primary`, `secondary`, `success`, `warning`, `error`, `info`, `outline`

### ProductCardCatto

```tsx
import { ProductCardCatto } from '@catto/ui';

<ProductCardCatto
  name="Premium Widget"
  price={29.99}
  originalPrice={39.99}
  image="/product.jpg"
  rating={4.5}
  reviewCount={128}
  onAddToCart={() => {}}
  onToggleWishlist={() => {}}
/>;
```

### MellowModalCatto

```tsx
import { MellowModalCatto } from '@catto/ui';

<MellowModalCatto
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  theme="danger"
  size="md"
>
  <p>Are you sure you want to proceed?</p>
</MellowModalCatto>;
```

---

## Hooks (4)

### useHaptics

Provides haptic feedback on mobile devices (requires Capacitor).

```tsx
import { useHaptics } from '@catto/ui';

function MyComponent() {
  const { triggerHaptic, isAvailable } = useHaptics();

  const handlePress = () => {
    triggerHaptic('medium'); // 'light' | 'medium' | 'heavy'
  };

  return <button onClick={handlePress}>Tap me</button>;
}
```

### useTableStateCatto

Manages TanStack Table state (sorting, filtering, visibility, selection).

```tsx
import { useTableStateCatto } from '@catto/ui';

function MyTable() {
  const {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
  } = useTableStateCatto();

  // Use with useReactTable...
}
```

### useTableInstanceCatto

Creates a TanStack Table instance with common configuration.

```tsx
import { useTableInstanceCatto } from '@catto/ui';

function MyTable({ data, columns }) {
  const table = useTableInstanceCatto(data, columns);
  // Render table...
}
```

### useDragDropList

Drag and drop list functionality.

```tsx
import { useDragDropList } from '@catto/ui';

function MyList({ items, onReorder }) {
  const { dragHandleProps, isDragging } = useDragDropList({
    items,
    onReorder,
  });
  // Render draggable list...
}
```

---

## Utilities

### cn

Class name merge utility (combines clsx + tailwind-merge).

```tsx
import { cn } from '@catto/ui';

<div className={cn('base-class', isActive && 'active-class', className)} />;
```

### Phone Utilities

```tsx
import {
  formatPhoneNumber,
  isValidPhoneNumber,
  parsePhoneNumber,
} from '@catto/ui';

formatPhoneNumber('+15551234567'); // "(555) 123-4567"
isValidPhoneNumber('5551234567'); // true
```

### Keyboard Utilities

```tsx
import { handleKeyboardSelect, isEnterOrSpace } from '@catto/ui';

<div role="button" tabIndex={0} onKeyDown={handleKeyboardSelect(onClick)}>
  Accessible button
</div>;
```

---

## Internationalization (i18n)

All components accept a `labels` prop for easy internationalization. We also ship pre-made translations for popular languages.

### Available Locales

| Language               | Import                                    | Locale Code  |
| ---------------------- | ----------------------------------------- | ------------ |
| English                | `defaultLabels`                           | en (default) |
| Spanish                | `spanishLabels` or `esLabels`             | es           |
| Portuguese (Brazilian) | `portugueseLabels` or `ptLabels`          | pt-BR        |
| Chinese (Simplified)   | `chineseSimplifiedLabels` or `zhCNLabels` | zh-CN        |
| French                 | `frenchLabels` or `frLabels`              | fr           |
| German                 | `germanLabels` or `deLabels`              | de           |
| Hindi                  | `hindiLabels` or `hiLabels`               | hi           |

### Using Pre-made Translations

```tsx
import { portugueseLabels, SelectCatto, spanishLabels } from '@catto/ui';

// Use with a specific component
<SelectCatto labels={spanishLabels.select} options={options} />;

// Or use the full labels object based on locale
const labels =
  locale === 'es'
    ? spanishLabels
    : locale === 'pt'
      ? portugueseLabels
      : defaultLabels;

<SelectCatto labels={labels.select} options={options} />;
```

### Custom Translations

You can also provide your own translations:

```tsx
import { defaultLabels, SelectCatto } from '@catto/ui';

const frenchLabels = {
  ...defaultLabels,
  select: {
    placeholder: 'Sélectionnez une option',
    noOptions: 'Aucune option trouvée',
    clearButton: 'Effacer la sélection',
  },
};

<SelectCatto labels={frenchLabels.select} options={options} />;
```

---

## Types

```tsx
import type {
  FontSizeType,
  FontWeightType,
  HapticFeedback,
  SelectOption,
  StyleAnimations,
  StyleWidth,
  ThemeType,
} from '@catto/ui';
```

---

## Storybook

Run Storybook to explore all components visually:

```bash
yarn workspace @catto/ui storybook
# Opens at http://localhost:6006
```

Build static Storybook:

```bash
yarn workspace @catto/ui build-storybook
```

---

## Development

### Building the Package

```bash
cd packages/ui
yarn build
```

### Watch Mode

```bash
yarn dev
```

### Testing

```bash
yarn test        # Watch mode
yarn test:run    # Single run (1,208 tests)
yarn test:coverage
```

### Type Checking

```bash
yarn typecheck
```

---

## Package Info

- **Version:** 1.0.0
- **Bundle Size:** ~255KB (ESM)
- **License:** MIT
- **Author:** Chris Catto

---

## Links

- [RLeaguez](https://www.rleaguez.com) - Live application
- [GitHub](https://github.com/chriscatto/catto-ui) - Source code
- [CHANGELOG](./CHANGELOG.md) - Version history
- [CONTRIBUTING](./CONTRIBUTING.md) - Contribution guidelines
