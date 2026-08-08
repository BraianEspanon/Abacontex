import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import LogoEmpresa from './LogoEmpresa';

export interface EditarEmpresaFormData {
  nombre: string;
  actividad: string;
}

interface EditarEmpresaFormProps {
  register: UseFormRegister<EditarEmpresaFormData>;
  errors: FieldErrors<EditarEmpresaFormData>;
  nombre: string;
  actividad: string;

  logoActual: string | null;
  logo: File | null;
  errorLogo: string;

  onLogoChange: (file: File | null) => void;
  onEliminarLogo: () => void;

  onSubmit: React.FormEventHandler;
}

export default function EditarEmpresaForm({
  register,
  errors,
  nombre,
  actividad,
  logoActual,
  logo,
  errorLogo,
  onLogoChange,
  onEliminarLogo,
  onSubmit,
}: EditarEmpresaFormProps) {
  return (
    <form id="editar-empresa-form" onSubmit={onSubmit} className="space-y-6">
      <div className="border-b border-gray-300 pb-5">
        <LogoEmpresa
          nombre={nombre}
          logoUrl={logoActual}
          logo={logo}
          errorLogo={errorLogo}
          onLogoChange={onLogoChange}
          onEliminarLogo={onEliminarLogo}
        />
      </div>

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
          className={`mt-2 w-full rounded-lg border px-3 py-2.5 outline-none transition focus:border-abacontex-primary focus:ring-2 focus:ring-abacontex-primary/20 ${
            errors.nombre ? 'border-red-500' : 'border-gray-300'
          }`}
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
          className={`mt-2 w-full resize-none rounded-lg border px-3 py-2.5 outline-none transition focus:border-abacontex-primary focus:ring-2 focus:ring-abacontex-primary/20 ${
            errors.actividad ? 'border-red-500' : 'border-gray-300'
          }`}
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
