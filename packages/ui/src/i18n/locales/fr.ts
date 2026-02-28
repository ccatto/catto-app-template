// @catto/ui - French Labels
// Français - fr

import type { CattoUILabels } from '../defaults';

/**
 * French translations for all @catto/ui components
 *
 * @example
 * import { frenchLabels } from '@catto/ui';
 *
 * // Use with a specific component
 * <SelectCatto labels={frenchLabels.select} />
 *
 * // Or spread into your i18n provider
 * const labels = locale === 'fr' ? frenchLabels : defaultLabels;
 */
export const frenchLabels: CattoUILabels = {
  modal: {
    closeButton: 'Fermer la fenêtre',
  },
  select: {
    placeholder: 'Sélectionnez une option',
    noOptions: 'Aucune option disponible',
    clearButton: 'Effacer la sélection',
  },
  phoneInput: {
    placeholder: '06 12 34 56 78',
  },
  datePicker: {
    placeholder: 'Sélectionnez une date',
    clearButton: 'Effacer la date',
    calendarButton: 'Ouvrir le calendrier',
  },
  calendar: {
    locale: 'fr-FR',
    dayNames: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    previousMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    today: "Aujourd'hui",
  },
  table: {
    filterPlaceholder: 'Rechercher...',
    emptyMessage: 'Aucune donnée disponible',
    loadingMessage: 'Chargement...',
    previousPage: 'Page précédente',
    nextPage: 'Page suivante',
    pageInfo: 'Page {current} sur {total}',
    rowsPerPage: 'Lignes par page',
    selectAll: 'Tout sélectionner',
    selectRow: 'Sélectionner la ligne',
  },
  emptyState: {
    defaultTitle: 'Aucune donnée',
    defaultDescription: "Il n'y a rien ici pour le moment",
    errorTitle: 'Une erreur est survenue',
    errorDescription: 'Veuillez réessayer plus tard',
    noResultsTitle: 'Aucun résultat trouvé',
    noResultsDescription: 'Essayez de modifier votre recherche ou vos filtres',
  },
  drawer: {
    closeButton: 'Fermer le panneau',
  },
  toast: {
    dismiss: 'Fermer',
    successTitle: 'Succès',
    errorTitle: 'Erreur',
    warningTitle: 'Attention',
    infoTitle: 'Information',
  },
  addToCalendar: {
    buttonText: 'Calendrier',
    buttonTooltip: 'Ajouter au calendrier',
    downloadTitle: 'Télécharger .ics',
    downloadDescription: 'Apple Calendar, Outlook',
    googleTitle: 'Google Agenda',
    googleDescription: "S'ouvre dans un nouvel onglet",
  },
};

export default frenchLabels;
