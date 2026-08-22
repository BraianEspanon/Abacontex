import type { EstadoPedido, TarjetaPedido as TarjetaPedidoType } from '../../types/pedido.types';

import TarjetaPedido from './TarjetaPedido';

interface ColumnaPedidosProps {
  titulo: string;
  estado: EstadoPedido;
  pedidos: TarjetaPedidoType[];

  esDestinoValido?: boolean;
  arrastrando?: boolean;

  onVerDetalle?: (idPedido: number) => void;
  onCrearOrdenProduccion?: (idPedido: number) => void;
  onMarcarListoParaEntregar?: (idPedido: number) => void;

  onIniciarArrastre?: (pedido: TarjetaPedidoType, estado: EstadoPedido) => void;

  onFinalizarArrastre?: () => void;

  onSoltar?: (estadoDestino: EstadoPedido) => void;
}

export default function ColumnaPedidos({
  titulo,
  estado,
  pedidos,
  esDestinoValido = false,
  arrastrando = false,
  onVerDetalle,
  onCrearOrdenProduccion,
  onMarcarListoParaEntregar,
  onIniciarArrastre,
  onFinalizarArrastre,
  onSoltar,
}: ColumnaPedidosProps) {
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
        'min-w-0 rounded-xl bg-[#f0efed] p-3 transition',
        'min-h-[540px]',
        arrastrando && esDestinoValido ? 'ring-2 ring-[#496647]/40' : '',
      ].join(' ')}
    >
      {/* Encabezado */}
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-base font-semibold text-gray-900">{titulo}</h2>

        <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-600 shadow-sm">
          {pedidos.length}
        </span>
      </div>

      {arrastrando && esDestinoValido && (
        <div className="mb-3 rounded-lg border border-dashed border-[#496647] bg-white px-3 py-3 text-center text-xs font-medium text-[#496647]">
          Soltá el pedido aquí
        </div>
      )}

      <div className="space-y-3">
        {pedidos.length === 0 ? (
          <div className="flex min-h-28 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white/40 px-4 text-center text-sm text-gray-500">
            No hay pedidos en este estado.
          </div>
        ) : (
          pedidos.map((pedido) => (
            <TarjetaPedido
              key={pedido.numeroPedido}
              pedido={pedido}
              estado={estado}
              onVerDetalle={onVerDetalle}
              onCrearOrdenProduccion={onCrearOrdenProduccion}
              onMarcarListoParaEntregar={onMarcarListoParaEntregar}
              onIniciarArrastre={onIniciarArrastre}
              onFinalizarArrastre={onFinalizarArrastre}
            />
          ))
        )}
      </div>
    </section>
  );
}
