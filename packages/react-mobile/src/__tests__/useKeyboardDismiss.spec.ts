import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { renderHook } from '@testing-library/react';
import {
  hideKeyboard,
  showKeyboard,
  useKeyboardDismiss,
} from '../hooks/useKeyboardDismiss';

describe('useKeyboardDismiss', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not configure keyboard on web', () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);

    renderHook(() => useKeyboardDismiss());

    expect(Keyboard.setResizeMode).not.toHaveBeenCalled();
    expect(Keyboard.setScroll).not.toHaveBeenCalled();
  });

  it('should configure keyboard on native', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);

    renderHook(() => useKeyboardDismiss());

    // Wait for async configure
    await vi.waitFor(() => {
      expect(Keyboard.setResizeMode).toHaveBeenCalledWith({ mode: 'body' });
    });
    expect(Keyboard.setScroll).toHaveBeenCalledWith({ isDisabled: false });
  });

  it('should register keyboard listeners on native', () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);

    renderHook(() => useKeyboardDismiss());

    expect(Keyboard.addListener).toHaveBeenCalledWith(
      'keyboardWillShow',
      expect.any(Function),
    );
    expect(Keyboard.addListener).toHaveBeenCalledWith(
      'keyboardWillHide',
      expect.any(Function),
    );
  });
});

describe('hideKeyboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not call Keyboard.hide on web', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
    await hideKeyboard();
    expect(Keyboard.hide).not.toHaveBeenCalled();
  });

  it('should call Keyboard.hide on native', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
    await hideKeyboard();
    expect(Keyboard.hide).toHaveBeenCalled();
  });
});

describe('showKeyboard', () => {
  it('should not call Keyboard.show on web', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
    await showKeyboard();
    expect(Keyboard.show).not.toHaveBeenCalled();
  });
});
