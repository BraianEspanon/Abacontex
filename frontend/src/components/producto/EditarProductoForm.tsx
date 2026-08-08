import { ImageOff, LockKeyhole, Save, Trash2, Upload, X } from 'lucide-react';

import { useEffect, useMemo, useState } from 'react';
import { useWatch } from 'react-hook-form';

import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

export interface EditarProductoFormData {
  nombre: string;
  descripcion: string;
  precioUnitario: number;
  margenGanancia: number;
}

interface EditarProductoFormProps {
  register: UseFormRegister<EditarProductoFormData>;
  control: Control<EditarProductoFormData>;
  errors: FieldErrors<EditarProductoFormData>;

  stock: number;
  fotoActualUrl: string | null;

  imagenSeleccionada: File | null;
  eliminarImagen: boolean;

  onImagenSeleccionada: (archivo: File | null) => void;
  onEliminarImagen: (eliminar: boolean) => void;

  isPending: boolean;
  isError: boolean;
  hayCambios: boolean;

  onCancelar: () => void;
}

const TIPOS_IMAGEN_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];

const TAMANIO_MAXIMO_IMAGEN = 5 * 1024 * 1024;

function formatearPrecio(precio: number) {
  if (!Number.isFinite(precio)) {
    return '$ 0,00';
  }

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(precio);
}

function calcularPrecioVenta(precioUnitario: number, margenGanancia: number) {
  if (!Number.isFinite(precioUnitario) || !Number.isFinite(margenGanancia)) {
    return 0;
  }

  return precioUnitario * (1 + margenGanancia / 100);
}

