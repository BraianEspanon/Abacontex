import { zodResolver } from '@hookform/resolvers/zod';
import { ClipboardList, Package, Plus } from 'lucide-react';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { usePedidosAsociablesProduccion } from '../../hooks/usePedidosAsociablesProduccion';
import { useProductos } from '../../hooks/useProductos';

import type {
  CrearOrdenProduccionRequest,
  PrioridadOrdenProduccion,
} from '../../types/produccion.types';

const crearOrdenProduccionFormSchema = z.object({
  pedidoId: z.number().int().positive().optional(),

  productoId: z
    .number({
      error: 'Seleccioná un producto.',
    })
    .int()
    .positive('Seleccioná un producto.'),

  cantidadProducir: z
    .number({
      error: 'Ingresá la cantidad a producir.',
    })
    .int('La cantidad debe ser un número entero.')
    .positive('La cantidad debe ser mayor a cero.'),

  prioridad: z.enum(['ALTA', 'MEDIA', 'BAJA'], {
    error: 'Seleccioná una prioridad.',
  }),
});

type CrearOrdenProduccionFormValues = z.infer<typeof crearOrdenProduccionFormSchema>;

interface CrearOrdenProduccionFormProps {
  onSubmit: (data: CrearOrdenProduccionRequest) => void;
  onCancelar: () => void;
  enviando?: boolean;
  pedidoInicialId?: number;
  bloquearPedido?: boolean;
}

const opcionesPrioridad: {
  valor: PrioridadOrdenProduccion;
  etiqueta: string;
  claseActiva: string;
}[] = [
  {
    valor: 'ALTA',
    etiqueta: 'Alta',
    claseActiva: 'border-red-300 bg-red-50 text-red-700',
  },
  {
    valor: 'MEDIA',
    etiqueta: 'Media',
    claseActiva: 'border-orange-300 bg-orange-50 text-orange-700',
  },
  {
    valor: 'BAJA',
    etiqueta: 'Baja',
    claseActiva: 'border-green-300 bg-green-50 text-green-700',
  },
];

