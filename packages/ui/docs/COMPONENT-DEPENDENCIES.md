# @catto/ui Component Dependency Diagram

This document shows the dependency relationships between components in the @catto/ui package.

## Legend

- `→` = depends on
- `◆` = uses internally
- `⚡` = memoized for performance
- `↔` = uses hook

---

## Component Hierarchy

```
@catto/ui
├── Core UI Components
│   ├── ButtonCatto (standalone)
│   ├── CardCatto (standalone)
│   ├── InputCatto (standalone)
│   ├── LinkCatto (standalone)
│   └── CheckboxCatto (standalone)
│
├── Form Components
│   ├── SelectCatto (standalone)
│   ├── SearchableSelectCatto (standalone)
│   ├── PhoneInputCatto (standalone)
│   ├── OtpInputCatto (standalone)
│   ├── QuantitySelectorCatto (standalone)
│   ├── RatingStarsCatto (standalone)
│   ├── CalendarCatto (standalone)
│   ├── DatePickerCatto → CalendarCatto
│   └── FormCatto → (react-hook-form, zod)
│
├── Table Components
│   ├── TablePrimitives ⚡
│   │   ├── Table
│   │   ├── TableHeader
│   │   ├── TableBody
│   │   ├── TableFooter
│   │   ├── TableRow ⚡
│   │   ├── TableHead ⚡
│   │   ├── TableCell ⚡
│   │   └── TableCaption
│   ├── SortableHeaderCatto ⚡ → ButtonCatto
│   ├── TableSelectColumnCatto → CheckboxCatto
│   ├── TableCoreCatto → TablePrimitives
│   ├── TableControlsCatto → InputCatto
│   ├── TablePrevNextButtonsCatto → ButtonCatto
│   └── TableCatto → TableCoreCatto, TableControlsCatto, TablePrevNextButtonsCatto
│
├── Navigation Components
│   ├── TabsCatto (standalone)
│   ├── DrawerCatto (standalone)
│   ├── BottomNavCatto (standalone)
│   ├── NavLinkGroupCatto → LinkCatto
│   ├── AnimatedHamburgerCatto (standalone)
│   └── HideOnScrollWrapper (standalone)
│
├── Feedback Components
│   ├── ToastCatto (standalone)
│   ├── MellowModalCatto (standalone)
│   ├── TooltipCatto (standalone)
│   ├── EmptyStateCatto (standalone)
│   └── BadgeCatto (standalone)
│
├── Display Components
│   ├── AvatarCatto (standalone)
│   ├── SkeletonBaseCatto (standalone)
│   ├── CardSkeletonCatto → SkeletonBaseCatto
│   ├── TableSkeletonCatto → SkeletonBaseCatto
│   └── CarouselCatto (standalone)
│
├── E-commerce Components
│   ├── ProductCardCatto → ButtonCatto, RatingStarsCatto
│   ├── PricingCardCatto → ButtonCatto, BadgeCatto
│   ├── CartItemCatto → ButtonCatto, QuantitySelectorCatto
│   └── (uses shared components above)
│
├── Loading Components
│   ├── LoadingCircleOrangeFancyCatto (standalone)
│   ├── LoadingMessageAndCircleCatto (standalone)
│   ├── PageLoadingCatto → LoadingCircleOrangeFancyCatto
│   └── InlineLoadingCatto (standalone)
│
├── Stepper Components
│   ├── ProgressStepperCatto (standalone)
│   └── DetailedStepperCatto (standalone)
│
├── Theme Components
│   ├── ThemeProvider (context)
│   ├── ThemeSwitcherCatto → SelectCatto ↔ useTheme
│   └── ThemeToggleCatto → ButtonTogglePillCatto ↔ next-themes
│
├── Utility Components
│   ├── ButtonTogglePillCatto (standalone)
│   ├── LanguageSwitcherCatto → SelectCatto
│   ├── MobileScrollIndicatorWrapperCatto (standalone)
│   ├── AddToCalendarCatto → ButtonCatto
│   └── HR Components (12 variants, standalone)
│
└── Phone Components
    ├── PhoneInputCatto (standalone)
    └── PhoneDisplayCatto (standalone)
```

---

## Dependency Details

### Table System

