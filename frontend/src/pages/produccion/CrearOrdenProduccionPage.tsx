import { ChevronRight, Factory, GraduationCap, Home } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import CrearOrdenProduccionForm from '../../components/produccion/CrearOrdenProduccionForm';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useCrearOrdenProduccion } from '../../hooks/useCrearOrdenProduccion';

import type { CrearOrdenProduccionRequest } from '../../types/produccion.types';

import { esCursoSexto } from '../../utils/curso.utils';

export default function CrearOrdenProduccionPage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const crearOrden = useCrearOrdenProduccion();

  const {
    data: alumno,
    isLoading: cargandoAlumno,
    isError: errorAlumno,
    refetch: refetchAlumno,
  } = useAlumnoActual();

  const esSexto = esCursoSexto(alumno?.curso?.nombre);

  const tieneEmpresa = Boolean(alumno?.empresa);

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

  if (cargandoAlumno) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando producción...</p>
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
          Ocurrió un problema al consultar tu curso y tus datos actuales.
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

  if (!esSexto) {
    return (
      <EstadoCrearOrdenNoDisponible
        icono={<GraduationCap className="h-9 w-9 text-abacontex-primary" />}
        titulo="Producción no está disponible para tu curso"
        descripcion="La creación de órdenes de producción está disponible únicamente para alumnos de 6.º año."
      />
    );
  }

  if (!tieneEmpresa) {
    return (
      <EstadoCrearOrdenNoDisponible
        icono={<Factory className="h-9 w-9 text-abacontex-primary" />}
        titulo="Todavía no pertenecés a una empresa"
        descripcion="Para crear una orden de producción primero tenés que formar parte de una empresa de tu curso."
      />
    );
  }

  return (
    <div className="space-y-5">
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

interface EstadoCrearOrdenNoDisponibleProps {
  icono: React.ReactNode;
  titulo: string;
  descripcion: string;
}

function EstadoCrearOrdenNoDisponible({
  icono,
  titulo,
  descripcion,
}: EstadoCrearOrdenNoDisponibleProps) {
  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
          <Home className="h-4 w-4" />
          Inicio
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-gray-700">Producción</span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold text-gray-900">Crear orden</h1>

        <p className="mt-1 text-sm text-gray-500">
          Creá una nueva orden de fabricación para tu empresa.
        </p>
      </header>

      <div className="flex justify-center pt-6">
        <section className="flex min-h-[360px] w-full max-w-3xl flex-col items-center justify-center rounded-2xl bg-white px-8 py-12 text-center shadow-md">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-abacontex-primary/10">
            {icono}
          </div>

          <h2 className="mt-6 font-heading text-2xl font-semibold text-abacontex-black-text">
            {titulo}
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-abacontex-gray-text">
            {descripcion}
          </p>
        </section>
      </div>
    </div>
  );
}