export default function CrearOrdenProduccionForm({
  onSubmit,
  onCancelar,
  enviando = false,
  pedidoInicialId,
  bloquearPedido = false,
}: CrearOrdenProduccionFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    resetField,
    formState: { errors },
  } = useForm<CrearOrdenProduccionFormValues>({
    resolver: zodResolver(crearOrdenProduccionFormSchema),

    defaultValues: {
      pedidoId: pedidoInicialId,
      productoId: undefined,
      cantidadProducir: undefined,
      prioridad: 'MEDIA',
    },
  });

  const pedidoId = useWatch({
    control,
    name: 'pedidoId',
  });

  const productoId = useWatch({
    control,
    name: 'productoId',
  });

  const cantidadProducir = useWatch({
    control,
    name: 'cantidadProducir',
  });

  const prioridad = useWatch({
    control,
    name: 'prioridad',
  });

  const { data: productosData, isLoading: cargandoProductos } = useProductos({
    page: 1,
    pageSize: 100,
    orden: 'NOMBRE_ASC',
  });

  const { data: pedidosAsociables = [], isLoading: cargandoPedidos } =
    usePedidosAsociablesProduccion();

  const pedidoSeleccionado = pedidosAsociables.find((pedido) => pedido.idPedido === pedidoId);

  const faltanteSeleccionado = pedidoSeleccionado?.faltantes.find(
    (faltante) => faltante.productoId === productoId
  );

  const productosDisponibles = pedidoSeleccionado
    ? pedidoSeleccionado.faltantes.map((faltante) => ({
        id: faltante.productoId,
        nombre: faltante.productoNombre,
      }))
    : (productosData?.items ?? []).map((producto) => ({
        id: producto.id,
        nombre: producto.nombre,
      }));

  const bloquearProducto = pedidoSeleccionado?.faltantes.length === 1;

  useEffect(() => {
    if (!pedidoSeleccionado) {
      return;
    }

    resetField('productoId');
    resetField('cantidadProducir');

    if (pedidoSeleccionado.faltantes.length === 1) {
      const unicoFaltante = pedidoSeleccionado.faltantes[0];

      setValue('productoId', unicoFaltante.productoId, {
        shouldValidate: true,
      });

      setValue('cantidadProducir', unicoFaltante.cantidadPendiente, {
        shouldValidate: true,
      });
    }
  }, [pedidoSeleccionado, resetField, setValue]);

  useEffect(() => {
    if (!pedidoSeleccionado || !productoId) {
      return;
    }

    const faltante = pedidoSeleccionado.faltantes.find((item) => item.productoId === productoId);

    if (!faltante) {
      return;
    }

    setValue('cantidadProducir', faltante.cantidadPendiente, {
      shouldValidate: true,
    });
  }, [pedidoSeleccionado, productoId, setValue]);

  const procesarSubmit = (values: CrearOrdenProduccionFormValues) => {
    const payload: CrearOrdenProduccionRequest = {
      productoId: values.productoId,
      cantidadProducir: values.cantidadProducir,
      prioridad: values.prioridad,
    };

    if (values.pedidoId) {
      payload.pedidoId = values.pedidoId;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(procesarSubmit)} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <ClipboardList className="h-5 w-5 text-gray-700" />

          <h2 className="text-lg font-semibold text-gray-900">Datos de la orden</h2>
        </div>

        <div className="space-y-6">
          {/* Pedido asociado */}
          <div>
            <label htmlFor="pedidoId" className="mb-2 block text-sm font-medium text-gray-800">
              Pedido asociado{' '}
              {!bloquearPedido && <span className="font-normal text-gray-400">(opcional)</span>}
            </label>

            {bloquearPedido ? (
              <div className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 py-2.5 text-sm text-gray-700">
                {pedidoSeleccionado
                  ? `PED-${pedidoSeleccionado.idPedido
                      .toString()
                      .padStart(5, '0')} - ${pedidoSeleccionado.clienteNombre}`
                  : pedidoInicialId
                    ? `PED-${pedidoInicialId.toString().padStart(5, '0')}`
                    : 'Cargando pedido...'}
              </div>
            ) : (
              <select
                id="pedidoId"
                {...register('pedidoId', {
                  setValueAs: (value) => (value === '' ? undefined : Number(value)),
                })}
                disabled={cargandoPedidos}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20 disabled:bg-gray-100"
              >
                <option value="">Sin pedido asociado</option>

                {pedidosAsociables.map((pedido) => (
                  <option key={pedido.idPedido} value={pedido.idPedido}>
                    PED-
                    {pedido.idPedido.toString().padStart(5, '0')} - {pedido.clienteNombre}
                  </option>
                ))}
              </select>
            )}

            {bloquearPedido && (
              <p className="mt-1 text-xs text-gray-500">
                El pedido fue seleccionado desde el flujo de Pedidos y no puede modificarse.
              </p>
            )}
          </div>

          {/* Producto */}
          <div>
            <label htmlFor="productoId" className="mb-2 block text-sm font-medium text-gray-800">
              Producto <span className="text-red-500">*</span>
            </label>

            <select
              id="productoId"
              {...register('productoId', {
                setValueAs: (value) => (value === '' ? undefined : Number(value)),
              })}
              disabled={
                cargandoProductos || (Boolean(pedidoId) && !pedidoSeleccionado) || bloquearProducto
              }
              className={[
                'w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition',
                'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600',
                errors.productoId
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-300 focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20',
              ].join(' ')}
            >
              <option value="">
                {pedidoSeleccionado ? 'Seleccioná un producto faltante' : 'Seleccioná un producto'}
              </option>

              {productosDisponibles.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>

            {pedidoSeleccionado && pedidoSeleccionado.faltantes.length > 1 && (
              <p className="mt-1 text-xs text-gray-500">
                Seleccioná uno de los productos pendientes de este pedido.
              </p>
            )}

            {bloquearProducto && (
              <p className="mt-1 text-xs text-gray-500">
                El producto fue determinado automáticamente según el faltante del pedido.
              </p>
            )}

            {errors.productoId && (
              <p className="mt-1 text-xs text-red-600">{errors.productoId.message}</p>
            )}
          </div>

          {/* Cantidad */}
          <div>
            <label
              htmlFor="cantidadProducir"
              className="mb-2 block text-sm font-medium text-gray-800"
            >
              Cantidad a producir <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                id="cantidadProducir"
                type="number"
                min={1}
                step={1}
                readOnly={Boolean(pedidoSeleccionado)}
                {...register('cantidadProducir', {
                  setValueAs: (value) => (value === '' ? undefined : Number(value)),
                })}
                placeholder="Ingresá la cantidad"
                className={[
                  'w-full rounded-xl border px-3 py-2.5 pr-12 text-sm outline-none transition',
                  pedidoSeleccionado ? 'cursor-not-allowed bg-gray-100 text-gray-600' : 'bg-white',
                  errors.cantidadProducir
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-300 focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20',
                ].join(' ')}
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                u.
              </span>
            </div>

            {faltanteSeleccionado && (
              <p className="mt-1 text-xs text-gray-500">
                Cantidad faltante del pedido: {faltanteSeleccionado.cantidadPendiente} u.
              </p>
            )}

            {errors.cantidadProducir && (
              <p className="mt-1 text-xs text-red-600">{errors.cantidadProducir.message}</p>
            )}
          </div>

          {/* Prioridad */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-800">
              Prioridad <span className="text-red-500">*</span>
            </p>

            <div className="grid grid-cols-3 gap-3">
              {opcionesPrioridad.map((opcion) => {
                const seleccionada = prioridad === opcion.valor;

                return (
                  <button
                    key={opcion.valor}
                    type="button"
                    onClick={() =>
                      setValue('prioridad', opcion.valor, {
                        shouldValidate: true,
                      })
                    }
                    className={[
                      'rounded-xl border px-4 py-2.5 text-sm font-medium transition',
                      seleccionada
                        ? opcion.claseActiva
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50',
                    ].join(' ')}
                  >
                    {opcion.etiqueta}
                  </button>
                );
              })}
            </div>

            {errors.prioridad && (
              <p className="mt-1 text-xs text-red-600">{errors.prioridad.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Resumen */}
      <section className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#496647]">Resumen de la orden</h2>

        <div className="mt-6 space-y-5">
          <ResumenFila
            icono={<Package className="h-5 w-5" />}
            etiqueta="Producto"
            valor={
              productosDisponibles.find((producto) => producto.id === productoId)?.nombre ?? '—'
            }
          />

          <ResumenFila
            icono={<Plus className="h-5 w-5" />}
            etiqueta="Cantidad a producir"
            valor={cantidadProducir ? `${cantidadProducir} u.` : '—'}
          />

          <ResumenFila
            etiqueta="Prioridad"
            valor={prioridad ? prioridad.charAt(0) + prioridad.slice(1).toLowerCase() : '—'}
          />

          <ResumenFila
            etiqueta="Pedido asociado"
            valor={
              pedidoSeleccionado
                ? `PED-${pedidoSeleccionado.idPedido.toString().padStart(5, '0')}`
                : pedidoInicialId
                  ? `PED-${pedidoInicialId.toString().padStart(5, '0')}`
                  : '—'
            }
          />
        </div>
      </section>

      {/* Acciones */}
      <div className="flex flex-col-reverse gap-3 lg:col-span-2 lg:flex-row lg:justify-end">
        <button
          type="button"
          onClick={onCancelar}
          disabled={enviando}
          className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={enviando}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6f9468] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5f8059] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />

          {enviando ? 'Creando orden...' : 'Crear orden'}
        </button>
      </div>
    </form>
  );
}

interface ResumenFilaProps {
  icono?: React.ReactNode;
  etiqueta: string;
  valor: string;
}

function ResumenFila({ icono, etiqueta, valor }: ResumenFilaProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-3 text-gray-700">
        {icono}

        <span className="text-sm font-medium">{etiqueta}</span>
      </div>

      <span className="text-sm font-semibold text-gray-800">{valor}</span>
    </div>
  );
}