```
TableCatto
├── TableCoreCatto
│   ├── TablePrimitives (Table, TableHeader, TableBody, TableRow ⚡, TableHead ⚡, TableCell ⚡)
│   └── flexRender (@tanstack/react-table)
├── TableControlsCatto
│   └── InputCatto
├── TablePrevNextButtonsCatto
│   └── ButtonCatto
└── Hooks
    ├── useTableStateCatto
    └── useTableInstanceCatto
```

### Form System

```
FormCatto
├── InputCatto
├── SelectCatto
├── CheckboxCatto
├── PhoneInputCatto
├── DatePickerCatto
│   └── CalendarCatto
└── External
    ├── react-hook-form
    ├── zod
    └── @hookform/resolvers
```

### Theme System

```
ThemeProvider (context)
├── useTheme (hook)
├── useThemeSafe (hook)
└── THEMES registry

ThemeSwitcherCatto
├── SelectCatto
└── useTheme

ThemeToggleCatto
├── ButtonTogglePillCatto
└── next-themes (useTheme)
```

### E-commerce System

```
ProductCardCatto
├── ButtonCatto
├── RatingStarsCatto
└── BadgeCatto (optional)

CartItemCatto
├── ButtonCatto
├── QuantitySelectorCatto
└── Image handling

PricingCardCatto
├── ButtonCatto
├── BadgeCatto
└── CheckboxCatto (features)
```

---

## Hooks

| Hook                    | Purpose                 | Used By              |
| ----------------------- | ----------------------- | -------------------- |
| `useHaptics`            | Mobile haptic feedback  | ButtonCatto          |
| `useTheme`              | Theme context access    | ThemeSwitcherCatto   |
| `useThemeSafe`          | Safe theme access       | Any component        |
| `useTableStateCatto`    | Table state management  | TableCatto consumers |
| `useTableInstanceCatto` | TanStack Table instance | TableCatto consumers |
| `useDragDropList`       | Drag and drop           | List components      |

---

## Utility Dependencies

| Utility              | Used By                            |
| -------------------- | ---------------------------------- |
| `cn()`               | All components (class merging)     |
| `formatPhoneNumber`  | PhoneInputCatto, PhoneDisplayCatto |
| `isValidPhoneNumber` | PhoneInputCatto                    |

---

## External Dependencies

| Package                    | Used By                         |
| -------------------------- | ------------------------------- |
| `lucide-react`             | Icons in most components        |
| `@tanstack/react-table`    | Table components                |
| `class-variance-authority` | ButtonCatto variants            |
| `next-themes`              | ThemeToggleCatto (optional)     |
| `react-hook-form`          | FormCatto (optional)            |
| `zod`                      | FormCatto validation (optional) |
| `libphonenumber-js`        | Phone utilities (optional)      |

---

## Performance Optimizations

### Memoized Components (⚡)

| Component             | Reason                             |
| --------------------- | ---------------------------------- |
| `TableRow`            | Rendered per data row              |
| `TableHead`           | Rendered per column                |
| `TableCell`           | Rendered per cell (rows × columns) |
| `SortableHeaderCatto` | Rendered per sortable column       |

### Components with forwardRef

- ButtonCatto, SelectCatto, CheckboxCatto
- InputCatto, PhoneInputCatto, LinkCatto
- CalendarCatto, DatePickerCatto
- OtpInputCatto, QuantitySelectorCatto, RatingStarsCatto
- SearchableSelectCatto
- All TablePrimitives

---

## Import Recommendations

```typescript
// ✅ Recommended: Import from main entry
import { ButtonCatto, CardCatto, TableCatto } from '@catto/ui';
// ✅ Also works: Import from barrel exports
import { TableCatto } from '@catto/ui/components/Table';
// ❌ Avoid: Deep imports (may break)
import ButtonCatto from '@catto/ui/dist/components/Button/ButtonCatto';
```

---

## Adding New Components

When adding a new component:

1. Create component in `src/components/{Name}/`
2. Add `index.ts` barrel export
3. Export from main `src/index.ts`
4. Add `forwardRef` if it wraps an interactive element
5. Add `React.memo` if it's rendered in lists
6. Add tests in `src/__tests__/components/`
7. Add Storybook story
8. Update this diagram if it has dependencies
