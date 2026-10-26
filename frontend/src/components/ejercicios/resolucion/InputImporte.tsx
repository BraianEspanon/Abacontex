import { useState } from 'react';

interface InputImporteProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

function formatearImporte(valor: number): string {
  if (!valor) {
    return '';
  }

  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

function convertirImporte(valor: string): number {
  if (!valor.trim()) {
    return 0;
  }

  const normalizado = valor.replace(/\./g, '').replace(',', '.');

  const numero = Number(normalizado);

  return Number.isFinite(numero) ? numero : 0;
}

function sanitizarImporte(valor: string): string {
  const limpio = valor.replace(/[^0-9.,]/g, '');

  const sinPuntos = limpio.replace(/\./g, '');
  const [parteEntera = '', ...partesDecimales] = sinPuntos.split(',');

  const parteDecimal = partesDecimales.join('').slice(0, 2);

  const enteroFormateado = parteEntera
    ? new Intl.NumberFormat('es-AR', {
        maximumFractionDigits: 0,
      }).format(Number(parteEntera))
    : '';

  if (limpio.includes(',')) {
    return `${enteroFormateado},${parteDecimal}`;
  }

  return enteroFormateado;
}

export default function InputImporte({
  value,
  onChange,
  placeholder = '-',
  disabled = false,
  className = '',
  ariaLabel,
}: InputImporteProps) {
  const [enFoco, setEnFoco] = useState(false);
  const [textoEdicion, setTextoEdicion] = useState('');

  const valorMostrado = enFoco ? textoEdicion : value === 0 ? '' : formatearImporte(value);

  return (
    <input
      type="text"
      inputMode="decimal"
      disabled={disabled}
      value={valorMostrado}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onFocus={() => {
        setEnFoco(true);

        setTextoEdicion(
          value === 0
            ? ''
            : new Intl.NumberFormat('es-AR', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }).format(value)
        );
      }}
      onChange={(event) => {
        const nuevoTexto = sanitizarImporte(event.target.value);

        setTextoEdicion(nuevoTexto);
        onChange(convertirImporte(nuevoTexto));
      }}
      onBlur={() => {
        setEnFoco(false);
      }}
      onKeyDown={(event) => {
        if (event.key === '-' || event.key === '+' || event.key === 'e' || event.key === 'E') {
          event.preventDefault();
        }
      }}
      className={className}
    />
  );
}
