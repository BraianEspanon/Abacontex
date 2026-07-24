import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChevronRight,
  House,
} from 'lucide-react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { useEmpresaActual } from '../../hooks/useEmpresaActual';
import { useActualizarEmpresa } from '../../hooks/useActualizarEmpresa';

import EditarEmpresaForm, {
  type EditarEmpresaFormData,
} from '../../components/empresa/EditarEmpresaForm';
import VistaPreviaEmpresa from '../../components/empresa/VistaPreviaEmpresa';
import ResumenIntegrantes from '../../components/empresa/ResumenIntegrantes';

const editarEmpresaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(
      100,
      'El nombre no puede superar los 100 caracteres',
    ),

  actividad: z
    .string()
    .trim()
    .min(1, 'La actividad es obligatoria')
    .max(
      255,
      'La actividad no puede superar los 255 caracteres',
    ),

  logoUrl: z
    .string()
    .trim()
    .url('Ingresá una URL válida')
    .or(z.literal('')),
});

export default function EditarEmpresaPage() {
  const navigate = useNavigate();

  const {
    data: empresa,
    isLoading,
    isError,
  } = useEmpresaActual();

  const {
    mutate: actualizarEmpresa,
    isPending,
    isSuccess,
    isError: isErrorActualizacion,
  } = useActualizarEmpresa();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: {
      errors,
      isDirty,
    },
  } = useForm<EditarEmpresaFormData>({
    resolver: zodResolver(editarEmpresaSchema),
    defaultValues: {
      nombre: '',
      actividad: '',
      logoUrl: '',
    },
  });

  const valoresFormulario = useWatch({
    control,
  });

  useEffect(() => {
    if (!empresa) {
      return;
    }

    reset({
      nombre: empresa.nombre,
      actividad: empresa.actividad,
      logoUrl: empresa.logoUrl ?? '',
    });
  }, [empresa, reset]);

  const onSubmit = (
    datos: EditarEmpresaFormData,
  ) => {
    actualizarEmpresa(
      {
        nombre: datos.nombre.trim(),
        actividad: datos.actividad.trim(),
        logoUrl:
          datos.logoUrl.trim() || null,
      },
      {
        onSuccess: (empresaActualizada) => {
          reset({
            nombre: empresaActualizada.nombre,
            actividad:
              empresaActualizada.actividad,
            logoUrl:
              empresaActualizada.logoUrl ?? '',
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        Cargando empresa...
      </div>
    );
  }

  if (isError || !empresa) {
    return (
      <div className="p-6">
        Error al cargar la empresa.
      </div>
    );
  }

  return (
    <div className="p-6">
      <nav className="mb-5 flex items-center gap-2 text-sm text-abacontex-gray-text">
        <House size={16} />

        <ChevronRight size={14} />

        <Link
          to="/alumno/empresa"
          className="transition hover:text-abacontex-primary"
        >
          Mi empresa
        </Link>

        <ChevronRight size={14} />

        <span className="font-medium text-abacontex-black-text">
          Editar empresa
        </span>
      </nav>

      <div className="mb-6">
        <h1 className="font-heading text-3xl font-semibold text-abacontex-black-text">
          Editar empresa
        </h1>

        <p className="mt-1 text-sm text-abacontex-gray-text">
          Actualizá la información principal de tu
          empresa.
        </p>
      </div>

      <section className="max-w-6xl rounded-2xl bg-white p-6 shadow-md">
        <h2 className="border-b border-gray-200 pb-3 text-sm font-semibold text-gray-800">
          Información
        </h2>

        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <EditarEmpresaForm
            register={register}
            errors={errors}
            onSubmit={handleSubmit(onSubmit)}
          />

          <aside className="space-y-5 border-gray-200 lg:border-l lg:pl-8">
            <VistaPreviaEmpresa
              nombre={
                valoresFormulario.nombre ??
                empresa.nombre
              }
              actividad={
                valoresFormulario.actividad ??
                empresa.actividad
              }
              logoUrl={
                valoresFormulario.logoUrl ||
                empresa.logoUrl
              }
              cantidadIntegrantes={
                empresa.integrantes.length
              }
            />

            <ResumenIntegrantes
              integrantes={empresa.integrantes}
            />
          </aside>
        </div>
      </section>

      <div className="mt-6 flex max-w-6xl justify-end gap-3">
        <button
          type="button"
          onClick={() =>
            navigate('/alumno/empresa')
          }
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-abacontex-black-text transition hover:bg-gray-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          form="editar-empresa-form"
          disabled={isPending || !isDirty}
          className="rounded-lg bg-abacontex-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-abacontex-primary-two disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? 'Guardando...'
            : 'Guardar cambios'}
        </button>
      </div>

      {isSuccess && (
        <p className="mt-3 max-w-6xl text-right text-sm text-green-700">
          Empresa actualizada correctamente.
        </p>
      )}

      {isErrorActualizacion && (
        <p className="mt-3 max-w-6xl text-right text-sm text-red-600">
          No se pudo actualizar la empresa.
        </p>
      )}
    </div>
  );
}