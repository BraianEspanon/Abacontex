import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, ShoppingBag, Calendar, User } from 'lucide-react';
import Button from '../ui/Button';
import { useProductos } from '../../hooks/useProductos';
import type { Producto } from '../../types/producto.types';

// Esquema de validación con coercion explícita para inputs y selects
const pedidoSchema = z.object({
  cliente: z.string().min(2, 'El nombre del cliente es obligatorio'),
  fecha: z.string().min(1, 'Selecciona una fecha válida'),
  items: z
    .array(
      z.object({
        productoId: z.coerce.number().min(1, 'Selecciona un producto de la lista'),
        cantidad: z.coerce.number().min(1, 'La cantidad debe ser al menos 1'),
      })
    )
    .min(1, 'Debes agregar al menos un producto al pedido'),
});

export type RegistrarPedidoFormValues = z.infer<typeof pedidoSchema>;

interface RegistrarPedidoFormProps {
  onSubmit: (data: RegistrarPedidoFormValues) => void;
  isLoading: boolean;
  onCancel: () => void;
  errorMessage?: string | null;
}

export default function RegistrarPedidoForm({
  onSubmit,
  isLoading,
  onCancel,
  errorMessage,
}: RegistrarPedidoFormProps) {
  // Carga de productos de la empresa
  const { data: productosResponse, isLoading: isLoadingProductos } = useProductos({
    pageSize: 100,
  });
  const productosList: Producto[] = Array.isArray(productosResponse)
    ? productosResponse
    : productosResponse?.items || [];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrarPedidoFormValues>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      cliente: '',
      fecha: new Date().toISOString().split('T')[0],
      items: [{ productoId: 0, cantidad: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // Observación en tiempo real para cálculos dinámicos
  const watchedItems = useWatch({ control, name: 'items' }) || [];

  const obtenerProducto = (id: number) => productosList.find((p) => Number(p.id) === Number(id));

  const totalGeneral = watchedItems.reduce((acc, item) => {
    const prod = obtenerProducto(Number(item?.productoId || 0));
    const cant = Number(item?.cantidad || 0);
    const precio = prod ? Number(prod.precioUnitario) : 0;
    return acc + cant * precio;
  }, 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Banner de error de API si ocurriese */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      {/* 1. Bloque: Información General */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <ShoppingBag size={18} className="text-indigo-600" />
          Información del Pedido
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
              <User size={14} className="text-gray-400" />
              Cliente *
            </label>
            <input
              {...register('cliente')}
              type="text"
              placeholder="Ej: Distribuidora Central S.A."
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm text-gray-900"
            />
            {errors.cliente && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.cliente.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              Fecha de Emisión *
            </label>
            <input
              {...register('fecha')}
              type="date"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm text-gray-900"
            />
            {errors.fecha && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.fecha.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Bloque: Tabla Dinámica de Productos */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">Detalle de Productos</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Selecciona los artículos y especifica las cantidades solicitadas.
            </p>
          </div>
          <button
            type="button"
            onClick={() => append({ productoId: 0, cantidad: 1 })}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition-colors"
          >
            <Plus size={15} />
            Agregar Producto
          </button>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3 w-32 text-center">Cantidad</th>
                <th className="px-4 py-3 w-36 text-right">Precio Un.</th>
                <th className="px-4 py-3 w-36 text-right">Subtotal</th>
                <th className="px-4 py-3 w-16 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {fields.map((field, index) => {
                const selectedProdId = watchedItems[index]?.productoId;
                const prod = obtenerProducto(Number(selectedProdId));
                const cantidad = Number(watchedItems[index]?.cantidad || 0);
                const precioUnitario = prod ? Number(prod.precioUnitario) : 0;
                const subtotal = cantidad * precioUnitario;

                return (
                  <tr key={field.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <select
                        {...register(`items.${index}.productoId`)}
                        disabled={isLoadingProductos}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                      >
                        <option value={0}>-- Seleccionar Producto --</option>
                        {productosList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre} (${Number(p.precioUnitario).toLocaleString('es-AR')})
                          </option>
                        ))}
                      </select>
                      {errors.items?.[index]?.productoId && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          {errors.items[index]?.productoId?.message}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <input
                        {...register(`items.${index}.cantidad`)}
                        type="number"
                        min={1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                      />
                      {errors.items?.[index]?.cantidad && (
                        <p className="text-red-500 text-xs mt-1 font-medium">
                          {errors.items[index]?.cantidad?.message}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-gray-600">
                      ${precioUnitario.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      ${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-30 transition-colors"
                        title="Eliminar fila"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {errors.items?.root && (
          <p className="text-red-500 text-xs font-medium">{errors.items.root.message}</p>
        )}

        {/* Total destacado */}
        <div className="flex justify-end pt-3">
          <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl px-6 py-3.5 flex items-center gap-6">
            <span className="text-sm font-bold text-indigo-900 uppercase tracking-wider">
              Total del Pedido:
            </span>
            <span className="text-2xl font-bold text-indigo-600">
              ${totalGeneral.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Botonera */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          label="Cancelar"
        />
        <Button
          type="submit"
          disabled={isLoading}
          label={isLoading ? 'Guardando...' : 'Guardar Pedido'}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm px-6"
        />
      </div>
    </form>
  );
}
