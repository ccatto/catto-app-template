/**
 * useQRScanner - Dual-layer QR code scanner hook
 *
 * Uses @capacitor-mlkit/barcode-scanning on native iOS/Android for optimal
 * performance, and falls back to web camera API on desktop browsers.
 *
 * Usage:
 *   const { isNative, scanNative, error } = useQRScanner({ onScan });
 *
 *   // Native: call scanNative() to open native camera overlay
 *   // Web: render a camera-based scanner component
 */
import { useCallback, useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { getLogger } from '../logger';

export interface UseQRScannerOptions {
  /** Called when a QR code is successfully scanned */
  onScan: (code: string) => void;
}

export interface UseQRScannerReturn {
  /** Whether running on a native Capacitor platform */
  isNative: boolean;
  /** Whether the camera is currently active (web only) */
  isScanning: boolean;
  /** Start web camera scanning */
  startScanning: () => void;
  /** Stop web camera scanning */
  stopScanning: () => void;
  /** Trigger native scan overlay (native only) */
  scanNative: () => Promise<void>;
  /** Current error message */
  error: string | null;
  /** Camera permission state: null = not checked, true = granted, false = denied */
  hasPermission: boolean | null;
  /** Request camera permission */
  requestPermission: () => Promise<boolean>;
}

export function useQRScanner({
  onScan,
}: UseQRScannerOptions): UseQRScannerReturn {
  const isNative = Capacitor.isNativePlatform();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isNative) return;

    const checkPermission = async () => {
      try {
        const { BarcodeScanner } =
          await import('@capacitor-mlkit/barcode-scanning');
        const result = await BarcodeScanner.checkPermissions();
        setHasPermission(result.camera === 'granted');
      } catch (err) {
        getLogger().error('[QRScanner] Failed to check native permissions:', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    };

    checkPermission();
  }, [isNative]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setError(null);

    if (isNative) {
      try {
        const { BarcodeScanner } =
          await import('@capacitor-mlkit/barcode-scanning');
        const result = await BarcodeScanner.requestPermissions();
        const granted = result.camera === 'granted';
        setHasPermission(granted);
        if (!granted) {
          setError('cameraPermissionDenied');
        }
        return granted;
      } catch (err) {
        getLogger().error('[QRScanner] Native permission request failed:', {
          error: err instanceof Error ? err.message : String(err),
        });
        setError('cameraPermissionDenied');
        setHasPermission(false);
        return false;
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
      return true;
    } catch (err) {
      getLogger().error('[QRScanner] Web camera permission denied:', {
        error: err instanceof Error ? err.message : String(err),
      });
      setError('cameraPermissionDenied');
      setHasPermission(false);
      return false;
    }
  }, [isNative]);

  const startScanning = useCallback(() => {
    setError(null);
    setIsScanning(true);
  }, []);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
  }, []);

  const scanNative = useCallback(async () => {
    if (!isNative) return;

    setError(null);
    try {
      const { BarcodeScanner, BarcodeFormat } =
        await import('@capacitor-mlkit/barcode-scanning');

      const permResult = await BarcodeScanner.checkPermissions();
      if (permResult.camera !== 'granted') {
        const reqResult = await BarcodeScanner.requestPermissions();
        if (reqResult.camera !== 'granted') {
          setError('cameraPermissionDenied');
          setHasPermission(false);
          return;
        }
        setHasPermission(true);
      }

      const result = await BarcodeScanner.scan({
        formats: [BarcodeFormat.QrCode],
      });

      if (result.barcodes.length > 0) {
        const code =
          result.barcodes[0].rawValue || result.barcodes[0].displayValue;
        if (code) {
          getLogger().info('[QRScanner] Native scan success:', {
            format: result.barcodes[0].format,
          });
          onScan(code);
        }
      }
    } catch (err) {
      getLogger().info('[QRScanner] Native scan cancelled or failed:', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }, [isNative, onScan]);

  return {
    isNative,
    isScanning,
    startScanning,
    stopScanning,
    scanNative,
    error,
    hasPermission,
    requestPermission,
  };
}

export default useQRScanner;
