import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { CuentaContableEjercicio } from '../../../types/ejercicio.types';

interface SelectorCuentaContableProps {
  cuentas: CuentaContableEjercicio[];
  value?: number | null;
  onSelect: (idCuenta: number) => void;
  placeholder?: string;
  disabled?: boolean;
  compacto?: boolean;
}

function normalizarTexto(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export default function SelectorCuentaContable({
  cuentas,
  value = null,
  onSelect,
  placeholder = 'Buscar cuenta...',
  disabled = false,
  compacto = false,
}: SelectorCuentaContableProps) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const cuentaSeleccionada = cuentas.find((cuenta) => cuenta.idCuenta === value);

  const cuentasFiltradas = useMemo(() => {
    const termino = normalizarTexto(busqueda);

    if (!termino) {
      return cuentas;
    }

    return cuentas.filter((cuenta) => {
      const codigo = normalizarTexto(cuenta.codigo);
      const nombre = normalizarTexto(cuenta.nombre);

      return codigo.includes(termino) || nombre.includes(termino);
    });
  }, [busqueda, cuentas]);

  const textoSeleccionado = cuentaSeleccionada
    ? `${cuentaSeleccionada.codigo} - ${cuentaSeleccionada.nombre}`
    : '';

  const seleccionarCuenta = (idCuenta: number) => {
    onSelect(idCuenta);
    setBusqueda('');
    setAbierto(false);
  };

  return (
    <div className="relative min-w-0 w-full">
      <div className="relative">
        <input
          type="text"
          value={abierto ? busqueda : textoSeleccionado}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={() => {
            setBusqueda('');
            setAbierto(true);
          }}
          onChange={(event) => {
            const valor = event.target.value;

            const valorValido = valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9.\-\s]/g, '').slice(0, 20);

            setBusqueda(valorValido);
            setAbierto(true);
          }}
          maxLength={20}
          onBlur={() => setAbierto(false)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && cuentasFiltradas[0]) {
              event.preventDefault();

              seleccionarCuenta(cuentasFiltradas[0].idCuenta);
            }

            if (event.key === 'Escape') {
              setAbierto(false);
            }
          }}
          className={[
            'w-full rounded-md border border-gray-300 bg-white pr-8 text-gray-700 outline-none transition',
            'focus:border-abacontex-primary-three focus:ring-1 focus:ring-abacontex-primary-three',
            'disabled:cursor-not-allowed disabled:bg-gray-100',
            compacto ? 'h-7 px-2 text-[10px]' : 'h-8 px-2 text-[11px]',
          ].join(' ')}
        />

        <Search
          className={[
            'pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400',
            compacto ? 'size-3' : 'size-3.5',
          ].join(' ')}
        />
      </div>

      {abierto && !disabled && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-52 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
          {cuentasFiltradas.length > 0 ? (
            cuentasFiltradas.map((cuenta) => (
              <button
                key={cuenta.idCuenta}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  seleccionarCuenta(cuenta.idCuenta);
                }}
                className="flex w-full cursor-pointer items-center rounded-md px-2.5 py-2 text-left transition hover:bg-abacontex-light"
              >
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium text-abacontex-dark">
                    {cuenta.nombre}
                  </span>

                  <span className="block text-[10px] text-abacontex-gray-text">
                    {cuenta.codigo}
                  </span>
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-3 text-center text-xs text-abacontex-gray-text">
              No se encontraron cuentas.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
