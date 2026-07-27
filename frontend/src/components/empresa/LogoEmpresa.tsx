import { Building2, ImageUp, Trash2 } from 'lucide-react';

interface LogoEmpresaProps {
  nombre: string;
  logoUrl: string | null;
}

export default function LogoEmpresa({ nombre, logoUrl }: LogoEmpresaProps) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-abacontex-black-text">Logo de la empresa</h3>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
          {logoUrl ? (
            <img src={logoUrl} alt={`Logo de ${nombre}`} className="h-full w-full object-cover" />
          ) : (
            <Building2 size={38} className="text-gray-400" />
          )}
        </div>

        <div>
          <button
            type="button"
            className="flex min-h-16 items-center gap-3 rounded-xl border border-dashed border-gray-300 px-5 py-3 text-left transition hover:border-abacontex-primary hover:bg-abacontex-primary/5"
          >
            <ImageUp size={24} className="shrink-0 text-abacontex-gray-text" />

            <span>
              <span className="block text-sm font-medium text-abacontex-black-text">
                Cambiar logo
              </span>

              <span className="mt-1 block text-xs text-abacontex-gray-text">
                PNG o JPG. Máx. 2 MB.
              </span>
            </span>
          </button>

          <button
            type="button"
            className="mt-2 flex items-center gap-2 text-sm font-medium text-red-600 transition hover:text-red-700"
          >
            <Trash2 size={16} />
            Eliminar logo
          </button>
        </div>
      </div>
    </section>
  );
}
