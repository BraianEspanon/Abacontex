import { ChevronRight, Home } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import AsientoContableForm from '../../components/contabilidad/AsientoContableForm';
import NavegacionContabilidad from '../../components/contabilidad/NavegacionContabilidad';
import ResumenOperacionContable from '../../components/contabilidad/ResumenOperacionContable';

import { useAlumnoActual } from '../../hooks/useAlumnoActual';
import { useCuentasContablesConFolio } from '../../hooks/useCuentasContablesConFolio';
import { useDetalleOperacionPendiente } from '../../hooks/useDetalleOperacionPendiente';
import { useRegistrarAsiento } from '../../hooks/useRegistrarAsiento';
import { useTiposMovimientoAsiento } from '../../hooks/useTiposMovimientoAsiento';

import type {
  RegistrarAsientoDetalleRequest,
  TipoOperacionPendiente,
} from '../../types/contabilidad.types';

const TIPOS_ORIGEN_VALIDOS: TipoOperacionPendiente[] = [
  'VENTA',
  'MOVIMIENTO_FINANCIERO',
  'CONCILIACION_FINANCIERA',
];

function esTipoOrigenValido(tipo: string | undefined): tipo is TipoOperacionPendiente {
  return tipo !== undefined && TIPOS_ORIGEN_VALIDOS.includes(tipo as TipoOperacionPendiente);
}

export default function RegistrarAsientoPage() {
  const navigate = useNavigate();

  const { tipo, id } = useParams<{
    tipo: string;
    id: string;
  }>();

  const [conceptoGeneral, setConceptoGeneral] = useState('');

  const tipoValido = esTipoOrigenValido(tipo) ? tipo : undefined;

  const idNumerico = id ? Number(id) : undefined;

  const idValido = idNumerico !== undefined && Number.isInteger(idNumerico) && idNumerico > 0;

  const {
    data: alumno,
    isLoading: cargandoAlumno,
    isError: errorAlumno,
    refetch: refetchAlumno,
  } = useAlumnoActual();

  const tieneEmpresa = Boolean(alumno?.empresa);

  const {
    data: operacion,
    isLoading: cargandoOperacion,
    isError: errorOperacion,
    refetch: refetchOperacion,
  } = useDetalleOperacionPendiente(tipoValido, idValido ? idNumerico : undefined, tieneEmpresa);

  const {
    data: cuentasData,
    isLoading: cargandoCuentas,
    isError: errorCuentas,
    refetch: refetchCuentas,
  } = useCuentasContablesConFolio(tieneEmpresa);

  const {
    data: tiposMovimiento = [],
    isLoading: cargandoTiposMovimiento,
    isError: errorTiposMovimiento,
    refetch: refetchTiposMovimiento,
  } = useTiposMovimientoAsiento(tieneEmpresa);

  const registrarAsientoMutation = useRegistrarAsiento();

  const handleGuardarAsiento = (detalles: RegistrarAsientoDetalleRequest[]) => {
    if (!tipoValido || !idValido || idNumerico === undefined) {
      return;
    }

    registrarAsientoMutation.mutate(
      {
        tipo: tipoValido,
        operacionId: idNumerico,
        conceptoGeneral: conceptoGeneral.trim(),
        detalles,
      },
      {
        onSuccess: () => {
          navigate('/alumno/contabilidad');
        },
      }
    );
  };

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

  if (!tieneEmpresa) {
    return (
      <EstadoError
        titulo="Todavía no pertenecés a una empresa"
        descripcion="Para registrar asientos contables primero tenés que formar parte de una empresa."
        mostrarReintentar={false}
      />
    );
  }

  if (!tipoValido || !idValido) {
    return (
      <EstadoError
        titulo="Operación contable inválida"
        descripcion="La operación que intentás contabilizar no es válida."
        mostrarReintentar={false}
      />
    );
  }

  if (cargandoOperacion) {
    return <EstadoCarga mensaje="Cargando operación..." />;
  }

  if (errorOperacion || !operacion) {
    return (
      <EstadoError
        titulo="No fue posible cargar la operación"
        descripcion="La operación puede no existir, pertenecer a otra empresa o haber sido contabilizada previamente."
        onReintentar={() => void refetchOperacion()}
      />
    );
  }

  if (cargandoCuentas || cargandoTiposMovimiento) {
    return <EstadoCarga mensaje="Cargando información del asiento..." />;
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
    <div className="space-y-3">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
          <Home className="h-3.5 w-3.5" />
          Inicio
        </Link>

        <ChevronRight className="h-3.5 w-3.5" />

        <Link to="/alumno/contabilidad" className="transition hover:text-gray-700">
          Gestión contable
        </Link>

        <ChevronRight className="h-3.5 w-3.5" />

        <Link to="/alumno/contabilidad/libro-diario" className="transition hover:text-gray-700">
          Libro diario
        </Link>

        <ChevronRight className="h-3.5 w-3.5" />

        <span className="font-medium text-gray-700">Registrar asiento</span>
      </nav>

      {/* Encabezado */}
      <header>
        <h1 className="text-xl font-bold text-gray-900">Registrar asiento</h1>

        <p className="mt-0.5 text-xs text-gray-500">
          Registrá contablemente la operación seleccionada mediante el principio de partida doble.
        </p>
      </header>

      <NavegacionContabilidad activa="LIBRO_DIARIO" />

      <ResumenOperacionContable operacion={operacion} />

      <AsientoContableForm
        fecha={operacion.fecha}
        conceptoGeneral={conceptoGeneral}
        onConceptoGeneralChange={setConceptoGeneral}
        cuentas={cuentasData.cuentas}
        tiposMovimiento={tiposMovimiento}
        enviando={registrarAsientoMutation.isPending}
        onCancelar={() => navigate('/alumno/contabilidad')}
        onGuardar={handleGuardarAsiento}
      />

      {registrarAsientoMutation.isError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          No fue posible registrar el asiento. Revisá los datos ingresados e intentá nuevamente.
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
    <div className="rounded-xl border border-red-200 bg-red-50 p-5">
      <h2 className="font-semibold text-red-800">{titulo}</h2>

      <p className="mt-1 text-sm text-red-700">{descripcion}</p>

      {mostrarReintentar && onReintentar && (
        <button
          type="button"
          onClick={onReintentar}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
