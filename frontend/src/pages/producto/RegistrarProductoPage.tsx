import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import RegistrarProductoForm from '../../components/producto/RegistrarProductoForm';
import { useCrearProducto } from '../../hooks/useCrearProducto';

import type { RegistrarProductoFormData } from '../../components/producto/RegistrarProductoForm';
import type { CrearProductoPayload } from '../../types/producto.types';

interface ErrorResponse {
  message?: string;
  error?: string;
}

const registrarProductoSchema = z.object({
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

  stockInicial: z
    .number({
      error: 'El stock inicial es obligatorio.',
    })
    .int('El stock inicial debe ser un número entero.')
    .min(0, 'El stock inicial no puede ser negativo.'),

  fotoUrl: z
    .string()
    .trim()
    .refine((value) => value === '' || z.url().safeParse(value).success, 'Ingresá una URL válida.'),
});

export default function RegistrarProductoPage() {
  const navigate = useNavigate();
  const crearProductoMutation = useCrearProducto();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegistrarProductoFormData>({
    resolver: zodResolver(registrarProductoSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      precioUnitario: 0,
      stockInicial: 0,
      fotoUrl: '',
    },
  });

  const handleCancelar = () => {
    navigate('/alumno/productos');
  };

  const onSubmit = async (data: RegistrarProductoFormData) => {
    clearErrors('nombre');
    crearProductoMutation.reset();

    const payload: CrearProductoPayload = {
      nombre: data.nombre.trim(),
      descripcion: data.descripcion.trim(),
      precioUnitario: data.precioUnitario,
      stockInicial: data.stockInicial,
      fotoUrl: data.fotoUrl.trim() || undefined,
    };

    try {
      await crearProductoMutation.mutateAsync(payload);

      navigate('/alumno/productos');
    } catch (error) {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        const status = error.response?.status;
        const mensajeBackend = error.response?.data?.message ?? error.response?.data?.error ?? '';

        const esNombreDuplicado =
          status === 409 ||
          mensajeBackend.toLowerCase().includes('existe') ||
          mensajeBackend.toLowerCase().includes('duplicado');

        if (esNombreDuplicado) {
          setError(
            'nombre',
            {
              type: 'server',
              message: 'Ya existe un producto con ese nombre. Ingresá un nombre diferente.',
            },
            {
              shouldFocus: true,
            }
          );

          crearProductoMutation.reset();
        }
      }
    }
  };

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
        <h1 className="text-3xl font-bold text-abacontex-black-text">Registrar producto</h1>

        <p className="mt-2 text-sm text-gray-500">
          Completá los datos para agregar un nuevo producto al catálogo de tu empresa.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <RegistrarProductoForm
          register={register}
          errors={errors}
          isPending={crearProductoMutation.isPending}
          isError={crearProductoMutation.isError}
          onCancelar={handleCancelar}
        />
      </form>
    </div>
  );
}
