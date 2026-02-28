// @catto/ui - LoadingMessageAndCircleCatto Component
'use client';

import React from 'react';
import LoadingCircleOrangeFancyCatto from './LoadingCircleOrangeFancyCatto';

export interface LoadingMessageAndCircleCattoProps {
  message?: string;
}

const LoadingMessageAndCircleCatto: React.FC<
  LoadingMessageAndCircleCattoProps
> = ({ message = 'Processing your request...' }) => {
  return (
    <div className="relative flex h-40 flex-col items-center bg-theme-surface-secondary p-4 text-theme-secondary">
      <p className="text-lg font-semibold">{message}</p>
      <div className="mt-2">
        <LoadingCircleOrangeFancyCatto />
      </div>
    </div>
  );
};

export default LoadingMessageAndCircleCatto;