export default function EditarProductoForm({
  register,
  control,
  errors,
  stock,
  fotoActualUrl,
  imagenSeleccionada,
  eliminarImagen,
  onImagenSeleccionada,
  onEliminarImagen,
  isPending,
  isError,
  hayCambios,
  onCancelar,
}: EditarProductoFormProps) {
  const [errorImagen, setErrorImagen] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const nombre =
    useWatch({
      control,
      name: 'nombre',
    }) ?? '';

  const descripcion =
    useWatch({
      control,
      name: 'descripcion',
    }) ?? '';

  const precioUnitario =
    useWatch({
      control,
      name: 'precioUnitario',
    }) ?? 0;

  const margenGanancia =
    useWatch({
      control,
      name: 'margenGanancia',
    }) ?? 0;

  const imagenPreviewUrl = useMemo(() => {
    if (imagenSeleccionada) {
      return URL.createObjectURL(imagenSeleccionada);
    }

    if (eliminarImagen) {
      return null;
    }

    return fotoActualUrl;
  }, [imagenSeleccionada, eliminarImagen, fotoActualUrl]);

  useEffect(() => {
    return () => {
      if (imagenSeleccionada && imagenPreviewUrl) {
        URL.revokeObjectURL(imagenPreviewUrl);
      }
    };
  }, [imagenSeleccionada, imagenPreviewUrl]);

  const validarImagen = (archivo: File) => {
    if (!TIPOS_IMAGEN_PERMITIDOS.includes(archivo.type)) {
      setErrorImagen('Seleccioná una imagen JPG, PNG o WebP.');

      return false;
    }

    if (archivo.size > TAMANIO_MAXIMO_IMAGEN) {
      setErrorImagen('La imagen no puede superar los 5 MB.');

      return false;
    }

    setErrorImagen(null);

    return true;
  };

  const handleArchivo = (archivo: File | undefined) => {
    if (!archivo || isPending) {
      return;
    }

    if (!validarImagen(archivo)) {
      return;
    }

    onImagenSeleccionada(archivo);

    // Una nueva imagen reemplaza la actual.
    onEliminarImagen(false);
  };

  const handleQuitarNuevaImagen = () => {
    onImagenSeleccionada(null);
    setErrorImagen(null);
  };

  const handleEliminarImagen = () => {
    if (isPending) {
      return;
    }

    onImagenSeleccionada(null);
    setErrorImagen(null);

    onEliminarImagen(!eliminarImagen);
  };

  const precioVenta = calcularPrecioVenta(precioUnitario, margenGanancia);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-semibold text-gray-900">
              Nombre
              <span className="ml-1 text-red-500">*</span>
            </label>

            <p className="mt-1 text-xs text-gray-500">Ingresá un nombre claro y descriptivo.</p>

            <input
              id="nombre"
              type="text"
              disabled={isPending}
              {...register('nombre')}
              className={`mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition disabled:cursor-not-allowed disabled:bg-gray-50 ${
                errors.nombre
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-300 focus:border-[#769a75] focus:ring-2 focus:ring-[#769a75]/15'
              }`}
            />

            {errors.nombre && (
              <p className="mt-1.5 text-xs text-red-600">{errors.nombre.message}</p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="max-w-xs">
              <label htmlFor="precioUnitario" className="block text-sm font-semibold text-gray-900">
                Precio unitario
                <span className="ml-1 text-red-500">*</span>
              </label>

              <p className="mt-1 text-xs text-gray-500">Debe ser mayor que cero.</p>

              <div className="relative mt-2">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-semibold text-gray-700">
                  $
                </span>

                <input
                  id="precioUnitario"
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={isPending}
                  {...register('precioUnitario', {
                    valueAsNumber: true,
                  })}
                  className={`w-full rounded-lg border bg-white py-2.5 pr-3 pl-8 text-sm text-gray-800 outline-none transition disabled:cursor-not-allowed disabled:bg-gray-50 ${
                    errors.precioUnitario
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-300 focus:border-[#769a75] focus:ring-2 focus:ring-[#769a75]/15'
                  }`}
                />
              </div>

              {errors.precioUnitario && (
                <p className="mt-1.5 text-xs text-red-600">{errors.precioUnitario.message}</p>
              )}
            </div>

            <div className="max-w-xs">
              <label htmlFor="margenGanancia" className="block text-sm font-semibold text-gray-900">
                Margen de ganancia
                <span className="ml-1 text-red-500">*</span>
              </label>

              <p className="mt-1 text-xs text-gray-500">
                Porcentaje de ganancia aplicado al precio unitario.
              </p>

              <div className="relative mt-2">
                <input
                  id="margenGanancia"
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={isPending}
                  {...register('margenGanancia', {
                    valueAsNumber: true,
                  })}
                  className={`w-full rounded-lg border bg-white py-2.5 pr-8 pl-3 text-sm text-gray-800 outline-none transition disabled:cursor-not-allowed disabled:bg-gray-50 ${
                    errors.margenGanancia
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-300 focus:border-[#769a75] focus:ring-2 focus:ring-[#769a75]/15'
                  }`}
                />

                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-gray-600">
                  %
                </span>
              </div>

              {errors.margenGanancia && (
                <p className="mt-1.5 text-xs text-red-600">{errors.margenGanancia.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-900">
              Descripción
              <span className="ml-1 text-red-500">*</span>
            </label>

            <p className="mt-1 text-xs text-gray-500">
              Contá las características principales del producto.
            </p>

            <textarea
              id="descripcion"
              rows={4}
              maxLength={250}
              disabled={isPending}
              {...register('descripcion')}
              className={`mt-2 w-full resize-none rounded-lg border bg-white px-3 py-2.5 text-sm leading-6 text-gray-800 outline-none transition disabled:cursor-not-allowed disabled:bg-gray-50 ${
                errors.descripcion
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-300 focus:border-[#769a75] focus:ring-2 focus:ring-[#769a75]/15'
              }`}
            />

            <div className="mt-1 flex items-start justify-between gap-4">
              <div>
                {errors.descripcion && (
                  <p className="text-xs text-red-600">{errors.descripcion.message}</p>
                )}
              </div>

              <span className="shrink-0 text-xs text-gray-400">{descripcion.length}/250</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Fotografía del producto
              <span className="ml-1 font-normal text-gray-400">(opcional)</span>
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Podés reemplazar o eliminar la imagen actual.
            </p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="flex h-36 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-[#f7f6f2]">
                {imagenPreviewUrl ? (
                  <img
                    src={imagenPreviewUrl}
                    alt={`Vista previa de ${nombre || 'producto'}`}
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center text-center text-gray-400">
                    <ImageOff size={30} strokeWidth={1.5} />

                    <span className="mt-2 text-xs">
                      {eliminarImagen ? 'La imagen será eliminada' : 'Sin imagen'}
                    </span>
                  </div>
                )}
              </div>

              <label
                htmlFor="imagen-producto"
                onDragEnter={(event) => {
                  event.preventDefault();

                  if (!isPending) {
                    setIsDragging(true);
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault();

                  if (!isPending) {
                    setIsDragging(true);
                  }
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);

                  handleArchivo(event.dataTransfer.files?.[0]);
                }}
                className={`flex h-36 ${
                  isPending ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                } flex-col items-center justify-center rounded-xl border border-dashed px-4 text-center transition ${
                  isDragging
                    ? 'border-[#769a75] bg-[#eef5ed]'
                    : 'border-gray-300 bg-white hover:border-[#9caf9c] hover:bg-[#f8faf7]'
                }`}
              >
                <Upload size={21} className="text-gray-500" />

                <span className="mt-2 text-xs font-semibold text-gray-700">
                  {imagenPreviewUrl ? 'Reemplazar imagen' : 'Seleccionar imagen'}
                </span>

                <span className="mt-1 text-[11px] leading-4 text-gray-400">
                  JPG, PNG o WebP
                  <br />
                  Máximo 5 MB
                </span>

                <input
                  id="imagen-producto"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={isPending}
                  onChange={(event) => handleArchivo(event.target.files?.[0])}
                  className="sr-only"
                />
              </label>
            </div>

            {imagenSeleccionada && (
              <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2">
                <p className="min-w-0 truncate text-xs text-gray-600">{imagenSeleccionada.name}</p>

                <button
                  type="button"
                  onClick={handleQuitarNuevaImagen}
                  disabled={isPending}
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-red-500 transition hover:text-red-600 disabled:opacity-50"
                >
                  <X size={14} />
                  Quitar
                </button>
              </div>
            )}

            {fotoActualUrl && !imagenSeleccionada && !eliminarImagen && (
              <button
                type="button"
                onClick={handleEliminarImagen}
                disabled={isPending}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={14} />
                Eliminar imagen actual
              </button>
            )}

            {eliminarImagen && (
              <button
                type="button"
                onClick={handleEliminarImagen}
                disabled={isPending}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#4f6f52] transition hover:text-[#3e593f] disabled:opacity-50"
              >
                <X size={14} />
                Cancelar eliminación de imagen
              </button>
            )}

            {errorImagen && <p className="mt-2 text-xs text-red-600">{errorImagen}</p>}
          </div>

          <div className="max-w-xs">
            <label htmlFor="stock" className="block text-sm font-semibold text-gray-900">
              Stock disponible
            </label>

            <p className="mt-1 text-xs text-gray-500">
              El stock se modifica mediante los movimientos de inventario.
            </p>

            <div className="relative mt-2">
              <input
                id="stock"
                type="text"
                value={`${stock} unidades`}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 pr-10 text-sm text-gray-500 outline-none"
              />

              <LockKeyhole
                size={16}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {isError && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            No fue posible actualizar el producto. Revisá los datos e intentá nuevamente.
          </div>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancelar}
            disabled={isPending}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isPending || !hayCambios}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#769a75] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#638563] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />

            {isPending ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </section>

      <aside className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 lg:sticky lg:top-6">
        <h2 className="text-sm font-semibold text-gray-900">Vista previa del producto</h2>

        <div className="mt-5 flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#f2f2ef]">
          {imagenPreviewUrl ? (
            <img
              src={imagenPreviewUrl}
              alt={`Vista previa de ${nombre || 'producto'}`}
              className="h-full w-full object-contain p-4"
            />
          ) : (
            <ImageOff size={64} strokeWidth={1.2} className="text-gray-300" />
          )}
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold text-gray-900">Nombre del producto</p>

          <p className="mt-2 min-h-5 text-sm text-gray-600">{nombre.trim() || 'Sin nombre'}</p>
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="text-xs font-semibold text-gray-900">Precio unitario</p>

          <p className="mt-2 text-sm font-medium text-gray-700">
            {formatearPrecio(precioUnitario)}
          </p>
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="text-xs font-semibold text-gray-900">Margen de ganancia</p>

          <p className="mt-2 text-sm text-gray-600">
            {Number.isFinite(margenGanancia) ? `${margenGanancia}%` : '0%'}
          </p>
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="text-xs font-semibold text-gray-900">Precio de venta</p>

          <p className="mt-2 text-sm font-medium text-gray-700">{formatearPrecio(precioVenta)}</p>
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="text-xs font-semibold text-gray-900">Stock disponible</p>

          <p className="mt-2 text-sm text-gray-600">{stock} unidades</p>
        </div>
      </aside>
    </div>
  );
}
