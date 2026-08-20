import type { EstadoPedido, TarjetaPedido as TarjetaPedidoType } from '../../types/pedido.types';

import TarjetaPedido from './TarjetaPedido';

interface ColumnaPedidosProps {
  titulo: string;
  estado: EstadoPedido;
  pedidos: TarjetaPedidoType[];

  esDestinoValido?: boolean;
  arrastrando?: boolean;

  onVerDetalle?: (idPedido: number) => void;
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
        'min-w-0 rounded-2xl p-4 transition',
        arrastrando && esDestinoValido ? 'bg-green-50 ring-2 ring-[#496647]/40' : 'bg-gray-50',
      ].join(' ')}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">{titulo}</h2>

        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-600 shadow-sm">
          {pedidos.length}
        </span>
      </div>

      {arrastrando && esDestinoValido && (
        <div className="mb-4 rounded-xl border border-dashed border-[#496647] bg-white px-4 py-3 text-center text-xs font-medium text-[#496647]">
          Soltá el pedido aquí
        </div>
      )}

      <div className="space-y-4">
        {pedidos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
            No hay pedidos en este estado.
          </div>
        ) : (
          pedidos.map((pedido) => (
            <TarjetaPedido
              key={pedido.numeroPedido}
              pedido={pedido}
              estado={estado}
              onVerDetalle={onVerDetalle}
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
