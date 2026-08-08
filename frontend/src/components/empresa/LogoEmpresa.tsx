import { Building2, ImageUp, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface LogoEmpresaProps {
  nombre: string;
  logoUrl: string | null;
  logo: File | null;
  errorLogo?: string;

  onLogoChange: (file: File | null) => void;
  onEliminarLogo: () => void;
}

const TAMANO_MAXIMO_LOGO = 2 * 1024 * 1024;

const TIPOS_IMAGEN_PERMITIDOS = ['image/jpeg', 'image/png'];

export default function LogoEmpresa({
  nombre,
  logoUrl,
  logo,
  errorLogo,
  onLogoChange,
  onEliminarLogo,
}: LogoEmpresaProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!logo) {
      setLogoPreview(null);
      return;
    }

    const url = URL.createObjectURL(logo);

    setLogoPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [logo]);

  const handleSeleccionLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0] ?? null;

    if (!archivo) {
      return;
    }

    if (!TIPOS_IMAGEN_PERMITIDOS.includes(archivo.type)) {
      onLogoChange(null);
      event.target.value = '';
      return;
    }

    if (archivo.size > TAMANO_MAXIMO_LOGO) {
      onLogoChange(null);
      event.target.value = '';
      return;
    }

    onLogoChange(archivo);

    // Permite volver a seleccionar el mismo archivo.
    event.target.value = '';
  };

  const abrirSelectorArchivo = () => {
    inputFileRef.current?.click();
  };

  const handleEliminar = () => {
    onEliminarLogo();
  };

  const imagenMostrar = logoPreview ?? logoUrl;

  return (
    <div>
      <h3 className="mb-1 text-sm font-semibold text-abacontex-black-text">Logo de la empresa</h3>

      <p className="mb-4 text-xs text-abacontex-gray-text">
        Podés subir una nueva imagen o eliminar el logo actual.
      </p>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
          {imagenMostrar ? (
            <img
              src={imagenMostrar}
              alt={`Logo de ${nombre}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <Building2 size={38} className="text-gray-400" />
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={abrirSelectorArchivo}
            className="flex min-h-16 items-center gap-3 rounded-xl border border-dashed border-gray-300 px-5 py-3 text-left transition hover:border-abacontex-primary hover:bg-abacontex-primary/5"
          >
            <ImageUp size={24} className="shrink-0 text-abacontex-gray-text" />

            <span>
              <span className="block text-sm font-medium text-abacontex-black-text">
                {logo ? 'Cambiar imagen' : 'Cambiar logo'}
              </span>

              <span className="mt-1 block text-xs text-abacontex-gray-text">
                PNG o JPG. Máx. 2 MB.
              </span>
            </span>
          </button>

          {(logo || logoUrl) && (
            <button
              type="button"
              onClick={handleEliminar}
              className="mt-2 flex items-center gap-2 text-sm font-medium text-red-600 transition hover:text-red-700"
            >
              <Trash2 size={16} />
              Eliminar logo
            </button>
          )}

          {logo && (
            <p className="mt-2 max-w-xs truncate text-xs text-abacontex-gray-text">
              Nueva imagen: {logo.name}
            </p>
          )}

          {errorLogo && <p className="mt-2 text-sm text-red-600">{errorLogo}</p>}
        </div>

        <input
          ref={inputFileRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleSeleccionLogo}
          className="hidden"
        />
      </div>
    </div>
  );
}
