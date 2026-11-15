import { AlertTriangle, CheckCircle2 } from 'lucide-react';

import type {
  ContenidoLibroMayor,
  CuentaLibroMayor,
  LineaLibroMayor,
} from '../../types/ejercicio.types';
import type { ErrorDetalleCorreccion } from '../../types/espacioTrabajoCorreccion.types';

interface LibroMayorCorreccionProps {
  contenido: ContenidoLibroMayor;
  errores: ErrorDetalleCorreccion[];
  onSeleccionarError: (indiceError: number) => void;
}

type CampoMayor = 'cuenta' | 'debe' | 'haber' | 'saldo' | 'tipoSaldo';

const formatoMoneda = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function importe(valor: number): string {
  return `$ ${formatoMoneda.format(valor)}`;
}

function fechaVisible(fecha: string): string {
  if (!fecha) return '—';

  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);

  if (coincidencia) {
    return `${coincidencia[3]}/${coincidencia[2]}/${coincidencia[1]}`;
  }

  return fecha;
}

function calcularTotales(cuenta: CuentaLibroMayor) {
  const debe = Number(
    cuenta.debe.reduce((total, linea) => total + (linea.monto || 0), 0).toFixed(2)
  );

  const haber = Number(
    cuenta.haber.reduce((total, linea) => total + (linea.monto || 0), 0).toFixed(2)
  );

  return {
    debe,
    haber,
    saldo: Math.abs(Number((debe - haber).toFixed(2))),
  };
}

function etiquetaSaldo(tipo: string | null): string {
  switch (tipo) {
    case 'DEUDOR':
      return 'Deudor';
    case 'ACREEDOR':
      return 'Acreedor';
    case 'SALDADA':
      return 'Saldada';
    default:
      return 'Sin seleccionar';
  }
}

function buscarError(
  errores: ErrorDetalleCorreccion[],
  cuenta: CuentaLibroMayor,
  campo: CampoMayor
): number {
  return errores.findIndex((error) => {
    const detalle = error.detalle;

    if (detalle.celda !== campo) return false;

    // Se utiliza el identificador contable que devuelve el comparador.
    if (typeof detalle.idCuenta === 'number') {
      return detalle.idCuenta === cuenta.idCuenta;
    }

    // Alternativa para errores que no incluyen identificador.
    if (typeof detalle.cuenta === 'string') {
      return detalle.cuenta === cuenta.cuenta;
    }

    return false;
  });
}

function CampoConError({
  children,
  indiceError,
  onSeleccionarError,
  className = '',
}: {
  children: React.ReactNode;
  indiceError: number;
  onSeleccionarError: (indiceError: number) => void;
  className?: string;
}) {
  if (indiceError < 0) {
    return <div className={className}>{children}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onSeleccionarError(indiceError)}
      title="Ver detalle del error"
      aria-label="Ver detalle del error detectado"
      className={`flex w-full min-w-0 items-center justify-between gap-2 rounded-md border border-red-300 bg-red-50 px-2 py-1.5 text-left text-red-700 transition hover:bg-red-100 ${className}`}
    >
      <span className="min-w-0 break-words">{children}</span>
      <AlertTriangle size={13} className="shrink-0" />
    </button>
  );
}

