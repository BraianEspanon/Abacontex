import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { ChevronRight, Home } from 'lucide-react';
import { useState } from 'react';
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

  stockInicial: z
    .number({
      error: 'El stock inicial es obligatorio.',
    })
    .int('El stock inicial debe ser un número entero.')
    .min(0, 'El stock inicial no puede ser negativo.'),
});

export default function RegistrarProductoPage() {
  const navigate = useNavigate();
  const crearProductoMutation = useCrearProducto();

  const [imagenSeleccionada, setImagenSeleccionada] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<RegistrarProductoFormData>({
    resolver: zodResolver(registrarProductoSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      precioUnitario: 0,
      margenGanancia: 0,
      stockInicial: 0,
    },
  });

  const nombreProducto = watch('nombre');
  const descripcionProducto = watch('descripcion');
  const precioProducto = watch('precioUnitario');
  const margenProducto = watch('margenGanancia');
  const stockProducto = watch('stockInicial');

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
      margenGanancia: data.margenGanancia,
      stockInicial: data.stockInicial,
      foto: imagenSeleccionada ?? undefined,
    };

    try {
      await crearProductoMutation.mutateAsync(payload);

      navigate('/alumno/productos');
    } catch (error) {
      if (!axios.isAxiosError<ErrorResponse>(error)) {
        return;
      }

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
  };

  return (
    <div className="min-h-screen bg-[#f5f6f4]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="mb-5 flex items-center gap-2 text-sm">
          <Link
            to="/alumno"
            className="inline-flex items-center gap-1 text-gray-500 transition hover:text-[#4f6f52]"
          >
            <Home size={15} />
            Inicio
          </Link>

          <ChevronRight size={15} className="text-gray-400" />

          <Link
            to="/alumno/productos"
            className="font-medium text-gray-500 transition hover:text-[#4f6f52]"
          >
            Productos
          </Link>

          <ChevronRight size={15} className="text-gray-400" />

          <span aria-current="page" className="font-semibold text-gray-900">
            Registrar producto
          </span>
        </nav>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-abacontex-black-text">Registrar producto</h1>

          <p className="mt-3 text-base text-gray-500">
            Completá la información del nuevo producto que formará parte del catálogo de tu empresa.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <RegistrarProductoForm
            register={register}
            errors={errors}
            isPending={crearProductoMutation.isPending}
            isError={crearProductoMutation.isError}
            imagenSeleccionada={imagenSeleccionada}
            nombreProducto={nombreProducto}
            descripcionProducto={descripcionProducto}
            precioProducto={precioProducto}
            margenProducto={margenProducto}
            stockProducto={stockProducto}
            onImagenChange={setImagenSeleccionada}
            onCancelar={handleCancelar}
          />
        </form>
      </div>
    </div>
  );
}
