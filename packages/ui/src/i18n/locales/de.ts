// @catto/ui - German Labels
// Deutsch - de

import type { CattoUILabels } from '../defaults';

/**
 * German translations for all @catto/ui components
 *
 * @example
 * import { germanLabels } from '@catto/ui';
 *
 * // Use with a specific component
 * <SelectCatto labels={germanLabels.select} />
 *
 * // Or spread into your i18n provider
 * const labels = locale === 'de' ? germanLabels : defaultLabels;
 */
export const germanLabels: CattoUILabels = {
  modal: {
    closeButton: 'Fenster schließen',
  },
  select: {
    placeholder: 'Bitte auswählen',
    noOptions: 'Keine Optionen verfügbar',
    clearButton: 'Auswahl löschen',
  },
  phoneInput: {
    placeholder: '0151 12345678',
  },
  datePicker: {
    placeholder: 'Datum auswählen',
    clearButton: 'Datum löschen',
    calendarButton: 'Kalender öffnen',
  },
  calendar: {
    locale: 'de-DE',
    dayNames: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    previousMonth: 'Vorheriger Monat',
    nextMonth: 'Nächster Monat',
    today: 'Heute',
  },
  table: {
    filterPlaceholder: 'Suchen...',
    emptyMessage: 'Keine Daten verfügbar',
    loadingMessage: 'Laden...',
    previousPage: 'Vorherige Seite',
    nextPage: 'Nächste Seite',
    pageInfo: 'Seite {current} von {total}',
    rowsPerPage: 'Zeilen pro Seite',
    selectAll: 'Alle auswählen',
    selectRow: 'Zeile auswählen',
  },
  emptyState: {
    defaultTitle: 'Keine Daten',
    defaultDescription: 'Hier gibt es noch nichts',
    errorTitle: 'Ein Fehler ist aufgetreten',
    errorDescription: 'Bitte versuchen Sie es später erneut',
    noResultsTitle: 'Keine Ergebnisse gefunden',
    noResultsDescription: 'Versuchen Sie, Ihre Suche oder Filter anzupassen',
  },
  drawer: {
    closeButton: 'Panel schließen',
  },
  toast: {
    dismiss: 'Schließen',
    successTitle: 'Erfolg',
    errorTitle: 'Fehler',
    warningTitle: 'Warnung',
    infoTitle: 'Information',
  },
  addToCalendar: {
    buttonText: 'Kalender',
    buttonTooltip: 'Zum Kalender hinzufügen',
    downloadTitle: '.ics herunterladen',
    downloadDescription: 'Apple Kalender, Outlook',
    googleTitle: 'Google Kalender',
    googleDescription: 'Öffnet in neuem Tab',
  },
};

export default germanLabels;