function MovimientosMayor({ lineas }: { lineas: LineaLibroMayor[] }) {
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-[76px_minmax(0,1fr)_85px] border-b border-gray-200 bg-gray-50 text-[10px] font-semibold text-gray-600">
        <span className="px-2 py-2">Fecha</span>
        <span className="border-l border-gray-200 px-2 py-2">Contracuenta</span>
        <span className="border-l border-gray-200 px-2 py-2 text-right">Monto</span>
      </div>

      {lineas.length === 0 ? (
        <div className="px-3 py-4 text-center text-xs text-gray-400">Sin movimientos</div>
      ) : (
        lineas.map((linea, indice) => (
          <div
            key={indice}
            className="grid grid-cols-[76px_minmax(0,1fr)_85px] border-b border-gray-100 text-[11px] text-gray-700 last:border-b-0"
          >
            <span className="px-2 py-2">{fechaVisible(linea.fecha)}</span>

            <span className="min-w-0 break-words border-l border-gray-100 px-2 py-2">
              {linea.contraCuenta || '—'}
            </span>

            <span className="border-l border-gray-100 px-2 py-2 text-right tabular-nums">
              {formatoMoneda.format(linea.monto || 0)}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

function CuentaMayorCorreccion({
  cuenta,
  indiceCuenta,
  errores,
  onSeleccionarError,
}: {
  cuenta: CuentaLibroMayor;
  indiceCuenta: number;
  errores: ErrorDetalleCorreccion[];
  onSeleccionarError: (indiceError: number) => void;
}) {
  const totales = calcularTotales(cuenta);

  const errorCuenta = buscarError(errores, cuenta, 'cuenta');
  const errorDebe = buscarError(errores, cuenta, 'debe');
  const errorHaber = buscarError(errores, cuenta, 'haber');
  const errorSaldo = buscarError(errores, cuenta, 'saldo');
  const errorTipoSaldo = buscarError(errores, cuenta, 'tipoSaldo');

  const cantidadErrores = errores.filter((error) => {
    const detalle = error.detalle;

    if (typeof detalle.idCuenta === 'number') {
      return detalle.idCuenta === cuenta.idCuenta;
    }

    return detalle.cuenta === cuenta.cuenta;
  }).length;

  return (
    <article className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-3 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-abacontex-primary-three text-[10px] font-semibold text-white">
            {indiceCuenta + 1}
          </span>

          <div className="min-w-0 flex-1">
            <CampoConError
              indiceError={errorCuenta}
              onSeleccionarError={onSeleccionarError}
              className="text-xs font-semibold"
            >
              {cuenta.cuenta}
            </CampoConError>
          </div>
        </div>

        {cantidadErrores > 0 ? (
          <span className="text-[10px] font-medium text-red-600">
            {cantidadErrores} {cantidadErrores === 1 ? 'error' : 'errores'}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] text-green-700">
            <CheckCircle2 size={12} />
            Sin diferencias detectadas
          </span>
        )}
      </div>

      <div className="grid grid-cols-2">
        <div className="min-w-0 border-r border-gray-300">
          <div className="border-b border-gray-200 bg-green-50/60 px-2 py-2 text-center text-xs font-bold text-abacontex-primary">
            DEBE
          </div>
          <MovimientosMayor lineas={cuenta.debe} />
        </div>

        <div className="min-w-0">
          <div className="border-b border-gray-200 bg-green-50/60 px-2 py-2 text-center text-xs font-bold text-abacontex-primary">
            HABER
          </div>
          <MovimientosMayor lineas={cuenta.haber} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-gray-200 bg-gray-50 p-3 sm:grid-cols-4">
        <div className="min-w-0">
          <p className="mb-1 text-[10px] font-semibold text-gray-600">Total Debe</p>
          <CampoConError
            indiceError={errorDebe}
            onSeleccionarError={onSeleccionarError}
            className="text-xs font-semibold tabular-nums"
          >
            {importe(totales.debe)}
          </CampoConError>
        </div>

        <div className="min-w-0">
          <p className="mb-1 text-[10px] font-semibold text-gray-600">Total Haber</p>
          <CampoConError
            indiceError={errorHaber}
            onSeleccionarError={onSeleccionarError}
            className="text-xs font-semibold tabular-nums"
          >
            {importe(totales.haber)}
          </CampoConError>
        </div>

        <div className="min-w-0">
          <p className="mb-1 text-[10px] font-semibold text-gray-600">Saldo final</p>
          <CampoConError
            indiceError={errorSaldo}
            onSeleccionarError={onSeleccionarError}
            className="text-xs font-semibold tabular-nums"
          >
            {importe(totales.saldo)}
          </CampoConError>
        </div>

        <div className="min-w-0">
          <p className="mb-1 text-[10px] font-semibold text-gray-600">Tipo de saldo</p>
          <CampoConError
            indiceError={errorTipoSaldo}
            onSeleccionarError={onSeleccionarError}
            className="text-xs font-semibold"
          >
            {etiquetaSaldo(cuenta.tipoSaldo)}
          </CampoConError>
        </div>
      </div>
    </article>
  );
}

export default function LibroMayorCorreccion({
  contenido,
  errores,
  onSeleccionarError,
}: LibroMayorCorreccionProps) {
  if (contenido.cuentas.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
        El alumno no registró cuentas en el Libro Mayor.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Libro Mayor</h3>
          <p className="text-xs text-gray-500">Resolución presentada por el alumno</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-red-500" />
            Diferencia detectada
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-gray-300" />
            Sin diferencia señalada
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        {contenido.cuentas.map((cuenta, indice) => (
          <CuentaMayorCorreccion
            key={`${cuenta.idCuenta}-${indice}`}
            cuenta={cuenta}
            indiceCuenta={indice}
            errores={errores}
            onSeleccionarError={onSeleccionarError}
          />
        ))}
      </div>

      <p className="text-[11px] leading-relaxed text-gray-500">
        Seleccioná un campo resaltado para consultar la diferencia. Los errores que no pueden
        asociarse a una cuenta existente se muestran en el listado de errores detectados.
      </p>
    </div>
  );
}
