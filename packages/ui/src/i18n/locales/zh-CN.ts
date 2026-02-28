// @catto/ui - Chinese Simplified Labels
// 简体中文 - zh-CN

import type { CattoUILabels } from '../defaults';

/**
 * Chinese Simplified translations for all @catto/ui components
 *
 * @example
 * import { chineseSimplifiedLabels } from '@catto/ui';
 *
 * // Use with a specific component
 * <SelectCatto labels={chineseSimplifiedLabels.select} />
 *
 * // Or spread into your i18n provider
 * const labels = locale === 'zh-CN' ? chineseSimplifiedLabels : defaultLabels;
 */
export const chineseSimplifiedLabels: CattoUILabels = {
  modal: {
    closeButton: '关闭窗口',
  },
  select: {
    placeholder: '请选择',
    noOptions: '无可用选项',
    clearButton: '清除选择',
  },
  phoneInput: {
    placeholder: '138 0000 0000',
  },
  datePicker: {
    placeholder: '请选择日期',
    clearButton: '清除日期',
    calendarButton: '打开日历',
  },
  calendar: {
    locale: 'zh-CN',
    dayNames: ['日', '一', '二', '三', '四', '五', '六'],
    previousMonth: '上个月',
    nextMonth: '下个月',
    today: '今天',
  },
  table: {
    filterPlaceholder: '搜索...',
    emptyMessage: '暂无数据',
    loadingMessage: '加载中...',
    previousPage: '上一页',
    nextPage: '下一页',
    pageInfo: '第 {current} 页，共 {total} 页',
    rowsPerPage: '每页行数',
    selectAll: '全选',
    selectRow: '选择行',
  },
  emptyState: {
    defaultTitle: '暂无数据',
    defaultDescription: '这里还没有任何内容',
    errorTitle: '出错了',
    errorDescription: '请稍后再试',
    noResultsTitle: '未找到结果',
    noResultsDescription: '请尝试调整搜索条件或筛选器',
  },
  drawer: {
    closeButton: '关闭面板',
  },
  toast: {
    dismiss: '关闭',
    successTitle: '成功',
    errorTitle: '错误',
    warningTitle: '警告',
    infoTitle: '提示',
  },
  addToCalendar: {
    buttonText: '日历',
    buttonTooltip: '添加到日历',
    downloadTitle: '下载 .ics 文件',
    downloadDescription: 'Apple 日历、Outlook',
    googleTitle: 'Google 日历',
    googleDescription: '在新标签页中打开',
  },
};

export default chineseSimplifiedLabels;
