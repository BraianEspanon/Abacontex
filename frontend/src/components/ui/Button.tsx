// src/components/ui/Button.tsx
import type { ButtonProps } from '../../types/ui.types';

export default function Button({
  label,
  variant = 'solid',
  className = '',
  icon,
  ...props
}: ButtonProps) {
  // Clases base que tienen TODOS los botones de la landing
  const baseClasses =
    'group inline-flex items-center justify-center font-medium transition-colors duration-300 cursor-pointer';

  // Lógica para elegir el color según la variante que nos pidan
  let variantClasses = '';

  switch (variant) {
    case 'solid':
      // Fondo verde principal, hover oscuro, texto blanco
      variantClasses =
        'bg-abacontex-primary hover:bg-abacontex-primary-two text-white rounded-lg px-6 py-3';
      break;
    case 'outline':
      // Fondo transparente, borde oscuro
      variantClasses =
        'bg-transparent border border-abacontex-dark text-abacontex-dark hover:bg-abacontex-primary-two/20 rounded-lg px-6 py-3';
      break;
    case 'pill':
      // Botoncitos redondeados grises (las etiquetas de características)
      variantClasses =
        'bg-abacontex-gray/30 border border-abacontex-gray text-gray-700 hover:bg-abacontex-primary/10 hover:border-abacontex-primary hover:text-abacontex-primary rounded-full px-4 py-3 text-md shadow-sm';
      break;
  }

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {label}

      {icon && <span className="flex items-center">{icon}</span>}
    </button>
  );
}
