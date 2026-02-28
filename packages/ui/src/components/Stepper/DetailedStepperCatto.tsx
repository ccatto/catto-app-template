'use client';

import { cn } from '../../utils';

export interface DetailedStep {
  /** Step title */
  title: string;
  /** Step description/details */
  description?: string;
  /** Whether this step is completed */
  completed?: boolean;
}

export interface DetailedStepperCattoProps {
  /** Array of step configurations */
  steps: DetailedStep[];
  /** Current active step (0-indexed) */
  currentStep?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Detailed stepper with titles and descriptions for each step
 */
const DetailedStepperCatto: React.FC<DetailedStepperCattoProps> = ({
  steps,
  currentStep = 0,
  className,
}) => {
  return (
    <ol
      className={cn(
        'w-full items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-8 rtl:space-x-reverse',
        className,
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = step.completed ?? index < currentStep;
        const isCurrent = index === currentStep;
        const isActive = isCompleted || isCurrent;

        return (
          <li
            key={index}
            className={cn(
              'flex items-center space-x-2.5 rtl:space-x-reverse',
              isActive
                ? 'text-blue-600 dark:text-blue-500'
                : 'text-gray-500 dark:text-gray-400',
            )}
          >
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                isActive
                  ? 'border-blue-600 dark:border-blue-500'
                  : 'border-gray-500 dark:border-gray-400',
              )}
            >
              {index + 1}
            </span>
            <span>
              <h3 className="leading-tight font-medium">{step.title}</h3>
              {step.description && (
                <p className="text-sm">{step.description}</p>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default DetailedStepperCatto;
