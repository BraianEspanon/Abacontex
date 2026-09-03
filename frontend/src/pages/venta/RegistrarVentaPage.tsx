import {
  CalendarDays,
  ChevronRight,
  Home,
  Package,
  ReceiptText,
  UserRound,
  WalletCards,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import CondicionesVentaForm from '../../components/venta/CondicionesVentaForm';
import VentaRegistradaModal from '../../components/venta/VentaRegistradaModal';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useMetodosPago } from '../../hooks/useMetodosPago';
import { usePedidosListosVenta } from '../../hooks/usePedidosListosVenta';
import { useRegistrarVenta } from '../../hooks/useRegistrarVenta';

import type { RegistrarVentaRequest, VentaRegistrada } from '../../types/venta.types';

const formatearMoneda = (valor: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(valor);
};

const formatearFecha = (fecha: string) => {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(fecha));
};

export default function RegistrarVentaPage() {
  const navigate = useNavigate();

  const [pedidoId, setPedidoId] = useState<number | null>(null);
  const [aplicaIva, setAplicaIva] = useState(false);

  const [ventaRegistrada, setVentaRegistrada] = useState<VentaRegistrada | null>(null);

  /*
   * Primero obtenemos los datos del alumno.
   *
   * Ventas está habilitado para todos los cursos,
   * pero para registrar una venta el alumno debe
   * pertenecer a una empresa.
   */
  const {
    data: alumno,
    isLoading: cargandoAlumno,
    isError: errorAlumno,
    refetch: refetchAlumno,
  } = useAlumnoActual();

  const tieneEmpresa = Boolean(alumno?.empresa);

  /*
   * Estas consultas solo se ejecutan cuando el alumno
   * pertenece a una empresa.
   */
  const { data: pedidos = [], isLoading, isError, refetch } = usePedidosListosVenta(tieneEmpresa);

  const {
    data: metodosPago = [],
    isLoading: cargandoMetodosPago,
    isError: errorMetodosPago,
    refetch: refetchMetodosPago,
  } = useMetodosPago(tieneEmpresa);

  const registrarVenta = useRegistrarVenta();

  const pedidoSeleccionado = pedidos.find((pedido) => pedido.idPedido === pedidoId);

  const subtotalPedido =
    pedidoSeleccionado?.detalles.reduce((total, detalle) => {
      const precioUnitario = aplicaIva
        ? Number(detalle.producto.precioVenta)
        : Number(detalle.producto.precioConsumidorFinal);

      return total + precioUnitario * detalle.cantidad;
    }, 0) ?? 0;

  const handleConfirmarVenta = (payload: RegistrarVentaRequest) => {
    registrarVenta.mutate(payload, {
      onSuccess: (venta) => {
        setVentaRegistrada(venta);
      },
    });
  };

  const handleCerrarModal = () => {
    navigate('/alumno/ventas');
  };

  const handleVerVenta = () => {
    if (!ventaRegistrada) {
      return;
    }

    navigate('/alumno/ventas', {
      state: {
        idVenta: ventaRegistrada.idVenta,
      },
    });
  };

  const handleCompletarFactura = () => {
    if (!ventaRegistrada) {
      return;
    }

    navigate(`/alumno/facturacion/nueva?ventaId=${ventaRegistrada.idVenta}`);
  };

  const handleCambiarPedido = (valor: string) => {
    setPedidoId(valor === '' ? null : Number(valor));
  };

  const renderSelectorPedido = () => (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#496647] text-sm font-semibold text-white">
            1
          </div>

          <h2 className="text-lg font-semibold text-gray-900">Pedido asociado</h2>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-medium text-gray-800">Aplicar IVA</span>

          <button
            type="button"
            role="switch"
            aria-checked={aplicaIva}
            onClick={() => setAplicaIva((valor) => !valor)}
            className={[
              'relative h-7 w-12 rounded-full transition',
              aplicaIva ? 'bg-[#6f9468]' : 'bg-gray-300',
            ].join(' ')}
          >
            <span
              className={[
                'absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all',
                aplicaIva ? 'left-6' : 'left-1',
              ].join(' ')}
            />
          </button>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="pedidoId" className="mb-1.5 block text-sm font-medium text-gray-500">
          Seleccionar pedido finalizado
        </label>

        <select
          id="pedidoId"
          value={pedidoId ?? ''}
          onChange={(event) => handleCambiarPedido(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20"
        >
          <option value="">Seleccioná un pedido</option>

          {pedidos.map((pedido) => (
            <option key={pedido.idPedido} value={pedido.idPedido}>
              PED-
              {pedido.idPedido.toString().padStart(5, '0')} - {pedido.clienteNombre}
            </option>
          ))}
        </select>
      </div>
    </>
  );

  const pedidoContenido = pedidoSeleccionado ? (
    <section className="p-5">
      {renderSelectorPedido()}

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-300">
        <div className="grid gap-x-8 gap-y-4 p-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <UserRound className="h-4 w-4 shrink-0 text-[#6f9468]" />

            <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
              <span className="text-sm text-gray-500">Cliente</span>

              <span className="truncate text-sm font-semibold text-gray-800">
                {pedidoSeleccionado.clienteNombre}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ReceiptText className="h-4 w-4 shrink-0 text-[#6f9468]" />

            <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
              <span className="text-sm text-gray-500">Detalle de pedido</span>

              <span className="text-sm font-semibold text-gray-800">
                PED-
                {pedidoSeleccionado.idPedido.toString().padStart(5, '0')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4 shrink-0 text-[#6f9468]" />

            <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
              <span className="text-sm text-gray-500">Fecha del pedido</span>

              <span className="text-sm font-semibold text-gray-800">
                {formatearFecha(pedidoSeleccionado.fecha)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Package className="h-4 w-4 shrink-0 text-[#6f9468]" />

            <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
              <span className="text-sm text-gray-500">Total del pedido</span>

              <span className="text-sm font-semibold text-gray-800">
                {formatearMoneda(subtotalPedido)}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full min-w-[520px] border border-gray-200">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm font-medium text-gray-700">
                <th className="px-4 py-3">Producto</th>

                <th className="px-4 py-3 text-center">Cantidad</th>

                <th className="px-4 py-3 text-right">Precio de venta</th>

                <th className="px-4 py-3 text-right">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {pedidoSeleccionado.detalles.map((detalle) => {
                const precioUnitario = aplicaIva
                  ? Number(detalle.producto.precioVenta)
                  : Number(detalle.producto.precioConsumidorFinal);

                const subtotal = precioUnitario * detalle.cantidad;

                return (
                  <tr key={detalle.idDetallePedido} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {detalle.producto.nombre}
                    </td>

                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {detalle.cantidad}
                    </td>

                    <td className="px-4 py-3 text-right text-sm text-gray-700">
                      {formatearMoneda(precioUnitario)}
                    </td>

                    <td className="px-4 py-3 text-right text-sm text-gray-700">
                      {formatearMoneda(subtotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr className="border-t border-gray-200">
                <td
                  colSpan={3}
                  className="px-4 py-3 text-right text-sm font-semibold text-gray-800"
                >
                  Total del pedido
                </td>

                <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  {formatearMoneda(subtotalPedido)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  ) : null;

  /*
   * Primero resolvemos el estado del alumno.
   */
  if (cargandoAlumno) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando información para registrar la venta...</p>
      </div>
    );
  }

  if (errorAlumno || !alumno) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">
          No fue posible comprobar la información del alumno
        </h2>

        <p className="mt-1 text-sm text-red-700">
          Ocurrió un problema al consultar tus datos actuales.
        </p>

        <button
          type="button"
          onClick={() => refetchAlumno()}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  /*
   * Ventas está disponible para todos los cursos,
   * pero requiere pertenecer a una empresa.
   */
  if (!tieneEmpresa) {
    return <EstadoRegistrarVentaSinEmpresa />;
  }

  /*
   * Recién acá esperamos las queries dependientes
   * de la empresa.
   */
  if (isLoading || cargandoMetodosPago) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando información para registrar la venta...</p>
      </div>
    );
  }

  if (isError || errorMetodosPago) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">No fue posible cargar la información</h2>

        <p className="mt-1 text-sm text-red-700">
          Ocurrió un error al consultar los datos necesarios para registrar la venta.
        </p>

        <button
          type="button"
          onClick={() => {
            void refetch();
            void refetchMetodosPago();
          }}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
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

          <Link to="/alumno/ventas" className="transition hover:text-gray-700">
            Ventas
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-gray-700">Registrar venta</span>
        </nav>

        {/* Encabezado */}
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Registrar venta</h1>

          <p className="mt-1 text-sm text-gray-500">
            Seleccioná un pedido finalizado y completá las condiciones comerciales para registrar la
            venta.
          </p>
        </header>

        {pedidos.length === 0 ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            {renderSelectorPedido()}

            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-medium text-amber-800">No hay pedidos disponibles para venta.</p>

              <p className="mt-1 text-sm text-amber-700">
                Para registrar una venta debe existir al menos un pedido en estado Listo para
                entregar.
              </p>
            </div>
          </section>
        ) : pedidoSeleccionado ? (
          <>
            {registrarVenta.isError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="font-medium text-red-800">No fue posible registrar la venta.</p>

                <p className="mt-1 text-sm text-red-700">
                  Revisá las condiciones comerciales e intentá nuevamente.
                </p>
              </div>
            )}

            <CondicionesVentaForm
              key={`${pedidoSeleccionado.idPedido}-${aplicaIva}`}
              pedido={pedidoSeleccionado}
              metodosPago={metodosPago}
              aplicaIva={aplicaIva}
              pedidoContenido={pedidoContenido}
              enviando={registrarVenta.isPending}
              onConfirmar={handleConfirmarVenta}
              onCancelar={() => navigate('/alumno/ventas')}
            />
          </>
        ) : (
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            {renderSelectorPedido()}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/alumno/ventas')}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </section>
        )}
      </div>

      <VentaRegistradaModal
        abierto={ventaRegistrada !== null}
        venta={ventaRegistrada}
        onCerrar={handleCerrarModal}
        onVerVenta={handleVerVenta}
        onCompletarFactura={handleCompletarFactura}
      />
    </>
  );
}

function EstadoRegistrarVentaSinEmpresa() {
  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
          <Home className="h-4 w-4" />
          Inicio
        </Link>

        <ChevronRight className="h-4 w-4" />

        <Link to="/alumno/ventas" className="transition hover:text-gray-700">
          Ventas
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-gray-700">Registrar venta</span>
      </nav>

      {/* Encabezado */}
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Registrar venta</h1>

        <p className="mt-1 text-sm text-gray-500">
          Seleccioná un pedido finalizado y completá las condiciones comerciales para registrar la
          venta.
        </p>
      </header>

      {/* Estado sin empresa */}
      <div className="flex justify-center pt-6">
        <section className="flex min-h-[360px] w-full max-w-3xl flex-col items-center justify-center rounded-2xl bg-white px-8 py-12 text-center shadow-md">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-abacontex-primary/10">
            <WalletCards size={36} className="text-abacontex-primary" />
          </div>

          <h2 className="mt-6 font-heading text-2xl font-semibold text-abacontex-black-text">
            Todavía no pertenecés a una empresa
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
            Para registrar una venta primero tenés que formar parte de una empresa de tu curso.
          </p>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
            Cuando seas incorporado a una empresa, vas a poder seleccionar pedidos y registrar las
            operaciones comerciales correspondientes.
          </p>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="mt-6 rounded-lg border border-[#6f9468] bg-white px-5 py-2.5 text-sm font-medium text-[#496647] transition hover:bg-[#f1f5ef]"
          >
            Volver
          </button>
        </section>
      </div>
    </div>
  );
}
