// src/components/empresa/DatosEmpresaForm.tsx

import { ImagePlus } from 'lucide-react';
import { useRef } from 'react';

interface DatosEmpresaFormProps {
  nombre: string;
  actividad: string;
  logo: File | null;
  logoPreview: string | null;
  errorNombre?: string;
  errorActividad?: string;
  onNombreChange: (value: string) => void;
  onActividadChange: (value: string) => void;
  onLogoChange: (file: File | null) => void;
}

export default function DatosEmpresaForm({
  nombre,
  actividad,
  logo,
  logoPreview,
  errorNombre,
  errorActividad,
  onNombreChange,
  onActividadChange,
  onLogoChange,
}: DatosEmpresaFormProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleSeleccionLogo = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const archivo = event.target.files?.[0] ?? null;
    onLogoChange(archivo);
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-md">
      <div className="space-y-5">
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
              onClick={() => inputFileRef.current?.click()}
              className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-abacontext-light-bg transition hover:border-abacontex-primary"
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
                Tamaño recomendado: 200 × 200 px. JPG o PNG.
              </p>

              <button
                type="button"
                onClick={() => inputFileRef.current?.click()}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-abacontex-black-text transition hover:border-abacontex-primary hover:bg-abacontex-primary/5"
              >
                {logo ? 'Cambiar imagen' : 'Subir imagen'}
              </button>

              <input
                ref={inputFileRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleSeleccionLogo}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}