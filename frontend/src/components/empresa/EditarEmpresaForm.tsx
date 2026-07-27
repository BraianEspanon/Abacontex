import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import LogoEmpresa from './LogoEmpresa';

export interface EditarEmpresaFormData {
  nombre: string;
  actividad: string;
  logoUrl: string;
}

interface EditarEmpresaFormProps {
  register: UseFormRegister<EditarEmpresaFormData>;
  errors: FieldErrors<EditarEmpresaFormData>;
  nombre: string;
  actividad: string;
  logoUrl: string | null;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export default function EditarEmpresaForm({
  register,
  errors,
  nombre,
  actividad,
  logoUrl,
  onSubmit,
}: EditarEmpresaFormProps) {
  return (
    <form id="editar-empresa-form" onSubmit={onSubmit} className="space-y-7">
      <LogoEmpresa nombre={nombre} logoUrl={logoUrl} />

      <input type="hidden" {...register('logoUrl')} />

      <div className="border-b border-gray-300 pb-3">
        <label htmlFor="nombre" className="block text-sm font-semibold text-abacontex-black-text">
          Nombre de la empresa
        </label>

        <p className="mt-1 text-xs text-abacontex-gray-text">
          Este será el nombre que verán las otras empresas y tus docentes.
        </p>

        <input
          id="nombre"
          type="text"
          maxLength={100}
          {...register('nombre')}
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-abacontex-primary focus:ring-2 focus:ring-abacontex-primary/20"
        />

        {errors.nombre ? (
          <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
        ) : (
          <div className="mt-1 flex justify-between text-xs text-abacontex-gray-text">
            <span>Máx. 100 caracteres</span>
            <span>{nombre.length}/100</span>
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="actividad"
          className="block text-sm font-semibold text-abacontex-black-text"
        >
          Descripción de la empresa
        </label>

        <p className="mt-1 text-xs text-abacontex-gray-text">
          Contanos brevemente a qué se dedica tu empresa.
        </p>

        <textarea
          id="actividad"
          rows={3}
          maxLength={255}
          {...register('actividad')}
          className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-abacontex-primary focus:ring-2 focus:ring-abacontex-primary/20"
        />

        {errors.actividad ? (
          <p className="mt-1 text-sm text-red-600">{errors.actividad.message}</p>
        ) : (
          <div className="mt-1 flex justify-between text-xs text-abacontex-gray-text">
            <span>Máx. 255 caracteres</span>
            <span>{actividad.length}/255</span>
          </div>
        )}
      </div>
    </form>
  );
}
