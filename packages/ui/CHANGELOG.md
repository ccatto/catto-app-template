# Changelog

All notable changes to @catto/ui will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-XX

### Added

#### Components (35)

- **BadgeCatto** - Status badges, count indicators, labels with variants and pulse animation
- **AvatarCatto** - User avatar with image, initials fallback, status indicator, and ring
- **PricingCardCatto** - Pricing tier card for subscription displays with features list
- **ProductCardCatto** - Product display card with image, price, rating, wishlist support
- **QuantitySelectorCatto** - Quantity input with +/- buttons, min/max limits
- **RatingStarsCatto** - Star rating display and interactive input with partial stars
- **CartItemCatto** - Cart line item with image, quantity selector, remove action
- **ButtonCatto** - Versatile button with 10+ variants, loading states, haptic feedback
- **CardCatto** - Content container with collapsible sections, multiple widths/elevations
- **InputCatto** - Text input with validation, icons, multiple variants
- **SelectCatto** - Dropdown select with search, custom rendering, keyboard navigation
- **MellowModalCatto** - Modal dialog with themes, sizes, positions, auto-close
- **TabsCatto** - Tabbed navigation with 4 variants, icons, disabled states
- **LinkCatto** - Styled links with 7 variants, icons, button-style options
- **EmptyStateCatto** - Empty/no-data states with icons, actions, variants
- **ToastCatto** - Notifications with 6 variants, animations, placements
- **CheckboxCatto** - Checkbox input with 4 sizes, custom styling
- **PhoneInputCatto** - Phone number input with auto-formatting, validation
- **TooltipCatto** - Hover tooltips with 5 variants, 4 positions
- **PageLoadingCatto** - Full-page loading spinner with RLeaguez branding
- **InlineLoadingCatto** - Inline loading spinner for containers
- **SkeletonBaseCatto** - Base skeleton with shimmer animation
- **CardSkeletonCatto** - Card-shaped loading skeleton
- **TableSkeletonCatto** - Table loading skeleton
- **BottomNavCatto** - Mobile bottom navigation with hide-on-scroll
- **NavLinkGroupCatto** - Grouped navigation links with section headers
- **DrawerCatto** - Slide-out drawer/sidebar
- **AnimatedHamburgerCatto** - Animated hamburger menu icon
- **HideOnScrollWrapper** - Wrapper that hides content on scroll
- **ThemeSwitcherCatto** - Theme toggle component
- **LanguageSwitcherCatto** - Language/locale switcher
- **SortableHeaderCatto** - Table header with sort indicators
- **PhoneDisplayCatto** - Formatted phone number display
- **LoadingCircleOrangeFancyCatto** - Animated orange loading circle
- **LoadingMessageAndCircleCatto** - Loading with message

#### Hooks (4)

- **useHaptics** - Haptic feedback for mobile (Capacitor integration)
- **useTableStateCatto** - TanStack Table state management
- **useTableInstanceCatto** - TanStack Table instance creation
- **useDragDropList** - Drag and drop list functionality

#### Utilities (3 modules)

- **cn** - Tailwind CSS class merging (clsx + tailwind-merge)
- **phone** - Phone number formatting and parsing
- **keyboard** - Keyboard event handling helpers

#### Themes (2)

- **rleaguez** - Default theme with orange/navy brand colors
- **neon-pulse** - Alternative vibrant theme

#### Features

- Full TypeScript support with strict types
- i18n-ready with customizable labels
- Dark mode support across all components
- Mobile-first responsive design
- Capacitor/native app compatibility
- 739 unit tests with Vitest (including 47 accessibility tests)
- **Storybook 8.6** - Visual component documentation with 35 stories
  - Theme switching (rleaguez / neon-pulse)
  - Dark/light mode backgrounds
  - Accessibility panel integration
  - Auto-generated controls from TypeScript props

### Accessibility

- **ButtonCatto**: `aria-busy` and `aria-disabled` when loading
- **SelectCatto**: Proper `role="combobox"` with `aria-controls` and `aria-label`
- **CheckboxCatto**: Visible `label` prop, `aria-label` fallback, `aria-hidden` on visual element
- **CardCatto**: `aria-level={2}` on heading elements

### Technical

- React 19 compatible
- Tailwind CSS v4 styling
- CVA (class-variance-authority) for variants
- Tree-shakeable ESM bundle (~165KB)

---

## [0.x.x] - Pre-release

Internal development versions used within RLeaguez monorepo.
