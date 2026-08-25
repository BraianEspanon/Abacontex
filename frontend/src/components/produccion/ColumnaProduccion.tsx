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
        'flex min-w-0 flex-col rounded-xl p-3 transition',
        'min-h-[390px]',
        arrastrando && esDestinoValido ? 'bg-green-50 ring-2 ring-[#496647]/30' : 'bg-[#f1f1ef]',
      ].join(' ')}
    >
      {/* Encabezado */}
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-sm font-semibold text-gray-900">{titulo}</h2>

        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-[11px] font-semibold text-gray-600 shadow-sm">
          {ordenes.length}
        </span>
      </div>

      {/* Zona válida de drop */}
      {arrastrando && esDestinoValido && (
        <div className="mb-3 rounded-lg border border-dashed border-[#6f9468] bg-white px-3 py-2.5 text-center text-xs font-medium text-[#496647]">
          Soltá la orden aquí
        </div>
      )}

      {/* Contenido */}
      <div className="flex-1 space-y-2.5">
        {ordenes.length === 0 ? (
          <div className="flex min-h-[90px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white/70 px-4 text-center">
            <p className="text-xs text-gray-500">No hay órdenes en este estado.</p>
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
