import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
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

  fotoUrl: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || z.string().url().safeParse(value).success,
      'Ingresá una URL válida.'
    ),
});

export default function EditarProductoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

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
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditarProductoFormData>({
    resolver: zodResolver(editarProductoSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      precioUnitario: 0,
      fotoUrl: '',
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
      fotoUrl: producto.fotoUrl ?? '',
    });
  }, [producto, reset]);

  const handleCancelar = () => {
    navigate('/alumno/productos');
  };

  const onSubmit = async (data: EditarProductoFormData) => {
    if (!productoIdValido) {
      return;
    }

    const payload: ActualizarProductoPayload = {
      nombre: data.nombre.trim(),
      descripcion: data.descripcion.trim(),
      precioUnitario: data.precioUnitario,
      fotoUrl: data.fotoUrl.trim() || undefined,
    };

    try {
      await actualizarProductoMutation.mutateAsync({
        productoId,
        producto: payload,
      });

      navigate('/alumno/productos');
    } catch {
      // El estado de error se muestra desde la mutación.
    }
  };

  if (!productoIdValido) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-abacontex-black-text">Producto inválido</h1>

        <p className="mt-3 text-sm text-gray-500">El identificador del producto no es válido.</p>

        <Link
          to="/alumno/productos"
          className="mt-5 inline-flex text-sm font-semibold text-[#4f6f52]"
        >
          Volver a productos
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (isError || !producto) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-abacontex-black-text">
          No fue posible cargar el producto
        </h1>

        <p className="mt-3 text-sm text-red-600">
          Ocurrió un error al obtener los datos del producto.
        </p>

        {error instanceof Error && <p className="mt-2 text-sm text-gray-500">{error.message}</p>}

        <Link
          to="/alumno/productos"
          className="mt-5 inline-flex text-sm font-semibold text-[#4f6f52]"
        >
          Volver a productos
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link
        to="/alumno/productos"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#4f6f52]"
      >
        <ArrowLeft size={17} />
        Volver a productos
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-abacontex-black-text">Editar producto</h1>

        <p className="mt-2 text-sm text-gray-500">Modificá los datos generales del producto.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <EditarProductoForm
          register={register}
          errors={errors}
          isPending={actualizarProductoMutation.isPending}
          isError={actualizarProductoMutation.isError}
          onCancelar={handleCancelar}
        />
      </form>
    </div>
  );
}
