// @catto/ui - Default i18n Labels
// These are the default English labels used by components.
// Override these by passing a `labels` prop to components or by
// providing your own labels object to your app's i18n provider.

/**
 * Default labels for MellowModalCatto component
 */
export interface ModalLabels {
  /** Aria label for the close button (default: "Close modal") */
  closeButton?: string;
}

/**
 * Default labels for SelectCatto component
 */
export interface SelectLabels {
  /** Placeholder text when no option is selected (default: "Select an option") */
  placeholder?: string;
  /** Text shown when no options match search (default: "No options found") */
  noOptions?: string;
  /** Aria label for clear button (default: "Clear selection") */
  clearButton?: string;
}

/**
 * Default labels for PhoneInputCatto component
 */
export interface PhoneInputLabels {
  /** Placeholder text for phone input (default: "(555) 123-4567") */
  placeholder?: string;
}

/**
 * Default labels for DatePickerCatto component
 */
export interface DatePickerLabels {
  /** Placeholder text when no date is selected (default: "Select a date") */
  placeholder?: string;
  /** Aria label for clear button (default: "Clear date") */
  clearButton?: string;
  /** Aria label for calendar button (default: "Open calendar") */
  calendarButton?: string;
}

/**
 * Default labels for CalendarCatto component
 */
export interface CalendarLabels {
  /** Locale for date formatting (default: "en-US") */
  locale?: string;
  /** Day names starting from Sunday (default: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]) */
  dayNames?: [string, string, string, string, string, string, string];
  /** Aria label for previous month button (default: "Previous month") */
  previousMonth?: string;
  /** Aria label for next month button (default: "Next month") */
  nextMonth?: string;
  /** Aria label for today indicator (default: "Today") */
  today?: string;
}

/**
 * Default labels for TableCatto component
 */
export interface TableLabels {
  /** Filter input placeholder (default: "Search...") */
  filterPlaceholder?: string;
  /** Text shown when table is empty (default: "No data available") */
  emptyMessage?: string;
  /** Text shown while loading (default: "Loading...") */
  loadingMessage?: string;
  /** Aria label for previous page button (default: "Previous page") */
  previousPage?: string;
  /** Aria label for next page button (default: "Next page") */
  nextPage?: string;
  /** Page info template - use {current} and {total} placeholders (default: "Page {current} of {total}") */
  pageInfo?: string;
  /** Rows per page label (default: "Rows per page") */
  rowsPerPage?: string;
  /** Select all checkbox aria label (default: "Select all rows") */
  selectAll?: string;
  /** Select row checkbox aria label (default: "Select row") */
  selectRow?: string;
}

/**
 * Default labels for EmptyStateCatto component
 */
export interface EmptyStateLabels {
  /** Default title when none provided (default: "No data") */
  defaultTitle?: string;
  /** Default description when none provided (default: "There's nothing here yet") */
  defaultDescription?: string;
  /** Error title (default: "Something went wrong") */
  errorTitle?: string;
  /** Error description (default: "Please try again later") */
  errorDescription?: string;
  /** No results title (default: "No results found") */
  noResultsTitle?: string;
  /** No results description (default: "Try adjusting your search or filters") */
  noResultsDescription?: string;
}

/**
 * Default labels for DrawerCatto component
 */
export interface DrawerLabels {
  /** Aria label for close button (default: "Close drawer") */
  closeButton?: string;
}

/**
 * Default labels for ToastCatto component
 */
export interface ToastLabels {
  /** Aria label for dismiss button (default: "Dismiss") */
  dismiss?: string;
  /** Success toast default title (default: "Success") */
  successTitle?: string;
  /** Error toast default title (default: "Error") */
  errorTitle?: string;
  /** Warning toast default title (default: "Warning") */
  warningTitle?: string;
  /** Info toast default title (default: "Info") */
  infoTitle?: string;
}

/**
 * Default labels for AddToCalendarCatto component
 */
export interface AddToCalendarLabels {
  /** Button text (default: "Calendar") */
  buttonText?: string;
  /** Button tooltip (default: "Add to calendar") */
  buttonTooltip?: string;
  /** Download ICS option title (default: "Download .ics") */
  downloadTitle?: string;
  /** Download ICS option description (default: "Apple Calendar, Outlook") */
  downloadDescription?: string;
  /** Google Calendar option title (default: "Google Calendar") */
  googleTitle?: string;
  /** Google Calendar option description (default: "Opens in new tab") */
  googleDescription?: string;
}

