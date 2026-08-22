import { ChevronRight, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import PedidoRegistradoModal from '../../components/pedido/PedidoRegistradoModal';
import RegistrarPedidoForm from '../../components/pedido/RegistrarPedidoForm';

import { useCrearPedido } from '../../hooks/useCrearPedido';

import type { CrearPedidoRequest, PedidoCreado } from '../../types/pedido.types';

export default function RegistrarPedidoPage() {
  const navigate = useNavigate();

  const [pedidoCreado, setPedidoCreado] = useState<PedidoCreado | null>(null);

  const crearPedidoMutation = useCrearPedido();

  const handleRegistrar = (payload: CrearPedidoRequest) => {
    crearPedidoMutation.mutate(payload, {
      onSuccess: (pedido) => {
        setPedidoCreado(pedido);
      },
    });
  };

  const handleIrAlTablero = () => {
    navigate('/alumno/pedidos');
  };

  const handleCerrarModal = () => {
    navigate('/alumno/pedidos');
  };

  const handleCrearOrdenProduccion = (idPedido: number) => {
    navigate(`/alumno/produccion/crear?pedidoId=${idPedido}`);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
            <Home className="h-4 w-4" />
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link to="/alumno/pedidos" className="transition hover:text-gray-700">
            Pedidos
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-700">Registrar pedido</span>
        </nav>

        {/* Encabezado */}
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Registrar pedido</h1>

          <p className="mt-1 text-sm text-gray-500">
            Completá los datos del cliente y agregá los productos del pedido.
          </p>
        </header>

        {/* Error general */}
        {crearPedidoMutation.isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="font-medium text-red-800">No fue posible registrar el pedido.</p>

            <p className="mt-1 text-sm text-red-700">Revisá los datos e intentá nuevamente.</p>
          </div>
        )}

        <RegistrarPedidoForm
          enviando={crearPedidoMutation.isPending}
          onCancelar={() => navigate('/alumno/pedidos')}
          onRegistrar={handleRegistrar}
        />
      </div>

      <PedidoRegistradoModal
        abierto={pedidoCreado !== null}
        pedido={pedidoCreado}
        onIrAlTablero={handleIrAlTablero}
        onCerrar={handleCerrarModal}
        onCrearOrdenProduccion={handleCrearOrdenProduccion}
      />
    </>
  );
}
