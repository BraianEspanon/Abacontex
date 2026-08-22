import { useState } from 'react';

import type {
  EstadoPedido,
  KanbanPedidos,
  TarjetaPedido,
} from '../../types/pedido.types';

import ColumnaPedidos from './ColumnaPedidos';

interface PedidoArrastrado {
  pedido: TarjetaPedido;
  estadoOrigen: EstadoPedido;
}

interface TableroPedidosProps {
  kanban: KanbanPedidos['kanban'];
  onVerDetalle?: (idPedido: number) => void;
  onCrearOrdenProduccion?: (idPedido: number) => void;
  onMarcarListoParaEntregar?: (idPedido: number) => void;
}

export default function TableroPedidos({
  kanban,
  onVerDetalle,
  onCrearOrdenProduccion,
  onMarcarListoParaEntregar,
}: TableroPedidosProps) {
  const [pedidoArrastrado, setPedidoArrastrado] =
    useState<PedidoArrastrado | null>(null);

  const handleIniciarArrastre = (
    pedido: TarjetaPedido,
    estadoOrigen: EstadoPedido
  ) => {
    setPedidoArrastrado({
      pedido,
      estadoOrigen,
    });
  };

  const handleFinalizarArrastre = () => {
    setPedidoArrastrado(null);
  };

  const esDestinoValido = (estadoDestino: EstadoPedido) => {
    if (!pedidoArrastrado) {
      return false;
    }

    return (
      pedidoArrastrado.estadoOrigen === 'PENDIENTE' &&
      estadoDestino === 'LISTO_PARA_ENTREGAR' &&
      !pedidoArrastrado.pedido.tieneFaltantesStock
    );
  };

  const handleSoltar = (estadoDestino: EstadoPedido) => {
    if (!pedidoArrastrado) {
      return;
    }

    if (!esDestinoValido(estadoDestino)) {
      setPedidoArrastrado(null);
      return;
    }

    onMarcarListoParaEntregar?.(
      pedidoArrastrado.pedido.numeroPedido
    );

    setPedidoArrastrado(null);
  };

  const arrastrando = pedidoArrastrado !== null;

  return (
    <section className="grid min-h-[540px] gap-3 xl:grid-cols-4">
      <ColumnaPedidos
        titulo="Pendientes"
        estado="PENDIENTE"
        pedidos={kanban.PENDIENTE}
        arrastrando={arrastrando}
        esDestinoValido={esDestinoValido('PENDIENTE')}
        onVerDetalle={onVerDetalle}
        onCrearOrdenProduccion={onCrearOrdenProduccion}
        onMarcarListoParaEntregar={onMarcarListoParaEntregar}
        onIniciarArrastre={handleIniciarArrastre}
        onFinalizarArrastre={handleFinalizarArrastre}
        onSoltar={handleSoltar}
      />

      <ColumnaPedidos
        titulo="En producción"
        estado="EN_PRODUCCION"
        pedidos={kanban.EN_PRODUCCION}
        arrastrando={arrastrando}
        esDestinoValido={esDestinoValido('EN_PRODUCCION')}
        onVerDetalle={onVerDetalle}
        onCrearOrdenProduccion={onCrearOrdenProduccion}
        onMarcarListoParaEntregar={onMarcarListoParaEntregar}
        onIniciarArrastre={handleIniciarArrastre}
        onFinalizarArrastre={handleFinalizarArrastre}
        onSoltar={handleSoltar}
      />

      <ColumnaPedidos
        titulo="Listos para entregar"
        estado="LISTO_PARA_ENTREGAR"
        pedidos={kanban.LISTO_PARA_ENTREGAR}
        arrastrando={arrastrando}
        esDestinoValido={esDestinoValido('LISTO_PARA_ENTREGAR')}
        onVerDetalle={onVerDetalle}
        onCrearOrdenProduccion={onCrearOrdenProduccion}
        onMarcarListoParaEntregar={onMarcarListoParaEntregar}
        onIniciarArrastre={handleIniciarArrastre}
        onFinalizarArrastre={handleFinalizarArrastre}
        onSoltar={handleSoltar}
      />

      <ColumnaPedidos
        titulo="Completados"
        estado="COMPLETADO"
        pedidos={kanban.COMPLETADO}
        arrastrando={arrastrando}
        esDestinoValido={esDestinoValido('COMPLETADO')}
        onVerDetalle={onVerDetalle}
        onCrearOrdenProduccion={onCrearOrdenProduccion}
        onMarcarListoParaEntregar={onMarcarListoParaEntregar}
        onIniciarArrastre={handleIniciarArrastre}
        onFinalizarArrastre={handleFinalizarArrastre}
        onSoltar={handleSoltar}
      />
    </section>
  );
}