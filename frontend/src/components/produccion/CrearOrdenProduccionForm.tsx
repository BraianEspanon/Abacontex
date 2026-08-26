import { zodResolver } from '@hookform/resolvers/zod';
import { ClipboardList, Flag, Package, Paperclip, Plus, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import Button from '../ui/Button';

import { useDebounce } from '../../hooks/useDebounce';
import { usePedidosAsociablesProduccion } from '../../hooks/usePedidosAsociablesProduccion';
import { useProductos } from '../../hooks/useProductos';

import type {
  CrearOrdenProduccionRequest,
  PrioridadOrdenProduccion,
} from '../../types/produccion.types';

const MAX_BUSQUEDA_PRODUCTO = 100;
const MAX_DIGITOS_CANTIDAD = 9;

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

interface ProductoBuscable {
  id: number;
  nombre: string;
}

const opcionesPrioridad: {
  valor: PrioridadOrdenProduccion;
  etiqueta: string;
  punto: string;
  claseActiva: string;
}[] = [
  {
    valor: 'ALTA',
    etiqueta: 'Alta',
    punto: 'bg-red-500',
    claseActiva: 'border-red-200 bg-red-50 text-red-600',
  },
  {
    valor: 'MEDIA',
    etiqueta: 'Media',
    punto: 'bg-orange-400',
    claseActiva: 'border-orange-200 bg-orange-50 text-orange-600',
  },
  {
    valor: 'BAJA',
    etiqueta: 'Baja',
    punto: 'bg-green-500',
    claseActiva: 'border-[#6f9468] bg-[#eaf3e8] text-[#496647]',
  },
];

export default function CrearOrdenProduccionForm({
  onSubmit,
  onCancelar,
  enviando = false,
  pedidoInicialId,
  bloquearPedido = false,
}: CrearOrdenProduccionFormProps) {
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [mostrarResultadosProducto, setMostrarResultadosProducto] = useState(false);

  const selectorProductoRef = useRef<HTMLDivElement>(null);

  const busquedaProductoDebounced = useDebounce(busquedaProducto, 300);

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
    search: busquedaProductoDebounced.trim() || undefined,
    page: 1,
    pageSize: 50,
    orden: 'NOMBRE_ASC',
  });

  const { data: pedidosAsociables = [], isLoading: cargandoPedidos } =
    usePedidosAsociablesProduccion();

  const pedidoSeleccionado = pedidosAsociables.find((pedido) => pedido.idPedido === pedidoId);

  const faltanteSeleccionado = pedidoSeleccionado?.faltantes.find(
    (faltante) => faltante.productoId === productoId
  );

  const productosDisponibles: ProductoBuscable[] = useMemo(() => {
    if (pedidoSeleccionado) {
      const termino = busquedaProductoDebounced.trim().toLowerCase();

      return pedidoSeleccionado.faltantes
        .filter((faltante) => faltante.productoNombre.toLowerCase().includes(termino))
        .map((faltante) => ({
          id: faltante.productoId,
          nombre: faltante.productoNombre,
        }));
    }

    return (productosData?.items ?? []).map((producto) => ({
      id: producto.id,
      nombre: producto.nombre,
    }));
  }, [pedidoSeleccionado, productosData?.items, busquedaProductoDebounced]);

  const productoSeleccionadoReal: ProductoBuscable | undefined = (() => {
    if (!productoId) {
      return undefined;
    }

    if (pedidoSeleccionado) {
      const faltante = pedidoSeleccionado.faltantes.find((item) => item.productoId === productoId);

      return faltante
        ? {
            id: faltante.productoId,
            nombre: faltante.productoNombre,
          }
        : undefined;
    }

    const producto = productosData?.items.find((item) => item.id === productoId);

    if (!producto) {
      return undefined;
    }

    return {
      id: producto.id,
      nombre: producto.nombre,
    };
  })();

  const bloquearProducto = pedidoSeleccionado?.faltantes.length === 1;

  useEffect(() => {
    const handleClickFuera = (event: MouseEvent) => {
      const selector = selectorProductoRef.current;

      if (!selector) {
        return;
      }

      if (!selector.contains(event.target as Node)) {
        setMostrarResultadosProducto(false);
      }
    };

    document.addEventListener('mousedown', handleClickFuera);

    return () => {
      document.removeEventListener('mousedown', handleClickFuera);
    };
  }, []);

  const handleCambiarPedido = (valor: string) => {
    const nuevoPedidoId = valor === '' ? undefined : Number(valor);

    setValue('pedidoId', nuevoPedidoId, {
      shouldValidate: true,
      shouldDirty: true,
    });

    resetField('productoId');
    resetField('cantidadProducir');

    setBusquedaProducto('');
    setMostrarResultadosProducto(false);

    if (!nuevoPedidoId) {
      return;
    }

    const pedido = pedidosAsociables.find((item) => item.idPedido === nuevoPedidoId);

    if (!pedido) {
      return;
    }

    if (pedido.faltantes.length === 1) {
      const unicoFaltante = pedido.faltantes[0];

      setValue('productoId', unicoFaltante.productoId, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue('cantidadProducir', unicoFaltante.cantidadPendiente, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleSeleccionarProducto = (producto: ProductoBuscable) => {
    setValue('productoId', producto.id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (pedidoSeleccionado) {
      const faltante = pedidoSeleccionado.faltantes.find((item) => item.productoId === producto.id);

      if (faltante) {
        setValue('cantidadProducir', faltante.cantidadPendiente, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }

    setBusquedaProducto('');
    setMostrarResultadosProducto(false);
  };

  const handleQuitarProducto = () => {
    if (bloquearProducto) {
      return;
    }

    resetField('productoId');
    resetField('cantidadProducir');

    setBusquedaProducto('');
    setMostrarResultadosProducto(false);
  };

  const handleFocusProducto = () => {
    if (productoId || bloquearProducto) {
      return;
    }

    setMostrarResultadosProducto(true);
  };

  const limitarCantidadADigitos = (event: React.FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;

    if (input.value.length > MAX_DIGITOS_CANTIDAD) {
      input.value = input.value.slice(0, MAX_DIGITOS_CANTIDAD);
    }
  };

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

  const prioridadMostrada = prioridad
    ? prioridad.charAt(0) + prioridad.slice(1).toLowerCase()
    : '—';

  const pedidoMostrado = pedidoSeleccionado
    ? `PED-${pedidoSeleccionado.idPedido.toString().padStart(5, '0')}`
    : pedidoInicialId
      ? `PED-${pedidoInicialId.toString().padStart(5, '0')}`
      : '—';

  return (
    <form
      onSubmit={handleSubmit(procesarSubmit)}
      className="grid items-start gap-5 lg:grid-cols-[1.12fr_0.88fr]"
    >
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <ClipboardList className="h-5 w-5 text-gray-800" />

          <h2 className="text-lg font-semibold text-gray-900">Datos de la orden</h2>
        </div>

        <div className="space-y-5">
          <div ref={selectorProductoRef}>
            <label className="mb-1.5 block text-sm font-medium text-gray-800">
              Producto <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              {productoSeleccionadoReal ? (
                <div
                  className={[
                    'flex h-[42px] w-full items-center rounded-lg border px-2',
                    bloquearProducto ? 'border-gray-300 bg-gray-100' : 'border-[#496647] bg-white',
                  ].join(' ')}
                >
                  <div className="flex max-w-full items-center gap-2 rounded-md bg-gray-100 px-2.5 py-1">
                    <Package className="h-3.5 w-3.5 shrink-0 text-gray-500" />

                    <span className="max-w-[320px] truncate text-sm font-medium text-gray-700">
                      {productoSeleccionadoReal.nombre}
                    </span>

                    {!bloquearProducto && (
                      <button
                        type="button"
                        onClick={handleQuitarProducto}
                        aria-label={`Quitar ${productoSeleccionadoReal.nombre}`}
                        title="Quitar selección"
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                      id="productoId"
                      type="text"
                      maxLength={MAX_BUSQUEDA_PRODUCTO}
                      value={busquedaProducto}
                      onChange={(event) => {
                        setBusquedaProducto(event.target.value);
                        setMostrarResultadosProducto(true);
                      }}
                      onFocus={handleFocusProducto}
                      placeholder={
                        pedidoSeleccionado ? 'Buscar producto faltante' : 'Buscar producto'
                      }
                      autoComplete="off"
                      disabled={
                        cargandoProductos ||
                        (Boolean(pedidoId) && !pedidoSeleccionado) ||
                        bloquearProducto
                      }
                      className={[
                        'w-full rounded-lg border bg-white py-2.5 pr-3 pl-9 text-sm outline-none transition',
                        'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600',
                        errors.productoId
                          ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                          : 'border-gray-300 focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20',
                      ].join(' ')}
                    />
                  </div>

                  {mostrarResultadosProducto && !productoId && (
                    <div className="absolute top-[calc(100%+4px)] right-0 left-0 z-30 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                      {cargandoProductos && !pedidoSeleccionado && (
                        <div className="px-4 py-3 text-sm text-gray-500">Cargando productos...</div>
                      )}

                      {!cargandoProductos && productosDisponibles.length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          {busquedaProductoDebounced.trim()
                            ? 'No se encontraron productos con esa búsqueda.'
                            : 'No hay productos disponibles.'}
                        </div>
                      )}

                      {productosDisponibles.map((producto) => (
                        <button
                          key={producto.id}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => handleSeleccionarProducto(producto)}
                          className="flex w-full items-center gap-3 border-b border-gray-100 px-3 py-2.5 text-left transition last:border-b-0 hover:bg-gray-50"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100">
                            <Package className="h-4 w-4 text-gray-400" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {producto.nombre}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {pedidoSeleccionado && pedidoSeleccionado.faltantes.length > 1 && (
              <p className="mt-1 text-xs text-gray-500">
                Seleccioná uno de los productos pendientes del pedido.
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

          <div>
            <label
              htmlFor="cantidadProducir"
              className="mb-1.5 block text-sm font-medium text-gray-800"
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
                onInput={limitarCantidadADigitos}
                placeholder="Ingrese la cantidad"
                className={[
                  'w-full rounded-lg border px-3 py-2.5 pr-12 text-sm outline-none transition',
                  pedidoSeleccionado ? 'cursor-not-allowed bg-gray-100 text-gray-600' : 'bg-white',
                  errors.cantidadProducir
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-300 focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20',
                ].join(' ')}
              />

              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-gray-500">
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

          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-800">
              Prioridad <span className="text-red-500">*</span>
            </p>

            <div className="grid grid-cols-3 gap-4">
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
                      'flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition',
                      seleccionada
                        ? opcion.claseActiva
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50',
                    ].join(' ')}
                  >
                    <span className={['h-2 w-2 rounded-full', opcion.punto].join(' ')} />

                    {opcion.etiqueta}
                  </button>
                );
              })}
            </div>

            {errors.prioridad && (
              <p className="mt-1 text-xs text-red-600">{errors.prioridad.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="pedidoId" className="mb-1.5 block text-sm font-medium text-gray-800">
              Pedido asociado{' '}
              {!bloquearPedido && <span className="font-normal text-gray-400">(opcional)</span>}
            </label>

            {bloquearPedido ? (
              <div className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2.5 text-sm text-gray-700">
                {pedidoSeleccionado
                  ? `PED-${pedidoSeleccionado.idPedido.toString().padStart(5, '0')} - ${
                      pedidoSeleccionado.clienteNombre
                    }`
                  : pedidoInicialId
                    ? `PED-${pedidoInicialId.toString().padStart(5, '0')}`
                    : 'Cargando pedido...'}
              </div>
            ) : (
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <select
                  id="pedidoId"
                  value={pedidoId ?? ''}
                  onChange={(event) => handleCambiarPedido(event.target.value)}
                  disabled={cargandoPedidos}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pr-3 pl-9 text-sm outline-none transition focus:border-[#6f9468] focus:ring-2 focus:ring-[#6f9468]/20 disabled:bg-gray-100"
                >
                  <option value="">Buscar pedido</option>

                  {pedidosAsociables.map((pedido) => (
                    <option key={pedido.idPedido} value={pedido.idPedido}>
                      PED-
                      {pedido.idPedido.toString().padStart(5, '0')} - {pedido.clienteNombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {bloquearPedido && (
              <p className="mt-1 text-xs text-gray-500">
                El pedido fue seleccionado desde el flujo de Pedidos y no puede modificarse.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="h-fit w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:max-w-[520px] lg:justify-self-end">
        <div className="mb-4 flex items-center gap-3">
          <Paperclip className="h-5 w-5 text-gray-800" />

          <h2 className="text-lg font-semibold text-gray-900">Resumen de la orden</h2>
        </div>

        <div>
          <ResumenFila
            icono={<Package className="h-4 w-4" />}
            etiqueta="Producto"
            valor={productoSeleccionadoReal?.nombre ?? '—'}
          />

          <ResumenFila
            icono={<Plus className="h-4 w-4" />}
            etiqueta="Cantidad a producir"
            valor={cantidadProducir ? `${cantidadProducir} u.` : '—'}
          />

          <ResumenFila
            icono={<Flag className="h-4 w-4" />}
            etiqueta="Prioridad"
            valor={prioridadMostrada}
          />

          <ResumenFila
            icono={<ChevronRightIcon />}
            etiqueta="Pedido asociado"
            valor={pedidoMostrado}
          />
        </div>
      </section>

      <div className="-mt-1 flex flex-col-reverse gap-3 lg:col-span-2 lg:flex-row lg:justify-end">
        <Button
          type="button"
          variant="outline"
          label="Cancelar"
          onClick={onCancelar}
          disabled={enviando}
          className="!rounded-lg !px-5 !py-2.5"
        />

        <Button
          type="submit"
          variant="solid"
          label={enviando ? 'Creando orden...' : 'Crear orden'}
          icon={<Plus className="h-4 w-4" />}
          disabled={enviando}
          className="!rounded-lg !px-5 !py-2.5"
        />
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
    <div className="flex min-h-[52px] items-center justify-between gap-4 border-b border-gray-100 py-3 last:border-b-0">
      <div className="flex items-center gap-3 text-gray-800">
        {icono && <span className="text-gray-700">{icono}</span>}

        <span className="text-sm font-medium">{etiqueta}</span>
      </div>

      <span className="max-w-[50%] truncate text-sm font-medium text-[#496647]">{valor}</span>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <div className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-700 text-[9px] leading-none font-bold text-gray-700">
      »
    </div>
  );
}
