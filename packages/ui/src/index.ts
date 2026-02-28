// @catto/ui - Main Entry Point
'use client';

// ============================================
// Components
// ============================================

// Button
// TanStack Table ColumnMeta type augmentation (responsiveHide)
import './types/table-meta';

export { default as ButtonCatto } from './components/Button/ButtonCatto';
export type { ButtonCattoProps } from './components/Button/ButtonCatto';

// Card
export { default as CardCatto } from './components/Card/CardCatto';
export type { CardCattoProps } from './components/Card/CardCatto';

// Input
export { default as InputCatto } from './components/Input/InputCatto';
export type { InputCattoProps } from './components/Input/InputCatto';

// Phone
export { default as PhoneInputCatto } from './components/Phone/PhoneInputCatto';
export type { PhoneInputCattoProps } from './components/Phone/PhoneInputCatto';
export { default as PhoneDisplayCatto } from './components/Phone/PhoneDisplayCatto';
export type { PhoneDisplayCattoProps } from './components/Phone/PhoneDisplayCatto';

// Link
export { default as LinkCatto } from './components/Link/LinkCatto';
export type { LinkCattoProps } from './components/Link/LinkCatto';

// Checkbox
export { default as CheckboxCatto } from './components/Checkbox/CheckboxCatto';
export type { CheckboxCattoProps } from './components/Checkbox/CheckboxCatto';

// EmptyState
export { default as EmptyStateCatto } from './components/EmptyState/EmptyStateCatto';
export type { EmptyStateCattoProps } from './components/EmptyState/EmptyStateCatto';

// Toast
export { default as ToastCatto } from './components/Toast/ToastCatto';
export type { ToastCattoProps } from './components/Toast/ToastCatto';

// Modal
export { default as MellowModalCatto } from './components/Modal/MellowModalCatto';
export type {
  MellowModalCattoProps,
  MellowModalThemeType,
  MellowModalSizeType,
  MellowModalPosition,
} from './components/Modal/MellowModalCatto';

// Select
export { default as SelectCatto } from './components/Select/SelectCatto';
export type { SelectCattoProps } from './components/Select/SelectCatto';

// Language Switcher
export {
  default as LanguageSwitcherCatto,
  SpinningEarthGlobe,
} from './components/LanguageSwitcher/LanguageSwitcherCatto';
export type {
  LanguageSwitcherCattoProps,
  LanguageOption,
  LanguageSwitcherVariant,
  LanguageSwitcherSize,
} from './components/LanguageSwitcher/LanguageSwitcherCatto';

// Hamburger Menu
export { default as AnimatedHamburgerCatto } from './components/Hamburger/AnimatedHamburgerCatto';
export type {
  AnimatedHamburgerCattoProps,
  HamburgerSize,
} from './components/Hamburger/AnimatedHamburgerCatto';

// Drawer
export { default as DrawerCatto } from './components/Drawer/DrawerCatto';
export type {
  DrawerCattoProps,
  DrawerSide,
  DrawerWidth,
} from './components/Drawer/DrawerCatto';

// Bottom Navigation
export { default as BottomNavCatto } from './components/BottomNav/BottomNavCatto';
export type {
  BottomNavCattoProps,
  BottomNavItem,
} from './components/BottomNav/BottomNavCatto';

// Nav Link Group
export { default as NavLinkGroupCatto } from './components/NavLinkGroup/NavLinkGroupCatto';
export type {
  NavLinkGroupCattoProps,
  NavLinkItem,
} from './components/NavLinkGroup/NavLinkGroupCatto';

// Hide On Scroll
export { default as HideOnScrollWrapper } from './components/HideOnScroll/HideOnScrollWrapper';
export type {
  HideOnScrollWrapperProps,
  HideDirection,
} from './components/HideOnScroll/HideOnScrollWrapper';

