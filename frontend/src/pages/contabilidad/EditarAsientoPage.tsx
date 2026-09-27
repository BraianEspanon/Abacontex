import { ChevronRight, Home } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import EditarAsientoForm from '../../components/contabilidad/EditarAsientoForm';
import NavegacionContabilidad from '../../components/contabilidad/NavegacionContabilidad';
import ResumenOperacionContable from '../../components/contabilidad/ResumenOperacionContable';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useAsientoPorId } from '../../hooks/useAsientoPorId';
import { useCuentasContablesConFolio } from '../../hooks/useCuentasContablesConFolio';
import { useEditarAsiento } from '../../hooks/useEditarAsiento';
import { useTiposMovimientoAsiento } from '../../hooks/useTiposMovimientoAsiento';

import type { EditarAsientoDetalleRequest } from '../../types/contabilidad.types';

export default function EditarAsientoPage() {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const idNumerico = id ? Number(id) : undefined;

  const idValido = idNumerico !== undefined && Number.isInteger(idNumerico) && idNumerico > 0;

  /*
   * Primero comprobamos que el alumno actual
   * pertenezca a una empresa.
   */
  const {
    data: alumno,
    isLoading: cargandoAlumno,
    isError: errorAlumno,
    refetch: refetchAlumno,
  } = useAlumnoActual();

  const tieneEmpresa = Boolean(alumno?.empresa);

  /*
   * Obtenemos el asiento completo.
   *
   * El backend ya devuelve:
   * - datos generales
   * - renglones
   * - operación que originó el asiento
   */
  const {
    data: asiento,
    isLoading: cargandoAsiento,
    isError: errorAsiento,
    refetch: refetchAsiento,
  } = useAsientoPorId(idValido ? idNumerico : undefined, tieneEmpresa);

  /*
   * Catálogo de cuentas contables y folios
   * correspondientes a la empresa.
   */
  const {
    data: cuentasData,
    isLoading: cargandoCuentas,
    isError: errorCuentas,
    refetch: refetchCuentas,
  } = useCuentasContablesConFolio(tieneEmpresa);

  /*
   * Tipos de movimiento:
   * A+, A-, P+, P-, PN, R+ y R-.
   */
  const {
    data: tiposMovimiento = [],
    isLoading: cargandoTiposMovimiento,
    isError: errorTiposMovimiento,
    refetch: refetchTiposMovimiento,
  } = useTiposMovimientoAsiento(tieneEmpresa);

  const editarAsientoMutation = useEditarAsiento();

  const handleGuardar = (detalles: EditarAsientoDetalleRequest[]) => {
    if (!idValido || idNumerico === undefined) {
      return;
    }

    editarAsientoMutation.mutate(
      {
        idAsiento: idNumerico,
        payload: {
          detalles,
        },
      },
      {
        onSuccess: () => {
          navigate('/alumno/contabilidad/libro-diario');
        },
      }
    );
  };

  /*
   * Estado inicial.
   */
  if (cargandoAlumno) {
    return <EstadoCarga mensaje="Cargando información contable..." />;
  }

  if (errorAlumno || !alumno) {
    return (
      <EstadoError
        titulo="No fue posible comprobar la información del alumno"
        descripcion="Ocurrió un problema al consultar tus datos actuales."
        onReintentar={() => void refetchAlumno()}
      />
    );
  }

  /*
   * Contabilidad requiere que el alumno
   * pertenezca a una empresa.
   */
  if (!tieneEmpresa) {
    return (
      <EstadoError
        titulo="Todavía no pertenecés a una empresa"
        descripcion="Para editar asientos contables primero tenés que formar parte de una empresa."
        mostrarReintentar={false}
      />
    );
  }

  /*
   * Validación del parámetro recibido por URL.
   */
  if (!idValido) {
    return (
      <EstadoError
        titulo="Asiento contable inválido"
        descripcion="El asiento que intentás editar no es válido."
        mostrarReintentar={false}
      />
    );
  }

  /*
   * Carga del asiento.
   */
  if (cargandoAsiento) {
    return <EstadoCarga mensaje="Cargando asiento contable..." />;
  }

  if (errorAsiento || !asiento) {
    return (
      <EstadoError
        titulo="No fue posible cargar el asiento"
        descripcion="El asiento puede no existir o no pertenecer a tu empresa."
        onReintentar={() => void refetchAsiento()}
      />
    );
  }

  /*
   * Información auxiliar necesaria
   * para editar los renglones.
   */
  if (cargandoCuentas || cargandoTiposMovimiento) {
    return <EstadoCarga mensaje="Cargando información contable..." />;
  }

  if (errorCuentas || errorTiposMovimiento || !cuentasData) {
    return (
      <EstadoError
        titulo="No fue posible cargar la información contable"
        descripcion="Ocurrió un problema al consultar las cuentas o los tipos de movimiento."
        onReintentar={() => {
          void refetchCuentas();
          void refetchTiposMovimiento();
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
          <Home className="h-4 w-4" />
          Inicio
        </Link>

        <ChevronRight className="h-4 w-4" />

        <Link to="/alumno/contabilidad" className="transition hover:text-gray-700">
          Gestión contable
        </Link>

        <ChevronRight className="h-4 w-4" />

        <Link to="/alumno/contabilidad/libro-diario" className="transition hover:text-gray-700">
          Libro diario
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-gray-700">Editar asiento</span>
      </nav>

      {/* Encabezado */}
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Editar asiento</h1>

        <p className="mt-1 text-sm text-gray-500">
          Modificá los renglones del asiento contable N° {asiento.numeroAsiento}.
        </p>
      </header>

      {/* Navegación interna */}
      <NavegacionContabilidad activa="LIBRO_DIARIO" />

      {/*
       * El backend devuelve la operación de origen junto
       * con el asiento. No necesitamos volver a consultar
       * Venta, Movimiento financiero o Conciliación.
       */}
      {asiento.operacionOrigen && <ResumenOperacionContable operacion={asiento.operacionOrigen} />}

      {/* Formulario */}
      <EditarAsientoForm
        numeroAsiento={asiento.numeroAsiento}
        fecha={asiento.fechaHecho}
        conceptoGeneral={asiento.conceptoGeneral}
        detallesIniciales={asiento.detalles}
        cuentas={cuentasData.cuentas}
        tiposMovimiento={tiposMovimiento}
        enviando={editarAsientoMutation.isPending}
        onCancelar={() => navigate('/alumno/contabilidad/libro-diario')}
        onGuardar={handleGuardar}
      />

      {/* Error PATCH */}
      {editarAsientoMutation.isError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          No fue posible guardar los cambios. Revisá que el asiento esté correctamente balanceado e
          intentá nuevamente.
        </div>
      )}
    </div>
  );
}

function EstadoCarga({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <p className="text-sm text-gray-500">{mensaje}</p>
    </div>
  );
}

interface EstadoErrorProps {
  titulo: string;
  descripcion: string;
  onReintentar?: () => void;
  mostrarReintentar?: boolean;
}

function EstadoError({
  titulo,
  descripcion,
  onReintentar,
  mostrarReintentar = true,
}: EstadoErrorProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <h2 className="font-semibold text-red-800">{titulo}</h2>

      <p className="mt-1 text-sm text-red-700">{descripcion}</p>

      {mostrarReintentar && onReintentar && (
        <button
          type="button"
          onClick={onReintentar}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
