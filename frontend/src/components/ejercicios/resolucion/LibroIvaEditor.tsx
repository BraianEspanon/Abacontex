import { Calculator, Info, Plus, Trash2 } from 'lucide-react';

import Button from '../../ui/Button';
import InputImporte from './InputImporte';

import type {
  ComprobanteIva,
  ContenidoLibroIva,
  LiquidacionIva,
  TipoResultadoIva,
} from '../../../types/ejercicio.types';

interface LibroIvaEditorProps {
  contenido: ContenidoLibroIva;
  onChange: (contenido: ContenidoLibroIva) => void;
  soloLectura?: boolean;
}

function crearComprobante(): ComprobanteIva {
  return {
    fecha: '',
    comprobante: 0,
    nombre: '',
    netoGravado: 0,
    iva: 0,
    total: 0,
  };
}

function convertirFechaParaInput(fecha: string): string {
  if (!fecha) {
    return '';
  }

  const coincidencia = fecha.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!coincidencia) {
    return fecha;
  }

  const [, dia, mes, anio] = coincidencia;

  return `${anio}-${mes}-${dia}`;
}

function convertirFechaParaContenido(fecha: string): string {
  if (!fecha) {
    return '';
  }

  const coincidencia = fecha.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!coincidencia) {
    return fecha;
  }

  const [, anio, mes, dia] = coincidencia;

  return `${dia}/${mes}/${anio}`;
}

function redondearImporte(valor: number): number {
  return Number(valor.toFixed(2));
}

function calcularLiquidacion(contenido: ContenidoLibroIva): LiquidacionIva {
  const totalNetoCompras = redondearImporte(
    contenido.compras.reduce(
      (acumulado, comprobante) => acumulado + (comprobante.netoGravado || 0),
      0
    )
  );

  const totalIvaCreditoFiscal = redondearImporte(
    contenido.compras.reduce((acumulado, comprobante) => acumulado + (comprobante.iva || 0), 0)
  );

  const totalCompras = redondearImporte(
    contenido.compras.reduce((acumulado, comprobante) => acumulado + (comprobante.total || 0), 0)
  );

  const totalNetoVentas = redondearImporte(
    contenido.ventas.reduce(
      (acumulado, comprobante) => acumulado + (comprobante.netoGravado || 0),
      0
    )
  );

  const totalIvaDebitoFiscal = redondearImporte(
    contenido.ventas.reduce((acumulado, comprobante) => acumulado + (comprobante.iva || 0), 0)
  );

  const totalVentas = redondearImporte(
    contenido.ventas.reduce((acumulado, comprobante) => acumulado + (comprobante.total || 0), 0)
  );

  const diferencia = redondearImporte(totalIvaDebitoFiscal - totalIvaCreditoFiscal);

  const saldoIva = Math.abs(diferencia);

  const resultadoCalculado: TipoResultadoIva = diferencia > 0 ? 'A_PAGAR' : 'A_FAVOR_CONTRIBUYENTE';

  return {
    totalNetoCompras,
    totalIvaCreditoFiscal,
    totalCompras,
    totalNetoVentas,
    totalIvaDebitoFiscal,
    totalVentas,
    saldoIva,
    resultadoCalculado,
  };
}

function formatearImporte(valor: number): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