// Loading
export { default as LoadingCircleOrangeFancyCatto } from './components/Loading/LoadingCircleOrangeFancyCatto';
export { default as LoadingMessageAndCircleCatto } from './components/Loading/LoadingMessageAndCircleCatto';
export type { LoadingMessageAndCircleCattoProps } from './components/Loading/LoadingMessageAndCircleCatto';
export { default as PageLoadingCatto } from './components/Loading/PageLoadingCatto';
export type { PageLoadingCattoProps } from './components/Loading/PageLoadingCatto';
export { default as InlineLoadingCatto } from './components/Loading/InlineLoadingCatto';
export type { InlineLoadingCattoProps } from './components/Loading/InlineLoadingCatto';

// Table Components
export {
  TableCatto,
  TableCoreCatto,
  TableControlsCatto,
  TablePrevNextButtonsCatto,
  createSelectColumn,
  SortableHeaderCatto,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './components/Table';
export type {
  TableCattoProps,
  TableCoreCattoProps,
  TableControlsCattoProps,
  TablePrevNextButtonsCattoProps,
  SortableHeaderCattoProps,
} from './components/Table';

// Mobile Scroll Indicator
export { MobileScrollIndicatorWrapperCatto } from './components/MobileScroll';
export type { MobileScrollIndicatorWrapperCattoProps } from './components/MobileScroll';

// Tabs
export { default as TabsCatto } from './components/Tabs/TabsCatto';
export type { TabsCattoProps, TabItem } from './components/Tabs/TabsCatto';

// Tooltip
export { default as TooltipCatto } from './components/Tooltip/TooltipCatto';
export type {
  TooltipCattoProps,
  TooltipPosition,
  TooltipVariant,
} from './components/Tooltip/TooltipCatto';

// Skeleton
export {
  SkeletonBaseCatto,
  TableSkeletonCatto,
  CardSkeletonCatto,
} from './components/Skeleton';
export type {
  SkeletonBaseCattoProps,
  TableSkeletonCattoProps,
  CardSkeletonCattoProps,
  CardSkeletonWidth,
} from './components/Skeleton';

// Badge
export { default as BadgeCatto } from './components/Badge/BadgeCatto';
export type {
  BadgeCattoProps,
  BadgeVariant,
  BadgeSize,
} from './components/Badge/BadgeCatto';

// Avatar
export { default as AvatarCatto } from './components/Avatar/AvatarCatto';
export type {
  AvatarCattoProps,
  AvatarSize,
  AvatarStatus,
  AvatarShape,
} from './components/Avatar/AvatarCatto';
export { default as AvatarUploadCatto } from './components/Avatar/AvatarUploadCatto';
export type {
  AvatarUploadCattoProps,
  AvatarUploadCattoLabels,
} from './components/Avatar/AvatarUploadCatto';

// PricingCard
export { default as PricingCardCatto } from './components/PricingCard/PricingCardCatto';
export type {
  PricingCardCattoProps,
  PricingFeature,
  PricingVariant,
} from './components/PricingCard/PricingCardCatto';

// ProductCard
export { default as ProductCardCatto } from './components/ProductCard/ProductCardCatto';
export type { ProductCardCattoProps } from './components/ProductCard/ProductCardCatto';

// QuantitySelector
export { default as QuantitySelectorCatto } from './components/QuantitySelector/QuantitySelectorCatto';
export type {
  QuantitySelectorCattoProps,
  QuantitySelectorSize,
  QuantitySelectorVariant,
} from './components/QuantitySelector/QuantitySelectorCatto';

// RatingStars
export { default as RatingStarsCatto } from './components/RatingStars/RatingStarsCatto';
export type {
  RatingStarsCattoProps,
  RatingStarsSize,
} from './components/RatingStars/RatingStarsCatto';

// CartItem
export { default as CartItemCatto } from './components/CartItem/CartItemCatto';
export type { CartItemCattoProps } from './components/CartItem/CartItemCatto';

// HR (Horizontal Rule / Divider) Components
export {
  HRDividerCatto,
  HRCircleCatto,
  HRTriangleCatto,
  HRAnimatedLineCatto,
  HRSquareCatto,
  HRSquaresCatto,
  HRPartyPulseCatto,
  HRPulseDividerCatto,
  HRSubtleCatto,
  HRWideCatto,
  HRHypnoCatto,
  SectionTitleCatto,
} from './components/HR';
export type {
  HRDividerCattoProps,
  HRCircleCattoProps,
  HRTriangleCattoProps,
  HRAnimatedLineCattoProps,
  HRSquareCattoProps,
  HRSquaresCattoProps,
  HRPartyPulseCattoProps,
  HRPulseDividerCattoProps,
  HRSubtleCattoProps,
  HRWideCattoProps,
  HRHypnoCattoProps,
  SectionTitleCattoProps,
} from './components/HR';

// OTP Input
export { OtpInputCatto } from './components/OtpInput';
export type { OtpInputCattoProps } from './components/OtpInput';

// Carousel
export { CarouselCatto } from './components/Carousel';
export type { CarouselCattoProps } from './components/Carousel';

// Button Toggle Pill
export { ButtonTogglePillCatto } from './components/ButtonTogglePill';
export type { ButtonTogglePillCattoProps } from './components/ButtonTogglePill';

// Theme Toggle (requires next-themes)
export { default as ThemeToggleCatto } from './components/ThemeToggle/ThemeToggleCatto';
export type { ThemeToggleCattoProps } from './components/ThemeToggle';

// Stepper Components
export {
  ProgressStepperCatto,
  DetailedStepperCatto,
} from './components/Stepper';
export type {
  ProgressStepperCattoProps,
  StepConfig,
  DetailedStepperCattoProps,
  DetailedStep,
} from './components/Stepper';

// Searchable Select
export { SearchableSelectCatto } from './components/SearchableSelect';
export type {
  SearchableSelectCattoProps,
  SearchableSelectSize,
  SearchableSelectWidth,
  SearchableSelectVariant,
  SearchableSelectTheme,
} from './components/SearchableSelect';

// MultiSelect
export { MultiSelectCatto } from './components/MultiSelect';
export type {
  MultiSelectCattoProps,
  MultiSelectOption,
} from './components/MultiSelect';

// Calendar
export { CalendarCatto } from './components/Calendar';
export type {
  CalendarCattoProps,
  CalendarTheme,
  CalendarSize,
  CalendarVariant,
} from './components/Calendar';

// DatePicker
export { DatePickerCatto } from './components/DatePicker';
export type {
  DatePickerCattoProps,
  DatePickerSize,
  DatePickerVariant,
  DatePickerWidth,
} from './components/DatePicker';

// Form (requires react-hook-form, zod, @hookform/resolvers)
export { FormCatto } from './components/Form';
export type {
  FormCattoProps,
  FormCattoLabels,
  FormErrorActions,
  FormField,
} from './components/Form';

// AddToCalendar
export { default as AddToCalendarCatto } from './components/AddToCalendar/AddToCalendarCatto';
export type { AddToCalendarCattoProps } from './components/AddToCalendar/AddToCalendarCatto';
// Note: AddToCalendarLabels is exported from './i18n/defaults' below

// EventCalendar - Full calendar views with event display
export {
  EventCalendarCatto,
  WeekViewCatto,
  DayViewCatto,
  TimeSlotPickerCatto,
  CalendarEventCard,
  eventColorClasses,
  eventTypeIcons,
  DEFAULT_EVENT_CALENDAR_LABELS,
  DEFAULT_WEEK_VIEW_LABELS,
  DEFAULT_DAY_VIEW_LABELS,
  DEFAULT_TIME_SLOT_PICKER_LABELS,
} from './components/EventCalendar';
export type {
  EventCalendarCattoProps,
  EventCalendarLabels,
  WeekViewCattoProps,
  WeekViewLabels,
  DayViewCattoProps,
  DayViewLabels,
  TimeSlotPickerCattoProps,
  TimeSlotPickerLabels,
  CalendarEventCardProps,
  CalendarEventItem,
  TimeSlot,
  CalendarView,
  EventCalendarTheme,
  EventCalendarSize,
  EventColor,
  EventType,
} from './components/EventCalendar';

// PageHeader
export { PageHeaderCatto } from './components/PageHeader';
export type { PageHeaderCattoProps } from './components/PageHeader';

// ViewToggle
export { ViewToggleCatto } from './components/ViewToggle';
export type {
  ViewToggleCattoProps,
  ViewToggleOption,
} from './components/ViewToggle';

// CourtScheduleGrid
export {
  CourtScheduleGridCatto,
  DEFAULT_COURT_SCHEDULE_GRID_LABELS,
} from './components/CourtScheduleGrid';
export type {
  CourtScheduleGridCattoProps,
  CourtScheduleGridLabels,
  CourtInfo,
  TimeSlotData,
  CourtTimeSlotState,
  ScheduleDropData,
} from './components/CourtScheduleGrid';

// ============================================
// Hooks
// ============================================
export { useHaptics } from './hooks/useHaptics';

// Drag and Drop
export { useDragDropList } from './hooks/useDragDropList';
export type {
  UseDragDropListOptions,
  UseDragDropListReturn,
  DragHandlers,
} from './hooks/useDragDropList';

// Table Hooks
export { useTableStateCatto } from './hooks/table/useTableStateCatto';
export { useTableInstanceCatto } from './hooks/table/useTableInstanceCatto';

// Breakpoint Hook (responsive column visibility)
export { useBreakpoint, isBelow } from './hooks/useBreakpoint';
export type { Breakpoint } from './hooks/useBreakpoint';

// ============================================
// Utilities
// ============================================
export { cn } from './utils';

// Phone Utilities
export {
  formatPhoneNumber,
  extractPhoneDigits,
  isValidPhoneNumber,
  formatPhoneAsYouType,
  parsePhoneInput,
} from './utils/phone';
export type { PhoneFormatOptions } from './utils/phone';

// Calendar Utilities
export {
  generateICSContent,
  downloadICSFile,
  generateGoogleCalendarURL,
} from './utils/calendar-utils';
export type { CalendarEvent } from './utils/calendar-utils';

// ============================================
// Types
// ============================================
export type {
  StyleWidth,
  StyleAnimations,
  FontSizeType,
  FontWeightType,
  ThemeType,
  HapticFeedback,
  SelectOption,
} from './types';

// ============================================
// i18n - Internationalization Support
// ============================================
export {
  defaultLabels,
  DEFAULT_MODAL_LABELS,
  DEFAULT_SELECT_LABELS,
  DEFAULT_PHONE_INPUT_LABELS,
  DEFAULT_DATE_PICKER_LABELS,
  DEFAULT_CALENDAR_LABELS,
  DEFAULT_TABLE_LABELS,
  DEFAULT_EMPTY_STATE_LABELS,
  DEFAULT_DRAWER_LABELS,
  DEFAULT_TOAST_LABELS,
  DEFAULT_ADD_TO_CALENDAR_LABELS,
} from './i18n/defaults';
export type {
  CattoUILabels,
  ModalLabels,
  SelectLabels,
  PhoneInputLabels,
  DatePickerLabels,
  CalendarLabels,
  TableLabels,
  EmptyStateLabels,
  DrawerLabels,
  ToastLabels,
  AddToCalendarLabels,
} from './i18n/defaults';

// i18n - Pre-made Locale Translations
export {
  portugueseLabels,
  spanishLabels,
  chineseSimplifiedLabels,
  frenchLabels,
  germanLabels,
  hindiLabels,
  ptLabels,
  esLabels,
  zhCNLabels,
  frLabels,
  deLabels,
  hiLabels,
} from './i18n/locales';

// ============================================
// Theming System
// ============================================

// Theme Provider & Hook
export { ThemeProvider, useTheme, useThemeSafe } from './context/ThemeProvider';

// Theme Switcher Component
export { default as ThemeSwitcherCatto } from './components/ThemeSwitcher/ThemeSwitcherCatto';
export type { ThemeSwitcherCattoProps } from './components/ThemeSwitcher/ThemeSwitcherCatto';

// Theme Registry & Types
export {
  THEMES,
  THEME_METADATA,
  getThemeMetadata,
  isValidTheme,
  THEME_FILES,
} from './themes';
export type { ThemeName, ThemeMetadata } from './themes';
