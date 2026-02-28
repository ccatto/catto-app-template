// @catto/ui - ToastCatto Component
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';

type ToastVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'midnightEmber';
type ToastSize = 'sm' | 'md' | 'lg';
type ToastAnimation = 'slide' | 'fade' | 'bounce' | 'none';
type ToastPlacement =
  | 'lowerLeft'
  | 'lowerRight'
  | 'upperLeft'
  | 'upperRight'
  | 'center';

export interface ToastCattoProps {
  header?: string;
  body: string | React.ReactNode;
  variant?: ToastVariant;
  size?: ToastSize;
  animation?: ToastAnimation;
  duration?: number;
  placement?: ToastPlacement;
  onClose?: () => void;
}

const variantStyles: Record<ToastVariant, string> = {
  primary: 'bg-theme-primary text-theme-on-primary',
  success: 'bg-green-500 text-gray-900',
  warning: 'bg-yellow-500 text-slate-900',
  error: 'bg-red-500 text-slate-50',
  info: 'bg-cyan-500 text-slate-50',
  midnightEmber: 'bg-[#1a2743] text-[#ff6b35]',
};

const sizeStyles: Record<ToastSize, string> = {
  sm: 'text-sm py-2 px-3 min-w-[250px]',
  md: 'text-base py-3 px-4 min-w-[300px]',
  lg: 'text-lg py-4 px-5 min-w-[350px]',
};

const animationStyles: Record<ToastAnimation, string> = {
  slide: 'animate-slideIn',
  fade: 'animate-fadeIn',
  bounce: 'animate-bounceIn',
  none: '',
};

const placementStyles: Record<ToastPlacement, string> = {
  lowerLeft: 'bottom-20 left-4',
  lowerRight: 'bottom-20 right-4',
  upperLeft: 'top-4 left-4',
  upperRight: 'top-4 right-4',
  center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
};

const ToastCatto: React.FC<ToastCattoProps> = ({
  header,
  body,
  variant = 'primary',
  size = 'md',
  animation = 'slide',
  duration = 3000,
  placement = 'upperRight',
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingProgress = 100 - (elapsedTime / duration) * 100;

      setProgress(Math.max(remainingProgress, 0));

      if (elapsedTime >= duration) {
        clearInterval(progressInterval);
        handleClose();
      }
    }, 10);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(progressInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [duration, handleClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed z-50 rounded-lg shadow-lg ${variantStyles[variant]} ${sizeStyles[size]} ${animationStyles[animation]} ${placementStyles[placement]} dark:bg-opacity-90 overflow-hidden`}
      role="alert"
      aria-live="assertive"
    >
      <div className="relative pr-7">
        {header && <div className="mb-1 font-bold">{header}</div>}
        <button
          onClick={handleClose}
          className="hover:bg-opacity-20 absolute top-0 right-0 rounded-full p-1"
          aria-label="Close toast"
        >
          <X size={16} />
        </button>
        <div className="relative">
          <div className="pb-3">{body}</div>
          <div
            className="absolute bottom-0 left-0 h-1 bg-gray-900/30"
            style={{
              width: `${progress}%`,
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ToastCatto;
