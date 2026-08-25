import { ImagePlus, Trash2, UploadCloud } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { ChangeEvent, DragEvent, KeyboardEvent } from 'react';

import type { FieldErrors, UseFormRegister } from 'react-hook-form';

export interface RegistrarProductoFormData {
  nombre: string;
  descripcion: string;
  precioUnitario: number;
  margenGanancia: number;
  stockInicial: number;
}

interface RegistrarProductoFormProps {
  register: UseFormRegister<RegistrarProductoFormData>;
  errors: FieldErrors<RegistrarProductoFormData>;
  isPending: boolean;
  isError: boolean;

  imagenSeleccionada: File | null;

  nombreProducto: string;
  descripcionProducto: string;
  precioProducto: number;
  margenProducto: number;
  stockProducto: number;

  onImagenChange: (imagen: File | null) => void;
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
  }).format(precio);
}

function calcularPrecioVenta(precioUnitario: number, margenGanancia: number) {
  if (!Number.isFinite(precioUnitario) || !Number.isFinite(margenGanancia)) {
    return 0;
  }

  return precioUnitario * (1 + margenGanancia / 100);
}

export default function RegistrarProductoForm({
  register,
  errors,
  isPending,
  isError,
  imagenSeleccionada,
  nombreProducto,
  descripcionProducto,
  precioProducto,
  margenProducto,
  stockProducto,
  onImagenChange,
  onCancelar,
}: RegistrarProductoFormProps) {
  const inputArchivoRef = useRef<HTMLInputElement | null>(null);

  const imagenPreviewUrl = useMemo(() => {
    if (!imagenSeleccionada) {
      return null;
    }

    return URL.createObjectURL(imagenSeleccionada);
  }, [imagenSeleccionada]);

  const [imagenError, setImagenError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (imagenPreviewUrl) {
        URL.revokeObjectURL(imagenPreviewUrl);
      }
    };
  }, [imagenPreviewUrl]);

  const validarYSeleccionarImagen = (archivo?: File) => {
    setImagenError(null);

    if (!archivo) {
      return;
    }

    if (!TIPOS_IMAGEN_PERMITIDOS.includes(archivo.type)) {
      setImagenError('El archivo debe ser una imagen JPG, PNG o WebP.');

      return;
    }

    if (archivo.size > TAMANIO_MAXIMO_IMAGEN) {
      setImagenError('La imagen no puede superar los 5 MB.');

      return;
    }

    onImagenChange(archivo);
  };

  const handleInputArchivoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];

    validarYSeleccionarImagen(archivo);

    event.target.value = '';
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const archivo = event.dataTransfer.files?.[0];

    validarYSeleccionarImagen(archivo);
  };

  const handleAbrirSelector = () => {
    if (!isPending) {
      inputArchivoRef.current?.click();
    }
  };

  const handleSelectorKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleAbrirSelector();
    }
  };

  const handleQuitarImagen = () => {
    setImagenError(null);
    onImagenChange(null);
  };

  const cantidadCaracteresNombre = nombreProducto?.length ?? 0;
  const cantidadCaracteresDescripcion = descripcionProducto?.length ?? 0;

  const precioVenta = calcularPrecioVenta(precioProducto, margenProducto);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="space-y-6">
          <div>
            <label htmlFor="nombre" className="mb-1 block text-sm font-semibold text-gray-800">
              Nombre <span className="text-red-500">*</span>
            </label>

            <p className="mb-2 text-xs text-gray-500">Ingresá un nombre claro y descriptivo.</p>

            <input
              id="nombre"
              type="text"
              maxLength={50}
              placeholder="Ej.: Taza personalizada"
              disabled={isPending}
              {...register('nombre')}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                errors.nombre
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-[#4f6f52]'
              }`}
            />

            <div className="mt-1 flex items-start justify-between gap-4">
              {errors.nombre ? (
                <p className="text-sm text-red-600">{errors.nombre.message}</p>
              ) : (
                <p className="text-xs text-gray-400">Máx. 50 caracteres</p>
              )}

              <p className="shrink-0 text-xs text-gray-400">{cantidadCaracteresNombre}/50</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="stockInicial"
                className="mb-1 block text-sm font-semibold text-gray-800"
              >
                Stock inicial <span className="text-red-500">*</span>
              </label>

              <p className="mb-2 text-xs text-gray-500">Puede ser igual a cero.</p>

              <input
                id="stockInicial"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                disabled={isPending}
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

            <div>
              <label
                htmlFor="precioUnitario"
                className="mb-1 block text-sm font-semibold text-gray-800"
              >
                Precio unitario <span className="text-red-500">*</span>
              </label>

              <p className="mb-2 text-xs text-gray-500">Debe ser mayor a cero.</p>

              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-gray-700">
                  $
                </span>

                <input
                  id="precioUnitario"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  disabled={isPending}
                  {...register('precioUnitario', {
                    valueAsNumber: true,
                  })}
                  className={`w-full rounded-lg border py-2.5 pr-3 pl-7 text-sm outline-none transition ${
                    errors.precioUnitario
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-[#4f6f52]'
                  }`}
                />
              </div>

              {errors.precioUnitario && (
                <p className="mt-1 text-sm text-red-600">{errors.precioUnitario.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="margenGanancia"
                className="mb-1 block text-sm font-semibold text-gray-800"
              >
                Margen de ganancia <span className="text-red-500">*</span>
              </label>

              <p className="mb-2 text-xs text-gray-500">
                Indicá el porcentaje de ganancia sobre el precio unitario.
              </p>

              <div className="relative">
                <input
                  id="margenGanancia"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  disabled={isPending}
                  {...register('margenGanancia', {
                    valueAsNumber: true,
                  })}
                  className={`w-full rounded-lg border py-2.5 pr-9 pl-3 text-sm outline-none transition ${
                    errors.margenGanancia
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-[#4f6f52]'
                  }`}
                />

                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-medium text-gray-600">
                  %
                </span>
              </div>

              {errors.margenGanancia && (
                <p className="mt-1 text-sm text-red-600">{errors.margenGanancia.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-800">
                Precio de venta estimado
              </label>

              <p className="mb-2 text-xs text-gray-500">
                Se calcula automáticamente según el margen ingresado.
              </p>

              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700">
                {formatearPrecio(precioVenta)}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="descripcion" className="mb-1 block text-sm font-semibold text-gray-800">
              Descripción <span className="text-red-500">*</span>
            </label>

            <p className="mb-2 text-xs text-gray-500">
              Contá las características principales del producto.
            </p>

            <textarea
              id="descripcion"
              rows={4}
              maxLength={250}
              placeholder="Ej.: Taza de cerámica blanca con diseño personalizado."
              disabled={isPending}
              {...register('descripcion')}
              className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                errors.descripcion
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-[#4f6f52]'
              }`}
            />

            <div className="mt-1 flex items-start justify-between gap-4">
              {errors.descripcion ? (
                <p className="text-sm text-red-600">{errors.descripcion.message}</p>
              ) : (
                <p className="text-xs text-gray-400">Máx. 250 caracteres</p>
              )}

              <p className="shrink-0 text-xs text-gray-400">{cantidadCaracteresDescripcion}/250</p>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-4">
              <label className="block text-sm font-semibold text-gray-800">
                Fotografía del producto
                <span className="ml-1 font-normal text-gray-400">(opcional)</span>
              </label>

              {imagenSeleccionada && (
                <button
                  type="button"
                  onClick={handleQuitarImagen}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={14} />
                  Quitar
                </button>
              )}
            </div>

            <input
              ref={inputArchivoRef}
              id="imagenProducto"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleInputArchivoChange}
              className="hidden"
            />

            <div
              role="button"
              tabIndex={0}
              onClick={handleAbrirSelector}
              onKeyDown={handleSelectorKeyDown}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-5 text-center outline-none transition ${
                isDragging
                  ? 'border-[#4f6f52] bg-[#f3f7f3]'
                  : imagenError
                    ? 'border-red-300 bg-red-50'
                    : 'border-[#8aaa8d] bg-[#fbfdfb] hover:border-[#4f6f52] hover:bg-[#f6faf6]'
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9f1e9] text-[#4f6f52]">
                <UploadCloud size={22} />
              </div>

              <p className="mt-3 text-sm font-semibold text-gray-800">
                Arrastrá y soltá una imagen aquí
              </p>

              <p className="mt-1 text-xs text-gray-500">o hacé clic para seleccionarla</p>

              <p className="mt-2 text-[11px] text-gray-400">
                Solo se permite una imagen JPG, PNG o WebP, máx. 5 MB.
              </p>

              {imagenSeleccionada && (
                <p className="mt-2 max-w-full truncate text-xs font-medium text-[#4f6f52]">
                  {imagenSeleccionada.name}
                </p>
              )}
            </div>

            {imagenError && <p className="mt-2 text-sm text-red-600">{imagenError}</p>}
          </div>
        </div>

        {isError && (
          <div
            role="alert"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            No fue posible registrar el producto. Revisá los datos e intentá nuevamente.
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancelar}
            disabled={isPending}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-[#6f966f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5d825f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? 'Registrando...' : 'Guardar producto'}
          </button>
        </div>
      </section>

      <aside className="rounded-2xl bg-white p-5 shadow-sm lg:sticky lg:top-6">
        <h2 className="text-base font-semibold text-gray-900">Vista previa del producto</h2>

        <div className="mt-5 overflow-hidden">
          <div className="flex aspect-square items-center justify-center bg-gray-100">
            {imagenPreviewUrl ? (
              <img
                src={imagenPreviewUrl}
                alt="Vista previa del producto"
                className="h-full w-full object-contain p-4"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-300">
                <ImagePlus size={72} strokeWidth={1.2} />
              </div>
            )}
          </div>

          <div className="pt-5">
            <p className="text-sm font-semibold text-gray-800">Nombre del producto</p>

            <p className="mt-2 min-h-5 text-sm text-gray-600">
              {nombreProducto?.trim() || 'Producto sin nombre'}
            </p>

            <div className="my-4 border-t border-gray-200" />

            <p className="text-sm font-semibold text-gray-800">Precio unitario</p>

            <p className="mt-2 text-sm text-gray-700">{formatearPrecio(precioProducto)}</p>

            <div className="my-4 border-t border-gray-200" />

            <p className="text-sm font-semibold text-gray-800">Margen de ganancia</p>

            <p className="mt-2 text-sm text-gray-700">
              {Number.isFinite(margenProducto) ? `${margenProducto}%` : '0%'}
            </p>

            <div className="my-4 border-t border-gray-200" />

            <p className="text-sm font-semibold text-gray-800">Precio de venta</p>

            <p className="mt-2 text-sm font-medium text-gray-700">{formatearPrecio(precioVenta)}</p>

            <div className="my-4 border-t border-gray-200" />

            <p className="text-sm font-semibold text-gray-800">Stock inicial</p>

            <p className="mt-2 text-sm text-gray-700">
              {Number.isFinite(stockProducto) ? stockProducto : 0} unidades
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
