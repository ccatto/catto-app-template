/**
 * useNetworkStatus - Network connectivity hook for iOS/Android
 *
 * Monitors network connectivity and provides status updates.
 * Uses Capacitor Network plugin on native, falls back to navigator.onLine on web.
 *
 * Usage:
 *   const { isConnected, connectionType } = useNetworkStatus();
 *
 *   if (!isConnected) {
 *     // Show offline UI
 *   }
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { ConnectionStatus, ConnectionType, Network } from '@capacitor/network';
import { getLogger } from '../logger';

export interface NetworkState {
  /** Whether the device has network connectivity */
  isConnected: boolean;
  /** The type of network connection (wifi, cellular, none, unknown) */
  connectionType: ConnectionType;
  /** Whether we're currently checking the connection */
  isChecking: boolean;
}

export interface UseNetworkStatusReturn extends NetworkState {
  /** Manually check the current network status */
  checkStatus: () => Promise<ConnectionStatus>;
}

export function useNetworkStatus(): UseNetworkStatusReturn {
  const [state, setState] = useState<NetworkState>({
    isConnected: true,
    connectionType: 'unknown',
    isChecking: true,
  });

  const isNative = Capacitor.isNativePlatform();
  const listenerRegistered = useRef(false);

  const checkStatus = useCallback(async (): Promise<ConnectionStatus> => {
    if (!isNative) {
      const connected =
        typeof navigator !== 'undefined' ? navigator.onLine : true;
      const status: ConnectionStatus = {
        connected,
        connectionType: connected ? 'wifi' : 'none',
      };
      setState({
        isConnected: connected,
        connectionType: status.connectionType,
        isChecking: false,
      });
      return status;
    }

    try {
      const status = await Network.getStatus();
      setState({
        isConnected: status.connected,
        connectionType: status.connectionType,
        isChecking: false,
      });
      return status;
    } catch (error) {
      getLogger().error('[NetworkStatus] Error checking status:', {
        error: error instanceof Error ? error.message : String(error),
      });
      const fallbackStatus: ConnectionStatus = {
        connected: true,
        connectionType: 'unknown',
      };
      setState({
        isConnected: true,
        connectionType: 'unknown',
        isChecking: false,
      });
      return fallbackStatus;
    }
  }, [isNative]);

  useEffect(() => {
    checkStatus();

    if (!isNative) {
      const handleOnline = () => {
        getLogger().info('[NetworkStatus] Device came online (web)');
        setState((prev) => ({
          ...prev,
          isConnected: true,
          connectionType: 'wifi',
        }));
      };

      const handleOffline = () => {
        getLogger().info('[NetworkStatus] Device went offline (web)');
        setState((prev) => ({
          ...prev,
          isConnected: false,
          connectionType: 'none',
        }));
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    if (listenerRegistered.current) return;
    listenerRegistered.current = true;

    const networkListener = Network.addListener(
      'networkStatusChange',
      (status) => {
        getLogger().info('[NetworkStatus] Network status changed:', {
          connected: status.connected,
          type: status.connectionType,
        });
        setState({
          isConnected: status.connected,
          connectionType: status.connectionType,
          isChecking: false,
        });
      },
    );

    return () => {
      networkListener.then((listener) => listener.remove());
    };
  }, [isNative, checkStatus]);

  return {
    ...state,
    checkStatus,
  };
}

export default useNetworkStatus;
