// src/components/ui/Button.tsx
import type { ButtonProps } from '../../types/ui.types';

export default function Button({
  label,
  variant = 'solid',
  className = '',
  icon,
  disabled,
  ...props
}: ButtonProps) {
  const esPill = variant === 'pill';

  const baseClasses = [
    'group inline-flex items-center justify-center gap-2',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-abacontex-primary-three',
    'focus-visible:ring-offset-2',
    esPill
      ? 'cursor-default'
      : disabled
        ? 'cursor-not-allowed opacity-50'
        : 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0',
  ].join(' ');

  let variantClasses = '';

  switch (variant) {
    case 'solid':
      variantClasses = [
        'rounded-xl px-6 py-3 font-semibold',
        'bg-abacontex-primary-three',
        'text-white',
        'hover:bg-abacontex-primary-two',
      ].join(' ');
      break;

    case 'outline':
      variantClasses = [
        'rounded-xl px-6 py-3 font-semibold',
        'border border-abacontex-primary-three',
        'bg-transparent',
        'text-abacontex-primary',
        'hover:bg-abacontex-primary-three/10',
      ].join(' ');
      break;

    case 'pill':
      variantClasses = [
        'rounded-full',
        'border border-abacontex-gray',
        'bg-abacontex-gray/30',
        'px-4 py-2',
        'text-sm font-medium',
        'text-gray-700',
        'shadow-sm',
        'hover:border-abacontex-primary',
        'hover:bg-abacontex-primary/10',
        'hover:text-abacontex-primary',
        'hover:translate-y-0',
        'hover:shadow-sm',
      ].join(' ');
      break;
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      <span>{label}</span>

      {icon && (
        <span className="flex items-center transition-transform duration-200 group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </button>
  );
}
