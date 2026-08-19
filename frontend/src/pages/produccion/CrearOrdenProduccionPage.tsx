import { ChevronRight, Home } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import CrearOrdenProduccionForm from '../../components/produccion/CrearOrdenProduccionForm';

import { useCrearOrdenProduccion } from '../../hooks/useCrearOrdenProduccion';

import type { CrearOrdenProduccionRequest } from '../../types/produccion.types';

export default function CrearOrdenProduccionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const crearOrden = useCrearOrdenProduccion();

  const pedidoIdParam = searchParams.get('pedidoId');

  const pedidoInicialId = pedidoIdParam ? Number(pedidoIdParam) : undefined;

  const vieneDesdePedido =
    pedidoInicialId !== undefined && Number.isInteger(pedidoInicialId) && pedidoInicialId > 0;

  const handleCrearOrden = (payload: CrearOrdenProduccionRequest) => {
    crearOrden.mutate(payload, {
      onSuccess: () => {
        navigate('/alumno/produccion');
      },
    });
  };

  const handleCancelar = () => {
    if (vieneDesdePedido) {
      navigate('/alumno/pedidos');
      return;
    }

    navigate('/alumno/produccion');
  };

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
          <Home className="h-4 w-4" />
          Inicio
        </Link>

        <ChevronRight className="h-4 w-4" />

        {vieneDesdePedido ? (
          <>
            <Link to="/alumno/pedidos" className="transition hover:text-gray-700">
              Pedidos
            </Link>

            <ChevronRight className="h-4 w-4" />
          </>
        ) : (
          <>
            <Link to="/alumno/produccion" className="transition hover:text-gray-700">
              Producción
            </Link>

            <ChevronRight className="h-4 w-4" />
          </>
        )}

        <span className="font-medium text-gray-700">Crear orden de producción</span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold text-gray-900">Crear orden</h1>

        <p className="mt-1 text-sm text-gray-500">
          {vieneDesdePedido
            ? 'Generá la orden necesaria para cubrir los productos pendientes del pedido.'
            : 'Creá una nueva orden de fabricación. Podrás dar seguimiento al avance y finalizarla cuando esté lista.'}
        </p>
      </header>

      {crearOrden.isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">
            No fue posible crear la orden de producción. Revisá los datos e intentá nuevamente.
          </p>
        </div>
      )}

      <CrearOrdenProduccionForm
        onSubmit={handleCrearOrden}
        onCancelar={handleCancelar}
        enviando={crearOrden.isPending}
        pedidoInicialId={vieneDesdePedido ? pedidoInicialId : undefined}
        bloquearPedido={vieneDesdePedido}
      />
    </div>
  );
}
