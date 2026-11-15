import { AlertTriangle, Calculator, CheckCircle2 } from 'lucide-react';

import type {
  ComprobanteIva,
  ContenidoLibroIva,
  TipoResultadoIva,
} from '../../types/ejercicio.types';

import type { ErrorDetalleCorreccion } from '../../types/espacioTrabajoCorreccion.types';

interface LibroIvaCorreccionProps {
  contenido: ContenidoLibroIva;
  errores: ErrorDetalleCorreccion[];
  onSeleccionarError: (indiceError: number) => void;
}

type SeccionIva = 'Compras' | 'Ventas';
type CampoComprobante = 'comprobante' | 'netoGravado' | 'iva' | 'total';

const formatoImporte = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function importe(valor: number): string {
  return `$ ${formatoImporte.format(valor || 0)}`;
}

function fechaVisible(fecha: string): string {
  if (!fecha) return '—';

  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);

  if (coincidencia) {
    return `${coincidencia[3]}/${coincidencia[2]}/${coincidencia[1]}`;
  }

  return fecha;
}

function resultadoVisible(resultado: TipoResultadoIva | null): string {
  switch (resultado) {
    case 'A_PAGAR':
      return 'A pagar';
    case 'A_FAVOR_CONTRIBUYENTE':
      return 'A favor del contribuyente';
    default:
      return 'Sin determinar';
  }
}

function buscarErrorComprobante(
  errores: ErrorDetalleCorreccion[],
  seccion: SeccionIva,
  comprobante: ComprobanteIva,
  campo: CampoComprobante
): number {
  return errores.findIndex((error) => {
    const detalle = error.detalle;

    if (detalle.seccion !== seccion || detalle.celda !== campo) {
      return false;
    }

    if (typeof detalle.comprobante !== 'number') {
      return false;
    }

    // Los errores de importes y comprobantes adicionales utilizan
    // el número del comprobante que ingresó el alumno.
    if (detalle.comprobante === comprobante.comprobante) {
      return true;
    }

    // En una sustitución, el error del número de comprobante
    // contiene el número esperado en "comprobante" y el número
    // ingresado por el alumno en "obtenido".
    if (
      campo === 'comprobante' &&
      typeof detalle.obtenido === 'number' &&
      detalle.obtenido === comprobante.comprobante
    ) {
      return true;
    }

    return false;
  });
}

function buscarErrorResultado(errores: ErrorDetalleCorreccion[]): number {
  return errores.findIndex((error) => error.detalle.celda === 'resultado');
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
    return <span className={className}>{children}</span>;
  }

  return (
    <button
      type="button"
      onClick={() => onSeleccionarError(indiceError)}
      title="Ver detalle del error"
      className={`inline-flex w-full min-w-0 items-center justify-between gap-1 rounded-md border border-red-300 bg-red-50 px-2 py-1.5 text-left font-semibold text-red-700 transition hover:bg-red-100 ${className}`}
    >
      <span className="min-w-0 break-words">{children}</span>
      <AlertTriangle size={13} className="shrink-0" />
    </button>
  );
}

function calcularTotales(comprobantes: ComprobanteIva[]) {
  return comprobantes.reduce(
    (acumulado, comprobante) => ({
      neto: acumulado.neto + (comprobante.netoGravado || 0),
      iva: acumulado.iva + (comprobante.iva || 0),
      total: acumulado.total + (comprobante.total || 0),
    }),
    { neto: 0, iva: 0, total: 0 }
  );
}