/**
 * All component labels grouped together
 */
export interface CattoUILabels {
  modal?: ModalLabels;
  select?: SelectLabels;
  phoneInput?: PhoneInputLabels;
  datePicker?: DatePickerLabels;
  calendar?: CalendarLabels;
  table?: TableLabels;
  emptyState?: EmptyStateLabels;
  drawer?: DrawerLabels;
  toast?: ToastLabels;
  addToCalendar?: AddToCalendarLabels;
}

/**
 * Default English labels for all @catto/ui components
 *
 * Usage in your app:
 * 1. Import these defaults
 * 2. Override with your translations
 * 3. Pass to components via labels prop or context
 *
 * @example
 * // Spanish overrides
 * const spanishLabels: CattoUILabels = {
 *   modal: { closeButton: 'Cerrar modal' },
 *   select: { placeholder: 'Seleccione una opción', noOptions: 'Sin opciones' },
 *   calendar: {
 *     locale: 'es-ES',
 *     dayNames: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
 *     previousMonth: 'Mes anterior',
 *     nextMonth: 'Mes siguiente',
 *   },
 *   table: {
 *     filterPlaceholder: 'Buscar...',
 *     emptyMessage: 'No hay datos disponibles',
 *     previousPage: 'Página anterior',
 *     nextPage: 'Página siguiente',
 *     pageInfo: 'Página {current} de {total}',
 *   },
 *   emptyState: {
 *     defaultTitle: 'Sin datos',
 *     defaultDescription: 'No hay nada aquí todavía',
 *   },
 *   drawer: { closeButton: 'Cerrar panel' },
 * };
 */
export const defaultLabels: CattoUILabels = {
  modal: {
    closeButton: 'Close modal',
  },
  select: {
    placeholder: 'Select an option',
    noOptions: 'No options found',
    clearButton: 'Clear selection',
  },
  phoneInput: {
    placeholder: '(555) 123-4567',
  },
  datePicker: {
    placeholder: 'Select a date',
    clearButton: 'Clear date',
    calendarButton: 'Open calendar',
  },
  calendar: {
    locale: 'en-US',
    dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    today: 'Today',
  },
  table: {
    filterPlaceholder: 'Search...',
    emptyMessage: 'No data available',
    loadingMessage: 'Loading...',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    pageInfo: 'Page {current} of {total}',
    rowsPerPage: 'Rows per page',
    selectAll: 'Select all rows',
    selectRow: 'Select row',
  },
  emptyState: {
    defaultTitle: 'No data',
    defaultDescription: "There's nothing here yet",
    errorTitle: 'Something went wrong',
    errorDescription: 'Please try again later',
    noResultsTitle: 'No results found',
    noResultsDescription: 'Try adjusting your search or filters',
  },
  drawer: {
    closeButton: 'Close drawer',
  },
  toast: {
    dismiss: 'Dismiss',
    successTitle: 'Success',
    errorTitle: 'Error',
    warningTitle: 'Warning',
    infoTitle: 'Info',
  },
  addToCalendar: {
    buttonText: 'Calendar',
    buttonTooltip: 'Add to calendar',
    downloadTitle: 'Download .ics',
    downloadDescription: 'Apple Calendar, Outlook',
    googleTitle: 'Google Calendar',
    googleDescription: 'Opens in new tab',
  },
};

// Export individual defaults for direct use
export const DEFAULT_MODAL_LABELS: Required<ModalLabels> = {
  closeButton: 'Close modal',
};

export const DEFAULT_SELECT_LABELS: Required<SelectLabels> = {
  placeholder: 'Select an option',
  noOptions: 'No options found',
  clearButton: 'Clear selection',
};

export const DEFAULT_PHONE_INPUT_LABELS: Required<PhoneInputLabels> = {
  placeholder: '(555) 123-4567',
};

export const DEFAULT_DATE_PICKER_LABELS: Required<DatePickerLabels> = {
  placeholder: 'Select a date',
  clearButton: 'Clear date',
  calendarButton: 'Open calendar',
};

export const DEFAULT_CALENDAR_LABELS: Required<CalendarLabels> = {
  locale: 'en-US',
  dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  today: 'Today',
};

