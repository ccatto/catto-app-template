// @catto/ui - Portuguese (Brazilian) Labels
// Português (Brasil) - pt-BR

import type { CattoUILabels } from '../defaults';

/**
 * Portuguese (Brazilian) translations for all @catto/ui components
 *
 * @example
 * import { portugueseLabels } from '@catto/ui';
 *
 * // Use with a specific component
 * <SelectCatto labels={portugueseLabels.select} />
 *
 * // Or spread into your i18n provider
 * const labels = locale === 'pt' ? portugueseLabels : defaultLabels;
 */
export const portugueseLabels: CattoUILabels = {
  modal: {
    closeButton: 'Fechar modal',
  },
  select: {
    placeholder: 'Selecione uma opção',
    noOptions: 'Nenhuma opção encontrada',
    clearButton: 'Limpar seleção',
  },
  phoneInput: {
    placeholder: '(11) 98765-4321',
  },
  datePicker: {
    placeholder: 'Selecione uma data',
    clearButton: 'Limpar data',
    calendarButton: 'Abrir calendário',
  },
  calendar: {
    locale: 'pt-BR',
    dayNames: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    previousMonth: 'Mês anterior',
    nextMonth: 'Próximo mês',
    today: 'Hoje',
  },
  table: {
    filterPlaceholder: 'Buscar...',
    emptyMessage: 'Nenhum dado disponível',
    loadingMessage: 'Carregando...',
    previousPage: 'Página anterior',
    nextPage: 'Próxima página',
    pageInfo: 'Página {current} de {total}',
    rowsPerPage: 'Linhas por página',
    selectAll: 'Selecionar todas as linhas',
    selectRow: 'Selecionar linha',
  },
  emptyState: {
    defaultTitle: 'Sem dados',
    defaultDescription: 'Não há nada aqui ainda',
    errorTitle: 'Algo deu errado',
    errorDescription: 'Por favor, tente novamente mais tarde',
    noResultsTitle: 'Nenhum resultado encontrado',
    noResultsDescription: 'Tente ajustar sua busca ou filtros',
  },
  drawer: {
    closeButton: 'Fechar painel',
  },
  toast: {
    dismiss: 'Dispensar',
    successTitle: 'Sucesso',
    errorTitle: 'Erro',
    warningTitle: 'Aviso',
    infoTitle: 'Informação',
  },
  addToCalendar: {
    buttonText: 'Calendário',
    buttonTooltip: 'Adicionar ao calendário',
    downloadTitle: 'Baixar .ics',
    downloadDescription: 'Apple Calendar, Outlook',
    googleTitle: 'Google Agenda',
    googleDescription: 'Abre em nova aba',
  },
};

export default portugueseLabels;
