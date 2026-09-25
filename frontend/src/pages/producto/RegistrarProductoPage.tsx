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

        <span className="font-medium text-gray-700">Registrar producto</span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold text-gray-900">Registrar producto</h1>

        <p className="mt-2 text-base text-gray-500">
          Completá la información del nuevo producto que formará parte del catálogo de tu empresa.
        </p>
      </header>

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
  );
}
