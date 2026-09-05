import { isAxiosError } from 'axios';
import { ChevronRight, Save } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import EditarEmpresaForm, {
  type EditarEmpresaFormData,
} from '../../components/empresa/EditarEmpresaForm';
import ResumenIntegrantes from '../../components/empresa/ResumenIntegrantes';
import VistaPreviaEmpresa from '../../components/empresa/VistaPreviaEmpresa';
import Button from '../../components/ui/Button';

import { useActualizarEmpresa } from '../../hooks/useActualizarEmpresa';
import { useEmpresaActual } from '../../hooks/useEmpresaActual';

const editarEmpresaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede superar los 100 caracteres'),

  actividad: z
    .string()
    .trim()
    .min(1, 'La actividad es obligatoria')
    .max(255, 'La actividad no puede superar los 255 caracteres'),
});

interface RespuestaErrorApi {
  message?: string;
  error?: string;
  code?: string;
}

export default function EditarEmpresaPage() {
  const navigate = useNavigate();

  const { data: empresa, isLoading, isError } = useEmpresaActual();

  const { mutate: actualizarEmpresa, isPending, isSuccess } = useActualizarEmpresa();

  const [logo, setLogo] = useState<File | null>(null);
  const [eliminarLogo, setEliminarLogo] = useState(false);
  const [errorLogo, setErrorLogo] = useState('');

  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<EditarEmpresaFormData>({
    resolver: zodResolver(editarEmpresaSchema),
    defaultValues: {
      nombre: '',
      actividad: '',
    },
    values: empresa
      ? {
          nombre: empresa.nombre,
          actividad: empresa.actividad,
        }
      : {
          nombre: '',
          actividad: '',
        },
  });

  const valoresFormulario = useWatch({
    control,
  });

  const onSubmit = (datos: EditarEmpresaFormData) => {
    clearErrors();
    setErrorLogo('');

    actualizarEmpresa(
      {
        nombre: datos.nombre.trim(),
        actividad: datos.actividad.trim(),
        logo: logo ?? undefined,
        eliminarLogo,
      },
      {
        onSuccess: (empresaActualizada) => {
          if (!empresaActualizada) {
            return;
          }

          setLogo(null);
          setEliminarLogo(false);
          setErrorLogo('');
        },

        onError: (error) => {
          if (isAxiosError<RespuestaErrorApi>(error)) {
            const status = error.response?.status;

            const mensajeBackend = error.response?.data?.message ?? error.response?.data?.error;

            if (status === 409) {
              setError('nombre', {
                type: 'server',
                message:
                  mensajeBackend ?? 'Ya existe una empresa con ese nombre. Ingresá uno diferente.',
              });

              return;
            }

            if (status === 400) {
              setError('root', {
                type: 'server',
                message: mensajeBackend ?? 'Los datos enviados no son válidos.',
              });

              return;
            }

            setError('root', {
              type: 'server',
              message: mensajeBackend ?? 'No se pudo actualizar la empresa. Intentá nuevamente.',
            });

            return;
          }

          setError('root', {
            type: 'server',
            message: 'Ocurrió un error inesperado. Intentá nuevamente.',
          });
        },
      }
    );
  };

  const handleLogoChange = (archivo: File | null) => {
    setLogo(archivo);
    setEliminarLogo(false);
    setErrorLogo('');
  };

  const handleEliminarLogo = () => {
    setLogo(null);
    setEliminarLogo(true);
    setErrorLogo('');
  };

  if (isLoading) {
    return <div>Cargando empresa...</div>;
  }

  if (isError || !empresa) {
    return <div>Error al cargar la empresa.</div>;
  }

  const nombreActual = valoresFormulario.nombre ?? empresa.nombre;

  const actividadActual = valoresFormulario.actividad ?? empresa.actividad;

  /*
   * Si el usuario eligió eliminar el logo, la vista previa debe
   * mostrar el estado sin logo.
   *
   * Si eligió una imagen nueva, se la pasamos al formulario para
   * mostrar su preview.
   */
  const logoActual = eliminarLogo ? null : empresa.logoUrl;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-abacontex-gray-text">
        <Link to="/alumno/empresa" className="transition hover:text-abacontex-primary">
          Mi empresa
        </Link>

        <ChevronRight size={14} />

        <span className="font-medium text-abacontex-black-text">Editar empresa</span>
      </nav>

      <div className="mb-6">
        <h1 className="font-heading text-3xl font-semibold text-abacontex-black-text">
          Editar empresa
        </h1>

        <p className="mt-1 text-sm text-abacontex-gray-text">
          Actualizá la información principal de tu empresa.
        </p>
      </div>

      <section className="max-w-6xl rounded-2xl bg-white p-6 shadow-md">
        <h2 className="border-b border-gray-200 pb-3 text-sm font-semibold text-gray-800">
          Información
        </h2>

        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(340px,1fr)]">
          <EditarEmpresaForm
            register={register}
            errors={errors}
            nombre={nombreActual}
            actividad={actividadActual}
            logoActual={logoActual}
            logo={logo}
            errorLogo={errorLogo}
            onLogoChange={handleLogoChange}
            onEliminarLogo={handleEliminarLogo}
            onSubmit={handleSubmit(onSubmit)}
          />

          <aside className="space-y-4 border-gray-200 lg:border-l lg:pl-8">
            <VistaPreviaEmpresa
              nombre={nombreActual}
              actividad={actividadActual}
              logoUrl={logoActual}
              cantidadIntegrantes={empresa.integrantes.length}
            />

            <ResumenIntegrantes integrantes={empresa.integrantes} />
          </aside>
        </div>
      </section>

      <div className="mt-4 flex max-w-6xl justify-end gap-3">
        <Button
          type="button"
          label="Cancelar"
          variant="outline"
          onClick={() => navigate('/alumno/empresa')}
        />

        <Button
          type="submit"
          form="editar-empresa-form"
          label={isPending ? 'Guardando...' : 'Guardar cambios'}
          variant="solid"
          icon={<Save size={16} />}
          disabled={isPending || (!isDirty && !logo && !eliminarLogo)}
        />
      </div>

      {isSuccess && (
        <p className="mt-3 max-w-6xl text-right text-sm text-green-700">
          Empresa actualizada correctamente.
        </p>
      )}

      {errors.root?.message && (
        <p className="mt-3 max-w-6xl text-right text-sm text-red-600">{errors.root.message}</p>
      )}
    </div>
  );
}
