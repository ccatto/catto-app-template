// @catto/ui - Spanish Labels Example
// Copy and customize this file for your app's Spanish translations
// Import and use with the labels prop on each component

import type { CattoUILabels } from './defaults';

/**
 * Complete Spanish translations for @catto/ui components
 *
 * Usage:
 * ```tsx
 * import { spanishLabels } from '@catto/ui/i18n/es.example';
 *
 * // Pass to individual components
 * <CalendarCatto labels={spanishLabels.calendar} />
 * <TableCatto labels={spanishLabels.table} />
 *
 * // Or create a provider/context for your app
 * ```
 */
export const spanishLabels: CattoUILabels = {
  modal: {
    closeButton: 'Cerrar modal',
  },
  select: {
    placeholder: 'Seleccione una opción',
    noOptions: 'No se encontraron opciones',
    clearButton: 'Borrar selección',
  },
  phoneInput: {
    placeholder: '(555) 123-4567',
  },
  datePicker: {
    placeholder: 'Seleccione una fecha',
    clearButton: 'Borrar fecha',
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
};

export default spanishLabels;