export const DEFAULT_TABLE_LABELS: Required<TableLabels> = {
  filterPlaceholder: 'Search...',
  emptyMessage: 'No data available',
  loadingMessage: 'Loading...',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  pageInfo: 'Page {current} of {total}',
  rowsPerPage: 'Rows per page',
  selectAll: 'Select all rows',
  selectRow: 'Select row',
};

export const DEFAULT_EMPTY_STATE_LABELS: Required<EmptyStateLabels> = {
  defaultTitle: 'No data',
  defaultDescription: "There's nothing here yet",
  errorTitle: 'Something went wrong',
  errorDescription: 'Please try again later',
  noResultsTitle: 'No results found',
  noResultsDescription: 'Try adjusting your search or filters',
};

export const DEFAULT_DRAWER_LABELS: Required<DrawerLabels> = {
  closeButton: 'Close drawer',
};

export const DEFAULT_TOAST_LABELS: Required<ToastLabels> = {
  dismiss: 'Dismiss',
  successTitle: 'Success',
  errorTitle: 'Error',
  warningTitle: 'Warning',
  infoTitle: 'Info',
};

export const DEFAULT_ADD_TO_CALENDAR_LABELS: Required<AddToCalendarLabels> = {
  buttonText: 'Calendar',
  buttonTooltip: 'Add to calendar',
  downloadTitle: 'Download .ics',
  downloadDescription: 'Apple Calendar, Outlook',
  googleTitle: 'Google Calendar',
  googleDescription: 'Opens in new tab',
};

/**
 * Default labels for EventCalendarCatto component
 */
export interface EventCalendarLabels extends CalendarLabels {
  /** Text for "Today" button (default: "Today") */
  todayButton?: string;
  /** Text shown when no events (default: "No events") */
  noEvents?: string;
  /** Text for showing more events (default: "+{count} more") */
  moreEvents?: string;
  /** View labels */
  month?: string;
  week?: string;
  day?: string;
}

/**
 * Default labels for WeekViewCatto component
 */
export interface WeekViewLabels extends CalendarLabels {
  /** Text for "Today" button */
  todayButton?: string;
  /** Text for previous week */
  previousWeek?: string;
  /** Text for next week */
  nextWeek?: string;
  /** All day section label */
  allDay?: string;
}

/**
 * Default labels for DayViewCatto component
 */
export interface DayViewLabels extends CalendarLabels {
  /** Text for "Today" button */
  todayButton?: string;
  /** Text for previous day */
  previousDay?: string;
  /** Text for next day */
  nextDay?: string;
  /** All day section label */
  allDay?: string;
  /** No events message */
  noEvents?: string;
}

/**
 * Default labels for TimeSlotPickerCatto component
 */
export interface TimeSlotPickerLabels {
  /** Header text (default: "Select a time") */
  header?: string;
  /** No slots available message (default: "No available times") */
  noSlots?: string;
  /** Booked slot text (default: "Booked") */
  booked?: string;
  /** Selected slot text (default: "Selected") */
  selected?: string;
}

export const DEFAULT_EVENT_CALENDAR_LABELS: Required<EventCalendarLabels> = {
  ...DEFAULT_CALENDAR_LABELS,
  todayButton: 'Today',
  noEvents: 'No events',
  moreEvents: '+{count} more',
  month: 'Month',
  week: 'Week',
  day: 'Day',
};

export const DEFAULT_WEEK_VIEW_LABELS: Required<WeekViewLabels> = {
  ...DEFAULT_CALENDAR_LABELS,
  todayButton: 'Today',
  previousWeek: 'Previous week',
  nextWeek: 'Next week',
  allDay: 'All day',
};

export const DEFAULT_DAY_VIEW_LABELS: Required<DayViewLabels> = {
  ...DEFAULT_CALENDAR_LABELS,
  todayButton: 'Today',
  previousDay: 'Previous day',
  nextDay: 'Next day',
  allDay: 'All day',
  noEvents: 'No events scheduled',
};

export const DEFAULT_TIME_SLOT_PICKER_LABELS: Required<TimeSlotPickerLabels> = {
  header: 'Select a time',
  noSlots: 'No available times',
  booked: 'Booked',
  selected: 'Selected',
};
