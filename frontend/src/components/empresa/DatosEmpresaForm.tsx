// src/components/empresa/DatosEmpresaForm.tsx

import { ImagePlus, Trash2 } from 'lucide-react';
import { useRef } from 'react';

interface DatosEmpresaFormProps {
  nombre: string;
  actividad: string;
  logo: File | null;
  logoPreview: string | null;
  errorNombre?: string;
  errorActividad?: string;
  errorLogo?: string;
  onNombreChange: (value: string) => void;
  onActividadChange: (value: string) => void;
  onLogoChange: (file: File | null) => void;
  onLogoError?: (error: string) => void;
}

const TAMANO_MAXIMO_LOGO = 2 * 1024 * 1024;

const TIPOS_IMAGEN_PERMITIDOS = ['image/jpeg', 'image/png'];

export default function DatosEmpresaForm({
  nombre,
  actividad,
  logo,
  logoPreview,
  errorNombre,
  errorActividad,
  errorLogo,
  onNombreChange,
  onActividadChange,
  onLogoChange,
  onLogoError,
}: DatosEmpresaFormProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleSeleccionLogo = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const archivo = event.target.files?.[0] ?? null;

    if (!archivo) {
      return;
    }

    if (!TIPOS_IMAGEN_PERMITIDOS.includes(archivo.type)) {
      onLogoError?.('Solo se permiten imágenes JPG o PNG.');
      event.target.value = '';
      return;
    }

    if (archivo.size > TAMANO_MAXIMO_LOGO) {
      onLogoError?.('La imagen no puede superar los 2 MB.');
      event.target.value = '';
      return;
    }

    onLogoError?.('');
    onLogoChange(archivo);

    // Permite volver a seleccionar el mismo archivo
    event.target.value = '';
  };

  const handleEliminarLogo = () => {
    onLogoChange(null);
    onLogoError?.('');
  };

  const abrirSelectorArchivo = () => {
    inputFileRef.current?.click();
  };

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
      <div className="space-y-6">
        <div>
          <label
            htmlFor="nombreEmpresa"
            className="mb-2 block font-heading text-lg font-semibold text-abacontex-black-text"
          >
            Nombre de la empresa
          </label>

          <input
            id="nombreEmpresa"
            type="text"
            value={nombre}
            onChange={(event) => onNombreChange(event.target.value)}
            placeholder="Ej. TechVision S.A."
            className={`w-full rounded-full border bg-white px-4 py-3 font-sans outline-none transition ${
              errorNombre
                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-300 focus:border-abacontex-primary focus:ring-2 focus:ring-abacontex-primary/20'
            }`}
          />

          {errorNombre && (
            <p className="mt-2 text-sm text-red-600">{errorNombre}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="actividadEmpresa"
            className="mb-2 block font-heading text-lg font-semibold text-abacontex-black-text"
          >
            ¿A qué se dedica?
          </label>

          <textarea
            id="actividadEmpresa"
            value={actividad}
            onChange={(event) => onActividadChange(event.target.value)}
            placeholder="Describí brevemente el tipo de producto, rubro o servicio..."
            rows={4}
            className={`w-full resize-none rounded-3xl border bg-white px-4 py-3 font-sans outline-none transition ${
              errorActividad
                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-300 focus:border-abacontex-primary focus:ring-2 focus:ring-abacontex-primary/20'
            }`}
          />

          {errorActividad && (
            <p className="mt-2 text-sm text-red-600">{errorActividad}</p>
          )}
        </div>

        <div className="border-t border-gray-200 pt-5">
          <h3 className="mb-1 font-semibold text-abacontex-black-text">
            Logo de la empresa
          </h3>

          <p className="mb-4 text-sm text-abacontex-gray-text">
            Opcional. Podés subir una imagen o utilizar el ícono predeterminado.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={abrirSelectorArchivo}
              className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-abacontext-light-bg transition hover:border-abacontex-primary"
              aria-label="Seleccionar logo de la empresa"
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Vista previa del logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlus className="h-7 w-7 text-abacontex-primary" />
              )}
            </button>

            <div>
              <p className="mb-2 text-sm text-abacontex-gray-text">
                Tamaño recomendado: 200 × 200 px. JPG o PNG. Máx. 2 MB.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={abrirSelectorArchivo}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-abacontex-black-text transition hover:border-abacontex-primary hover:bg-abacontex-primary/5"
                >
                  {logo ? 'Cambiar imagen' : 'Subir imagen'}
                </button>

                {logo && (
                  <button
                    type="button"
                    onClick={handleEliminarLogo}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Quitar
                  </button>
                )}
              </div>

              {logo && (
                <p className="mt-2 max-w-xs truncate text-xs text-abacontex-gray-text">
                  {logo.name}
                </p>
              )}
            </div>

            <input
              ref={inputFileRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleSeleccionLogo}
              className="hidden"
            />
          </div>

          {errorLogo && (
            <p className="mt-3 text-sm text-red-600">{errorLogo}</p>
          )}
        </div>
      </div>
    </section>
  );
}