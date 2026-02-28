// @catto/ui - Keyboard Utilities

import { KeyboardEvent as ReactKeyboardEvent } from 'react';

const KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ARROW_DOWN: 'ArrowDown',
  ARROW_UP: 'ArrowUp',
  ESCAPE: 'Escape',
} as const;

// Typeahead search state - shared across calls (only one dropdown open at a time)
let typeaheadBuffer = '';
let typeaheadTimeout: ReturnType<typeof setTimeout> | null = null;
let lastMatchIndex = -1;
const TYPEAHEAD_TIMEOUT_MS = 500;

/**
 * Scroll an option into view within its scrollable dropdown container.
 * More reliable than `scrollIntoView` which can scroll the page instead
 * of just the overflow container.
 */
export const scrollOptionIntoContainer = (el: HTMLElement) => {
  const container = el.parentElement;
  if (!container) return;

  const elTop = el.offsetTop;
  const elBottom = elTop + el.offsetHeight;
  const scrollTop = container.scrollTop;
  const visibleBottom = scrollTop + container.clientHeight;

  if (elBottom > visibleBottom) {
    // Option is below visible area — scroll down
    container.scrollTop = elBottom - container.clientHeight;
  } else if (elTop < scrollTop) {
    // Option is above visible area — scroll up
    container.scrollTop = elTop;
  }
};

/**
 * Handle typeahead search with cycling support.
 *
 * - Typing "f" jumps to the first option starting with "F"
 * - Typing "f" again cycles to the NEXT option starting with "F"
 * - Typing "fl" quickly (multi-char) jumps to "Florida" (prefix match)
 *
 * Returns the index of the matching option, or -1 if no match.
 */
export const handleTypeahead = (
  key: string,
  options: { value: string; label: string }[],
  optionRefs: React.MutableRefObject<(HTMLDivElement | null)[]> | null,
): number => {
  // Only handle single printable characters
  if (key.length !== 1 || !key.match(/[a-zA-Z0-9]/)) {
    return -1;
  }

  // Clear previous timeout
  if (typeaheadTimeout) {
    clearTimeout(typeaheadTimeout);
  }

  const lowerKey = key.toLowerCase();

  // Detect same-character cycling: buffer is "n" and key is "n" → cycle
  const isSameCharRepeated =
    typeaheadBuffer.length > 0 &&
    [...typeaheadBuffer].every((c) => c === lowerKey);

  // Append to buffer
  typeaheadBuffer += lowerKey;

  // Set timeout to clear buffer
  typeaheadTimeout = setTimeout(() => {
    typeaheadBuffer = '';
    lastMatchIndex = -1;
  }, TYPEAHEAD_TIMEOUT_MS);

  let matchIndex = -1;

  if (isSameCharRepeated) {
    // Cycle: find next option starting with this single character
    // Start searching from one past the last match
    const startIndex =
      lastMatchIndex >= 0 ? (lastMatchIndex + 1) % options.length : 0;

    for (let i = 0; i < options.length; i++) {
      const idx = (startIndex + i) % options.length;
      if (options[idx].label.toLowerCase().startsWith(lowerKey)) {
        matchIndex = idx;
        break;
      }
    }
  } else {
    // Multi-character prefix search (e.g., "fl" → "Florida")
    matchIndex = options.findIndex((option) =>
      option.label.toLowerCase().startsWith(typeaheadBuffer),
    );
  }

  if (matchIndex !== -1) {
    lastMatchIndex = matchIndex;
    if (optionRefs) {
      const el = optionRefs.current[matchIndex];
      if (el) {
        el.focus();
        scrollOptionIntoContainer(el);
      }
    }
  }

  return matchIndex;
};

/**
 * Clear typeahead buffer - call when dropdown closes
 */
export const clearTypeahead = () => {
  typeaheadBuffer = '';
  lastMatchIndex = -1;
  if (typeaheadTimeout) {
    clearTimeout(typeaheadTimeout);
    typeaheadTimeout = null;
  }
};

export const handleOptionKeyDown = (
  event: ReactKeyboardEvent<HTMLDivElement>,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  optionRefs: React.RefObject<(HTMLDivElement | null)[]>,
  isOpen: boolean,
) => {
  if (!optionRefs.current) {
    return;
  }

  if (optionRefs.current.length === 0) {
    return;
  }

  switch (event.key) {
    case KEYS.ENTER:
    case KEYS.SPACE:
      event.preventDefault();
      setIsOpen(!isOpen);
      break;

    case KEYS.ARROW_DOWN:
      if (isOpen) {
        event.preventDefault();
        optionRefs.current[0]?.focus();
      }
      break;

    case KEYS.ARROW_UP:
      if (isOpen) {
        event.preventDefault();
        const lastIndex = optionRefs.current.length - 1;
        optionRefs.current[lastIndex]?.focus();
      }
      break;

    case KEYS.ESCAPE:
      if (isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }
      break;
  }
};

/**
 * Handle keyboard navigation on the select combobox.
 * Returns the typeahead match index when a letter is pressed while closed
 * (so the component can open the dropdown and focus after render).
 * Returns -1 otherwise.
 */
export const handleKeyDown = (
  event: ReactKeyboardEvent<HTMLDivElement>,
  optionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
  onChange: (value: string) => void,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  options: { value: string; label: string }[],
  isOpen: boolean,
): number => {
  const currentIndex = optionRefs.current.findIndex(
    (ref) => ref === document.activeElement,
  );

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (!isOpen) {
      setIsOpen(true);
      return -1;
    }

    const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
    optionRefs.current[nextIndex]?.focus();
    return -1;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (!isOpen) {
      setIsOpen(true);
      return -1;
    }

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
    optionRefs.current[prevIndex]?.focus();
    return -1;
  }

  if (event.key === 'Enter' && currentIndex !== -1) {
    event.preventDefault();
    onChange(options[currentIndex].value);
    setIsOpen(false);
    clearTypeahead();
    return -1;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    setIsOpen(false);
    clearTypeahead();
    return -1;
  }

  // Typeahead search: typing letters/numbers jumps to matching option
  if (event.key.length === 1 && event.key.match(/[a-zA-Z0-9]/)) {
    event.preventDefault();

    if (isOpen) {
      // Dropdown is open — focus the match immediately
      handleTypeahead(event.key, options, optionRefs);
    } else {
      // Dropdown is closed — compute match index, open dropdown
      // Pass null for optionRefs since elements don't exist yet
      const matchIndex = handleTypeahead(event.key, options, null);
      setIsOpen(true);
      return matchIndex;
    }
  }

  return -1;
};
