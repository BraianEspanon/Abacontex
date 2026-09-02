import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, X } from 'lucide-react';

import type { FacturaDetalle } from '../../types/facturacion.types';

import FacturaDocumento from './FacturaDocumento';

interface FacturaModalProps {
  abierto: boolean;
  factura: FacturaDetalle | null;
  onCerrar: () => void;
}

export default function FacturaModal({ abierto, factura, onCerrar }: FacturaModalProps) {
  useEffect(() => {
    if (!abierto) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCerrar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [abierto, onCerrar]);

  if (!abierto || !factura) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="factura-generada-titulo"
    >
      <div
        className="flex min-h-full items-center justify-center p-4 sm:p-6"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onCerrar();
          }
        }}
      >
        <div className="w-full max-w-4xl">
          {/* Confirmación */}
          <div className="mb-3 flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="size-5 text-green-700" />
              </div>

              <div>
                <p id="factura-generada-titulo" className="font-medium text-abacontex-black-text">
                  Factura emitida correctamente
                </p>

                <p className="text-xs text-abacontex-gray-text">
                  El comprobante quedó registrado y asociado a la venta.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onCerrar}
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-abacontex-gray-text transition hover:bg-gray-100 hover:text-abacontex-black-text"
              aria-label="Cerrar factura"
            >
              <X className="size-5" />
            </button>
          </div>

          <FacturaDocumento factura={factura} />

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={onCerrar}
              className="cursor-pointer rounded-lg bg-white px-6 py-2 text-sm font-medium text-abacontex-black-text shadow-lg transition hover:bg-gray-100"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
