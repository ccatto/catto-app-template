// @catto/ui - Drag and Drop List Hook
'use client';

/**
 * useDragDropList - Reusable drag-and-drop list reordering hook
 *
 * Provides HTML5 native drag-and-drop functionality for list reordering.
 * No external dependencies required.
 *
 * Usage:
 *   const {
 *     items,
 *     dragHandlers,
 *     isDragging,
 *     dragOverIndex,
 *     hasChanges,
 *     reset,
 *   } = useDragDropList({
 *     initialItems: myItems,
 *     getKey: (item) => item.id,
 *     onReorder: (newItems) => console.log('Reordered:', newItems),
 *     disabled: false,
 *   });
 *
 *   // Use in your component
 *   {items.map((item, index) => (
 *     <div key={getKey(item)} {...dragHandlers(index)}>
 *       {item.name}
 *     </div>
 *   ))}
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseDragDropListOptions<T> {
  /**
   * Initial items to display in the list
   */
  initialItems: T[];

  /**
   * Function to extract a unique key from each item
   * Used internally for tracking but not for React keys
   */
  getKey: (item: T) => string | number;

  /**
   * Called when items are reordered via drag-and-drop
   * Receives the new ordered array
   */
  onReorder?: (items: T[]) => void;

  /**
   * Disable drag-and-drop functionality
   * @default false
   */
  disabled?: boolean;
}

export interface DragHandlers {
  draggable: boolean;
  onDragStart: (e: React.DragEvent<HTMLElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLElement>) => void;
  onDrop: (e: React.DragEvent<HTMLElement>) => void;
}

export interface UseDragDropListReturn<T> {
  /**
   * The current ordered list of items
   */
  items: T[];

  /**
   * Function that returns drag handlers for a specific index
   * Spread these onto your draggable element: {...dragHandlers(index)}
   */
  dragHandlers: (index: number) => DragHandlers;

  /**
   * Whether a drag operation is currently in progress
   */
  isDragging: boolean;

  /**
   * The index currently being dragged, or null
   */
  draggedIndex: number | null;

  /**
   * The index currently being hovered over during drag, or null
   */
  dragOverIndex: number | null;

  /**
   * Whether the current order differs from the initial order
   */
  hasChanges: boolean;

  /**
   * Reset to the initial order, discarding changes
   */
  reset: () => void;

  /**
   * Manually set the items (useful when external data changes)
   * If preserveChanges is false (default), also resets hasChanges
   */
  setItems: (newItems: T[], preserveChanges?: boolean) => void;

  /**
   * Move an item from one index to another programmatically
   */
  moveItem: (fromIndex: number, toIndex: number) => void;
}

export function useDragDropList<T>({
  initialItems,
  getKey,
  onReorder,
  disabled = false,
}: UseDragDropListOptions<T>): UseDragDropListReturn<T> {
  // Current ordered items
  const [items, setItemsState] = useState<T[]>(initialItems);

  // Drag state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Track if we have unsaved changes
  const [hasChanges, setHasChanges] = useState(false);

  // Store initial items for reset and comparison
  const initialItemsRef = useRef<T[]>(initialItems);

  // Sync with initialItems when they change externally (and no local changes)
  useEffect(() => {
    if (!hasChanges) {
      const initialKeys = initialItemsRef.current.map(getKey).join(',');
      const newKeys = initialItems.map(getKey).join(',');

      if (initialKeys !== newKeys) {
        initialItemsRef.current = initialItems;
        setItemsState(initialItems);
      }
    }
  }, [initialItems, hasChanges, getKey]);

  // Reset to initial order
  const reset = useCallback(() => {
    setItemsState(initialItemsRef.current);
    setHasChanges(false);
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  // Manually set items
  const setItems = useCallback((newItems: T[], preserveChanges = false) => {
    setItemsState(newItems);
    initialItemsRef.current = newItems;
    if (!preserveChanges) {
      setHasChanges(false);
    }
  }, []);

  // Move an item programmatically
  const moveItem = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (disabled) return;
      if (fromIndex === toIndex) return;
      if (fromIndex < 0 || fromIndex >= items.length) return;
      if (toIndex < 0 || toIndex >= items.length) return;

      const newItems = [...items];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);

      setItemsState(newItems);
      setHasChanges(true);
      onReorder?.(newItems);
    },
    [disabled, items, onReorder],
  );

  // Drag handlers
  const handleDragStart = useCallback(
    (index: number) => (e: React.DragEvent<HTMLElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      setDraggedIndex(index);
      e.dataTransfer.effectAllowed = 'move';
      // Visual feedback
      e.currentTarget.style.opacity = '0.5';
    },
    [disabled],
  );

  const handleDragEnd = useCallback(
    () => (e: React.DragEvent<HTMLElement>) => {
      e.currentTarget.style.opacity = '1';
      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [],
  );

  const handleDragOver = useCallback(
    (index: number) => (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (draggedIndex !== null && index !== draggedIndex) {
        setDragOverIndex(index);
      }
    },
    [draggedIndex],
  );

  const handleDragLeave = useCallback(
    () => () => {
      setDragOverIndex(null);
    },
    [],
  );

  const handleDrop = useCallback(
    (dropIndex: number) => (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === dropIndex) {
        setDraggedIndex(null);
        setDragOverIndex(null);
        return;
      }

      const newItems = [...items];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(dropIndex, 0, draggedItem);

      setItemsState(newItems);
      setHasChanges(true);
      setDraggedIndex(null);
      setDragOverIndex(null);

      onReorder?.(newItems);
    },
    [draggedIndex, items, onReorder],
  );

  // Generate drag handlers for a specific index
  const dragHandlers = useCallback(
    (index: number): DragHandlers => ({
      draggable: !disabled,
      onDragStart: handleDragStart(index),
      onDragEnd: handleDragEnd(),
      onDragOver: handleDragOver(index),
      onDragLeave: handleDragLeave(),
      onDrop: handleDrop(index),
    }),
    [
      disabled,
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDragLeave,
      handleDrop,
    ],
  );

  return {
    items,
    dragHandlers,
    isDragging: draggedIndex !== null,
    draggedIndex,
    dragOverIndex,
    hasChanges,
    reset,
    setItems,
    moveItem,
  };
}

export default useDragDropList;
