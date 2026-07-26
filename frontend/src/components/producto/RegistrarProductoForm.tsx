import type { FieldErrors, UseFormRegister } from 'react-hook-form';

export interface RegistrarProductoFormData {
  nombre: string;
  descripcion: string;
  precioUnitario: number;
  stockInicial: number;
  fotoUrl: string;
}

interface RegistrarProductoFormProps {
  register: UseFormRegister<RegistrarProductoFormData>;
  errors: FieldErrors<RegistrarProductoFormData>;
  isPending: boolean;
  isError: boolean;
  onCancelar: () => void;
}

export default function RegistrarProductoForm({
  register,
  errors,
  isPending,
  isError,
  onCancelar,
}: RegistrarProductoFormProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-gray-700">
            Nombre del producto
          </label>

          <input
            id="nombre"
            type="text"
            placeholder="Ej.: Cuaderno personalizado"
            {...register('nombre')}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
              errors.nombre
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-[#4f6f52]'
            }`}
          />

          {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="descripcion" className="mb-2 block text-sm font-medium text-gray-700">
            Descripción
          </label>

          <textarea
            id="descripcion"
            rows={4}
            placeholder="Describí las principales características del producto."
            {...register('descripcion')}
            className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
              errors.descripcion
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-[#4f6f52]'
            }`}
          />

          {errors.descripcion && (
            <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="precioUnitario" className="mb-2 block text-sm font-medium text-gray-700">
            Precio unitario
          </label>

          <input
            id="precioUnitario"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            {...register('precioUnitario', {
              valueAsNumber: true,
            })}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
              errors.precioUnitario
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-[#4f6f52]'
            }`}
          />

          {errors.precioUnitario && (
            <p className="mt-1 text-sm text-red-600">{errors.precioUnitario.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="stockInicial" className="mb-2 block text-sm font-medium text-gray-700">
            Stock inicial
          </label>

          <input
            id="stockInicial"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            {...register('stockInicial', {
              valueAsNumber: true,
            })}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
              errors.stockInicial
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-[#4f6f52]'
            }`}
          />

          {errors.stockInicial && (
            <p className="mt-1 text-sm text-red-600">{errors.stockInicial.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="fotoUrl" className="mb-2 block text-sm font-medium text-gray-700">
            URL de la imagen <span className="font-normal text-gray-400">(opcional)</span>
          </label>

          <input
            id="fotoUrl"
            type="url"
            placeholder="https://ejemplo.com/producto.jpg"
            {...register('fotoUrl')}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
              errors.fotoUrl
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-[#4f6f52]'
            }`}
          />

          {errors.fotoUrl && <p className="mt-1 text-sm text-red-600">{errors.fotoUrl.message}</p>}

          <p className="mt-1 text-xs text-gray-500">
            Por el momento, la imagen se registra mediante una URL.
          </p>
        </div>
      </div>

      {isError && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          No fue posible registrar el producto. Revisá los datos e intentá nuevamente.
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancelar}
          disabled={isPending}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-[#4f6f52] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#405c43] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Registrando...' : 'Registrar producto'}
        </button>
      </div>
    </div>
  );
}
