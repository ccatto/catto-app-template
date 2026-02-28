// @catto/ui - Spanish Labels
// Español - es

import type { CattoUILabels } from '../defaults';

/**
 * Spanish translations for all @catto/ui components
 *
 * @example
 * import { spanishLabels } from '@catto/ui';
 *
 * // Use with a specific component
 * <SelectCatto labels={spanishLabels.select} />
 *
 * // Or spread into your i18n provider
 * const labels = locale === 'es' ? spanishLabels : defaultLabels;
 */
export const spanishLabels: CattoUILabels = {
  modal: {
    closeButton: 'Cerrar modal',
  },
  select: {
    placeholder: 'Seleccione una opción',
    noOptions: 'No se encontraron opciones',
    clearButton: 'Limpiar selección',
  },
  phoneInput: {
    placeholder: '(555) 123-4567',
  },
  datePicker: {
    placeholder: 'Seleccione una fecha',
    clearButton: 'Limpiar fecha',
    calendarButton: 'Abrir calendario',
  },
  calendar: {
    locale: 'es-ES',
    dayNames: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    previousMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    today: 'Hoy',
  },
  table: {
    filterPlaceholder: 'Buscar...',
    emptyMessage: 'No hay datos disponibles',
    loadingMessage: 'Cargando...',
    previousPage: 'Página anterior',
    nextPage: 'Página siguiente',
    pageInfo: 'Página {current} de {total}',
    rowsPerPage: 'Filas por página',
    selectAll: 'Seleccionar todas las filas',
    selectRow: 'Seleccionar fila',
  },
  emptyState: {
    defaultTitle: 'Sin datos',
    defaultDescription: 'No hay nada aquí todavía',
    errorTitle: 'Algo salió mal',
    errorDescription: 'Por favor, inténtelo de nuevo más tarde',
    noResultsTitle: 'No se encontraron resultados',
    noResultsDescription: 'Intente ajustar su búsqueda o filtros',
  },
  drawer: {
    closeButton: 'Cerrar panel',
  },
  toast: {
    dismiss: 'Descartar',
    successTitle: 'Éxito',
    errorTitle: 'Error',
    warningTitle: 'Advertencia',
    infoTitle: 'Información',
  },
  addToCalendar: {
    buttonText: 'Calendario',
    buttonTooltip: 'Agregar al calendario',
    downloadTitle: 'Descargar .ics',
    downloadDescription: 'Apple Calendar, Outlook',
    googleTitle: 'Google Calendar',
    googleDescription: 'Abre en nueva pestaña',
  },
};

export default spanishLabels;
