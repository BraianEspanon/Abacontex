import type { EstadoOrdenProduccion, OrdenProduccionTarjeta } from '../../types/produccion.types';

import TarjetaOrdenProduccion from './TarjetaOrdenProduccion';

interface ColumnaProduccionProps {
  titulo: string;
  estado: EstadoOrdenProduccion;
  ordenes: OrdenProduccionTarjeta[];

  arrastrando?: boolean;
  esDestinoValido?: boolean;

  onVerDetalle: (idOrden: number) => void;
  onIniciar: (idOrden: number) => void;
  onFinalizar: (idOrden: number) => void;

  onIniciarArrastre?: (orden: OrdenProduccionTarjeta, estado: EstadoOrdenProduccion) => void;

  onFinalizarArrastre?: () => void;

  onSoltar?: (estadoDestino: EstadoOrdenProduccion) => void;
}

export default function ColumnaProduccion({
  titulo,
  estado,
  ordenes,
  arrastrando = false,
  esDestinoValido = false,
  onVerDetalle,
  onIniciar,
  onFinalizar,
  onIniciarArrastre,
  onFinalizarArrastre,
  onSoltar,
}: ColumnaProduccionProps) {
  return (
    <section
      onDragOver={(event) => {
        if (!esDestinoValido) {
          return;
        }

        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      }}
      onDrop={(event) => {
        event.preventDefault();

        if (!esDestinoValido) {
          return;
        }

        onSoltar?.(estado);
      }}
      className={[
        'min-w-0 rounded-2xl p-4 transition',
        arrastrando && esDestinoValido ? 'bg-green-50 ring-2 ring-[#496647]/40' : 'bg-gray-100',
      ].join(' ')}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">{titulo}</h2>

        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-600 shadow-sm">
          {ordenes.length}
        </span>
      </div>

      {arrastrando && esDestinoValido && (
        <div className="mb-4 rounded-xl border border-dashed border-[#496647] bg-white px-4 py-3 text-center text-xs font-medium text-[#496647]">
          Soltá la orden aquí
        </div>
      )}

      <div className="space-y-4">
        {ordenes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
            No hay órdenes en este estado.
          </div>
        ) : (
          ordenes.map((orden) => (
            <TarjetaOrdenProduccion
              key={orden.idOrden}
              orden={orden}
              estado={estado}
              onVerDetalle={onVerDetalle}
              onIniciar={onIniciar}
              onFinalizar={onFinalizar}
              onIniciarArrastre={onIniciarArrastre}
              onFinalizarArrastre={onFinalizarArrastre}
            />
          ))
        )}
      </div>
    </section>
  );
}
