import type { FieldErrors, UseFormRegister } from 'react-hook-form';

export interface EditarEmpresaFormData {
  nombre: string;
  actividad: string;
  logoUrl: string;
}

interface EditarEmpresaFormProps {
  register: UseFormRegister<EditarEmpresaFormData>;
  errors: FieldErrors<EditarEmpresaFormData>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export default function EditarEmpresaForm({ register, errors, onSubmit }: EditarEmpresaFormProps) {
  return (
    <form id="editar-empresa-form" onSubmit={onSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="nombre"
          className="mb-1 block text-sm font-medium text-abacontex-black-text"
        >
          Nombre de la empresa
        </label>

        <input
          id="nombre"
          type="text"
          {...register('nombre')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-abacontex-primary focus:ring-2 focus:ring-abacontex-primary/20"
        />

        {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
      </div>

      <div>
        <label
          htmlFor="actividad"
          className="mb-1 block text-sm font-medium text-abacontex-black-text"
        >
          Descripción de la empresa
        </label>

        <textarea
          id="actividad"
          rows={5}
          {...register('actividad')}
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-abacontex-primary focus:ring-2 focus:ring-abacontex-primary/20"
        />

        {errors.actividad && (
          <p className="mt-1 text-sm text-red-600">{errors.actividad.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="logoUrl"
          className="mb-1 block text-sm font-medium text-abacontex-black-text"
        >
          URL del logo
        </label>

        <input
          id="logoUrl"
          type="text"
          {...register('logoUrl')}
          placeholder="https://ejemplo.com/logo.png"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-abacontex-primary focus:ring-2 focus:ring-abacontex-primary/20"
        />

        {errors.logoUrl && <p className="mt-1 text-sm text-red-600">{errors.logoUrl.message}</p>}
      </div>
    </form>
  );
}
