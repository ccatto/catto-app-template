# @catto/ui Roadmap

> Future improvement ideas for the RLeaguez component library

## Current State

@catto/ui is a React component library with:

- **Components**: ButtonCatto, CardCatto, InputCatto, SelectCatto, ToastCatto, MellowModalCatto, EmptyStateCatto, TabsCatto, Skeletons, Loading states
- **Hooks**: `useHaptics`, `useDragDropList`, `useTableStateCatto`, `useTableInstanceCatto`
- **Utilities**: `cn()` for class merging

## Improvement Ideas

### Quick Wins (< 1 day each)

- [ ] **Add README.md** - Document all components, props, and usage examples
- [ ] **Export more hooks** - Consider extracting reusable patterns from RLeaguez (debounce, click-outside, local storage, etc.)
- [ ] **Type exports** - Ensure all prop types are properly exported for consumers

### Medium Effort (1-3 days)

- [ ] **Storybook Integration** - Visual component documentation and testing
  - Interactive playground for all components
  - Accessibility testing with a11y addon
  - Visual regression testing

- [ ] **Additional Hooks**:
  - `useLocalStorage` / `useSessionStorage`
  - `useDebounce` / `useThrottle`
  - `useClickOutside`
  - `useMediaQuery`
  - `useKeyboardShortcut`

- [ ] **Form Components**:
  - TextareaCatto
  - RadioGroupCatto
  - SwitchCatto (toggle)
  - DatePickerCatto

- [ ] **Accessibility Audit**:
  - ARIA labels and roles
  - Keyboard navigation
  - Screen reader testing
  - Focus management

### Large Investments (1+ weeks)

- [ ] **Headless/Unstyled Variants** - Provide behavior-only versions for custom styling
- [ ] **Animation System** - Consistent animation primitives (fade, slide, scale)
- [ ] **Theme System** - Configurable design tokens (colors, spacing, typography)
- [ ] **Component Composition** - Compound component patterns (Menu.Item, Tabs.Panel, etc.)

## Design Principles

1. **Simplicity** - Components should be easy to use with sensible defaults
2. **Flexibility** - Allow customization via props and className overrides
3. **Accessibility** - Follow WAI-ARIA guidelines
4. **Performance** - Minimize bundle size, use proper memoization
5. **TypeScript First** - Full type safety with exported interfaces

## Popular Libraries to Reference

| Library     | Strength                           | Notes                                  |
| ----------- | ---------------------------------- | -------------------------------------- |
| shadcn/ui   | Copy-paste components, Radix-based | Great patterns to borrow               |
| Radix UI    | Headless primitives                | For complex behaviors (menus, dialogs) |
| Headless UI | Tailwind-native                    | Simple, accessible                     |
| React Aria  | Accessibility                      | Adobe's a11y hooks                     |
| Mantine     | Full-featured                      | Hooks library is excellent             |

## Notes

- @catto/ui is internal to RLeaguez, not published to npm
- Focus on components actually needed by RLeaguez
- Avoid over-engineering; add features as needed
