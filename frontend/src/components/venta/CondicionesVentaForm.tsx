import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Percent } from 'lucide-react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import type {
  CantidadCuotasVenta,
  MetodoPago,
  PedidoListoVenta,
  RegistrarVentaRequest,
  TipoAjusteVenta,
} from '../../types/venta.types';

const cuotasDisponibles: CantidadCuotasVenta[] = [2, 3, 4, 6, 9, 12, 18, 24];

const condicionesVentaSchema = z
  .object({
    metodoPagoId: z
      .number({
        error: 'Seleccioná una forma de pago.',
      })
      .int()
      .positive(),

    tipoAjuste: z.enum(['NINGUNO', 'DESCUENTO', 'RECARGO']),

    porcentajeAjuste: z
      .number({
        error: 'Ingresá un porcentaje válido.',
      })
      .min(0, 'El porcentaje no puede ser negativo.')
      .max(100, 'El porcentaje no puede superar el 100%.'),

    cantidadCuotas: z
      .union([
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(6),
        z.literal(9),
        z.literal(12),
        z.literal(18),
        z.literal(24),
      ])
      .nullable(),

    porcentajeInteres: z
      .number({
        error: 'Ingresá un porcentaje válido.',
      })
      .min(0, 'El interés no puede ser negativo.')
      .max(100, 'El interés no puede superar el 100%.'),
  })
  .superRefine((data, ctx) => {
    if (data.tipoAjuste === 'NINGUNO' && data.porcentajeAjuste !== 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['porcentajeAjuste'],
        message: 'El porcentaje debe ser 0 cuando no se aplica un ajuste.',
      });
    }

    if (data.tipoAjuste !== 'NINGUNO' && data.porcentajeAjuste <= 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['porcentajeAjuste'],
        message: 'Ingresá un porcentaje mayor a 0.',
      });
    }
  });

type CondicionesVentaFormValues = z.infer<typeof condicionesVentaSchema>;

interface CondicionesVentaFormProps {
  pedido: PedidoListoVenta;
  metodosPago: MetodoPago[];
  aplicaIva: boolean;
  pedidoContenido: ReactNode;
  enviando?: boolean;
  onConfirmar: (data: RegistrarVentaRequest) => void;
  onCancelar: () => void;
}

const formatearMoneda = (valor: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(valor);
};

