import { Building2, ChevronRight, CircleHelp, ClipboardList, Home, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import DetallePedidoModal from '../../components/pedido/DetallePedidoModal';
import ResumenPedidos from '../../components/pedido/ResumenPedidos';
import TableroPedidos from '../../components/pedido/TableroPedidos';
import Button from '../../components/ui/Button';

import { useDetallePedido } from '../../hooks/useDetallePedido';
import { useEmpresaActual } from '../../hooks/useEmpresaActual';
import { useMarcarPedidoListo } from '../../hooks/useMarcarPedidoListo';
import { usePedidos } from '../../hooks/usePedidos';

export default function PedidosPage() {
  const navigate = useNavigate();

  const [idPedidoSeleccionado, setIdPedidoSeleccionado] = useState<number | null>(null);

  /*
   * Primero determinamos si el alumno pertenece
   * actualmente a una empresa.
   */
  const { data: empresa, isLoading: cargandoEmpresa, isError: errorEmpresa } = useEmpresaActual();

  /*
   * Solamente consultamos el tablero de pedidos
   * si el alumno pertenece a una empresa.
   */
  const {
    data,
    isLoading: cargandoPedidos,
    isError: errorPedidos,
    refetch,
  } = usePedidos(Boolean(empresa));

  const marcarPedidoListo = useMarcarPedidoListo();

  const {
    data: detallePedido,
    isLoading: cargandoDetalle,
    isError: errorDetalle,
  } = useDetallePedido(idPedidoSeleccionado);

  const handleVerDetalle = (idPedido: number) => {
    setIdPedidoSeleccionado(idPedido);
  };

  const handleCerrarDetalle = () => {
    setIdPedidoSeleccionado(null);
  };

  const handleCrearOrdenProduccion = (idPedido: number) => {
    setIdPedidoSeleccionado(null);

    navigate(`/alumno/produccion/crear?pedidoId=${idPedido}`);
  };

  const handleMarcarListoParaEntregar = (idPedido: number) => {
    marcarPedidoListo.mutate(idPedido);
  };

  /*
   * Mientras verificamos a qué empresa pertenece
   * el alumno, mostramos el estado de carga general.
   */
  if (cargandoEmpresa) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando pedidos...</p>
      </div>
    );
  }

  /*
   * Error consultando la información del alumno/empresa.
   */
  if (errorEmpresa) {
    return (
      <div className="p-6">
        <section className="mx-auto max-w-2xl rounded-2xl border border-red-100 bg-white p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50">
              <CircleHelp className="h-6 w-6 text-red-500" />
            </div>

            <div>
              <h1 className="font-heading text-xl font-semibold text-abacontex-black-text">
                No pudimos cargar los pedidos
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-abacontex-gray-text">
                Ocurrió un problema al consultar la información necesaria para acceder al módulo de
                pedidos. Intentá nuevamente en unos minutos.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /*
   * El alumno está correctamente registrado,
   * pero todavía no pertenece a ninguna empresa.
   *
   * Esto es un estado válido y no un error.
   */
  if (!empresa) {
    return (
      <div className="space-y-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
            <Home className="h-4 w-4" />
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-700">Pedidos</span>
        </nav>

        {/* Encabezado */}
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>

          <p className="mt-2 text-base text-gray-500">Gestioná los pedidos de tu empresa.</p>
        </header>

        {/* Estado sin empresa */}
        <div className="flex justify-center pt-6">
          <section className="flex min-h-[360px] w-full max-w-3xl flex-col items-center justify-center rounded-2xl bg-white px-8 py-12 text-center shadow-md">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-abacontex-primary/10">
              <ClipboardList size={36} className="text-abacontex-primary" />
            </div>

            <h2 className="mt-6 font-heading text-2xl font-semibold text-abacontex-black-text">
              Todavía no podés gestionar pedidos
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
              Para registrar y consultar pedidos primero tenés que formar parte de una empresa de tu
              curso.
            </p>

            <p className="mt-3 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
              Cuando seas incorporado a una empresa, vas a poder gestionar desde acá todos sus
              pedidos y realizar el seguimiento de cada operación.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs text-abacontex-gray-text">
              <Building2 className="h-4 w-4 text-abacontex-primary" />

              <span>Tu acceso se habilitará automáticamente cuando pertenezcas a una empresa.</span>
            </div>
          </section>
        </div>
      </div>
    );
  }

  /*
   * La empresa existe, pero todavía estamos cargando
   * específicamente su tablero de pedidos.
   */
  if (cargandoPedidos) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando pedidos...</p>
      </div>
    );
  }

  /*
   * Error real del módulo de pedidos.
   */
  if (errorPedidos || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">No fue posible cargar los pedidos</h2>

        <p className="mt-1 text-sm text-red-700">
          Ocurrió un error al consultar el tablero de pedidos.
        </p>

        <Button type="button" label="Reintentar" onClick={() => refetch()} className="mt-4" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
            <Home className="h-4 w-4" />
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-700">Pedidos</span>
        </nav>

        {/* Encabezado */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>

            <p className="mt-2 text-base text-gray-500">Gestioná los pedidos de tu empresa</p>
          </div>

          <Button
            type="button"
            label="Registrar pedido"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => navigate('/alumno/pedidos/registrar')}
            className="self-start px-4 py-2.5 text-sm sm:self-auto"
          />
        </header>

        {/* Resumen */}
        <ResumenPedidos resumen={data.resumen} />

        {/* Kanban */}
        <TableroPedidos
          kanban={data.kanban}
          onVerDetalle={handleVerDetalle}
          onCrearOrdenProduccion={handleCrearOrdenProduccion}
          onMarcarListoParaEntregar={handleMarcarListoParaEntregar}
        />
      </div>

      <DetallePedidoModal
        abierto={idPedidoSeleccionado !== null}
        pedido={detallePedido}
        cargando={cargandoDetalle}
        error={errorDetalle}
        onCerrar={handleCerrarDetalle}
        onCrearOrdenProduccion={handleCrearOrdenProduccion}
      />
    </>
  );
}
