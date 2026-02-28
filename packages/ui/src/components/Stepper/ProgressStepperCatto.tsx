'use client';

import { cn } from '../../utils';

export interface StepConfig {
  /** Whether this step is completed */
  completed?: boolean;
  /** Icon to display (defaults to checkmark for completed, number for others) */
  icon?: React.ReactNode;
}

export interface ProgressStepperCattoProps {
  /** Array of step configurations */
  steps?: StepConfig[];
  /** Current active step (0-indexed) */
  currentStep?: number;
  /** Total number of steps (used if steps array not provided) */
  totalSteps?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Progress stepper with visual indicators for multi-step workflows
 */
const ProgressStepperCatto: React.FC<ProgressStepperCattoProps> = ({
  steps,
  currentStep = 0,
  totalSteps = 3,
  className,
}) => {
  const stepCount = steps?.length ?? totalSteps;

  const renderStep = (index: number, isLast: boolean) => {
    const step = steps?.[index];
    const isCompleted = step?.completed ?? index < currentStep;
    const isCurrent = index === currentStep;

    return (
      <li
        key={index}
        className={cn(
          'flex items-center',
          !isLast && 'w-full',
          !isLast &&
            "after:inline-block after:h-1 after:w-full after:border-4 after:border-b after:content-['']",
          isCompleted
            ? 'text-blue-600 dark:text-blue-500 after:border-blue-100 dark:after:border-blue-800'
            : 'after:border-gray-100 dark:after:border-gray-700',
        )}
      >
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full lg:h-12 lg:w-12',
            isCompleted
              ? 'bg-blue-100 dark:bg-blue-800'
              : 'bg-gray-100 dark:bg-gray-700',
          )}
        >
          {step?.icon ??
            (isCompleted ? (
              <svg
                className="h-3.5 w-3.5 text-blue-600 lg:h-4 lg:w-4 dark:text-blue-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 12"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5.917 5.724 10.5 15 1.5"
                />
              </svg>
            ) : (
              <span
                className={cn(
                  'text-sm font-medium lg:text-base',
                  isCurrent
                    ? 'text-blue-600 dark:text-blue-300'
                    : 'text-gray-500 dark:text-gray-100',
                )}
              >
                {index + 1}
              </span>
            ))}
        </span>
      </li>
    );
  };

  return (
    <ol className={cn('flex w-full items-center', className)}>
      {Array.from({ length: stepCount }).map((_, index) =>
        renderStep(index, index === stepCount - 1),
      )}
    </ol>
  );
};

export default ProgressStepperCatto;
