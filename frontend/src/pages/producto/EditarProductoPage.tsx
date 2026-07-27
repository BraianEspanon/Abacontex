import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import EditarProductoForm from '../../components/producto/EditarProductoForm';

import { useActualizarProducto } from '../../hooks/useActualizarProducto';
import { useProductoDetalle } from '../../hooks/useProductoDetalle';

import type { EditarProductoFormData } from '../../components/producto/EditarProductoForm';
import type { ActualizarProductoPayload } from '../../types/producto.types';

const editarProductoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre del producto es obligatorio.')
    .max(100, 'El nombre no puede superar los 100 caracteres.'),

  descripcion: z
    .string()
    .trim()
    .min(1, 'La descripción es obligatoria.')
    .max(500, 'La descripción no puede superar los 500 caracteres.'),

  precioUnitario: z
    .number({
      error: 'El precio unitario es obligatorio.',
    })
    .finite('El precio unitario debe ser un número válido.')
    .positive('El precio unitario debe ser mayor que cero.'),
});

export default function EditarProductoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imagenSeleccionada, setImagenSeleccionada] = useState<File | null>(null);

  const productoId = Number(id);
  const productoIdValido = Number.isInteger(productoId) && productoId > 0;

  const actualizarProductoMutation = useActualizarProducto();

  const {
    data: producto,
    isLoading,
    isError,
    error,
  } = useProductoDetalle(productoIdValido ? productoId : null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditarProductoFormData>({
    resolver: zodResolver(editarProductoSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      precioUnitario: 0,
    },
  });

  useEffect(() => {
    if (!producto) {
      return;
    }

    reset({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precioUnitario: producto.precioUnitario,
    });
  }, [producto, reset]);

  const handleCancelar = () => {
    navigate('/alumno/productos');
  };

  const onSubmit = async (data: EditarProductoFormData) => {
    if (!productoIdValido || !producto) {
      return;
    }

    const payload: ActualizarProductoPayload = {
      nombre: data.nombre.trim(),
      descripcion: data.descripcion.trim(),
      precioUnitario: data.precioUnitario,

      /*
       * Mientras el backend no soporte la carga de archivos,
       * se conserva la imagen actual del producto.
       */
      fotoUrl: producto.fotoUrl ?? undefined,
    };

    try {
      await actualizarProductoMutation.mutateAsync({
        productoId,
        producto: payload,
      });

      navigate('/alumno/productos');
    } catch {
      // El error se muestra dentro del formulario.
    }
  };

  if (!productoIdValido) {
    return (
      <div className="px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-abacontex-black-text">Producto inválido</h1>

          <p className="mt-3 text-sm text-gray-500">El identificador del producto no es válido.</p>

          <Link
            to="/alumno/productos"
            className="mt-5 inline-flex text-sm font-semibold text-[#4f6f52]"
          >
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-5 w-52 rounded bg-gray-200" />

          <div className="mt-7 h-7 w-48 rounded bg-gray-200" />

          <div className="mt-4 h-4 w-80 rounded bg-gray-200" />

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="h-[580px] rounded-2xl bg-white shadow-sm" />

            <div className="h-[430px] rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !producto) {
    return (
      <div className="px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-abacontex-black-text">
            No fue posible cargar el producto
          </h1>

          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              Ocurrió un error al obtener los datos del producto.
            </p>

            {error instanceof Error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
          </div>

          <Link
            to="/alumno/productos"
            className="mt-5 inline-flex text-sm font-semibold text-[#4f6f52]"
          >
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  const hayCambios = isDirty || imagenSeleccionada !== null;

  return (
    <div className="min-h-full px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Migas de pan" className="mb-7 flex flex-wrap items-center gap-2 text-sm">
          <Link
            to="/alumno"
            aria-label="Ir al inicio"
            className="inline-flex items-center text-gray-500 transition hover:text-[#4f6f52]"
          >
            <Home size={18} />
          </Link>

          <ChevronRight size={15} className="text-gray-400" />

          <Link to="/alumno/productos" className="text-gray-500 transition hover:text-[#4f6f52]">
            Productos
          </Link>

          <ChevronRight size={15} className="text-gray-400" />

          <span aria-current="page" className="font-semibold text-gray-900">
            Editar producto
          </span>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-950">Editar producto</h1>

          <p className="mt-2 text-sm text-gray-500">
            Actualizá la información del producto seleccionado.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <EditarProductoForm
            register={register}
            control={control}
            errors={errors}
            stock={producto.stock}
            fotoActualUrl={producto.fotoUrl}
            imagenSeleccionada={imagenSeleccionada}
            onImagenSeleccionada={setImagenSeleccionada}
            isPending={actualizarProductoMutation.isPending}
            isError={actualizarProductoMutation.isError}
            hayCambios={hayCambios}
            onCancelar={handleCancelar}
          />
        </form>
      </div>
    </div>
  );
}