export default function LibroIvaEditor({
  contenido,
  onChange,
  soloLectura = false,
}: LibroIvaEditorProps) {
  const liquidacion = calcularLiquidacion(contenido);

  function agregarComprobante(tipo: 'compras' | 'ventas') {
    onChange({
      ...contenido,
      [tipo]: [...contenido[tipo], crearComprobante()],
    });
  }

  function eliminarComprobante(tipo: 'compras' | 'ventas', indiceComprobante: number) {
    onChange({
      ...contenido,
      [tipo]: contenido[tipo].filter((_, indice) => indice !== indiceComprobante),
    });
  }

  function actualizarComprobante(
    tipo: 'compras' | 'ventas',
    indiceComprobante: number,
    cambios: Partial<ComprobanteIva>
  ) {
    onChange({
      ...contenido,
      [tipo]: contenido[tipo].map((comprobante, indice) =>
        indice === indiceComprobante
          ? {
              ...comprobante,
              ...cambios,
            }
          : comprobante
      ),
    });
  }

  function actualizarImporte(
    tipo: 'compras' | 'ventas',
    indiceComprobante: number,
    campo: 'netoGravado' | 'iva' | 'total',
    valor: number
  ) {
    if (!Number.isFinite(valor) || valor < 0) {
      return;
    }

    actualizarComprobante(tipo, indiceComprobante, {
      [campo]: valor,
    });
  }

  function actualizarNumeroComprobante(
    tipo: 'compras' | 'ventas',
    indiceComprobante: number,
    valor: string
  ) {
    const numero = valor === '' ? 0 : Number(valor);

    if (!Number.isFinite(numero) || numero < 0) {
      return;
    }

    actualizarComprobante(tipo, indiceComprobante, {
      comprobante: numero,
    });
  }

  function actualizarResultado(resultado: TipoResultadoIva | null) {
    onChange({
      ...contenido,
      resultado,
    });
  }

  return (
    <div className="space-y-2">
      <SeccionComprobantes
        titulo="Libro IVA Compra"
        descripcionNombre="Nombre proveedor"
        tipo="compras"
        comprobantes={contenido.compras}
        onAgregar={() => agregarComprobante('compras')}
        onEliminar={(indice) => eliminarComprobante('compras', indice)}
        onActualizar={(indice, cambios) => actualizarComprobante('compras', indice, cambios)}
        onActualizarImporte={(indice, campo, valor) =>
          actualizarImporte('compras', indice, campo, valor)
        }
        onActualizarNumero={(indice, valor) =>
          actualizarNumeroComprobante('compras', indice, valor)
        }
        totalNeto={liquidacion.totalNetoCompras}
        totalIva={liquidacion.totalIvaCreditoFiscal}
        totalGeneral={liquidacion.totalCompras}
        soloLectura={soloLectura}
      />

      <SeccionComprobantes
        titulo="Libro IVA Venta"
        descripcionNombre="Nombre comprador"
        tipo="ventas"
        comprobantes={contenido.ventas}
        onAgregar={() => agregarComprobante('ventas')}
        onEliminar={(indice) => eliminarComprobante('ventas', indice)}
        onActualizar={(indice, cambios) => actualizarComprobante('ventas', indice, cambios)}
        onActualizarImporte={(indice, campo, valor) =>
          actualizarImporte('ventas', indice, campo, valor)
        }
        onActualizarNumero={(indice, valor) => actualizarNumeroComprobante('ventas', indice, valor)}
        totalNeto={liquidacion.totalNetoVentas}
        totalIva={liquidacion.totalIvaDebitoFiscal}
        totalGeneral={liquidacion.totalVentas}
        soloLectura={soloLectura}
      />

      {/* Cálculo del saldo de IVA */}
      <div className="mx-auto w-full max-w-5xl rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <Calculator size={17} className="text-abacontex-primary-three" />

          <h3 className="text-sm font-semibold text-gray-900">Cálculo del saldo de IVA</h3>
        </div>

        <div className="grid grid-cols-1 items-center gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1.1fr_1.5fr]">
          {/* Crédito fiscal */}
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-700">IVA Crédito Fiscal</p>

            <p className="text-[10px] text-gray-500">(Compras)</p>

            <p className="mt-1 text-base font-semibold text-gray-900">
              $ {formatearImporte(liquidacion.totalIvaCreditoFiscal)}
            </p>
          </div>

          <div className="hidden text-lg font-medium text-gray-500 lg:block">−</div>

          {/* Débito fiscal */}
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-700">IVA Débito Fiscal</p>

            <p className="text-[10px] text-gray-500">(Ventas)</p>

            <p className="mt-1 text-base font-semibold text-gray-900">
              $ {formatearImporte(liquidacion.totalIvaDebitoFiscal)}
            </p>
          </div>

          <div className="hidden text-lg font-medium text-gray-500 lg:block">=</div>

          {/* Saldo */}
          <div className="rounded-lg bg-abacontex-primary-three/10 px-4 py-2 text-center">
            <p className="text-xs font-semibold text-gray-700">Saldo de IVA</p>

            <p className="mt-0.5 text-lg font-bold text-abacontex-primary">
              $ {formatearImporte(liquidacion.saldoIva)}
            </p>

            <div className="mt-0.5 flex items-center justify-center gap-1 text-[9px] text-gray-500">
              <span>Monto calculado automáticamente</span>
              <Info size={10} />
            </div>
          </div>

          {/* Resultado */}
          <div>
            <label
              htmlFor="resultado-iva"
              className="mb-1 block text-xs font-semibold text-gray-700"
            >
              Resultado <span className="text-red-500">*</span>
            </label>

            <select
              id="resultado-iva"
              value={contenido.resultado ?? ''}
              disabled={soloLectura}
              onChange={(event) =>
                actualizarResultado(
                  event.target.value ? (event.target.value as TipoResultadoIva) : null
                )
              }
              className="h-8 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-700 outline-none transition focus:border-abacontex-primary-three focus:ring-1 focus:ring-abacontex-primary-three"
            >
              <option value="">Seleccioná el resultado</option>
              <option value="A_FAVOR_CONTRIBUYENTE">A favor del contribuyente</option>
              <option value="A_PAGAR">A pagar</option>
            </select>

            <div className="mt-1 flex items-start gap-1 text-[9px] text-gray-500">
              <Info size={10} className="mt-0.5 shrink-0 text-blue-500" />

              <span>Seleccioná el resultado según corresponda.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Tabla reutilizable para Compras / Ventas
// ============================================================================

interface SeccionComprobantesProps {
  titulo: string;
  descripcionNombre: string;
  tipo: 'compras' | 'ventas';
  comprobantes: ComprobanteIva[];
  soloLectura?: boolean;

  onAgregar: () => void;
  onEliminar: (indice: number) => void;
  onActualizar: (indice: number, cambios: Partial<ComprobanteIva>) => void;

  onActualizarImporte: (
    indice: number,
    campo: 'netoGravado' | 'iva' | 'total',
    valor: number
  ) => void;

  onActualizarNumero: (indice: number, valor: string) => void;

  totalNeto: number;
  totalIva: number;
  totalGeneral: number;
}

function SeccionComprobantes({
  titulo,
  descripcionNombre,
  tipo,
  comprobantes,
  onAgregar,
  onEliminar,
  onActualizar,
  onActualizarImporte,
  onActualizarNumero,
  totalNeto,
  totalIva,
  totalGeneral,
  soloLectura = false,
}: SeccionComprobantesProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900">{titulo}</h3>

        {!soloLectura && (
          <Button
            type="button"
            label="Agregar línea"
            variant="outline"
            icon={<Plus size={14} />}
            onClick={onAgregar}
            className="!rounded-lg !px-3 !py-1.5 !text-xs"
          />
        )}
      </div>

      {comprobantes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-center">
          <p className="text-xs text-gray-500">
            {tipo === 'compras'
              ? 'No hay comprobantes de compra cargados.'
              : 'No hay comprobantes de venta cargados.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] table-fixed text-xs">
            <colgroup>
              <col className="w-[13%]" />
              <col className="w-[13%]" />
              <col className="w-[24%]" />
              <col className="w-[16%]" />
              <col className="w-[14%]" />
              <col className="w-[17%]" />
              <col className="w-[3%]" />
            </colgroup>

            <thead>
              <tr className="border-y border-gray-200 text-center text-[11px] font-semibold text-gray-700">
                <th className="px-2 py-1">Fecha</th>

                <th className="px-2 py-1">N° comprobante</th>

                <th className="px-2 py-1">{descripcionNombre}</th>

                <th className="px-2 py-1">
                  Importe neto
                  <br />
                  gravado $
                </th>

                <th className="px-2 py-1">IVA facturado $</th>

                <th className="px-2 py-1">
                  Importe total
                  <br />
                  facturado $
                </th>

                <th className="px-1 py-1">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {comprobantes.map((comprobante, indice) => (
                <tr key={indice} className="border-b border-gray-100">
                  {/* Fecha */}
                  <td className="px-1.5 py-0.5">
                    <input
                      type="date"
                      value={convertirFechaParaInput(comprobante.fecha)}
                      onChange={(event) =>
                        onActualizar(indice, {
                          fecha: convertirFechaParaContenido(event.target.value),
                        })
                      }
                      disabled={soloLectura}
                      className="h-8 w-full rounded-md border border-gray-300 bg-white px-2 text-[11px] text-gray-700 outline-none focus:border-abacontex-primary-three focus:ring-1 focus:ring-abacontex-primary-three"
                    />
                  </td>

                  {/* Comprobante */}
                  <td className="px-1.5 py-0.5">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={comprobante.comprobante === 0 ? '' : comprobante.comprobante}
                      placeholder="0"
                      onChange={(event) => onActualizarNumero(indice, event.target.value)}
                      disabled={soloLectura}
                      className="h-8 w-full rounded-md border border-gray-300 bg-white px-2 text-right text-[11px] text-gray-700 outline-none focus:border-abacontex-primary-three focus:ring-1 focus:ring-abacontex-primary-three"
                    />
                  </td>

                  {/* Proveedor / comprador */}
                  <td className="px-1.5 py-0.5">
                    <input
                      type="text"
                      value={comprobante.nombre}
                      placeholder={tipo === 'compras' ? 'Proveedor' : 'Comprador'}
                      onChange={(event) =>
                        onActualizar(indice, {
                          nombre: event.target.value,
                        })
                      }
                      disabled={soloLectura}
                      className="h-8 w-full rounded-md border border-gray-300 bg-white px-2 text-[11px] text-gray-700 outline-none focus:border-abacontex-primary-three focus:ring-1 focus:ring-abacontex-primary-three"
                    />
                  </td>

                  {/* Neto */}
                  <td className="px-1.5 py-0.5">
                    <InputImporte
                      value={comprobante.netoGravado}
                      onChange={(valor) => onActualizarImporte(indice, 'netoGravado', valor)}
                      placeholder="0,00"
                      ariaLabel={`Importe neto gravado del comprobante ${indice + 1}`}
                      disabled={soloLectura}
                      className="h-8 w-full rounded-md border border-gray-300 bg-white px-2 text-right text-[11px] text-gray-700 outline-none focus:border-abacontex-primary-three focus:ring-1 focus:ring-abacontex-primary-three"
                    />
                  </td>

                  {/* IVA */}
                  <td className="px-1.5 py-0.5">
                    <InputImporte
                      value={comprobante.iva}
                      onChange={(valor) => onActualizarImporte(indice, 'iva', valor)}
                      placeholder="0,00"
                      ariaLabel={`IVA del comprobante ${indice + 1}`}
                      disabled={soloLectura}
                      className="h-8 w-full rounded-md border border-gray-300 bg-white px-2 text-right text-[11px] text-gray-700 outline-none focus:border-abacontex-primary-three focus:ring-1 focus:ring-abacontex-primary-three"
                    />
                  </td>

                  {/* Total */}
                  <td className="px-1.5 py-0.5">
                    <InputImporte
                      value={comprobante.total}
                      onChange={(valor) => onActualizarImporte(indice, 'total', valor)}
                      placeholder="0,00"
                      ariaLabel={`Importe total del comprobante ${indice + 1}`}
                      disabled={soloLectura}
                      className="h-8 w-full rounded-md border border-gray-300 bg-white px-2 text-right text-[11px] text-gray-700 outline-none focus:border-abacontex-primary-three focus:ring-1 focus:ring-abacontex-primary-three"
                    />
                  </td>

                  {/* Eliminar */}
                  <td className="px-1 py-0.5 text-center">
                    {!soloLectura && (
                      <button
                        type="button"
                        onClick={() => onEliminar(indice)}
                        className="inline-flex cursor-pointer items-center justify-center rounded-md p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                        aria-label={`Eliminar comprobante ${indice + 1}`}
                        title="Eliminar comprobante"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="bg-abacontex-primary-three/10 font-semibold text-gray-800">
                <td colSpan={3} className="px-2 py-1 text-center">
                  TOTALES
                </td>

                <td className="px-2 py-1 text-right">$ {formatearImporte(totalNeto)}</td>

                <td className="px-2 py-1 text-right">$ {formatearImporte(totalIva)}</td>

                <td className="px-2 py-1 text-right">$ {formatearImporte(totalGeneral)}</td>

                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