export default function CondicionesVentaForm({
  pedido,
  metodosPago,
  aplicaIva,
  pedidoContenido,
  enviando = false,
  onConfirmar,
  onCancelar,
}: CondicionesVentaFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CondicionesVentaFormValues>({
    resolver: zodResolver(condicionesVentaSchema),

    defaultValues: {
      metodoPagoId: undefined,
      tipoAjuste: 'NINGUNO',
      porcentajeAjuste: 0,
      cantidadCuotas: null,
      porcentajeInteres: 0,
    },
  });

  const metodoPagoId = useWatch({
    control,
    name: 'metodoPagoId',
  });

  const tipoAjuste =
    useWatch({
      control,
      name: 'tipoAjuste',
    }) ?? 'NINGUNO';

  const porcentajeAjuste =
    useWatch({
      control,
      name: 'porcentajeAjuste',
    }) ?? 0;

  const cantidadCuotas = useWatch({
    control,
    name: 'cantidadCuotas',
  });

  const porcentajeInteres =
    useWatch({
      control,
      name: 'porcentajeInteres',
    }) ?? 0;

  const metodoPagoSeleccionado = metodosPago.find((metodo) => metodo.idMetodoPago === metodoPagoId);

  const esCredito = metodoPagoSeleccionado?.nombre.trim().toLowerCase() === 'crédito';

  useEffect(() => {
    if (esCredito) {
      return;
    }

    setValue('cantidadCuotas', null);
    setValue('porcentajeInteres', 0);
  }, [esCredito, setValue]);

  useEffect(() => {
    if (tipoAjuste === 'NINGUNO') {
      setValue('porcentajeAjuste', 0);
    }
  }, [tipoAjuste, setValue]);

  /*
   * Mismos cálculos utilizados actualmente por el backend.
   */
  const subtotal = pedido.detalles.reduce((total, detalle) => {
    const precioUnitario = aplicaIva
      ? Number(detalle.producto.precioVenta)
      : Number(detalle.producto.precioConsumidorFinal);

    return total + precioUnitario * detalle.cantidad;
  }, 0);

  const importeAjuste = tipoAjuste === 'NINGUNO' ? 0 : subtotal * (porcentajeAjuste / 100);

  let subtotalConAjuste = subtotal;

  if (tipoAjuste === 'DESCUENTO') {
    subtotalConAjuste -= importeAjuste;
  }

  if (tipoAjuste === 'RECARGO') {
    subtotalConAjuste += importeAjuste;
  }

  const importeIva = aplicaIva ? subtotalConAjuste * 0.21 : 0;

  const totalConIva = subtotalConAjuste + importeIva;

  const importeInteres = esCredito ? totalConIva * (porcentajeInteres / 100) : 0;

  const totalFinal = totalConIva + importeInteres;

  const cambiarTipoAjuste = (tipo: Exclude<TipoAjusteVenta, 'NINGUNO'>) => {
    /*
     * Si vuelve a presionar el ajuste actualmente seleccionado,
     * se desactiva y vuelve a NINGUNO.
     *
     * Esto permite respetar la maqueta, donde solamente aparecen
     * Descuento y Recargo como botones.
     */
    if (tipoAjuste === tipo) {
      setValue('tipoAjuste', 'NINGUNO', {
        shouldValidate: true,
      });

      setValue('porcentajeAjuste', 0, {
        shouldValidate: true,
      });

      return;
    }

    setValue('tipoAjuste', tipo, {
      shouldValidate: true,
    });
  };

  const procesarSubmit = (values: CondicionesVentaFormValues) => {
    const payload: RegistrarVentaRequest = {
      pedidoId: pedido.idPedido,
      metodoPagoId: values.metodoPagoId,

      cantidadCuotas: esCredito ? values.cantidadCuotas : null,

      tipoAjuste: values.tipoAjuste,
      porcentajeAjuste: values.porcentajeAjuste,

      aplicaIva,

      porcentajeInteres: esCredito ? values.porcentajeInteres : 0,
    };

    onConfirmar(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(procesarSubmit)}
      className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]"
    >
      {/* COLUMNA IZQUIERDA */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* PEDIDO ASOCIADO */}
        {pedidoContenido}

        {/* CONDICIONES */}
        <section className="border-t border-gray-200 p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#496647] text-sm font-semibold text-white">
              2
            </div>

            <h2 className="text-lg font-semibold text-gray-900">Condiciones de la venta</h2>
          </div>

          {/* Primera fila como en la maqueta */}
          <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr_0.85fr]">
            {/* Forma de pago */}
            <div>
              <label
                htmlFor="metodoPagoId"
                className="mb-1.5 block text-sm font-medium text-gray-800"
              >
                Forma de pago <span className="text-red-500">*</span>
              </label>

              <select
                id="metodoPagoId"
                {...register('metodoPagoId', {
                  setValueAs: (value) => (value === '' ? undefined : Number(value)),
                })}
                className={[
                  'w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition',
                  errors.metodoPagoId
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-300 focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20',
                ].join(' ')}
              >
                <option value="">Seleccioná una forma de pago</option>

                {metodosPago.map((metodo) => (
                  <option key={metodo.idMetodoPago} value={metodo.idMetodoPago}>
                    {metodo.nombre}
                  </option>
                ))}
              </select>

              {errors.metodoPagoId && (
                <p className="mt-1 text-xs text-red-600">{errors.metodoPagoId.message}</p>
              )}
            </div>

            {/* Tipo de ajuste */}
            <div>
              <p className="mb-1.5 text-sm font-medium text-gray-800">Tipo de ajuste</p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => cambiarTipoAjuste('DESCUENTO')}
                  className={[
                    'rounded-lg border px-3 py-2.5 text-sm font-medium transition',
                    tipoAjuste === 'DESCUENTO'
                      ? 'border-[#496647] bg-[#496647] text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
                  ].join(' ')}
                >
                  Descuento
                </button>

                <button
                  type="button"
                  onClick={() => cambiarTipoAjuste('RECARGO')}
                  className={[
                    'rounded-lg border px-3 py-2.5 text-sm font-medium transition',
                    tipoAjuste === 'RECARGO'
                      ? 'border-[#496647] bg-[#496647] text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
                  ].join(' ')}
                >
                  Recargo
                </button>
              </div>
            </div>

            {/* Porcentaje */}
            <div>
              <label
                htmlFor="porcentajeAjuste"
                className="mb-1.5 block text-sm font-medium text-gray-800"
              >
                Porcentaje de ajuste
              </label>

              <div className="relative">
                <input
                  id="porcentajeAjuste"
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  disabled={tipoAjuste === 'NINGUNO'}
                  {...register('porcentajeAjuste', {
                    setValueAs: (value) => (value === '' ? 0 : Number(value)),
                  })}
                  className={[
                    'w-full rounded-lg border px-3 py-2.5 pr-9 text-sm outline-none transition',
                    tipoAjuste === 'NINGUNO'
                      ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                      : 'bg-white',
                    errors.porcentajeAjuste
                      ? 'border-red-400'
                      : 'border-gray-300 focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20',
                  ].join(' ')}
                />

                <Percent className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>

              {errors.porcentajeAjuste && (
                <p className="mt-1 text-xs text-red-600">{errors.porcentajeAjuste.message}</p>
              )}
            </div>
          </div>

          {/* Crédito */}
          {esCredito && (
            <div className="mt-4">
              <p className="mb-3 text-sm font-medium text-gray-800">Pago en cuotas</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="cantidadCuotas"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Cantidad de cuotas
                  </label>

                  <select
                    id="cantidadCuotas"
                    value={cantidadCuotas ?? ''}
                    onChange={(event) =>
                      setValue(
                        'cantidadCuotas',
                        event.target.value === ''
                          ? null
                          : (Number(event.target.value) as CantidadCuotasVenta),
                        {
                          shouldValidate: true,
                        }
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20"
                  >
                    <option value="">Seleccioná cuotas</option>

                    {cuotasDisponibles.map((cuota) => (
                      <option key={cuota} value={cuota}>
                        {cuota} cuotas
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="porcentajeInteres"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Interés de cuota
                  </label>

                  <div className="relative">
                    <input
                      id="porcentajeInteres"
                      type="number"
                      min={0}
                      max={100}
                      step="0.01"
                      {...register('porcentajeInteres', {
                        setValueAs: (value) => (value === '' ? 0 : Number(value)),
                      })}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20"
                    />

                    <Percent className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>

                  {errors.porcentajeInteres && (
                    <p className="mt-1 text-xs text-red-600">{errors.porcentajeInteres.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Acciones dentro de la tarjeta izquierda */}
          <div className="mt-8 flex justify-center gap-3">
            <button
              type="button"
              onClick={onCancelar}
              disabled={enviando}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={enviando || !metodoPagoId}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#6f9468] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5f8059] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCircle2 className="h-4 w-4" />

              {enviando ? 'Registrando venta...' : 'Confirmar venta'}
            </button>
          </div>
        </section>
      </div>

      {/* COLUMNA DERECHA */}
      <div className="space-y-4">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Resumen de la venta</h2>

          <div className="mt-6 space-y-5">
            <FilaResumen etiqueta="Subtotal" valor={formatearMoneda(subtotal)} />

            <FilaResumen
              etiqueta="Descuento / Recargo"
              valor={
                tipoAjuste === 'NINGUNO'
                  ? formatearMoneda(0)
                  : `${tipoAjuste === 'DESCUENTO' ? '-' : '+'} ${formatearMoneda(importeAjuste)}`
              }
            />

            {aplicaIva && <FilaResumen etiqueta="IVA (21%)" valor={formatearMoneda(importeIva)} />}

            <FilaResumen
              etiqueta={
                esCredito && porcentajeInteres > 0 ? `Interés (${porcentajeInteres}%)` : 'Interés'
              }
              valor={formatearMoneda(importeInteres)}
            />

            <div className="border-t border-gray-200 pt-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-lg font-semibold text-gray-900">Total final</span>

                <span className="text-xl font-bold text-[#496647]">
                  {formatearMoneda(totalFinal)}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#d7e3d4] bg-[#f5f8f4] px-5 py-4">
          <p className="text-sm leading-relaxed text-[#496647]">
            Al confirmar la venta, el pedido asociado pasará automáticamente a estado{' '}
            <strong>Completado</strong> y se generará el movimiento financiero correspondiente.
          </p>
        </section>
      </div>
    </form>
  );
}

interface FilaResumenProps {
  etiqueta: string;
  valor: string;
}

function FilaResumen({ etiqueta, valor }: FilaResumenProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-600">{etiqueta}</span>

      <span className="text-sm font-semibold text-gray-900">{valor}</span>
    </div>
  );
}
