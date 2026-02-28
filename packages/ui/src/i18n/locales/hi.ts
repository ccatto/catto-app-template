// @catto/ui - Hindi Labels
// हिन्दी - hi

import type { CattoUILabels } from '../defaults';

/**
 * Hindi translations for all @catto/ui components
 *
 * @example
 * import { hindiLabels } from '@catto/ui';
 *
 * // Use with a specific component
 * <SelectCatto labels={hindiLabels.select} />
 *
 * // Or spread into your i18n provider
 * const labels = locale === 'hi' ? hindiLabels : defaultLabels;
 */
export const hindiLabels: CattoUILabels = {
  modal: {
    closeButton: 'विंडो बंद करें',
  },
  select: {
    placeholder: 'कृपया चुनें',
    noOptions: 'कोई विकल्प उपलब्ध नहीं',
    clearButton: 'चयन हटाएं',
  },
  phoneInput: {
    placeholder: '98765 43210',
  },
  datePicker: {
    placeholder: 'तारीख चुनें',
    clearButton: 'तारीख हटाएं',
    calendarButton: 'कैलेंडर खोलें',
  },
  calendar: {
    locale: 'hi-IN',
    dayNames: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
    previousMonth: 'पिछला महीना',
    nextMonth: 'अगला महीना',
    today: 'आज',
  },
  table: {
    filterPlaceholder: 'खोजें...',
    emptyMessage: 'कोई डेटा उपलब्ध नहीं',
    loadingMessage: 'लोड हो रहा है...',
    previousPage: 'पिछला पृष्ठ',
    nextPage: 'अगला पृष्ठ',
    pageInfo: 'पृष्ठ {current} का {total}',
    rowsPerPage: 'प्रति पृष्ठ पंक्तियाँ',
    selectAll: 'सभी चुनें',
    selectRow: 'पंक्ति चुनें',
  },
  emptyState: {
    defaultTitle: 'कोई डेटा नहीं',
    defaultDescription: 'यहां अभी कुछ नहीं है',
    errorTitle: 'कुछ गलत हो गया',
    errorDescription: 'कृपया बाद में पुनः प्रयास करें',
    noResultsTitle: 'कोई परिणाम नहीं मिला',
    noResultsDescription: 'अपनी खोज या फ़िल्टर समायोजित करने का प्रयास करें',
  },
  drawer: {
    closeButton: 'पैनल बंद करें',
  },
  toast: {
    dismiss: 'बंद करें',
    successTitle: 'सफल',
    errorTitle: 'त्रुटि',
    warningTitle: 'चेतावनी',
    infoTitle: 'जानकारी',
  },
  addToCalendar: {
    buttonText: 'कैलेंडर',
    buttonTooltip: 'कैलेंडर में जोड़ें',
    downloadTitle: '.ics डाउनलोड करें',
    downloadDescription: 'Apple कैलेंडर, Outlook',
    googleTitle: 'Google कैलेंडर',
    googleDescription: 'नए टैब में खुलता है',
  },
};

export default hindiLabels;
