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
    .max(50, 'El nombre no puede superar los 50 caracteres.'),

  descripcion: z
    .string()
    .trim()
    .min(1, 'La descripción es obligatoria.')
    .max(250, 'La descripción no puede superar los 250 caracteres.'),

  precioUnitario: z
    .number({
      error: 'El precio unitario es obligatorio.',
    })
    .finite('El precio unitario debe ser un número válido.')
    .positive('El precio unitario debe ser mayor que cero.'),

  margenGanancia: z
    .number({
      error: 'El margen de ganancia es obligatorio.',
    })
    .finite('El margen de ganancia debe ser un número válido.')
    .min(0, 'El margen de ganancia no puede ser negativo.'),
});

export default function EditarProductoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imagenSeleccionada, setImagenSeleccionada] = useState<File | null>(null);
  const [eliminarImagen, setEliminarImagen] = useState(false);

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
      margenGanancia: 0,
    },
  });

  useEffect(() => {
    if (!producto) {
      return;
    }

    reset({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precioUnitario: Number(producto.precioUnitario),
      margenGanancia: Number(producto.margenGanancia),
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
      margenGanancia: data.margenGanancia,
    };

    if (imagenSeleccionada) {
      payload.foto = imagenSeleccionada;
    }

    if (eliminarImagen) {
      payload.eliminarFoto = true;
    }

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
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-gray-900">Producto inválido</h1>

        <p className="text-sm text-gray-500">El identificador del producto no es válido.</p>

        <Link to="/alumno/productos" className="inline-flex text-sm font-semibold text-[#4f6f52]">
          Volver a productos
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Cargando producto...</p>
      </div>
    );
  }

  if (isError || !producto) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-gray-900">No fue posible cargar el producto</h1>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-700">
            Ocurrió un error al obtener los datos del producto.
          </p>

          {error instanceof Error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
        </div>

        <Link to="/alumno/productos" className="inline-flex text-sm font-semibold text-[#4f6f52]">
          Volver a productos
        </Link>
      </div>
    );
  }

  const hayCambios = isDirty || imagenSeleccionada !== null || eliminarImagen;

  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/alumno" className="flex items-center gap-1 transition hover:text-gray-700">
          <Home className="h-4 w-4" />
          Inicio
        </Link>

        <ChevronRight className="h-4 w-4" />

        <Link to="/alumno/productos" className="transition hover:text-gray-700">
          Productos
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="font-medium text-gray-700">Editar producto</span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold text-gray-900">Editar producto</h1>

        <p className="mt-2 text-base text-gray-500">
          Actualizá la información del producto seleccionado.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <EditarProductoForm
          register={register}
          control={control}
          errors={errors}
          stock={producto.stock}
          fotoActualUrl={producto.fotoUrl}
          imagenSeleccionada={imagenSeleccionada}
          eliminarImagen={eliminarImagen}
          onImagenSeleccionada={setImagenSeleccionada}
          onEliminarImagen={setEliminarImagen}
          isPending={actualizarProductoMutation.isPending}
          isError={actualizarProductoMutation.isError}
          hayCambios={hayCambios}
          onCancelar={handleCancelar}
        />
      </form>
    </div>
  );
}