function TablaIvaCorreccion({
  seccion,
  comprobantes,
  errores,
  onSeleccionarError,
}: {
  seccion: SeccionIva;
  comprobantes: ComprobanteIva[];
  errores: ErrorDetalleCorreccion[];
  onSeleccionarError: (indiceError: number) => void;
}) {
  const totales = calcularTotales(comprobantes);
  const esCompra = seccion === 'Compras';

  const cantidadErrores = errores.filter((error) => error.detalle.seccion === seccion).length;

  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-3 py-2.5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Libro IVA {esCompra ? 'Compra' : 'Venta'}
          </h3>
          <p className="text-[11px] text-gray-500">
            {comprobantes.length} {comprobantes.length === 1 ? 'comprobante' : 'comprobantes'}
          </p>
        </div>

        {cantidadErrores > 0 ? (
          <span className="text-xs font-medium text-red-600">
            {cantidadErrores} {cantidadErrores === 1 ? 'error' : 'errores'}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-green-700">
            <CheckCircle2 size={14} />
            Sin diferencias detectadas
          </span>
        )}
      </div>

      {comprobantes.length === 0 ? (
        <p className="p-5 text-center text-xs text-gray-500">
          No se registraron comprobantes de {esCompra ? 'compra' : 'venta'}.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] table-fixed text-xs">
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[14%]" />
              <col className="w-[24%]" />
              <col className="w-[17%]" />
              <col className="w-[16%]" />
              <col className="w-[17%]" />
            </colgroup>

            <thead className="bg-gray-50 text-[11px] font-semibold text-gray-700">
              <tr className="border-b border-gray-200">
                <th className="px-3 py-2 text-left">Fecha</th>
                <th className="px-3 py-2 text-left">N.º comprobante</th>
                <th className="px-3 py-2 text-left">{esCompra ? 'Proveedor' : 'Comprador'}</th>
                <th className="px-3 py-2 text-right">Neto gravado</th>
                <th className="px-3 py-2 text-right">IVA facturado</th>
                <th className="px-3 py-2 text-right">Total facturado</th>
              </tr>
            </thead>

            <tbody>
              {comprobantes.map((comprobante, indice) => {
                const errorNumero = buscarErrorComprobante(
                  errores,
                  seccion,
                  comprobante,
                  'comprobante'
                );
                const errorNeto = buscarErrorComprobante(
                  errores,
                  seccion,
                  comprobante,
                  'netoGravado'
                );
                const errorIva = buscarErrorComprobante(errores, seccion, comprobante, 'iva');
                const errorTotal = buscarErrorComprobante(errores, seccion, comprobante, 'total');

                return (
                  <tr
                    key={`${comprobante.comprobante}-${indice}`}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <td className="px-3 py-2 text-gray-700">{fechaVisible(comprobante.fecha)}</td>

                    <td className="px-2 py-1.5 tabular-nums">
                      <CampoConError
                        indiceError={errorNumero}
                        onSeleccionarError={onSeleccionarError}
                      >
                        {comprobante.comprobante || '—'}
                      </CampoConError>
                    </td>

                    <td className="break-words px-3 py-2 text-gray-700">
                      {comprobante.nombre || '—'}
                    </td>

                    <td className="px-2 py-1.5 text-right tabular-nums">
                      <CampoConError
                        indiceError={errorNeto}
                        onSeleccionarError={onSeleccionarError}
                        className="justify-end"
                      >
                        {importe(comprobante.netoGravado)}
                      </CampoConError>
                    </td>

                    <td className="px-2 py-1.5 text-right tabular-nums">
                      <CampoConError
                        indiceError={errorIva}
                        onSeleccionarError={onSeleccionarError}
                        className="justify-end"
                      >
                        {importe(comprobante.iva)}
                      </CampoConError>
                    </td>

                    <td className="px-2 py-1.5 text-right tabular-nums">
                      <CampoConError
                        indiceError={errorTotal}
                        onSeleccionarError={onSeleccionarError}
                        className="justify-end"
                      >
                        {importe(comprobante.total)}
                      </CampoConError>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr className="border-t border-gray-200 bg-green-50/60 font-semibold text-gray-800">
                <td colSpan={3} className="px-3 py-2 text-center">
                  TOTALES
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{importe(totales.neto)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{importe(totales.iva)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{importe(totales.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </section>
  );
}

export default function LibroIvaCorreccion({
  contenido,
  errores,
  onSeleccionarError,
}: LibroIvaCorreccionProps) {
  const totalesCompras = calcularTotales(contenido.compras);
  const totalesVentas = calcularTotales(contenido.ventas);

  const diferencia = Number((totalesVentas.iva - totalesCompras.iva).toFixed(2));

  const saldoIva = Math.abs(diferencia);
  const errorResultado = buscarErrorResultado(errores);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Libro IVA</h3>
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

      <TablaIvaCorreccion
        seccion="Compras"
        comprobantes={contenido.compras}
        errores={errores}
        onSeleccionarError={onSeleccionarError}
      />

      <TablaIvaCorreccion
        seccion="Ventas"
        comprobantes={contenido.ventas}
        errores={errores}
        onSeleccionarError={onSeleccionarError}
      />

      <section className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <Calculator size={17} className="text-abacontex-primary-three" />
          <h3 className="text-sm font-semibold text-gray-900">Cálculo del saldo de IVA</h3>
        </div>

        <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <p className="text-xs font-semibold text-gray-700">IVA Crédito Fiscal</p>
            <p className="text-[11px] text-gray-500">(Compras)</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {importe(totalesCompras.iva)}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <p className="text-xs font-semibold text-gray-700">IVA Débito Fiscal</p>
            <p className="text-[11px] text-gray-500">(Ventas)</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{importe(totalesVentas.iva)}</p>
          </div>

          <div className="rounded-lg bg-green-50 p-3 text-center">
            <p className="text-xs font-semibold text-gray-700">Saldo de IVA</p>
            <p className="mt-1 text-base font-bold text-abacontex-primary">{importe(saldoIva)}</p>
            <p className="mt-1 text-[10px] text-gray-500">Calculado automáticamente</p>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold text-gray-700">Resultado</p>

            <CampoConError
              indiceError={errorResultado}
              onSeleccionarError={onSeleccionarError}
              className="min-h-10 text-xs"
            >
              {resultadoVisible(contenido.resultado)}
            </CampoConError>
          </div>
        </div>
      </section>

      <p className="text-[11px] leading-relaxed text-gray-500">
        Seleccioná un campo resaltado para consultar la diferencia. Los comprobantes omitidos que no
        tengan una fila asociada se muestran en el listado de errores detectados.
      </p>
    </div>
  );
}
