// @catto/ui - useDragDropList Tests
// Tests for the drag and drop list reordering hook

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDragDropList } from '../../hooks/useDragDropList';

interface TestItem {
  id: string;
  name: string;
}

const testItems: TestItem[] = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
  { id: '3', name: 'Item 3' },
  { id: '4', name: 'Item 4' },
];

const getKey = (item: TestItem) => item.id;

describe('useDragDropList', () => {
  // ============================================
  // Initial State Tests
  // ============================================

  describe('Initial State', () => {
    it('returns initial items', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      expect(result.current.items).toEqual(testItems);
    });

    it('starts with isDragging as false', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      expect(result.current.isDragging).toBe(false);
    });

    it('starts with draggedIndex as null', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      expect(result.current.draggedIndex).toBeNull();
    });

    it('starts with dragOverIndex as null', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      expect(result.current.dragOverIndex).toBeNull();
    });

    it('starts with hasChanges as false', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      expect(result.current.hasChanges).toBe(false);
    });

    it('returns empty array for empty initialItems', () => {
      const { result } = renderHook(() =>
        useDragDropList<TestItem>({ initialItems: [], getKey }),
      );

      expect(result.current.items).toEqual([]);
    });
  });

  // ============================================
  // Drag Handlers Tests
  // ============================================

  describe('Drag Handlers', () => {
    it('returns drag handlers for an index', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      const handlers = result.current.dragHandlers(0);

      expect(handlers).toHaveProperty('draggable');
      expect(handlers).toHaveProperty('onDragStart');
      expect(handlers).toHaveProperty('onDragEnd');
      expect(handlers).toHaveProperty('onDragOver');
      expect(handlers).toHaveProperty('onDragLeave');
      expect(handlers).toHaveProperty('onDrop');
    });

    it('draggable is true when not disabled', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey, disabled: false }),
      );

      const handlers = result.current.dragHandlers(0);
      expect(handlers.draggable).toBe(true);
    });

    it('draggable is false when disabled', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey, disabled: true }),
      );

      const handlers = result.current.dragHandlers(0);
      expect(handlers.draggable).toBe(false);
    });
  });

  // ============================================
  // Move Item Tests
  // ============================================

  describe('moveItem', () => {
    it('moves item from one position to another', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      act(() => {
        result.current.moveItem(0, 2);
      });

      expect(result.current.items[0].id).toBe('2');
      expect(result.current.items[1].id).toBe('3');
      expect(result.current.items[2].id).toBe('1');
    });

    it('sets hasChanges to true after move', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      act(() => {
        result.current.moveItem(0, 2);
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it('calls onReorder callback after move', () => {
      const onReorder = vi.fn();
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey, onReorder }),
      );

      act(() => {
        result.current.moveItem(0, 2);
      });

      expect(onReorder).toHaveBeenCalledTimes(1);
      expect(onReorder).toHaveBeenCalledWith(expect.any(Array));
    });

    it('does nothing when fromIndex equals toIndex', () => {
      const onReorder = vi.fn();
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey, onReorder }),
      );

      act(() => {
        result.current.moveItem(1, 1);
      });

      expect(onReorder).not.toHaveBeenCalled();
      expect(result.current.hasChanges).toBe(false);
    });

    it('does nothing when disabled', () => {
      const onReorder = vi.fn();
      const { result } = renderHook(() =>
        useDragDropList({
          initialItems: testItems,
          getKey,
          onReorder,
          disabled: true,
        }),
      );

      act(() => {
        result.current.moveItem(0, 2);
      });

      expect(onReorder).not.toHaveBeenCalled();
      expect(result.current.items).toEqual(testItems);
    });

    it('does nothing for invalid fromIndex', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      act(() => {
        result.current.moveItem(-1, 2);
      });

      expect(result.current.items).toEqual(testItems);
    });

    it('does nothing for invalid toIndex', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      act(() => {
        result.current.moveItem(0, 10);
      });

      expect(result.current.items).toEqual(testItems);
    });
  });

  // ============================================
  // Reset Tests
  // ============================================

  describe('reset', () => {
    it('resets items to initial order', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      act(() => {
        result.current.moveItem(0, 3);
      });

      expect(result.current.items[0].id).not.toBe('1');

      act(() => {
        result.current.reset();
      });

      expect(result.current.items).toEqual(testItems);
    });

    it('resets hasChanges to false', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      act(() => {
        result.current.moveItem(0, 2);
      });

      expect(result.current.hasChanges).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.hasChanges).toBe(false);
    });

    it('resets drag state', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      act(() => {
        result.current.reset();
      });

      expect(result.current.draggedIndex).toBeNull();
      expect(result.current.dragOverIndex).toBeNull();
    });
  });

  // ============================================
  // setItems Tests
  // ============================================

  describe('setItems', () => {
    it('updates items', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      const newItems: TestItem[] = [
        { id: '5', name: 'Item 5' },
        { id: '6', name: 'Item 6' },
      ];

      act(() => {
        result.current.setItems(newItems);
      });

      expect(result.current.items).toEqual(newItems);
    });

    it('resets hasChanges by default', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      act(() => {
        result.current.moveItem(0, 2);
      });

      expect(result.current.hasChanges).toBe(true);

      act(() => {
        result.current.setItems(testItems);
      });

      expect(result.current.hasChanges).toBe(false);
    });

    it('preserves hasChanges when preserveChanges is true', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      act(() => {
        result.current.moveItem(0, 2);
      });

      const newItems: TestItem[] = [{ id: '5', name: 'Item 5' }];

      act(() => {
        result.current.setItems(newItems, true);
      });

      expect(result.current.hasChanges).toBe(true);
    });
  });

  // ============================================
  // Return Type Tests
  // ============================================

  describe('Return Type', () => {
    it('returns all expected properties', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      expect(result.current).toHaveProperty('items');
      expect(result.current).toHaveProperty('dragHandlers');
      expect(result.current).toHaveProperty('isDragging');
      expect(result.current).toHaveProperty('draggedIndex');
      expect(result.current).toHaveProperty('dragOverIndex');
      expect(result.current).toHaveProperty('hasChanges');
      expect(result.current).toHaveProperty('reset');
      expect(result.current).toHaveProperty('setItems');
      expect(result.current).toHaveProperty('moveItem');
    });

    it('functions are callable', () => {
      const { result } = renderHook(() =>
        useDragDropList({ initialItems: testItems, getKey }),
      );

      expect(typeof result.current.dragHandlers).toBe('function');
      expect(typeof result.current.reset).toBe('function');
      expect(typeof result.current.setItems).toBe('function');
      expect(typeof result.current.moveItem).toBe('function');
    });
  });
});
